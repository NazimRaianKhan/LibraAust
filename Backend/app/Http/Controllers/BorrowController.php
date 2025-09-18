<?php

namespace App\Http\Controllers;

use App\Models\Borrow;
use App\Models\Publication;
use App\Models\Users;
use App\Models\Students;
use App\Models\Faculties;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class BorrowController extends Controller
{
    // Borrow a publication
    public function borrowPublication(Request $request, $publicationId)
    {
        try {
            // Get the authenticated user
            $user = Auth::user();
            if (!$user) {
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            // Check if user is student or faculty (not librarian)
            if (!in_array($user->role, ['student', 'faculty'])) {
                return response()->json(['message' => 'Only students and faculty can borrow publications'], 403);
            }

            // Start database transaction for thread safety
            return DB::transaction(function () use ($publicationId, $user) {
                // Find the publication with row locking to prevent race conditions
                $publication = Publication::lockForUpdate()->find($publicationId);
                
                if (!$publication) {
                    return response()->json(['message' => 'Publication not found'], 404);
                }

                // Check if publication is available
                if ($publication->available_copies <= 0) {
                    return response()->json(['message' => 'Publication is not available for borrowing'], 400);
                }

                // Check if user already has this publication borrowed and not returned
                $existingBorrow = Borrow::where('borrowed_id', $publicationId)
                    ->where('borrower_id', $user->id)
                    ->whereIn('status', ['borrowed', 'overdue'])
                    ->first();

                if ($existingBorrow) {
                    return response()->json(['message' => 'You have already borrowed this publication'], 400);
                }

                // Check borrowing limits (optional - you can set limits per user type)
                $activeBorrows = Borrow::where('borrower_id', $user->id)
                    ->whereIn('status', ['borrowed', 'overdue'])
                    ->count();

                $maxBorrows = $user->role === 'faculty' ? 10 : 3; // Faculty can borrow more
                if ($activeBorrows >= $maxBorrows) {
                    return response()->json(['message' => "You have reached your borrowing limit of {$maxBorrows} publications"], 400);
                }

                // Set fine rate based on user role
                $fineRate = $user->role === 'student' ? 5.00 : 0.00;

                // Calculate return date (2 weeks for faculty, 1 week for students)
                $borrowPeriod = $user->role === 'faculty' ? 14 : 7;
                $returnDate = Carbon::now()->addDays($borrowPeriod);

                // Create borrow record
                $borrow = Borrow::create([
                    'borrowed_id' => $publicationId,
                    'borrower_id' => $user->id,
                    'borrow_date' => Carbon::now()->toDateString(),
                    'return_date' => $returnDate->toDateString(),
                    'fine_rate' => $fineRate,
                    'status' => 'borrowed'
                ]);

                // Update publication available copies
                $publication->decrement('available_copies');

                // Update user borrowed_id (if you want to track last borrowed item)
                if ($user->role === 'student') {
                    Students::where('email', $user->email)->update(['borrowed_id' => $publicationId]);
                } elseif ($user->role === 'faculty') {
                    Faculties::where('email', $user->email)->update(['borrowed_id' => $publicationId]);
                }

                // Load relationships for response
                $borrow->load(['publication', 'borrower']);

                return response()->json([
                    'message' => 'Publication borrowed successfully',
                    'borrow' => $borrow,
                    'return_date' => $returnDate->format('Y-m-d'),
                    'fine_rate' => $fineRate
                ], 201);
            });

        } catch (\Exception $e) {
            \Log::error('Borrowing failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to borrow publication',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Return a publication
    public function returnPublication(Request $request, $borrowId)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            return DB::transaction(function () use ($borrowId, $user) {
                // Find the borrow record
                $borrow = Borrow::with(['publication'])
                    ->where('id', $borrowId)
                    ->where('borrower_id', $user->id)
                    ->whereIn('status', ['borrowed', 'overdue'])
                    ->lockForUpdate()
                    ->first();

                if (!$borrow) {
                    return response()->json(['message' => 'Borrow record not found or already returned'], 404);
                }

                // Calculate fine if overdue
                $actualReturnDate = Carbon::now();
                $fine = 0;

                if ($actualReturnDate->gt($borrow->return_date) && $borrow->fine_rate > 0) {
                    $overdueDays = $actualReturnDate->diffInDays($borrow->return_date);
                    $fine = $overdueDays * $borrow->fine_rate;
                }

                // Update borrow record
                $borrow->update([
                    'actual_return_date' => $actualReturnDate->toDateString(),
                    'total_fine' => $fine,
                    'status' => 'returned'
                ]);

                // Update publication available copies
                $borrow->publication->increment('available_copies');

                return response()->json([
                    'message' => 'Publication returned successfully',
                    'fine' => $fine,
                    'borrow' => $borrow
                ], 200);
            });

        } catch (\Exception $e) {
            \Log::error('Return failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to return publication',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Get user's borrowing history
    public function getUserBorrows(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            $borrows = Borrow::with(['publication'])
                ->where('borrower_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();

            // Update overdue status
            foreach ($borrows as $borrow) {
                $borrow->updateStatus();
            }

            return response()->json($borrows);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch borrowing history',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Get all borrows (for librarians)
    public function getAllBorrows(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'librarian') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $query = Borrow::with(['publication', 'borrower']);

            // Filter by status if provided
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by overdue
            if ($request->has('overdue') && $request->overdue == 'true') {
                $query->where('status', 'borrowed')
                    ->where('return_date', '<', Carbon::now()->toDateString());
            }

            $borrows = $query->orderBy('created_at', 'desc')->paginate(20);

            // Update overdue status for all records
            foreach ($borrows as $borrow) {
                $borrow->updateStatus();
            }

            return response()->json($borrows);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch borrow records',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Get borrowing statistics
    public function getBorrowingStats(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'librarian') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $stats = [
                'total_borrowed' => Borrow::whereIn('status', ['borrowed', 'overdue'])->count(),
                'total_returned' => Borrow::where('status', 'returned')->count(),
                'overdue_count' => Borrow::where('status', 'borrowed')
                    ->where('return_date', '<', Carbon::now()->toDateString())
                    ->count(),
                'total_fines' => Borrow::sum('total_fine'),
                'active_borrowers' => Borrow::whereIn('status', ['borrowed', 'overdue'])
                    ->distinct('borrower_id')
                    ->count()
            ];

            return response()->json($stats);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ----------------------------------------------------------------
     * Manual return by librarian (offline return)
     */
    public function manualReturn(Request $request, $borrowId)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'librarian') {
                return response()->json(['message' => 'Only librarians can perform manual returns'], 403);
            }

            return DB::transaction(function () use ($borrowId) {
                // Find the borrow record
                $borrow = Borrow::with(['publication'])
                    ->where('id', $borrowId)
                    ->whereIn('status', ['borrowed', 'overdue'])
                    ->lockForUpdate()
                    ->first();

                if (!$borrow) {
                    return response()->json(['message' => 'Borrow record not found or already returned'], 404);
                }

                // Calculate fine if overdue
                $actualReturnDate = Carbon::now();
                $fine = 0;

                if ($actualReturnDate->gt($borrow->return_date) && $borrow->fine_rate > 0) {
                    $overdueDays = $actualReturnDate->diffInDays($borrow->return_date);
                    $fine = $overdueDays * $borrow->fine_rate;
                }

                // Update borrow record
                $borrow->update([
                    'actual_return_date' => $actualReturnDate->toDateString(),
                    'total_fine' => $fine,
                    'status' => 'returned'
                ]);

                // Update publication available copies
                $borrow->publication->increment('available_copies');

                // Update user borrowed_id to null (clear last borrowed item tracking)
                if ($borrow->borrower) {
                    if ($borrow->borrower->role === 'student') {
                        Students::where('email', $borrow->borrower->email)->update(['borrowed_id' => null]);
                    } elseif ($borrow->borrower->role === 'faculty') {
                        Faculties::where('email', $borrow->borrower->email)->update(['borrowed_id' => null]);
                    }
                }

                return response()->json([
                    'message' => 'Book manually returned successfully',
                    'fine' => $fine,
                    'borrow' => $borrow->load(['publication', 'borrower'])
                ], 200);
            });

        } catch (\Exception $e) {
            \Log::error('Manual return failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to process manual return',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clear fine (when payment received offline)
     */
    public function clearFine(Request $request, $borrowId)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'librarian') {
                return response()->json(['message' => 'Only librarians can clear fines'], 403);
            }

            return DB::transaction(function () use ($borrowId) {
                // Find the borrow record
                $borrow = Borrow::where('id', $borrowId)
                    ->where('total_fine', '>', 0)
                    ->lockForUpdate()
                    ->first();

                if (!$borrow) {
                    return response()->json(['message' => 'Borrow record not found or no fine to clear'], 404);
                }

                $previousFine = $borrow->total_fine;

                // Clear the fine
                $borrow->update([
                    'total_fine' => 0
                ]);

                return response()->json([
                    'message' => 'Fine cleared successfully',
                    'previous_fine' => $previousFine,
                    'borrow' => $borrow->load(['publication', 'borrower'])
                ], 200);
            });

        } catch (\Exception $e) {
            \Log::error('Clear fine failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to clear fine',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Extend due date (bonus feature for librarians)
     */
    public function extendDueDate(Request $request, $borrowId)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'librarian') {
                return response()->json(['message' => 'Only librarians can extend due dates'], 403);
            }

            $request->validate([
                'days' => 'required|integer|min:1|max:30'
            ]);

            return DB::transaction(function () use ($borrowId, $request) {
                // Find the borrow record
                $borrow = Borrow::where('id', $borrowId)
                    ->whereIn('status', ['borrowed', 'overdue'])
                    ->lockForUpdate()
                    ->first();

                if (!$borrow) {
                    return response()->json(['message' => 'Borrow record not found or already returned'], 404);
                }

                $oldDueDate = $borrow->return_date;
                $newDueDate = Carbon::parse($borrow->return_date)->addDays($request->days);

                // Update due date and reset status to borrowed if it was overdue
                $borrow->update([
                    'return_date' => $newDueDate->toDateString(),
                    'status' => 'borrowed',
                    'total_fine' => 0 // Clear existing fine when extending
                ]);

                return response()->json([
                    'message' => 'Due date extended successfully',
                    'old_due_date' => $oldDueDate,
                    'new_due_date' => $newDueDate->toDateString(),
                    'extended_by' => $request->days . ' days',
                    'borrow' => $borrow->load(['publication', 'borrower'])
                ], 200);
            });

        } catch (\Exception $e) {
            \Log::error('Extend due date failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to extend due date',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
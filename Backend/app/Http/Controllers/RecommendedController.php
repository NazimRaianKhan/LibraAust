<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\Faculties;
use App\Models\Students;
use App\Models\Publication;

class RecommendedController extends Controller
{
    public function recommended(Request $request)
    {

        $user = $request->user();

        if ($user) {

            // Check dept

            if ($user->role === 'student') {
                $dept = Students::where('email', $user->email)->value('department');
            } elseif ($user->role === 'faculty') {
                $dept = Faculties::where('email', $user->email)->value('department');
            }
        }

        $query = Publication::where('department', $dept)->get();
        $books = $query->where('type', 'book');

        return response()->json($books);
    }

    public function featured()
    {
        $books = Publication::where('type', 'book')
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get();
        return response()->json($books);
    }
}

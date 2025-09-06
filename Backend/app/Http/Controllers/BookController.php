<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookController extends Controller
{
    // Get all books (with optional filters)
    public function index(Request $request)
    {
        $query = "SELECT * FROM publications WHERE type = 'book'";
        $params = [];

        // Search by title
        if ($request->has('q')) {
            $query .= " AND LOWER(title) LIKE ?";
            $params[] = "%" . strtolower($request->q) . "%";
        }

        // Filter by department
        if ($request->has('department')) {
            $query .= " AND department = ?";
            $params[] = $request->department;
        }

        $books = DB::select($query, $params);
        return response()->json($books);
    }

    // Get book details by ID
    public function show($id)
    {
        $book = DB::selectOne(
            "SELECT * FROM publications WHERE id = ? AND type = 'book' LIMIT 1",
            [$id]
        );

        if (!$book) {
            return response()->json(['message' => 'Book not found'], 404);
        }

        return response()->json($book);
    }

    // Store new book
    public function store(Request $request)
    {
        DB::insert(
            "INSERT INTO publications (title, author, type, category, cover_url, description, year) 
             VALUES (?, ?, 'book', ?, ?, ?, ?)",
            [
                $request->title,
                $request->author,
                $request->category,
                $request->cover_url,
                $request->description,
                $request->year
            ]
        );

        return response()->json(['message' => 'Book created successfully']);
    }

    // Update book
    public function update(Request $request, $id)
    {
        $affected = DB::update(
            "UPDATE publications 
             SET title = ?, author = ?, category = ?, cover_url = ?, description = ?, year = ? 
             WHERE id = ? AND type = 'book'",
            [
                $request->title,
                $request->author,
                $request->category,
                $request->cover_url,
                $request->description,
                $request->year,
                $id
            ]
        );

        if ($affected === 0) {
            return response()->json(['message' => 'Book not found or not updated'], 404);
        }

        return response()->json(['message' => 'Book updated successfully']);
    }

    // Delete book
    public function destroy($id)
    {
        $deleted = DB::delete(
            "DELETE FROM publications WHERE id = ? AND type = 'book'",
            [$id]
        );

        if ($deleted === 0) {
            return response()->json(['message' => 'Book not found'], 404);
        }

        return response()->json(['message' => 'Book deleted successfully']);
    }
}

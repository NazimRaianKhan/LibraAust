<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Publication;

class PublicationController extends Controller
{
    public function index(Request $request)
    {
        $query = Publication::query();

        // filter by type (book, thesis)
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        $publication = Publication::findOrFail($id);
        return response()->json($publication);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'author' => 'required|string',
            'isbn' => 'nullable|string',
            'publication_year' => 'nullable|integer',
            'publisher' => 'nullable|string',
            'department' => 'nullable|string',
            'type' => 'required|in:book,thesis',
            'total_copies' => 'nullable|integer',
            'available_copies' => 'nullable|integer',
            'shelf_location' => 'nullable|string',
            'description' => 'nullable|string',
            'cover_url' => 'nullable|string',
        ]);

        $publication = Publication::create($validated);
        return response()->json($publication, 201);
    }

    public function update(Request $request, $id)
    {
        $publication = Publication::findOrFail($id);
        $publication->update($request->all());

        return response()->json($publication);
    }

    public function destroy($id)
    {
        $publication = Publication::findOrFail($id);
        $publication->delete();

        return response()->json(['message' => 'Publication deleted']);
    }
}

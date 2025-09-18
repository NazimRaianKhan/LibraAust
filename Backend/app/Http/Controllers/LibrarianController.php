<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\Librarians;
use App\Models\Users;
use Illuminate\Support\Facades\Hash;


class LibrarianController extends Controller
{
    // Other for fetching
    public function show()
    {
        $librarians = Librarians::all();
        return response()->json($librarians);
    }

    public function store(Request $request)
    {
        $request->validate([
            'librarian_id' => 'required|unique:librarians,librarian_id',
            'name' => 'required|string|max:255',
            'designation' => 'required|string|max:255',
            'email' => 'required|email|unique:librarians,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8|regex:/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/',
        ]);

        $exists = Librarians::where('librarian_id', $request->librarian_id)->exists();

        if ($exists) {
            return response()->json(['message' => 'Librarian with this ID already exists'], 409);
        }

        $password = $request['password'];
        unset($request['password']);

        DB::beginTransaction();
        try {
            $librarian = Librarians::create($request->all());

            Users::create([
                'email' => $request['email'],
                'password_hash' => Hash::make($password),
                'role' => 'librarian'
            ]);

            DB::commit();

            return response()->json($librarian, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create librarian', 'error' => $e->getMessage()], 500);
        }
    }
}

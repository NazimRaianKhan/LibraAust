<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Hash;
use App\Models\Librarians;
use App\Models\Users;

class LibrarianController extends Controller
{
    public function librarians(Request $request)
    {
        $librarians = Librarians::all();
        return response()->json($librarians);
    }

    public function create(Request $request)
    {
        // $request->validate([]); thing fails for some reason
        // Why? I have no idea
        // I want my 3 hours back

        // Using Validator instead
        $validator = Validator::make($request->all(), [
            'librarian_id' => 'required|unique:librarians,librarian_id',
            'name' => 'required|string|max:255',
            'designation' => 'required|string|max:255',
            'email' => 'required|email|unique:librarians,email',
            'phone' => 'nullable|string|max:20',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/'
            ],
        ]);

        // Check if the librarian_id already exists
        if (Librarians::where('librarian_id', $request['librarian_id'])->exists()) {
            return response()->json([
                'message' => 'Librarian ID already exists',
                'error' => 'Duplicate Librarian ID'
            ], 409);
        }

        // Extract password before creating librarian
        $password = $request['password'];
        unset($request['password']); // Remove password from librarian data

        // Transaction to send it to user table as well
        DB::beginTransaction();
        try {
            // Create the librarian using Eloquent
            $librarian = Librarians::create($request->all());

            // Create Users account for the librarian
            Users::create([
                'email' => $request->input('email'),
                'password_hash' => Hash::make($password),
                'role' => 'librarian'
            ]);

            // Commit the transaction
            DB::commit();
        } catch (\Exception $e) {
            // Rollback the transaction on error
            DB::rollBack();
            return response()->json(['message' => 'Error creating librarian', 'error' => $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Librarian created successfully'], 201);

    }
}

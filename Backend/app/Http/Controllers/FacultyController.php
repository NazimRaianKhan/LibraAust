<?php

namespace App\Http\Controllers;

use App\Models\Faculties;
use App\Models\Users;
use Illuminate\Http\Request;
use DB;
use Hash;

class FacultyController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'faculty_id' => 'required|unique:faculties,faculty_id',
            'name' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'email' => 'required|email|unique:faculties,email',
            'phone' => 'nullable|string|max:20',
            'borrowed_id' => 'nullable|string|max:50',
            'password' => 'required|string|min:8|regex:/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/',
        ]);

        // Check if faculty_id already exists
        if (Faculties::where('faculty_id', $request['faculty_id'])->exists()) {
            return response()->json([
                'message' => 'Faculty ID already exists',
                'error' => 'Duplicate Faculty ID'
            ], 409);
        }

        // Extract password before creating faculty
        $password = $request['password'];
        unset($request['password']); // Remove password from faculty data

        // Transaction to send it to user table as well

        DB::beginTransaction();
        try {
            // Create the faculty using Eloquent
            $faculty = Faculties::create($request->all());

            // Create Users account for the faculty
            Users::create([
                'email' => $request->input('email'),
                'password_hash' => Hash::make($password),
                'role' => 'faculty'
            ]);

            // Commit the transaction
            DB::commit();
        } catch (\Exception $e) {
            // Rollback the transaction on error
            DB::rollBack();
            return response()->json(['message' => 'Error creating faculty', 'error' => $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Faculty created successfully', 'faculty' => $faculty], 201);
    }
}

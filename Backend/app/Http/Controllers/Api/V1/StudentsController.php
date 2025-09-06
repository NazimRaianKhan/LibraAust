<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Students;
use App\Models\Users; // Assuming your Userss model is named 'Users'
use App\Http\Requests\UpdateStudentsRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\StudentsResource;
use App\Http\Requests\V1\StoreStudentsRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Use Eloquent to get all students
        return Students::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentsRequest $request)
    {
        $validated = $request->validated();

        // Check if student_id already exists using Eloquent
        if (Students::where('student_id', $validated['student_id'])->exists()) {
            return response()->json([
                'message' => 'Student ID already exists',
                'error' => 'Duplicate student_id'
            ], 409);
        }

        // Extract password before creating student
        $password = $validated['password'];
        unset($validated['password']); // Remove password from student data

        // Start database transaction
        DB::beginTransaction();

        try {
            // Create the student using Eloquent
            $student = Students::create($validated);

            // Create Users account for the student
            Users::create([
                'email' => $validated['email'],
                'password_hash' => Hash::make($password),
                'role' => 'student'
            ]);

            // Commit the transaction
            DB::commit();

            // Return the student resource
            return new StudentsResource($student);

        } catch (\Exception $e) {
            // Rollback the transaction on error
            DB::rollBack();

            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Students $student) // Renamed parameter to $student for clarity
    {
        // Eloquent automatically injects the model instance based on the route ID
        // No need to manually fetch it
        return $student;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentsRequest $request, Students $student) // Renamed parameter to $student
    {
        // Get validated data from request
        $validated = $request->validated();

        // If password is included in update, remove it from student data
        if (isset($validated['password'])) {
            unset($validated['password']);
        }

        // Use Eloquent to update the student
        $student->update($validated);

        // Return the updated student (fresh instance from the database)
        return $student->fresh();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Students $student) // Renamed parameter to $student
    {
        // Use Eloquent to delete the student
        $student->delete();

        return response()->json(['message' => 'Student deleted successfully'], 200);
    }
}
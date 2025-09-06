<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Users;
use App\Http\Requests\StoreUsersRequest;
use App\Http\Requests\UpdateUsersRequest;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = DB::select('SELECT * FROM users');
        return $users;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUsersRequest $request)
    {
        $validated = $request->validated();
        
        // Hash the password before storing
        $validated['password_hash'] = Hash::make($validated['password_hash']);
        
        // Check if email already exists
        $existingUser = DB::select('SELECT * FROM users WHERE email = ?', [$validated['email']]);
        
        if (!empty($existingUser)) {
            return response()->json([
                'message' => 'Email already exists',
                'error' => 'Duplicate email'
            ], 409);
        }
        
        // Build and execute insert query
        $columns = implode(', ', array_keys($validated));
        $placeholders = implode(', ', array_fill(0, count($validated), '?'));
        
        DB::insert("INSERT INTO users ($columns) VALUES ($placeholders)", array_values($validated));
        
        $lastId = DB::getPdo()->lastInsertId();
        $user = DB::select('SELECT * FROM users WHERE id = ?', [$lastId]);
        
        return response()->json($user[0], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Users $users)
    {
        $user = DB::select('SELECT * FROM users WHERE id = ?', [$users->id]);
        
        if (empty($user)) {
            return response()->json(['message' => 'User not found'], 404);
        }
        
        return $user[0];
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUsersRequest $request, Users $users)
    {
        $validated = $request->validated();
        
        // Hash the password if it's being updated
        if (isset($validated['password_hash'])) {
            $validated['password_hash'] = Hash::make($validated['password_hash']);
        }
        
        // Build SET clause for prepared statement
        $setClause = implode(' = ?, ', array_keys($validated)) . ' = ?';
        
        // Execute raw SQL update with prepared statement
        DB::update("UPDATE users SET $setClause WHERE id = ?", 
            array_merge(array_values($validated), [$users->id]));
        
        // Fetch the updated user
        $updatedUser = DB::select('SELECT * FROM users WHERE id = ?', [$users->id]);
        
        return $updatedUser[0];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Users $users)
    {
        DB::delete('DELETE FROM users WHERE id = ?', [$users->id]);
        
        return response()->json(['message' => 'User deleted successfully'], 200);
    }
}
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ProfileQueryController extends Controller
{
    
public function show(Request $request)
{
    // Prefer explicit email from body/query, else fallback to authenticated user
    $email = $request->input('email') ?? optional($request->user())->email;

    if (!$email) {
        return response()->json(['message' => 'Email is required'], 422);
    }

    // Fetch student
    $student = DB::select('SELECT * FROM students WHERE email = ? LIMIT 1', [$email]);
    if (!$student) {
        return response()->json(['message' => 'Student not found'], 404);
    }
    $s = $student[0];

    // Respond WITHOUT any borrows/history info
    return response()->json([
        'name'       => $s->name ?? null,
        'role'       => 'Student',
        'department' => $s->department ?? null,
        'email'      => $s->email,
        'phone'      => $s->phone ?? null,
        'address'    => null,
        'academic'   => [
            'studentId'       => $s->student_id ?? null,
            'currentSemester' => $s->semester ?? null,
            'enrollmentDate'  => null,
        ],
        // Kept keys for front-end stability; now always empty arrays
        'borrowed'   => [],
        'history'    => [],
    ]);
}

    public function update(Request $request)
    {
        // Prefer auth user email; if not present (e.g., testing), accept email from payload
        $email = optional($request->user())->email ?? $request->input('email');

        if (!$email) {
            return response()->json(['message' => 'Email is required'], 422);
        }

        $data = $request->validate([
            'phone'      => 'nullable|string',
            'department' => 'nullable|string',
            'academic'   => 'nullable|array',
            'academic.studentId'       => 'nullable|string',
            'academic.currentSemester' => 'nullable|string',
        ]);
        
        DB::update("
            UPDATE students
            SET phone = COALESCE(?, phone),
                department = COALESCE(?, department),
                semester = COALESCE(?, semester),
                student_id = COALESCE(?, student_id),
                updated_at = NOW()
            WHERE email = ?
        ", [
            $data['phone'] ?? null,
            $data['department'] ?? null,
            $data['academic']['currentSemester'] ?? null,
            $data['academic']['studentId'] ?? null,
            $email,
        ]);

        // Reuse show() to return fresh profile
        $request->merge(['email' => $email]);
        return $this->show($request);
    }
}

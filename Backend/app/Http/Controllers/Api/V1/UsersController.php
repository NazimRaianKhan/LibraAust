<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Users;
use App\Models\Students;
use App\Models\Faculties;
// use App\Models\Librarians; // Uncomment if you add a Librarians model
use App\Http\Requests\StoreUsersRequest;
use App\Http\Requests\UpdateUsersRequest;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    public function __invoke(Request $request)
    {
        // Fetch current user details (specifically the email and role)

        $user = $request->user();

        if ($user) {

            // Check what the user is

            if ($user->role === 'student') {
                $name = Students::where('email', $user->email)->value('name');
            } elseif ($user->role === 'faculty') {
                $name = Faculties::where('email', $user->email)->value('name');
            }
            // Uncomment when yall add Librarians
            // else {
            //     $name = Librarians::where('email', $user->email)->value('name');
            // }

            // Add here if yall want something idk


            return response()->json([
                'email' => $user->email,
                'role' => $user->role,
                'name' => $name,
            ]);
        } else {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }
}
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\LoginController as LoginControllerV1;
use App\Http\Controllers\LoginController as LoginController;
use App\Http\Controllers\FacultyController as FacultyController;
use App\Http\Controllers\Api\V1\UsersController as UsersController;

use App\Http\Controllers\PublicationController;

Route::get('/publications', [PublicationController::class, 'index']);
Route::get('/publications/{id}', [PublicationController::class, 'show']);
Route::post('/publications', [PublicationController::class, 'store']);
Route::post('/publications/{id}', [PublicationController::class, 'update']);
Route::delete('/publications/{id}', [PublicationController::class, 'destroy']);

use App\Http\Controllers\BorrowController;

Route::middleware('auth:sanctum')->group(function () {
    
    // Borrow a publication
    Route::post('/publications/{id}/borrow', [BorrowController::class, 'borrowPublication']);
    
    // Return a borrowed publication
    Route::post('/borrows/{id}/return', [BorrowController::class, 'returnPublication']);
    
    // Get current user's borrowing history
    Route::get('/my-borrows', [BorrowController::class, 'getUserBorrows']);
    
    // Librarian only routes
    Route::middleware('role:librarian')->group(function () {
        // Get all borrow records
        Route::get('/borrows', [BorrowController::class, 'getAllBorrows']);
        
        // Get borrowing statistics
        Route::get('/borrow-stats', [BorrowController::class, 'getBorrowingStats']);
    });
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['prefix' => 'v1', 'namespace' => 'App\Http\Controllers\Api\V1'], function () {
    Route::apiResource('students', App\Http\Controllers\Api\V1\StudentsController::class);
    Route::apiResource('users', App\Http\Controllers\Api\V1\UsersController::class);
});

// Route::get('/sanctum/csrf-cookie', function () {
//     return response()->json(['message' => 'CSRF cookie set']);
// });

// Depreciated...?
Route::post('/login', LoginControllerV1::class)->middleware('guest:sanctum');

// Use this instead
Route::post('/login', LoginController::class)->middleware('guest:sanctum');

Route::post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'message' => 'Logged out successfully',
    ], 200);
})->middleware('auth:sanctum');

// Route::get('/userinfo', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Universal API to get everything needed for the logged in user
Route::get('/userinfo', UsersController::class)->middleware('auth:sanctum');

Route::get('/studentinfo', function (Request $request) {
    return $request->user()->load('students');
})->middleware('auth:sanctum');
// Use ability to restrict access to certain roles
// ->middleware('auth:sanctum', 'abilities:stuff')

Route::post('/faculty', [FacultyController::class, 'store']);
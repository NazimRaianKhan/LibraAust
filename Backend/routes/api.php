<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\LoginController as LoginController;

use App\Http\Controllers\PageController;

Route::get('/pages/{slug}', [PageController::class, 'show']);

use App\Http\Controllers\BookController;

// All Books
Route::get('/books', [BookController::class, 'index']);

// Single Book by ID
Route::get('/books/{id}', [BookController::class, 'show']);
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

Route::post('/login', LoginController::class)->middleware('guest:sanctum');

Route::post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'message' => 'Logged out successfully',
    ], 200);
})->middleware('auth:sanctum');

Route::get('/userinfo', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/studentinfo', function (Request $request) {
    return $request->user()->load('students');
})->middleware('auth:sanctum');
// Use ability to restrict access to certain roles
// ->middleware('auth:sanctum', 'abilities:stuff')
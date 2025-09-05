<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// routes/api.php
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

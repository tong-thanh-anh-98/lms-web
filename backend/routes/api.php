<?php

use App\Http\Controllers\front\AccountController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AccountController::class, 'register'])->name('register');
Route::post('/login', [AccountController::class, 'authenticate'])->name('authenticate');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

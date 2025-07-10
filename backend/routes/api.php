<?php

use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\CategoryController;
use App\Http\Controllers\front\CourseController;
use App\Http\Controllers\front\LanguageController;
use App\Http\Controllers\front\LevelController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AccountController::class, 'register'])->name('register');
Route::post('/login', [AccountController::class, 'authenticate'])->name('authenticate');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/courses', [CourseController::class, 'store'])->name('store');
    Route::get('/courses/show/{id}', [CourseController::class, 'show'])->name('show');
    Route::get('/courses/meta-data', [CourseController::class, 'metaData'])->name('metaData');
    Route::post('/categories', [CategoryController::class, 'store'])->name('store');
    Route::post('/levels', [LevelController::class, 'store'])->name('store');
    Route::post('/languages', [LanguageController::class, 'store'])->name('store');
});

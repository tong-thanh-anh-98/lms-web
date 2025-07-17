<?php

use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\CategoryController;
use App\Http\Controllers\front\CourseController;
use App\Http\Controllers\front\LanguageController;
use App\Http\Controllers\front\LevelController;
use App\Http\Controllers\front\OutcomeController;
use App\Http\Controllers\front\RequirementController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AccountController::class, 'register'])->name('register');
Route::post('/login', [AccountController::class, 'authenticate'])->name('authenticate');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('courses', CourseController::class);
    // Route::post('/courses', [CourseController::class, 'store'])->name('store');
    // Route::get('/courses/{id}', [CourseController::class, 'show'])->name('show');
    // Route::put('/courses/{id}', [CourseController::class, 'update'])->name('update');
    Route::get('/get-courses/meta-data', [CourseController::class, 'metaData'])->name('metaData');
    Route::post('/save-course-image/{id}', [CourseController::class, 'saveCourseImage'])->name('saveCourseImage');

    Route::apiResource('outcomes', OutcomeController::class);
    // Route::get('/outcomes', [OutcomeController::class, 'index'])->name('index');
    // Route::post('/outcomes', [OutcomeController::class, 'store'])->name('store');
    // Route::get('/outcomes/{id}', [OutcomeController::class, 'show'])->name('show');
    // Route::put('/outcomes/{id}', [OutcomeController::class, 'update'])->name('update');
    // Route::delete('/outcomes/{id}', [OutcomeController::class, 'destroy'])->name('destroy');
    Route::post('/sort-outcomes', [OutcomeController::class, 'sortOutcomes'])->name('sortOutcomes');

    Route::get('get-all-requirements', [RequirementController::class, 'getAllRequirement'])->name('getAllRequirement');
    Route::apiResource('requirements', RequirementController::class);
    // Route::get('/requirements', [RequirementController::class, 'index'])->name('index');
    // Route::post('/requirements', [RequirementController::class, 'store'])->name('store');
    // Route::get('/requirements/{id}', [RequirementController::class, 'show'])->name('show');
    // Route::put('/requirements/{id}', [RequirementController::class, 'update'])->name('update');
    // Route::delete('/requirements/{id}', [RequirementController::class, 'destroy'])->name('destroy');
    Route::post('/sort-requirements', [RequirementController::class, 'sortRequirements'])->name('sortRequirements');


    Route::post('/categories', [CategoryController::class, 'store'])->name('store');
    Route::post('/levels', [LevelController::class, 'store'])->name('store');
    Route::post('/languages', [LanguageController::class, 'store'])->name('store');
});

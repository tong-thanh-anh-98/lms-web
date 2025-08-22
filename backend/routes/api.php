<?php

use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\CategoryController;
use App\Http\Controllers\front\ChapterController;
use App\Http\Controllers\front\CourseController;
use App\Http\Controllers\front\HomeController;
use App\Http\Controllers\front\LanguageController;
use App\Http\Controllers\front\LessonController;
use App\Http\Controllers\front\LevelController;
use App\Http\Controllers\front\OutcomeController;
use App\Http\Controllers\front\RequirementController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AccountController::class, 'register'])->name('register');
Route::post('/login', [AccountController::class, 'authenticate'])->name('authenticate');

// Show Featured Courses on Home
Route::get('/fetch-categories', [HomeController::class, 'fetchCategories'])->name('fetchCategories');
Route::get('/fetch-feature-courses', [HomeController::class, 'fetchFeatureCourses'])->name('fetchFeatureCourses');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('courses', CourseController::class);
    Route::get('/get-courses/meta-data', [CourseController::class, 'metaData'])->name('metaData');
    Route::post('/save-course-image/{id}', [CourseController::class, 'saveCourseImage'])->name('saveCourseImage');
    Route::post('/change-course-status/{id}', [CourseController::class, 'changeStatus'])->name('changeStatus');

    Route::get('get-all-outcomes', [OutcomeController::class, 'getAllOutcomes'])->name('getAllOutcomes');
    Route::apiResource('outcomes', OutcomeController::class);
    Route::post('/sort-outcomes', [OutcomeController::class, 'sortOutcomes'])->name('sortOutcomes');

    Route::get('get-all-requirements', [RequirementController::class, 'getAllRequirement'])->name('getAllRequirement');
    Route::apiResource('requirements', RequirementController::class);
    Route::post('/sort-requirements', [RequirementController::class, 'sortRequirements'])->name('sortRequirements');

    Route::get('/categories', [CategoryController::class, 'index'])->name('index');
    Route::post('/categories', [CategoryController::class, 'store'])->name('store');

    Route::get('/levels', [LevelController::class, 'index'])->name('index');
    Route::post('/levels', [LevelController::class, 'store'])->name('store');

    Route::get('/languages', [LanguageController::class, 'index'])->name('index');
    Route::post('/languages', [LanguageController::class, 'store'])->name('store');

    Route::get('get-all-chapters', [ChapterController::class, 'getAllChapters'])->name('getAllChapters');
    Route::apiResource('chapters', ChapterController::class);
    Route::post('/sort-chapters', [ChapterController::class, 'sortChapters'])->name('sortChapters');

    Route::get('get-all-lessons', [LessonController::class, 'getAllLessons'])->name('getAllLessons');
    Route::apiResource('lessons', LessonController::class);
    Route::post('/save-lesson-video/{id}', [LessonController::class, 'saveVideo'])->name('saveVideo');
    Route::post('/sort-lessons', [LessonController::class, 'sortLessons'])->name('sortLessons');

    Route::get('/my-courses', [AccountController::class, 'courses'])->name('courses');
});

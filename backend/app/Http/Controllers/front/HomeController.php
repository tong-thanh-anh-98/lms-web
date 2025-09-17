<?php

namespace App\Http\Controllers\front;

use App\Models\Level;
use App\Models\Course;
use App\Models\Category;
use App\Models\Language;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\User;

class HomeController extends Controller
{
    public function fetchCategories()
    {
        try {
            $categories = Category::orderBy('name', 'ASC')->get();

            return response()->json([
                'status'    => 200,
                'message'   => __('message.success'),
                'data'      => $categories
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'   => __('message.error')
            ], 500);
        }
    }

    public function fetchLevels()
    {
        try {
            $levels = Level::orderBy('name', 'ASC')->get();

            return response()->json([
                'status'    => 200,
                'message'   => __('message.success'),
                'data' => $levels
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'   => __('message.error')
            ], 500);
        }
    }

    public function fetchLanguages()
    {
        try {
            $languages = Language::orderBy('name', 'ASC')->get();

            return response()->json([
                'status'    => 200,
                'message'   => __('message.success'),
                'data'      => $languages
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'   => __('message.error')
            ], 500);
        }
    }

    public function fetchFeatureCourses()
    {
        try {
            $courses = Course::orderBy('title', 'ASC')
                ->where('is_featured', 'yes')
                ->where('status', 1)
                ->with('level')
                ->get();

            return response()->json([
                'status'    => 200,
                'message'   => __('message.success'),
                'data'      => $courses
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'   => __('message.error')
            ], 500);
        }
    }

    public function courses(Request $request)
    {
        try {
            $courses = Course::where('status', 1)->with('level');

            // filer course by keyword
            if (!empty($request->keyword)) {
                $courses = $courses->where('title', 'like', '%' . $request->keyword . '%');
            }

            // filer course by categories
            if (!empty($request->category)) {
                $categoryArr = explode(',', $request->category);
                if (!empty($categoryArr)) {
                    $courses = $courses->whereIn('category_id', $categoryArr);
                }
            }

            // filer course by levels
            if (!empty($request->level)) {
                $levelArr = explode(',', $request->level);
                if (!empty($levelArr)) {
                    $courses = $courses->whereIn('level_id', $levelArr);
                }
            }

            // filer course by languages
            if (!empty($request->language)) {
                $languageArr = explode(',', $request->language);
                if (!empty($languageArr)) {
                    $courses = $courses->whereIn('language_id', $languageArr);
                }
            }

            if (!empty($request->sort)) {
                $sortArr = ['asc', 'desc'];

                if (in_array($request->sort, $sortArr)) {
                    $courses = $courses->orderBy('created_at', $request->sort);
                } else {
                    $courses = $courses->orderBy('created_at', 'DESC');
                }
            }

            $courses = $courses->get();

            return response()->json([
                'status'    => 200,
                'message'   => __('message.success'),
                'data'      => $courses
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'   => __('message.error')
            ], 500);
        }
    }

    public function course($id)
    {
        $course = Course::where('id', $id)
            ->withCount('chapters')
            ->with([
                'category',
                'level',
                'language',
                'chapters' => function ($query) {
                    $query->withCount(['lessons' => function ($query) {
                        $query->where('status', 1);
                        $query->whereNotNull('video');
                    }]);
                    $query->withSum(['lessons' => function ($query) {
                        $query->where('status', 1);
                        $query->whereNotNull('video');
                    }], 'duration');
                },
                'chapters.lessons' => function ($query) {
                    $query->where('status', 1);
                    $query->whereNotNull('video');
                },
                'outcomes',
                'requirements'

            ])
            ->first();

        if ($course === null) {
            return response()->json([
                'status'    => 404,
                'message'   => __('message.not_found')
            ], 404);
        }

        $totalDuration = $course->chapters->sum('lessons_sum_duration');
        $totalLessons = $course->chapters->sum('lessons_count');

        $course->lessons_sum_duration = $totalDuration;
        $course->lessons_count = $totalLessons;

        return response()->json([
            'status'    => 200,
            'message'   => __('message.success'),
            'data'  => $course
        ]);
    }

    public function enroll(Request $request)
    {
        $course = Course::find($request->course_id);

        if (!$course) {
            return response()->json([
                'status'    => 404,
                'message'   => __('message.not_found')
            ], 404);
        }

        $exists = Enrollment::where([
            'user_id'   => $request->user()->id,
            'course_id' => $request->course_id,
        ])->exists();

        if ($exists) {
            return response()->json([
                'status'  => 409,
                'message' => __('message.exists')
            ], 409);
        }

        DB::beginTransaction();
        try {
            $enrollment = new Enrollment();
            $enrollment->user_id = $request->user()->id;
            $enrollment->course_id = $request->course_id;
            $enrollment->save();
            DB::commit();

            return response()->json([
                'status'    => 201,
                'message' => __('message.created'),
                'data'      => $enrollment
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'   =>  __('message.error')
            ], 500);
        }
    }
}

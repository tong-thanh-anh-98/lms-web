<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\Language;
use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
}

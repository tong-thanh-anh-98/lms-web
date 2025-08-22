<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
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
}

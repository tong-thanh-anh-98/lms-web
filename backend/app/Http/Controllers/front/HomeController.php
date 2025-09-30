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
use App\Services\CourseService;

class HomeController extends Controller
{
    protected $courseService;

    public function __construct(CourseService $courseService)
    {
        $this->courseService = $courseService;
    }

    public function fetchCategories()
    {
        $categories = $this->courseService->getCategories();

        return response()->json([
            'status'    => 200,
            'message'   => __('message.success'),
            'data'      => $categories
        ], 200);
    }

    public function fetchLevels()
    {
        $levels = $this->courseService->getLevel();

        return response()->json([
            'status'    => 200,
            'message'   => __('message.success'),
            'data' => $levels
        ], 200);
    }

    public function fetchLanguages()
    {
        $languages = $this->courseService->getLanguage();

        return response()->json([
            'status'    => 200,
            'message'   => __('message.success'),
            'data'      => $languages
        ], 200);
    }

    public function fetchFeatureCourses()
    {
        $courses = $this->courseService->getFeaturedCourses();

        return response()->json([
            'status'    => 200,
            'message'   => __('message.success'),
            'data'      => $courses
        ], 200);
    }

    public function courses(Request $request)
    {
        $filters = [
            'keyword'  => $request->keyword,
            'category' => !empty($request->category) ? explode(',', $request->category) : [],
            'level'    => !empty($request->level) ? explode(',', $request->level) : [],
            'language' => !empty($request->language) ? explode(',', $request->language) : [],
            'sort'     => $request->sort,
        ];

        $courses = $this->courseService->getFilteredCourses($filters);

        return response()->json([
            'status'    => 200,
            'message'   => __('message.success'),
            'data'      => $courses
        ], 200);
    }

    public function course($id)
    {
        $course = $this->courseService->getCourseDetail($id);

        if (!$course) {
            return response()->json([
                'status'  => 404,
                'message' => __('message.not_found')
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'message'   => __('message.success'),
            'data'  => $course
        ]);
    }

    public function enroll(Request $request)
    {
        $result = $this->courseService->enrollCourse(
            $request->user()->id,
            $request->course_id
        );

        if (isset($result['error'])) {
            switch ($result['error']) {
                case 'not_found':
                    return response()->json([
                        'status'    => 404,
                        'message'   => __('message.not_found')
                    ], 404);
                case 'exists':
                    return response()->json([
                        'status'  => 409,
                        'message' => __('message.exists')
                    ], 409);
                default:
                    return response()->json([
                        'status'  => 500,
                        'message' => __('message.error')
                    ], 500);
            }
        }

        return response()->json([
            'status'  => 201,
            'message' => __('message.enroll'),
            'data'    => $result
        ], 201);
    }
}

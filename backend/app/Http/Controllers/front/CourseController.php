<?php

namespace App\Http\Controllers\front;

use App\Models\Category;
use App\Models\Course;
use App\Models\Level;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\CourseRequest;
use App\Models\Language;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CourseRequest $request)
    {
        DB::beginTransaction();

        try {
            $data = $this->extractCourseData($request);
            $course = Course::create($data);
            DB::commit();

            return response()->json([
                'status'    => 201,
                'message' => __('message.created'),
                'data'      => $course
            ], 201);
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'   =>  __('message.error')
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $course = Course::find($id);

            if (!$course) {
                return response()->json([
                    'status'    => 404,
                    'message' => __('message.not_found'),
                ], 404);
            }

            return response()->json([
                'status'  => 200,
                'message' => __('message.success'),
                'data'    => $course
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'  => 500,
                'message' => __('message.error'),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CourseRequest $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function metaData()
    {
        try {
            $categories = Category::all();
            $levels = Level::all();
            $languages = Language::all();

            return response()->json([
                'status'    => 200,
                'message' => __('message.success'),
                'categories'      => $categories,
                'levels'      => $levels,
                'languages'      => $languages,
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'   =>  __('message.error')
            ], 500);
        }
    }

    private function extractCourseData(CourseRequest $request)
    {
        return array_merge(
            $request->only([
                'title',
                'category_id',
                'level_id',
                'language_id',
                'description',
                'price',
                'cross_price',
                'status',
                'is_featured'
            ]),
            [
                'user_id' => Auth::id(), // user login
            ]
        );
    }
}

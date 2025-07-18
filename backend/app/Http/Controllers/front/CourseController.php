<?php

namespace App\Http\Controllers\front;

use App\Models\Level;
use App\Models\Course;
use App\Models\Category;
use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\CourseRequest;
use App\Services\ImageUploadService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
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

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $courses = Course::orderBy('created_at', 'desc')->get();

            return response()->json([
                'status'    => 200,
                'message'       => __('message.success'),
                'data'      => $courses
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Error' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'       => __('message.error')
            ], 500);
        }
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
            DB::rollBack();
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
        DB::beginTransaction();

        try {
            $course = Course::find($id);

            if (!$course) {
                return response()->json([
                    'status' => 404,
                    'message' => __('message.not_found')
                ], 404);
            }

            $data = $this->extractCourseData($request);
            $course->update($data);
            DB::commit();

            return response()->json([
                'status' => 200,
                'message' => __('message.updated'),
                'data' => $data
            ], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message' => __('message.error'),
            ], 500);
        }
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

    public function saveCourseImage(Request $request, $id, ImageUploadService $imageService)
    {
        DB::beginTransaction();

        try {
            $course = Course::find($id);
            if (!$course) {
                return response()->json([
                    'status' => 404,
                    'message' => __('message.not_found'),
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:20480',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'errors' => $validator->errors(),
                ], 400);
            }

            // Xóa ảnh cũ nếu có
            if (!empty($course->image)) {
                $imageService->deleteImage('courses', $course->image);
            }

            // Upload ảnh mới
            $imageName = $imageService->uploadImage($request->image, 'courses', [750, 480]);
            $course->image = $imageName;
            $course->save();

            DB::commit();

            return response()->json([
                'status' => 200,
                'message' => __('message.uploaded'),
                'data' => $course,
            ], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status' => 500,
                'message' => __('message.error'),
            ], 500);
        }
    }
}

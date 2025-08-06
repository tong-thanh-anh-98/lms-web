<?php

namespace App\Http\Controllers\front;

use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\LessonRequest;
use App\Services\UploadService;
use Illuminate\Support\Facades\Validator;

class LessonController extends Controller
{
    private function extractLessonData(LessonRequest $request)
    {
        return array_merge(
            $request->only([
                'title',
                'chapter_id',
                'duration',
                'video',
                'description',
                'status'
            ]),
            [
                'is_free_preview' => $request->input('is_free_preview', 'no'),
                'sort_order' => $request->input('sort_order', 1000)
            ]
        );
    }

    public function getAllLessons()
    {
        try {
            $lesson = Lesson::orderBy('created_at', 'desc')->get();

            return response()->json([
                'status' => 200,
                'message' => __('message.success'),
                'data' => $lesson
            ], 200);
        } catch (\Throwable $e) {
            Log::error('List error: ' . $e->getMessage());

            return response()->json([
                'status' => 500,
                'message' => __('message.error')
            ], 500);
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $course_id = $request->course_id;
            $lesson = Lesson::where('course_id', $course_id)->orderBy('sort_order')->get();

            return response()->json([
                'status'    => 200,
                'message'   => __('message.success'),
                'data'      => $lesson
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status' => 500,
                'message' => __('message.error')
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(LessonRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $this->extractLessonData($request);
            $lesson = Lesson::create($data);
            DB::commit();

            return response()->json([
                'status'    => 201,
                'message'   => __('message.created'),
                'data'  => $lesson
            ], 201);
        } catch (\Throwable $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'status' => 500,
                'message'   => __('message.error')
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $lesson = Lesson::find($id);

            if (!$lesson) {
                return response()->json([
                    'status' => 404,
                    'message' => __('message.not_found')
                ], 404);
            }

            return response()->json([
                'status'  => 200,
                'message' => __('message.success'),
                'data'    => $lesson
            ], 200);
        } catch (\Throwable $e) {
            Log::error('List error: ' . $e->getMessage());

            return response()->json([
                'status' => 500,
                'message' => __('message.error')
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(LessonRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $lesson = Lesson::find($id);
            if (!$lesson) {
                return response()->json([
                    'status' => 404,
                    'message' => __('message.not_found')
                ], 404);
            }

            $data = $this->extractLessonData($request);
            $lesson->update($data);
            DB::commit();

            return response()->json([
                'status'    => 201,
                'message' => __('message.updated'),
                'data'      => $lesson
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
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $lesson = Lesson::find($id);

            if (!$lesson) {
                return response()->json([
                    'status'    => 404,
                    'message' => __('message.not_found'),
                ], 404);
            }

            $lesson->delete();

            return response()->json([
                'status'  => 200,
                'message' => __('message.deleted'),
                'data'    => $lesson
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'  => 500,
                'message' => __('message.error'),
            ], 500);
        }
    }

    public function saveVideo(Request $request, $id, UploadService $uploadService)
    {
        DB::beginTransaction();

        try {
            $lesson = Lesson::find($id);
            if (!$lesson) {
                return response()->json([
                    'status' => 404,
                    'message' => __('message.not_found'),
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'video' => 'required|mimes:mp4'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'errors' => $validator->errors(),
                ], 400);
            }

            // Xóa video cũ nếu có
            if (!empty($lesson->video)) {
                $uploadService->deleteVideo('courses/videos', $lesson->video);
            }

            // Upload video mới
            $videoName = $uploadService->uploadVideo($request->file('video'), 'courses/videos');
            $lesson->video = $videoName;
            $lesson->save();

            DB::commit();

            // Tạo URL public tới file
            $videoUrl = asset("uploads/courses/videos/{$videoName}");

            return response()->json([
                'status' => 200,
                'message' => __('message.uploaded'),
                'data' => [
                    'lesson' => $lesson,
                    'video_url' => $videoUrl,
                ],
            ], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Upload video error: ' . $e->getMessage());

            return response()->json([
                'status' => 500,
                'message' => __('message.error'),
            ], 500);
        }
    }
}

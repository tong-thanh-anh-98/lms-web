<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Http\Requests\ChapterRequest;
use App\Models\Chapter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ChapterController extends Controller
{
    private function extractChapterData(ChapterRequest $request)
    {
        return array_merge(
            $request->only([
                'title',
                'course_id',
                'status'
            ]),
            [
                'sort_order' => $request->input('sort_order', 1000), // defaults to 1000 if not present
            ]
        );
    }

    public function getAllChapters()
    {
        try {
            $chapter = Chapter::orderBy('created_at', 'desc')->get();

            return response()->json([
                'status'    => 200,
                'message'   => __('message.success'),
                'data'  => $chapter
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'status' => 500,
                'message'   => __('message.error')
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
            $chapter = Chapter::where('course_id', $course_id)->orderBy('sort_order')->get();

            return response()->json([
                'status'    => 200,
                'message'   => __('message.success'),
                'data'      => $chapter
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
    public function store(ChapterRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $this->extractChapterData($request);
            $chapter = Chapter::create($data);
            DB::commit();

            return response()->json([
                'status'    => 201,
                'message'   => __('message.created'),
                'data'  => $chapter
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
            $chapter = Chapter::find($id);
            if (!$chapter) {
                return response()->json([
                    'status' => 404,
                    'message' => __('message.not_found')
                ], 404);
            }

            return response()->json([
                'status'  => 200,
                'message' => __('message.success'),
                'data'    => $chapter
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
    public function update(ChapterRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $chapter = Chapter::find($id);
            if (!$chapter) {
                return response()->json([
                    'status' => 404,
                    'message' => __('message.not_found')
                ], 404);
            }

            $data = $this->extractChapterData($request);
            $chapter->update($data);
            // $chapter->load('lesson');
            DB::commit();

            return response()->json([
                'status'    => 201,
                'message' => __('message.updated'),
                'data'      => $chapter
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
    public function destroy($id)
    {
        try {
            $chapter = Chapter::find($id);

            if (!$chapter) {
                return response()->json([
                    'status'    => 404,
                    'message' => __('message.not_found'),
                ], 404);
            }

            $chapter->delete();

            return response()->json([
                'status'  => 200,
                'message' => __('message.deleted'),
                'data'    => $chapter
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'  => 500,
                'message' => __('message.error'),
            ], 500);
        }
    }

    public function sortChapters(Request $request)
    {
        try {
            $courseId = '';
            if (!empty($request->chapters)) {
                foreach ($request->chapters as $key => $chapter) {
                    $courseId =$chapter['course_id'];
                    Chapter::where('id', $chapter['id'])->update(['sort_order' => $key]);
                }
            }

            $chapters = Chapter::where('course_id', $courseId)->with('lessons')->orderBy('sort_order', 'ASC')->get();

            return response()->json([
                'status'  => 200,
                'chapters' => $chapters,
                'message' => __('message.success_sort'),
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'  => 500,
                'message' => __('message.error'),
            ], 500);
        }
    }
}

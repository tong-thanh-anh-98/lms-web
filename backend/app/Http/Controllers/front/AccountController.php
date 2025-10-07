<?php

namespace App\Http\Controllers\front;

use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use App\Services\CourseService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\RegisterRequest;
use App\Models\Course;
use Illuminate\Support\Facades\Validator;

class AccountController extends Controller
{
    protected $courseService;

    public function __construct(CourseService $courseService)
    {
        $this->courseService = $courseService;
    }
    private function extractUserData(RegisterRequest $request)
    {
        return [
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
        ];
    }

    public function register(RegisterRequest $request)
    {
        DB::beginTransaction();

        try {
            $data = $this->extractUserData($request);
            $user = User::create($data);
            DB::commit();

            return response()->json([
                'status'        => 201,
                'message'       => __('message.register_success'),
                'data'      => $user
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'   => __('message.error')
            ], 500);
        }
    }

    public function authenticate(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email'     => 'required|email',
                'password'     => 'required'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status'    => 400,
                    'errors'   => $validator->errors(),
                ], 400);
            }

            if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
                $user = User::find(Auth::id());
                $token = $user->createToken('token')->plainTextToken;

                return response()->json([
                    'status' => 200,
                    'message' => __('message.login_success'),
                    'id' => Auth::user()->id,
                    'name' => $user->name,
                    'token' => $token,
                ], 200);
            } else {
                return response()->json([
                    'status' => 401,
                    'message' => __('message.login_error')
                ], 401);
            }
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'   =>  __('message.error')
            ], 500);
        }
    }

    public function courses(Request $request)
    {
        $courses = $this->courseService->getUserCourses($request->user());

        $courses->map(function ($course) {
            $course->rating = $course->reviews_count > 0 ? number_format($course->reviews_sum_rating / $course->reviews_count, 1) : "0.0";
        });

        return response()->json([
            'status' => 200,
            'data'   => $courses
        ], 200);
    }

    public function enrollments(Request $request)
    {
        $enrollments = $this->courseService->getUserEnrollments($request->user());

        $enrollments->map(function ($enrollments) {
            $enrollments->course->rating = $enrollments->course->reviews_count > 0 ? number_format($enrollments->course->reviews_sum_rating / $enrollments->course->reviews_count, 1) : "0.0";
        });

        return response()->json([
            'status' => 200,
            'data'   => $enrollments
        ], 200);
    }

    public function course($id, Request $request)
    {
        try {
            $courseData = $this->courseService->getCourseForUser($request->user(), $id);

            if (!$courseData) {
                return response()->json([
                    'status'  => 404,
                    'message' => __('message.not_access')
                ], 404);
            }

            return response()->json([
                'status'                    => 200,
                'message'                   => __('message.success'),
                'data'                      => $courseData['course'],
                'activityLesson'            => $courseData['activityLesson'],
                'completedLessons'          => $courseData['completedLessons'],
                'progress'                  => $courseData['progress'],
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'status'  => 500,
                'message' => __('message.error')
            ], 500);
        }
    }

    public function saveActivity(Request $request)
    {
        try {
            $user = $request->user();
            $courseId = $request->input('course_id');
            $lessonId = $request->input('lesson');

            $activity = $this->courseService->saveUserActivity($user, $courseId, $lessonId);

            if (!$activity) {
                return response()->json([
                    'status'  => 404,
                    'message' => __('message.not_found')
                ], 404);
            }

            return response()->json([
                'status'  => 200,
                'message' => __('message.activity'),
                'data'    => $activity
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'status'  => 500,
                'message' => __('message.error')
            ], 500);
        }
    }

    public function markAsCompleted(Request $request)
    {
        try {
            $user = $request->user();
            $courseId = $request->input('course_id');
            $lessonId = $request->input('lesson');

            $activity = $this->courseService->markAsCompleted($user, $courseId, $lessonId);

            if (!$activity) {
                return response()->json([
                    'status'  => 404,
                    'message' => __('message.not_found'),
                ], 404);
            }

            // lấy danh sách completed lessons
            $completedLessons = $this->courseService->getCompletedLessons($user->id, $courseId);

            return response()->json([
                'status'  => 200,
                'data'    => $activity,
                'completedLessons' => $completedLessons,
                'message' => __('message.complete'),
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'status'  => 500,
                'message' => __('message.error'),
            ], 500);
        }
    }

    public function saveRating(Request $request)
    {
        $course = Course::find($request->course_id);
        if ($course === null) {
            return response()->json([
                'status'  => 404,
                'message' => __('message.not_found'),
            ], 404);
        }

        $count = Review::where('course_id', $request->course_id)->where('user_id', $request->user()->id)->count();

        if ($count > 0) {
            return response()->json([
                'status'  => 200,
                'message' => 'You already rated this course.',
            ], 200);
        }

        DB::beginTransaction();

        try {
            $review = new Review();
            $review->user_id = $request->user()->id;
            $review->course_id = $request->course_id;
            $review->rating = $request->rating;
            $review->comment = $request->comment;
            $review->status = 1;
            $review->save();
            DB::commit();

            return response()->json([
                'status'    => 201,
                'message'   => 'Thanks for your feedback.',
                'data'      => $review
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

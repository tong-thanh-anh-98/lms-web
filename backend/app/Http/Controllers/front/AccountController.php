<?php

namespace App\Http\Controllers\front;

use App\Models\User;
use App\Models\Course;
use App\Models\Review;
use Illuminate\Http\Request;
use App\Services\CourseService;
use App\Services\UploadService;
use App\Mail\ResetPasswordEmail;
use App\Mail\ChangePasswordEmail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\RegisterRequest;
use Illuminate\Support\Facades\Validator;
use DragonCode\Support\Facades\Helpers\Str;

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
            'password' => $request->input('password'),
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

    public function fetchUser(Request $request)
    {
        $user = User::find($request->user()->id);
        if ($user === null) {
            return response()->json([
                'status'  => 404,
                'message' => __('message.not_found'),
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'message'   => __('message.success'),
            'data'      => $user
        ], 200);
    }

    public function updateUser(Request $request)
    {
        $user = User::find($request->user()->id);

        if ($user === null) {
            return response()->json([
                'status'  => 404,
                'message' => __('message.not_found'),
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'  => 'required',
            'email' => 'required|email|unique:users,email,' . $request->user()->id
        ]);

        if ($validator->fails()) {
            return response()->json(data: [
                'status'  => 400,
                'error' => $validator->errors(),
            ]);
        }

        try {
            DB::beginTransaction();
            $user->update($validator->validated());
            DB::commit();

            return response()->json([
                'status'  => 201,
                'message' => __('message.updated'),
                'data'    => $user,
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('User update failed: ' . $e->getMessage());

            return response()->json([
                'status'  => 500,
                'message' => __('message.error'),
            ], 500);
        }
    }

    public function saveProfileImage(Request $request, $id, UploadService $uploadService)
    {
        DB::beginTransaction();
        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json([
                    'status' => 404,
                    'message'   => __('message.not_found')
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'errors' => $validator->errors(),
                ], 400);
            }

            // Xóa ảnh cũ nếu có
            if (!empty($user->image)) {
                $uploadService->deleteImage('users', $user->image);
            }

            // Upload ảnh mới
            $imageName = $uploadService->uploadImage($request->image, 'profiles', [50, 50]);
            $user->image = $imageName;
            $user->save();
            DB::commit();

            return response()->json([
                'status'    => 200,
                'message'   => __('message.uploaded'),
                'data'      => $user,
            ], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'   => __('message.error'),
            ], 500);
        }
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        $user = User::where('email', $request->email)->first();

        // Tạo token reset
        $token = Str::random(64);

        // Lưu token vào bảng password_reset_tokens
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => Hash::make($token),
                'created_at' => now()
            ]
        );

        // Gửi email với Mailable tùy chỉnh
        Mail::to($user->email)->send(new ResetPasswordEmail($user, $token));

        return response()->json([
            'status' => 200,
            'message' => 'Reset password link has been sent to your email.'
        ], 200);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'password' => 'required|confirmed|min:8',
        ]);

        $record = DB::table('password_reset_tokens')->where('email', $request->email)->first();

        if (!$record || !Hash::check($request->token, $record->token)) {
            return response()->json([
                'status' => 400,
                'message' => 'Invalid or expired token.',
            ], 400);
        }

        $user = User::where('email', $request->email)->first();
        $user->update(['password' => $request->password]);

        // Xoá token sau khi đổi
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        // Hủy tất cả token đăng nhập cũ
        if (method_exists($user, 'tokens')) {
            $user->tokens()->delete();
        }

        return response()->json([
            'status' => 200,
            'message' => 'Password has been reset successfully.',
        ], 200);
    }

    public function changePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required',
            'password' => 'required|confirmed|min:8',
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => 400,
                'message' => 'Current password is incorrect.'
            ], 400);
        }

        $user->password = $request->password;
        $user->save();

        // Xóa các token cũ (đăng xuất các thiết bị khác)
        if (method_exists($user, 'tokens')) {
            $user->tokens()->delete();
        }

        try {
            Mail::to($user->email)->send(new ChangePasswordEmail($user));
        } catch (\Exception $e) {
            Log::error('Failed to send password changed email: ' . $e->getMessage());
        }

        return response()->json([
            'status' => 200,
            'message' => 'Password changed successfully.'
        ], 200);
    }
}

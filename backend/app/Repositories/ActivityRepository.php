<?php

namespace App\Repositories;

use App\Models\Activity;

class ActivityRepository
{
    /**
     * Kiểm tra user đã có activity trong course chưa
     */
    public function existsForUserCourse(int $userId, int $courseId): bool
    {
        return Activity::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->exists();
    }

    /**
     * Tạo activity ban đầu (first lesson)
     */
    public function createInitial(int $userId, int $courseId, $lesson): Activity
    {
        return Activity::create([
            'user_id'         => $userId,
            'course_id'       => $courseId,
            'chapter_id'      => $lesson->chapter_id,
            'lesson_id'       => $lesson->id,
            'is_last_watched' => 'yes',
        ]);
    }

    /**
     * Lấy activity cuối cùng của user trong course (bài học đang học)
     */
    public function getLastWatchedLesson(int $userId, int $courseId)
    {
        return Activity::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->where('is_last_watched', 'yes')
            ->with('lesson') // quan hệ lesson
            ->first();
    }

    public function saveUserActivity(int $userId, int $courseId, $lesson): Activity
    {
        // Reset toàn bộ activity trước đó về "no"
        Activity::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->update(['is_last_watched' => 'no']);

        // Cập nhật hoặc tạo mới activity cho lesson hiện tại
        return Activity::updateOrCreate(
            [
                'user_id'       => $userId,
                'course_id'     => $courseId,
                'lesson_id'     => $lesson->id,
                'chapter_id'    => $lesson->chapter_id,
            ],
            [
                'is_last_watched' => 'yes',
            ]
        );
    }

    public function markAsCompleted(int $userId, int $courseId, $lesson): Activity
    {
        return Activity::updateOrCreate(
            [
                'user_id'    => $userId,
                'course_id'  => $courseId,
                'lesson_id'  => $lesson->id,
                'chapter_id' => $lesson->chapter_id,
            ],
            [
                'is_completed' => 'yes',
            ]
        );
    }

    public function getCompletedLessons(int $userId, int $courseId)
    {
        return Activity::where([
            'user_id' => $userId,
            'course_id' => $courseId,
            'is_completed' => 'yes',
        ])->pluck('lesson_id')->toArray();
    }

    public function getCompleteLessonCount(int $userId, int $courseId)
    {
        return Activity::where([
            'user_id' => $userId,
            'course_id' => $courseId,
            'is_completed' => 'yes',
        ])->count();
    }
}

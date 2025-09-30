<?php

namespace App\Repositories;

use App\Models\Lesson;
use App\Models\Chapter;

class LessonRepository
{
    /**
     * Lấy bài học đầu tiên của course
     */
    public function getFirstLessonOfCourse(int $courseId): ?Lesson
    {
        $chapter = Chapter::where('course_id', $courseId)
            ->orderBy('sort_order', 'asc')
            ->first();

        if (!$chapter) {
            return null;
        }

        return Lesson::where('chapter_id', $chapter->id)
            ->where('status', 1)
            ->whereNotNull('video')
            ->orderBy('sort_order', 'asc')
            ->first();
    }

    /**
     * Lấy bài học theo ID
     */
    public function findById(int $lessonId): ?Lesson
    {
        return Lesson::where('id', $lessonId)
            ->where('status', 1)
            ->whereNotNull('video')
            ->first();
    }
}

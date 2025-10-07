<?php

namespace App\Repositories;

use App\Models\Level;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Chapter;
use App\Models\Category;
use App\Models\Enrollment;
use App\Models\Language;

class CourseRepository
{
    public function getCategories()
    {
        return Category::orderBy('name', 'asc')->get();
    }

    public function getLevel()
    {
        return Level::orderBy('name', 'asc')->get();
    }

    public function getLanguage()
    {
        return Language::orderBy('name', 'asc')->get();
    }

    public function getFeaturedCourses()
    {
        return Course::orderBy('title', 'ASC')->with('level')->withCount('enrollments')->withCount('reviews')->withSum('reviews', 'rating')->where('is_featured', 'yes')->where('status', 1)->get();
    }

    public function filterCourses(array $filters)
    {
        $course = Course::where('status', 1)->with('level')->withCount('enrollments')->withCount('reviews')->withSum('reviews', 'rating');

        // filer course by keyword
        if (!empty($filters['keyword'])) {
            $course->where('title', 'like', '%' . $filters['keyword'] . '%');
        }

        // filer course by category
        if (!empty($filters['category'])) {
            $course->whereIn('category_id', $filters['category']);
        }

        // filter course by level
        if (!empty($filters['level'])) {
            $course->whereIn('level_id', $filters['level']);
        }

        // filter course by language
        if (!empty($filters['language'])) {
            $course->whereIn('language_id', $filters['language']);
        }

        // sort course
        if (!empty($filters['sort']) && in_array($filters['sort'], ['asc', 'desc'])) {
            $course->orderBy('created_at', $filters['sort']);
        } else {
            $course->orderBy('created_at', 'desc');
        }

        return $course->get();
    }

    public function getCourseDetail(int $courseId)
    {
        return Course::where('id', $courseId)
            ->withCount('enrollments')
            ->withCount('chapters')
            ->withCount('reviews')
            ->withSum('reviews', 'rating')
            ->with([
                'reviews',
                'reviews.user',
                'category',
                'level',
                'language',
                'outcomes',
                'requirements',
                'chapters' => function ($query) {
                    $query->withCount(['lessons' => function ($query) {
                        $query->where('status', 1)->whereNotNull('video');
                    }]);
                    $query->withSum(['lessons' => function ($query) {
                        $query->where('status', 1)->whereNotNull('video');
                    }], 'duration');
                },
                'chapters.lessons' => function ($query) {
                    $query->where('status', 1)->whereNotNull('video');
                }
            ])->first();
    }

    public function findCourse(int $id)
    {
        return Course::find($id);
    }

    public function isEnrolled(int $userId, int $courseId)
    {
        return Enrollment::where(['user_id' => $userId, 'course_id' => $courseId])->exists();
    }

    public function createEnrollment(int $userId, int $courseId)
    {
        return Enrollment::create(['user_id'   => $userId, 'course_id' => $courseId]);
    }

    public function getCoursesByUser($userId)
    {
        return Course::where('user_id', $userId)->withCount('enrollments')->withCount('reviews')->withSum('reviews', 'rating')->with('level')->get();
    }

    public function findEnrollment($userId, $courseId)
    {
        return Enrollment::where(['user_id'   => $userId, 'course_id' => $courseId])->first();
    }

    public function getEnrollmentsByUser($userId)
    {
        return Enrollment::where('user_id', $userId)->with([
            'course' => function ($query) {
                $query->withCount('reviews');
                $query->withSum('reviews', 'rating');
                $query->withCount('enrollments');
            },
            'course.level'
        ])->get();
    }

    /**
     * Kiểm tra user có enroll vào course không
     */
    public function isUserEnrolled(int $userId, int $courseId): bool
    {
        return Enrollment::where(['user_id'   => $userId, 'course_id' => $courseId])->exists();
    }

    /**
     * Lấy course kèm quan hệ và thống kê
     */
    public function getCourseWithRelations(int $courseId)
    {
        return Course::where('id', $courseId)
            ->withCount('chapters')
            ->with([
                'reviews',
                'reviews.user',
                'category',
                'level',
                'language',
                'chapters' => function ($query) {
                    $query->withCount(['lessons' => function ($query) {
                        $query->where('status', 1)->whereNotNull('video');
                    }]);
                    $query->withSum(['lessons' => function ($query) {
                        $query->where('status', 1)->whereNotNull('video');
                    }], 'duration');
                },
                'chapters.lessons' => function ($query) {
                    $query->where('status', 1)->whereNotNull('video');
                },
            ])->first();
    }

    /**
     * Lấy chapter đầu tiên và lesson đầu tiên có video
     */
    public function getFirstLesson(int $courseId): ?Lesson
    {
        $chapter = Chapter::where('course_id', $courseId)->orderBy('sort_order', 'asc')->first();

        if (!$chapter) {
            return null;
        }

        return Lesson::where('chapter_id', $chapter->id)->where('status', 1)->whereNotNull('video')->orderBy('sort_order', 'asc')->first();
    }
}

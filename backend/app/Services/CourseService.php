<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Repositories\CourseRepository;
use App\Repositories\LessonRepository;
use App\Repositories\ActivityRepository;

class CourseService
{
    protected $courseRepository;
    protected $activityRepository;
    protected $lessonRepository;

    public function __construct(
        CourseRepository $courseRepository,
        ActivityRepository $activityRepository,
        LessonRepository $lessonRepository
    ) {
        $this->courseRepository  = $courseRepository;
        $this->activityRepository = $activityRepository;
        $this->lessonRepository   = $lessonRepository;
    }

    public function getCategories()
    {
        return $this->courseRepository->getCategories();
    }

    public function getLevel()
    {
        return $this->courseRepository->getLevel();
    }

    public function getLanguage()
    {
        return $this->courseRepository->getLanguage();
    }

    public function getFeaturedCourses()
    {
        return $this->courseRepository->getFeaturedCourses();
    }

    public function getFilteredCourses(array $filters)
    {
        return $this->courseRepository->filterCourses($filters);
    }

    public function getCourseDetail(int $id)
    {
        $course = $this->courseRepository->getCourseDetail($id);

        if (!$course) {
            return null;
        }

        // tính tổng của lesson và duration
        $totalDuration = $course->chapters->sum('lesson_sum_duration');
        $totalLesson = $course->chapters->sum('lessons_count');

        $course->lessons_sum_duration = $totalDuration;
        $course->lessons_count = $totalLesson;
        $course->rating = $course->reviews_count > 0 ? number_format($course->reviews_sum_rating / $course->reviews_count, 1) : "0.0";

        return $course;
    }

    public function enrollCourse($userId, int $courseId)
    {
        $course = $this->courseRepository->findCourse($courseId);

        if (!$course) {
            return ['error' => 'not_found'];
        }

        if ($this->courseRepository->isEnrolled($userId, $courseId)) {
            return ['error' => 'exists'];
        }

        DB::beginTransaction();
        try {
            $enrollment = $this->courseRepository->createEnrollment($userId, $courseId);
            DB::commit();
            return $enrollment;
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Enroll error: ' . $e->getMessage());
            return ['error' => 'exception'];
        }
    }

    public function getUserCourses($user)
    {
        return $this->courseRepository->getCoursesByUser($user->id);
    }

    public function getUserEnrollments($user)
    {
        return $this->courseRepository->getEnrollmentsByUser($user->id);
    }

    /**
     * Lấy thông tin course cho user, đồng thời tạo Activity nếu cần
     */
    public function getCourseForUser($user, int $courseId)
    {
        $enrollment = $this->courseRepository->findEnrollment($user->id, $courseId);

        if (!$enrollment) {
            return null;
        }

        $course = $this->courseRepository->getCourseWithRelations($courseId);

        $activityLesson = null;

        if (!$this->activityRepository->existsForUserCourse($user->id, $courseId)) {
            DB::beginTransaction();
            try {
                $lesson = $this->lessonRepository->getFirstLessonOfCourse($courseId);
                if ($lesson) {
                    $this->activityRepository->createInitial($user->id, $courseId, $lesson);
                    $activityLesson = $lesson;
                }
                DB::commit();
            } catch (\Throwable $e) {
                DB::rollBack();
                Log::error('Create Activity Error', ['exception' => $e]);
                throw $e;
            }
        } else {
            $lastActivity = $this->activityRepository->getLastWatchedLesson($user->id, $courseId);
            $activityLesson = $lastActivity ? $lastActivity->lesson : null;
        }

        // Lấy danh sách bài học đã completed
        $completedLessons = $this->activityRepository->getCompletedLessons($user->id, $courseId);

        $totalLessons = $course->chapters->sum(function ($chapter) {
            return $chapter->lessons->count();
        });

        $completeLessonCount = $this->activityRepository->getCompleteLessonCount($user->id, $courseId);

        $progress = $totalLessons > 0 ? round(($completeLessonCount / $totalLessons) * 100) : 0;

        return [
            'course'                    => $course,
            'activityLesson'            => $activityLesson,
            'completedLessons'          => $completedLessons,
            'completeLessonCount'       => $completeLessonCount,
            'progress'                  => $progress
        ];
    }

    public function saveUserActivity($user, int $courseId, int $lessonId)
    {
        DB::beginTransaction();
        try {
            $lesson = $this->lessonRepository->findById($lessonId);
            if (!$lesson) {
                return null;
            }

            $activity = $this->activityRepository->saveUserActivity($user->id, $courseId, $lesson);

            DB::commit();
            return $activity;
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Save Activity Error', ['exception' => $e]);
            throw $e;
        }
    }

    public function markAsCompleted($user, int $courseId, int $lessonId)
    {
        DB::beginTransaction();
        try {
            $lesson = $this->lessonRepository->findById($lessonId);

            if (!$lesson) {
                return null;
            }

            $activity = $this->activityRepository->markAsCompleted($user->id, $courseId, $lesson);

            DB::commit();
            return $activity;
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Mark Complete Error', ['exception' => $e]);
            throw $e;
        }
    }

    public function getCompletedLessons(int $userId, int $courseId): array
    {
        return $this->activityRepository->getCompletedLessons($userId, $courseId);
    }
}

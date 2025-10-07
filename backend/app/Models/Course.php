<?php

namespace App\Models;

use App\Models\Level;
use App\Models\Chapter;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'user_id',
        'category_id',
        'level_id',
        'language_id',
        'description',
        'price',
        'cross_price',
        'status',
        'is_featured',
        'image'
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if (empty($this->image)) {
            return "";
        }

        return url('/uploads/courses/small/' . $this->image);
    }

    public function chapters()
    {
        return $this->hasMany(Chapter::class)->orderBy('sort_order', 'ASC');
    }

    public function outcomes()
    {
        return $this->hasMany(Outcome::class)->orderBy('sort_order', 'ASC');
    }

    public function requirements()
    {
        return $this->hasMany(Requirement::class)->orderBy('sort_order', 'ASC');
    }

    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function language()
    {
        return $this->belongsTo(Language::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($course) {
            // Xóa ảnh thumbnail của course
            if (!empty($course->image)) {
                app(\App\Services\UploadService::class)->deleteImage('courses', $course->image);
            }

            // Xóa chapters và lessons
            foreach ($course->chapters as $chapter) {
                foreach ($chapter->lessons as $lesson) {
                    // Xóa file video nếu có
                    if (!empty($lesson->video)) {
                        app(\App\Services\UploadService::class)->deleteVideo('courses/videos', $lesson->video);
                    }
                    $lesson->delete();
                }
                $chapter->delete();
            }

            // Xóa outcomes
            foreach ($course->outcomes as $outcome) {
                $outcome->delete();
            }

            // Xóa requirements
            foreach ($course->requirements as $requirement) {
                $requirement->delete();
            }
        });
    }
}

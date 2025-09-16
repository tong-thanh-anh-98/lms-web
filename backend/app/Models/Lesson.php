<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lesson extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'chapter_id',
        'is_free_preview',
        'duration',
        'video',
        'description',
        'sort_order',
        'status'
    ];

    protected $appends = ['video_url'];

    public function getVideoUrlAttribute()
    {
        if (empty($this->video)) {
            return "";
        }

        return url('/uploads/courses/videos/' . $this->video);
    }
}

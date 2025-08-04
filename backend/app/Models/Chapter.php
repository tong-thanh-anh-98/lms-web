<?php

namespace App\Models;

use App\Models\Lesson;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Chapter extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'course_id',
        'status',
        'sort_order'
    ];

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }
}

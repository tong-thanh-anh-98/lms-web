<?php

namespace App\Models;

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
}

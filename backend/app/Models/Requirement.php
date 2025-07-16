<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Requirement extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'course_id',
        'requirement',
        'sort_order'
    ];
}

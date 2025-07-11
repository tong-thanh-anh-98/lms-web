<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Outcome extends Model
{
     use SoftDeletes;

    protected $fillable = [
        'course_id',
        'text',
        'sort_order'
    ];
}

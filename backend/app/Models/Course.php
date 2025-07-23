<?php

namespace App\Models;

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

        return asset('uploads/courses/small/' . $this->image);
    }

    public function chapters()
    {
        return $this->hasMany(Chapter::class);
    }
}

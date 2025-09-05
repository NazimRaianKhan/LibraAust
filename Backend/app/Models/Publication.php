<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Publication extends Model
{
    protected $fillable = [
        'title', 'author', 'type', 'category', 'photo_url', 'year', 'description', 'tags'
    ];

    protected $casts = [
        'tags' => 'array'
    ];
}

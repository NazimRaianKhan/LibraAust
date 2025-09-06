<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Publication extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'author', 'isbn', 'publication_year', 'publisher',
        'department', 'type', 'total_copies', 'available_copies',
        'shelf_location', 'description', 'cover_url'
    ];
}

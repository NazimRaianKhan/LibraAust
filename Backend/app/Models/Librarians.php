<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Librarians extends Model
{
    use HasFactory;

    protected $fillable = [
        'librarian_id',
        'name',
        'designation',
        'email',
        'phone',
        'password',
    ];

    public function user()
    {
        return $this->belongsTo(Users::class, 'email', 'email');
    }
}

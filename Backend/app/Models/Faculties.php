<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculties extends Model
{
    use HasFactory;

    protected $fillable = [
        'faculty_id',
        'name',
        'department',
        'email',
        'phone',
        'borrowed_id'
    ];

    public function user()
    {
        return $this->belongsTo(Users::class, 'email', 'email');
    }
}

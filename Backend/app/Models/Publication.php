<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Publication extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'isbn',
        'publication_year',
        'publisher',
        'department',
        'type',
        'total_copies',
        'available_copies',
        'shelf_location',
        'description',
        'cover_url',
        'cover_public_id'
    ];

    protected $casts = [
        'publication_year' => 'integer',
        'total_copies' => 'integer',
        'available_copies' => 'integer'
    ];

    // Relationships
    public function borrows()
    {
        return $this->hasMany(Borrow::class, 'borrowed_id');
    }

    public function activeBorrows()
    {
        return $this->hasMany(Borrow::class, 'borrowed_id')
                    ->whereIn('status', ['borrowed', 'overdue']);
    }

    public function currentBorrowers()
    {
        return $this->belongsToMany(Users::class, 'borrows', 'borrowed_id', 'borrower_id')
                    ->whereIn('borrows.status', ['borrowed', 'overdue'])
                    ->withPivot(['borrow_date', 'return_date', 'status', 'total_fine']);
    }

    // Helper methods
    public function isAvailable()
    {
        return $this->available_copies > 0;
    }

    public function getTotalBorrowedCount()
    {
        return $this->borrows()->count();
    }

    public function getCurrentlyBorrowedCount()
    {
        return $this->activeBorrows()->count();
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('available_copies', '>', 0);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByDepartment($query, $department)
    {
        return $query->where('department', $department);
    }
}
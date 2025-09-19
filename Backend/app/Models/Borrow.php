<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Borrow extends Model
{
    use HasFactory;

    protected $fillable = [
        'borrowed_id',
        'borrower_id',
        'borrow_date',
        'return_date',
        'actual_return_date',
        'fine_rate',
        'total_fine',
        'status'
    ];

    protected $dates = [
        'borrow_date',
        'return_date',
        'actual_return_date'
    ];

    protected $casts = [
        'borrow_date' => 'date',
        'return_date' => 'date',
        'actual_return_date' => 'date',
        'fine_rate' => 'decimal:2',
        'total_fine' => 'decimal:2'
    ];

    // Relationships
    public function publication()
    {
        return $this->belongsTo(Publication::class, 'borrowed_id');
    }

    public function borrower()
    {
        return $this->belongsTo(Users::class, 'borrower_id');
    }

    // Helper methods
    public function isOverdue()
    {
        return $this->status === 'borrowed' && Carbon::now()->gt($this->return_date);
    }

    public function calculateFine()
    {
        if ($this->status === 'returned' || !$this->isOverdue()) {
            return 0;
        }

        $overdueDays = Carbon::now()->diffInDays($this->return_date);
        return $overdueDays * $this->fine_rate;
    }

    public function updateStatus()
    {
        if ($this->status === 'borrowed' && $this->isOverdue()) {
            $this->status = 'overdue';
            $this->total_fine = $this->calculateFine();
            $this->save();
        }
    }
}
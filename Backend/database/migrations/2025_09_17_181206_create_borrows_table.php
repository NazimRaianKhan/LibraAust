<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('borrows', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('borrowed_id'); // publication ID
            $table->unsignedBigInteger('borrower_id'); // user ID (from users table)
            $table->date('borrow_date');
            $table->date('return_date'); // expected return date
            $table->date('actual_return_date')->nullable(); // when actually returned
            $table->decimal('fine_rate', 8, 2)->default(0); // fine per day
            $table->decimal('total_fine', 8, 2)->default(0); // calculated fine
            $table->enum('status', ['borrowed', 'returned', 'overdue'])->default('borrowed');
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('borrowed_id')->references('id')->on('publications')->onDelete('cascade');
            $table->foreign('borrower_id')->references('id')->on('users')->onDelete('cascade');
            
            // Index for better performance
            $table->index(['borrower_id', 'status']);
            $table->index(['borrowed_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('borrows');
    }
};
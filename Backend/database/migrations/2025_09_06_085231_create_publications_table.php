<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('publications', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('author');
            $table->string('isbn')->nullable();
            $table->integer('publication_year')->nullable();
            $table->string('publisher')->nullable();
            $table->string('department')->nullable();
            $table->enum('type', ['book', 'thesis']);
            $table->integer('total_copies')->default(1);
            $table->integer('available_copies')->default(1);
            $table->string('shelf_location')->nullable();
            $table->text('description')->nullable();
            $table->string('cover_url')->nullable();
            $table->string('cover_public_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('publications');
    }
};

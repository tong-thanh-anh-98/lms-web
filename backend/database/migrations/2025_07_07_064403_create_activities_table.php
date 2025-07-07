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
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // user_id
            $table->foreignId('course_id')->constrained()->onDelete('cascade'); // course_id
            $table->foreignId('chapter_id')->constrained()->onDelete('cascade'); // chapter_id
            $table->foreignId('lesson_id')->constrained()->onDelete('cascade'); // lesson_id
            $table->enum('is_completed', ['yes', 'no'])->default('no'); // is_completed
            $table->enum('is_last_watched', ['yes', 'no'])->default('no'); // is_last_watched
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};

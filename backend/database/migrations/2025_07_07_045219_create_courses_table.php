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
        Schema::create('courses', function (Blueprint $table) {
            $table->id(); // id
            $table->string('title'); // title

            // Quan hệ khóa ngoại
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // user_id
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('cascade'); // category_id
            $table->foreignId('level_id')->nullable()->constrained()->onDelete('cascade'); // level_id
            $table->foreignId('language_id')->nullable()->constrained()->onDelete('cascade'); // language_id

            // Nội dung & thông tin
            $table->text('description')->nullable(); // description
            $table->decimal('price', 15, 0)->nullable(); // price
            $table->decimal('cross_price', 15, 0)->nullable(); // cross_price

            // Trạng thái
            $table->integer('status')->default(0); // status
            $table->enum('is_featured', ['yes', 'no'])->default('no'); // is_featured

            $table->string('image')->nullable(); // image

            // Thời gian
            $table->timestamps(); // created_at, updated_at
            $table->softDeletes(); // deleted_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};

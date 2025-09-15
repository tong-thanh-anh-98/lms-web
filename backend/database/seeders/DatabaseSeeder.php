<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Tống Thành Anh',
            'email' => 'tongthanhanh@lms.com',
        ]);

        $this->call(CategorySeeder::class);
        $this->call(LanguageSeeder::class);
        $this->call(LevelSeeder::class);
    }
}

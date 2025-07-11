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
            'name' => 'Default User Name',
            'email' => 'default.user.name@lsm.com',
        ]);

        $this->call(CategorySeeder::class);
        $this->call(LanguageSeeder::class);
        $this->call(LevelSeeder::class);
    }
}

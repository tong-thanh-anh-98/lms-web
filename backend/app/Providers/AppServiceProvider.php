<?php

namespace App\Providers;

use Illuminate\Support\Facades\App;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $lang = request()->header('Accept-Language');
        if ($lang && in_array($lang, ['vi', 'en'])) {
            App::setLocale($lang);
        }
    }
}

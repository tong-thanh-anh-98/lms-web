<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // $locale = $request->header('Accept-Language', config('app.locale'));
        // app()->setLocale($locale);
        // return $next($request);

        $locale = $request->getPreferredLanguage(config('app.supported_locales', ['en']));
        if (!in_array($locale, config('app.supported_locales'))) {
            $locale = config('app.fallback_locale', 'en');
        }
        app()->setLocale($locale);

        return $next($request);
    }
}

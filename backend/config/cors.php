<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Laravel CORS Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'translations/*',
        'uploads/*',
        'save-lesson-video/*',
    ],

    // Cho phép tất cả method
    'allowed_methods' => ['*'],

    // CORS chỉ nên mở cho domain thực sự dùng
    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],

    'allowed_origins_patterns' => [],

    // Cho phép tất cả headers
    'allowed_headers' => ['*'],

    // Expose headers cần thiết cho video, pagination...
    'exposed_headers' => [
        'Content-Length',
        'Content-Range',
    ],

    'max_age' => 0,

    // Nếu frontend cần gửi cookie
    'supports_credentials' => true,

];

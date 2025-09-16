<?php

return [

    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'translations/*',
        'uploads/*',
        'save-lesson-video/*',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:9173',
        'http://127.0.0.1:9173',
        // 'https://your-production-frontend.com' // use when production
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [
        'Content-Length',
        'Content-Range',
    ],

    'max_age' => 0,

    'supports_credentials' => true,

];

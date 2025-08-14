<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'translations/*', 'uploads/*', 'save-lesson-video/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['Content-Length', 'Content-Range'],

    'max_age' => 0,

    'supports_credentials' => false,

];

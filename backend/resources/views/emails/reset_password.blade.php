<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f8f9fa;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .btn {
            display: inline-block;
            background: #007bff;
            color: white !important;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
        }
        .footer {
            font-size: 12px;
            color: #888;
            margin-top: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>Hello {{ $user->name }},</h2>
        <p>We received a request to reset your password for your account on <strong>{{ config('app.name') }}</strong>.</p>

        <p style="text-align:center;">
            <a href="{{ $url }}" class="btn">Reset Password</a>
        </p>

        <p>This link will expire in 60 minutes.</p>

        <p>If you did not request a password reset, you can safely ignore this email.</p>

        <div class="footer">
            <p>© {{ date('Y') }} {{ config('app.name') }} — All rights reserved.</p>
        </div>
    </div>
</body>
</html>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Changed</title>
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
        <p>Hi {{ $name }},</p>

        <p>This is a confirmation that your account password has been successfully changed.</p>

        <p>If you did not make this change, please reset your password immediately or contact support.</p>

        <p>Thank you,<br>Support Team</p>

        <div class="footer">
            <p>© {{ date('Y') }} {{ config('app.name') }} — All rights reserved.</p>
        </div>
    </div>
</body>
</html>

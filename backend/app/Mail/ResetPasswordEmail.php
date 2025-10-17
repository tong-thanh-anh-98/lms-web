<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Contracts\Queue\ShouldQueue;

class ResetPasswordEmail extends Mailable
{
    use Queueable, SerializesModels;

    protected $user;
    protected $token;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, $token)
    {
        $this->user = $user;
        $this->token = $token;
    }

    public function build()
    {
        $url = config('app.frontend_url') . '/reset-password?token=' . urlencode($this->token) . '&email=' . urlencode($this->user->email);

        return $this->subject('Reset Your Password')
            ->view('emails.reset_password')
            ->with([
                'user' => $this->user,
                'token' => $this->token,
                'url' => $url,
            ]);
    }
}

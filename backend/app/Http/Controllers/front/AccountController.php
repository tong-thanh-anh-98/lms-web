<?php

namespace App\Http\Controllers\front;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\RegisterRequest;
use Illuminate\Support\Facades\Validator;

class AccountController extends Controller
{
    public function register(RegisterRequest $request)
    {
        DB::beginTransaction();

        try {
            $data = $this->extractUserData($request);
            $user = User::create($data);
            DB::commit();

            return response()->json([
                'status'        => 201,
                'message'       => 'User has successfully registered.',
                'data'      => $user
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'   => 'Server error.',
            ], 500);
        }
    }

    public function authenticate(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email'     => 'required|email',
                'password'     => 'required'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status'    => 400,
                    'errors'   => $validator->errors(),
                ], 400);
            }

            if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
                $user = User::find(Auth::id());
                $token = $user->createToken('token')->plainTextToken;

                return response()->json([
                    'status' => 200,
                    'message' => 'You have successfully logged in.',
                    'id' => Auth::user()->id,
                    'name' => $user->name,
                    'token' => $token,
                ], 200);
            } else {
                return response()->json([
                    'status' => 401,
                    'message' => 'The email or password you entered is incorrect.'
                ], 401);
            }
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'   => 'Server error.',
            ], 500);
        }
    }

    private function extractUserData(RegisterRequest $request)
    {
        return [
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
        ];
    }
}

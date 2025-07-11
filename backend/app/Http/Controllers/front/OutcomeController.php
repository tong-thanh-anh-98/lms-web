<?php

namespace App\Http\Controllers\front;

use App\Models\Outcome;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\OutcomeRequest;

class OutcomeController extends Controller
{
    public function index(Request $request)
    {
        try {
            $course_id = $request->course_id;
            $outcomes = Outcome::where('course_id', $course_id)->get();

            if ($outcomes->isEmpty()) {
                return response()->json([
                    'status' => 404,
                    'message' => __('message.not_found'),
                ], 404);
            } else {
                return response()->json([
                    'status'  => 200,
                    'message' => __('message.success'),
                    'data'    => $outcomes
                ], 200);
            }
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'  => 500,
                'message' => __('message.error'),
            ], 500);
        }
    }

    public function store(OutcomeRequest $request)
    {
        DB::beginTransaction();

        try {
            $data = $this->extractOutcomeData($request);
            $outcome = Outcome::create($data);
            DB::commit();

            return response()->json([
                'status'    => 201,
                'message' => __('message.created'),
                'data'      => $outcome
            ], 201);
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'   =>  __('message.error')
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $outcome = Outcome::find($id);

            if (!$outcome) {
                return response()->json([
                    'status'    => 404,
                    'message' => __('message.not_found'),
                ], 404);
            }

            return response()->json([
                'status'  => 200,
                'message' => __('message.success'),
                'data'    => $outcome
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'  => 500,
                'message' => __('message.error'),
            ], 500);
        }
    }

    public function update(OutcomeRequest $request, $id)
    {
        DB::beginTransaction();

        try {
            $outcome = Outcome::find($id);

            if (!$outcome) {
                return response()->json([
                    'status' => 404,
                    'message' => __('message.not_found')
                ], 404);
            }

            $data = $this->extractOutcomeData($request);
            $outcome->update($data);
            DB::commit();

            return response()->json([
                'status'    => 201,
                'message' => __('message.updated'),
                'data'      => $outcome
            ], 201);
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'   =>  __('message.error')
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $outcome = Outcome::find($id);

            if (!$outcome) {
                return response()->json([
                    'status'    => 404,
                    'message' => __('message.not_found'),
                ], 404);
            }

            $outcome->delete();

            return response()->json([
                'status'  => 200,
                'message' => __('message.deleted'),
                'data'    => $outcome
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'  => 500,
                'message' => __('message.error'),
            ], 500);
        }
    }

    private function extractOutcomeData(OutcomeRequest $request)
    {
        return $request->only([
            'course_id',
            'text',
            'sort_order'
        ]);
    }
}

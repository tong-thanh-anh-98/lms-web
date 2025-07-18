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
    private function extractOutcomeData(OutcomeRequest $request)
    {
        return array_merge(
            $request->only([
                'outcome',
                'course_id'
            ]),
            [
                'sort_order' => $request->input('sort_order', 1000), // defaults to 1000 if not present
            ]
        );
    }

    public function getAllOutcomes()
    {
        try {
            $outcomes = Outcome::orderBy('created_at', 'desc')->get();

            return response()->json([
                'status'    => 200,
                'message'       => __('message.success'),
                'data'      => $outcomes
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Error' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'       => __('message.error')
            ], 500);
        }
    }

    public function index(Request $request)
    {
        try {
            $course_id = $request->course_id;
            $outcomes = Outcome::where('course_id', $course_id)->orderBy('sort_order')->get();

            return response()->json([
                'status'  => 200,
                'message' => __('message.success'),
                'data'    => $outcomes
            ], 200);
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

    public function sortOutcomes(Request $request)
    {
        try {
            if (!empty($request->outcomes)) {
                foreach ($request->outcomes as $key => $outcome) {
                    Outcome::where('id', $outcome['id'])->update(['sort_order' => $key]);
                }
            }

            return response()->json([
                'status'  => 200,
                'message' => __('message.success_sort'),
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'  => 500,
                'message' => __('message.error'),
            ], 500);
        }
    }
}

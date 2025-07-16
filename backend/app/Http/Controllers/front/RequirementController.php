<?php

namespace App\Http\Controllers\front;

use App\Models\Requirement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\RequirementRequest;

class RequirementController extends Controller
{
    private function extractRequirementData(RequirementRequest $request)
    {
        return array_merge(
            $request->only([
                'course_id',
                'requirement',
            ]),
            [
                'sort_order' => $request->input('sort_order', 1000), // defaults to 1000 if not present
            ]
        );
    }

    public function getAllRequirement()
    {
        try {
            $requirement = Requirement::orderBy('created_at', 'desc')->orderBy('sort_order')->get();

            return response()->json([
                'status'    => 200,
                'message'       => __('message.success'),
                'data'      => $requirement
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
            $requirements = Requirement::where('course_id', $course_id)->get();

            return response()->json([
                'status'  => 200,
                'message' => __('message.success'),
                'data'    => $requirements
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'  => 500,
                'message' => __('message.error'),
            ], 500);
        }
    }

    public function store(RequirementRequest $request)
    {
        DB::beginTransaction();

        try {
            $data = $this->extractRequirementData($request);
            $requirement = Requirement::create($data);
            DB::commit();

            return response()->json([
                'status'    => 201,
                'message' => __('message.created'),
                'data'      => $requirement
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
            $requirement = Requirement::find($id);
            if (!$requirement) {
                return response()->json([
                    'status'    => 404,
                    'message'   => __('message.not_found')
                ], 404);
            }

            return response()->json([
                'status'    => 200,
                'message'   => __('message.success'),
                'data'      => $requirement
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'  => 500,
                'message' => __('message.error'),
            ], 500);
        }
    }

    public function update(RequirementRequest $request, $id)
    {
        DB::beginTransaction();

        try {
            $requirement = Requirement::find($id);
            if (!$requirement) {
                return response()->json([
                    'status'    => 404,
                    'message'   => __('message.not_found')
                ], 404);
            }

            $data = $this->extractRequirementData($request);
            $requirement->update($data);
            DB::commit();

            return response()->json([
                'status'    => 201,
                'message' => __('message.updated'),
                'data'      => $requirement
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
            $requirement = Requirement::find($id);

            if (!$requirement) {
                return response()->json([
                    'status'    => 404,
                    'message' => __('message.not_found'),
                ], 404);
            }

            $requirement->delete();

            return response()->json([
                'status'  => 200,
                'message' => __('message.deleted'),
                'data'    => $requirement
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'  => 500,
                'message' => __('message.error'),
            ], 500);
        }
    }

    public function sortRequirements(Request $request)
    {
        try {
            if (!empty($request->requirements)) {
                foreach ($request->requirements as $key => $requirement) {
                    Requirement::where('id', $requirement['id'])->update(['sort_order' => $key]);
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

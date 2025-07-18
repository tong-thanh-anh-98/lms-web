<?php

namespace App\Http\Controllers\front;

use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\LevelRequest;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class LevelController extends Controller
{
    private function extractLevelData(LevelRequest $request)
    {
        return $request->only([
            'name',
            'status'
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $levels = Level::orderBy('created_at', 'desc')->get();

            return response()->json([
                'status' => 200,
                'message' =>  __('message.success'),
                'data' => $levels
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Error' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'       => __('message.error')
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(LevelRequest $request)
    {
        DB::beginTransaction();

        try {
            $data = $this->extractLevelData($request);
            $level = Level::create($data);
            DB::commit();

            return response()->json([
                'status'    => 201,
                'message' => __('message.created'),
                'data'      => $level
            ], 201);
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'   =>  __('message.error')
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

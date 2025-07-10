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
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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

    private function extractLevelData(LevelRequest $request)
    {
        return $request->only([
            'name',
            'status'
        ]);
    }
}

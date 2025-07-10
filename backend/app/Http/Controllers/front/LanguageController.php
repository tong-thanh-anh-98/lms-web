<?php

namespace App\Http\Controllers\front;

use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\LanguageRequest;

class LanguageController extends Controller
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
    public function store(LanguageRequest $request)
    {
        DB::beginTransaction();

        try {
            $data = $this->extractLanguageData($request);
            $language = Language::create($data);
            DB::commit();

            return response()->json([
                'status'    => 201,
                'message' => __('message.created'),
                'data'      => $language
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

    private function extractLanguageData(LanguageRequest $request)
    {
        return $request->only([
            'name',
            'status'
        ]);
    }
}

<?php

namespace App\Http\Controllers\front;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;

class CategoryController extends Controller
{
    private function extractCategoryData(CategoryRequest $request)
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
            $categories = Category::orderBy('created_at', 'desc')->get();

            return response()->json([
                'status' => 200,
                'message' =>  __('message.success'),
                'data' => $categories
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
     * Method store
     *
     * @param CategoryRequest $request
     *
     * @return void
     */
    public function store(CategoryRequest $request)
    {
        DB::beginTransaction();

        try {
            $data = $this->extractCategoryData($request);
            $category = Category::create($data);
            DB::commit();

            return response()->json([
                'status'    => 201,
                'message' => __('message.created'),
                'data'      => $category
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

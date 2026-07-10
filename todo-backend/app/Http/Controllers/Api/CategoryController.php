<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Traits\HandleControllerErrors;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    use HandleControllerErrors;

    public function index(Request $request): AnonymousResourceCollection|JsonResponse
    {
        // ከተጠቃሚው የሚመጣውን Token እና አስቀድሞ መግባቱን ማረጋገጫ
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $query = $user->categories();

        // Search
        $search = $request->input('search');
        if ($search) {
            $query->where('name', 'LIKE', "%{$search}%");
        }

        // Sort - ይበልጥ አስተማማኝ እና ከ 500 ስህተት የጸዳ አደራደር
        $sortField = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');

        // የ አቅጣጫውን (asc/desc) ደህንነት ማረጋገጥ
        $sortDirection = in_array(strtolower($sortDirection), ['asc', 'desc']) ? $sortDirection : 'desc';

        $allowedSortFields = ['created_at', 'name', 'id'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc'); // Default መደደሪያ
        }

        // Pagination
        $perPage = $request->input('per_page', 50);
        $categories = $query->paginate($perPage);

        return CategoryResource::collection($categories);
    }

    public function store(CategoryRequest $request): JsonResponse
    {
        try {
            // ተጠቃሚው መኖሩን ቼክ ማድረግ
            $user = $request->user();
            if (!$user) {
                return response()->json(['message' => 'Unauthenticated'], 401);
            }

            $category = $user->categories()->create($request->validated());

            return $this->successResponse([
                'category' => new CategoryResource($category),
            ], 'Category created successfully', 201);
        } catch (\Exception $e) {
            Log::error('Category creation error: ' . $e->getMessage());
            return $this->errorResponse('Failed to create category', $e->getMessage());
        }
    }

    public function show(Request $request, Category $category): CategoryResource
    {
        try {
            Gate::authorize('view', $category);
            return new CategoryResource($category);
        } catch (AuthorizationException $e) {
            Log::warning('Unauthorized access to category: ' . $category->id);
            throw $e;
        }
    }

    public function update(CategoryRequest $request, Category $category): JsonResponse
    {
        try {
            Gate::authorize('update', $category);
            $category->update($request->validated());

            return $this->successResponse([
                'category' => new CategoryResource($category),
            ], 'Category updated successfully');
        } catch (AuthorizationException $e) {
            Log::warning('Unauthorized update attempt on category: ' . $category->id);
            return $this->errorResponse('Unauthorized', 'You do not have permission to update this category', 403);
        } catch (\Exception $e) {
            Log::error('Category update error: ' . $e->getMessage());
            return $this->errorResponse('Failed to update category', $e->getMessage());
        }
    }

    public function destroy(Request $request, Category $category): JsonResponse
    {
        try {
            Gate::authorize('delete', $category);
            $category->delete();

            return response()->json(['message' => 'Category deleted successfully'], 200); // ላራቬል ኤፒአይ 200 መመለስ ይመረጣል
        } catch (AuthorizationException $e) {
            Log::warning('Unauthorized delete attempt on category: ' . $category->id);
            return $this->errorResponse('Unauthorized', 'You do not have permission to delete this category', 403);
        } catch (\Exception $e) {
            Log::error('Category delete error: ' . $e->getMessage());
            return $this->errorResponse('Failed to delete category', $e->getMessage());
        }
    }
}

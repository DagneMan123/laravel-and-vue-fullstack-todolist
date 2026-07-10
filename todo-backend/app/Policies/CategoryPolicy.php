<?php

namespace App\Policies;

use App\Models\Category;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CategoryPolicy
{
    /**
     * Determine if the user can view the category
     */
    public function view(User $user, Category $category): Response|bool
    {
        return $user->id === $category->user_id ?: Response::deny('This category does not belong to you.');
    }

    /**
     * Determine if the user can create categories
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can update the category
     */
    public function update(User $user, Category $category): Response|bool
    {
        return $user->id === $category->user_id ?: Response::deny('You cannot update this category.');
    }

    /**
     * Determine if the user can delete the category
     */
    public function delete(User $user, Category $category): Response|bool
    {
        return $user->id === $category->user_id ?: Response::deny('You cannot delete this category.');
    }
}
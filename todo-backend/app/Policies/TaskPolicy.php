<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TaskPolicy
{
    /**
     * Determine if the user can view the task
     */
    public function view(User $user, Task $task): Response|bool
    {
        return $user->id === $task->user_id ?: Response::deny('This task does not belong to you.');
    }

    /**
     * Determine if the user can create tasks
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can update the task
     */
    public function update(User $user, Task $task): Response|bool
    {
        return $user->id === $task->user_id ?: Response::deny('You cannot update this task.');
    }

    /**
     * Determine if the user can delete the task
     */
    public function delete(User $user, Task $task): Response|bool
    {
        return $user->id === $task->user_id ?: Response::deny('You cannot delete this task.');
    }

    /**
     * Determine if the user can restore the task
     */
    public function restore(User $user, Task $task): Response|bool
    {
        return $user->id === $task->user_id ?: Response::deny('You cannot restore this task.');
    }

    /**
     * Determine if the user can permanently delete the task
     */
    public function forceDelete(User $user, Task $task): Response|bool
    {
        return $user->id === $task->user_id ?: Response::deny('You cannot force delete this task.');
    }
}
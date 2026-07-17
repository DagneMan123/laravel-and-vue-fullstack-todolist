<?php

namespace App\Observers;

use App\Models\Task;
use App\Services\NotificationService;

class TaskObserver
{
    /**
     * Handle the Task "created" event.
     */
    public function created(Task $task): void
    {
        // Create notification when task is created
        NotificationService::notifyTaskCreated($task->user, $task->toArray());
    }

    /**
     * Handle the Task "updated" event.
     */
    public function updated(Task $task): void
    {
        // Check if task was just completed
        if ($task->isDirty('is_completed') && $task->is_completed) {
            NotificationService::notifyTaskCompleted($task->user, $task->toArray());
        }

        // Check if task status changed from completed to incomplete
        if ($task->isDirty('is_completed') && !$task->is_completed) {
            // Optional: notify user task was reopened
        }
    }

    /**
     * Handle the Task "deleted" event.
     */
    public function deleted(Task $task): void
    {
        // Optional: create notification when task is deleted
    }

    /**
     * Handle the Task "restored" event.
     */
    public function restored(Task $task): void
    {
        // Optional: create notification when task is restored
    }

    /**
     * Handle the Task "force deleted" event.
     */
    public function forceDeleted(Task $task): void
    {
        // Optional: create notification when task is force deleted
    }
}

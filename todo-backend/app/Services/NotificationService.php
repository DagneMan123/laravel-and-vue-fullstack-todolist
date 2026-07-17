<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    /**
     * Create a notification for a user
     */
    public static function createNotification(
        User $user,
        string $title,
        string $message,
        string $type = 'info',
        ?string $relatedModel = null,
        ?int $relatedId = null,
        ?array $data = null
    ): Notification {
        return Notification::create([
            'user_id' => $user->id,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'data' => array_merge($data ?? [], [
                'related_model' => $relatedModel,
                'related_id' => $relatedId,
            ]),
        ]);
    }

    /**
     * Create a task created notification
     */
    public static function notifyTaskCreated(User $user, array $taskData): void
    {
        self::createNotification(
            $user,
            'New Task Created',
            "Task '{$taskData['title']}' has been created successfully.",
            'info',
            'Task',
            $taskData['id'] ?? null,
            ['action' => 'create', 'model' => 'task']
        );
    }

    /**
     * Create a task completed notification
     */
    public static function notifyTaskCompleted(User $user, array $taskData): void
    {
        self::createNotification(
            $user,
            'Task Completed',
            "Great! You've completed '{$taskData['title']}'.",
            'success',
            'Task',
            $taskData['id'] ?? null,
            ['action' => 'complete', 'model' => 'task']
        );
    }

    /**
     * Create a task overdue notification
     */
    public static function notifyTaskOverdue(User $user, array $taskData): void
    {
        self::createNotification(
            $user,
            'Task Overdue',
            "Task '{$taskData['title']}' is now overdue.",
            'warning',
            'Task',
            $taskData['id'] ?? null,
            ['action' => 'overdue', 'model' => 'task']
        );
    }

    /**
     * Create a task reminder notification
     */
    public static function notifyTaskReminder(User $user, array $taskData): void
    {
        self::createNotification(
            $user,
            'Task Reminder',
            "Reminder: '{$taskData['title']}' is due soon.",
            'warning',
            'Task',
            $taskData['id'] ?? null,
            ['action' => 'reminder', 'model' => 'task']
        );
    }

    /**
     * Create a project created notification
     */
    public static function notifyProjectCreated(User $user, array $projectData): void
    {
        self::createNotification(
            $user,
            'New Project Created',
            "Project '{$projectData['name']}' has been created successfully.",
            'success',
            'Project',
            $projectData['id'] ?? null,
            ['action' => 'create', 'model' => 'project']
        );
    }

    /**
     * Create a category created notification
     */
    public static function notifyCategoryCreated(User $user, array $categoryData): void
    {
        self::createNotification(
            $user,
            'New Category Created',
            "Category '{$categoryData['name']}' has been created successfully.",
            'info',
            'Category',
            $categoryData['id'] ?? null,
            ['action' => 'create', 'model' => 'category']
        );
    }
}

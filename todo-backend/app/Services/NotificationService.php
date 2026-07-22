<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    /**
     * Create a notification for a user
     * 
     * @param User $user
     * @param string $titleKey - Translation key for title (e.g., 'notifications.taskCompleted')
     * @param string $messageKey - Translation key for message (e.g., 'notifications.taskCompletedMessage')
     * @param string $type - Notification type (info, success, warning, error)
     * @param string|null $relatedModel - Related model type
     * @param int|null $relatedId - Related model ID
     * @param array|null $params - Parameters for translation keys (e.g., ['name' => 'Task Title'])
     * @return Notification
     */
    public static function createNotification(
        User $user,
        string $titleKey,
        string $messageKey,
        string $type = 'info',
        ?string $relatedModel = null,
        ?int $relatedId = null,
        ?array $params = null
    ): Notification {
        return Notification::create([
            'user_id' => $user->id,
            'title' => $titleKey,
            'message' => $messageKey,
            'type' => $type,
            'data' => array_merge($params ?? [], [
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
            'notifications.taskCreated',
            'notifications.taskCreatedMessage',
            'info',
            'Task',
            $taskData['id'] ?? null,
            ['name' => trim($taskData['title'] ?? 'Untitled')]
        );
    }

    /**
     * Create a task completed notification
     */
    public static function notifyTaskCompleted(User $user, array $taskData): void
    {
        self::createNotification(
            $user,
            'notifications.taskCompleted',
            'notifications.taskCompletedMessage',
            'success',
            'Task',
            $taskData['id'] ?? null,
            ['name' => trim($taskData['title'] ?? 'Untitled')]
        );
    }

    /**
     * Create a task overdue notification
     */
    public static function notifyTaskOverdue(User $user, array $taskData): void
    {
        self::createNotification(
            $user,
            'notifications.taskOverdue',
            'notifications.taskOverdueMessage',
            'warning',
            'Task',
            $taskData['id'] ?? null,
            ['name' => trim($taskData['title'] ?? 'Untitled')]
        );
    }

    /**
     * Create a task reminder notification
     */
    public static function notifyTaskReminder(User $user, array $taskData): void
    {
        self::createNotification(
            $user,
            'notifications.reminder',
            'notifications.taskReminderMessage',
            'warning',
            'Task',
            $taskData['id'] ?? null,
            ['name' => trim($taskData['title'] ?? 'Untitled')]
        );
    }

    /**
     * Create a project created notification
     */
    public static function notifyProjectCreated(User $user, array $projectData): void
    {
        self::createNotification(
            $user,
            'notifications.projectCreated',
            'notifications.projectCreatedMessage',
            'success',
            'Project',
            $projectData['id'] ?? null,
            ['name' => trim($projectData['name'] ?? 'Untitled')]
        );
    }

    /**
     * Create a category created notification
     */
    public static function notifyCategoryCreated(User $user, array $categoryData): void
    {
        self::createNotification(
            $user,
            'notifications.categoryCreated',
            'notifications.categoryCreatedMessage',
            'info',
            'Category',
            $categoryData['id'] ?? null,
            ['name' => trim($categoryData['name'] ?? 'Untitled')]
        );
    }
}

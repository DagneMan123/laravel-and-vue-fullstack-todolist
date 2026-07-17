<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\NotificationController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);

    // Tasks - Define stats BEFORE apiResource to prevent route conflicts
    Route::get('/tasks/stats', [TaskController::class, 'stats']);
    Route::get('/tasks/chart/trend', [TaskController::class, 'chartTrendData']);
    Route::get('/tasks/chart/priority', [TaskController::class, 'chartPriorityData']);
    Route::apiResource('tasks', TaskController::class);
    Route::patch('/tasks/{task}/toggle-complete', [TaskController::class, 'toggleComplete']);
    Route::delete('/tasks/bulk-delete', [TaskController::class, 'bulkDelete']);
    Route::patch('/tasks/bulk-complete', [TaskController::class, 'bulkComplete']);


    // Activities (nested under projects)
    Route::prefix('projects/{project}')->group(function () {
        Route::apiResource('activities', ActivityController::class);
        Route::patch('/activities/{activity}/archive', [ActivityController::class, 'archive']);
        Route::patch('/activities/{activity}/unarchive', [ActivityController::class, 'unarchive']);
    });

    // Categories
    Route::apiResource('categories', CategoryController::class);

    // Notifications
    Route::get('/notifications/unread/count', [NotificationController::class, 'unreadCount']);
    Route::patch('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/delete-all-read', [NotificationController::class, 'deleteAllRead']);
    Route::apiResource('notifications', NotificationController::class, ['except' => ['store', 'update']]);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::patch('/notifications/{notification}/unread', [NotificationController::class, 'markAsUnread']);
});

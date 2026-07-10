<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use App\Traits\HandleControllerErrors;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    use HandleControllerErrors;

    public function index(Request $request): AnonymousResourceCollection
    {
        $notifications = $request->user()->notifications()->latest()->get();
        return NotificationResource::collection($notifications);
    }

    public function show(Request $request, Notification $notification): NotificationResource
    {
        try {
            Gate::authorize('view', $notification);
            return new NotificationResource($notification);
        } catch (AuthorizationException $e) {
            Log::warning('Unauthorized access to notification: ' . $notification->id);
            throw $e;
        }
    }

    public function destroy(Request $request, Notification $notification): JsonResponse
    {
        try {
            Gate::authorize('delete', $notification);
            $notification->delete();

            return response()->json(['message' => 'Notification deleted successfully'], 204);
        } catch (AuthorizationException $e) {
            Log::warning('Unauthorized delete attempt on notification: ' . $notification->id);
            return $this->errorResponse('Unauthorized', 'You do not have permission to delete this notification', 403);
        } catch (\Exception $e) {
            Log::error('Notification delete error: ' . $e->getMessage());
            return $this->errorResponse('Failed to delete notification', $e->getMessage());
        }
    }

    public function markAsRead(Request $request, Notification $notification): JsonResponse
    {
        try {
            Gate::authorize('update', $notification);
            $notification->markAsRead();

            return $this->successResponse([
                'notification' => new NotificationResource($notification),
            ], 'Notification marked as read');
        } catch (AuthorizationException $e) {
            Log::warning('Unauthorized update attempt on notification: ' . $notification->id);
            return $this->errorResponse('Unauthorized', 'You do not have permission to update this notification', 403);
        } catch (\Exception $e) {
            Log::error('Notification mark as read error: ' . $e->getMessage());
            return $this->errorResponse('Failed to mark notification as read', $e->getMessage());
        }
    }

    public function markAsUnread(Request $request, Notification $notification): JsonResponse
    {
        try {
            Gate::authorize('update', $notification);
            $notification->markAsUnread();

            return $this->successResponse([
                'notification' => new NotificationResource($notification),
            ], 'Notification marked as unread');
        } catch (AuthorizationException $e) {
            Log::warning('Unauthorized update attempt on notification: ' . $notification->id);
            return $this->errorResponse('Unauthorized', 'You do not have permission to update this notification', 403);
        } catch (\Exception $e) {
            Log::error('Notification mark as unread error: ' . $e->getMessage());
            return $this->errorResponse('Failed to mark notification as unread', $e->getMessage());
        }
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $count = $request->user()->notifications()->unread()->count();
        return response()->json(['count' => $count]);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        try {
            $request->user()->notifications()->unread()->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

            return $this->successResponse([], 'All notifications marked as read');
        } catch (\Exception $e) {
            Log::error('Mark all notifications as read error: ' . $e->getMessage());
            return $this->errorResponse('Failed to mark all notifications as read', $e->getMessage());
        }
    }

    public function deleteAllRead(Request $request): JsonResponse
    {
        try {
            $request->user()->notifications()->read()->delete();

            return $this->successResponse([], 'All read notifications deleted');
        } catch (\Exception $e) {
            Log::error('Delete all read notifications error: ' . $e->getMessage());
            return $this->errorResponse('Failed to delete all read notifications', $e->getMessage());
        }
    }
}

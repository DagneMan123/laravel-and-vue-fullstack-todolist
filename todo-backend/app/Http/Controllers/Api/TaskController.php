<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Task\TaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Traits\HandleControllerErrors;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class TaskController extends Controller
{
    use HandleControllerErrors;

    public function index(Request $request): AnonymousResourceCollection
    {
        $query = $request->user()->tasks()->with('category');

        // Filter by status
        $status = $request->input('status');
        if ($status && $status !== 'all') {
            if ($status === 'completed') {
                $query->completed();
            } elseif ($status === 'pending') {
                $query->pending();
            }
        }

        // Filter by priority
        $priority = $request->input('priority');
        if ($priority && $priority !== 'all') {
            $query->priority($priority);
        }

        // Search
        $search = $request->input('search');
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        // Sort
        $sortField = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');

        $allowedSortFields = ['created_at', 'title', 'priority', 'due_date', 'is_completed'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        }

        $perPage = $request->input('per_page', 15);
        $tasks = $query->paginate($perPage);

        return TaskResource::collection($tasks);
    }

    public function store(TaskRequest $request): JsonResponse
    {
        try {
            $task = $request->user()->tasks()->create($request->validated());

            return $this->successResponse([
                'task' => new TaskResource($task),
            ], 'Task created successfully', 201);
        } catch (\Exception $e) {
            Log::error('Task creation error: ' . $e->getMessage());
            return $this->errorResponse('Failed to create task', $e->getMessage());
        }
    }

    public function show(Request $request, Task $task): TaskResource
    {
        try {
            Gate::authorize('view', $task);
            return new TaskResource($task);
        } catch (AuthorizationException $e) {
            Log::warning('Unauthorized access to task: ' . $task->id);
            throw $e;
        }
    }

    public function update(TaskRequest $request, Task $task): JsonResponse
    {
        try {
            Gate::authorize('update', $task);
            $task->update($request->validated());

            return $this->successResponse([
                'task' => new TaskResource($task),
            ], 'Task updated successfully');
        } catch (AuthorizationException $e) {
            Log::warning('Unauthorized update attempt on task: ' . $task->id);
            return $this->errorResponse('Unauthorized', 'You do not have permission to update this task', 403);
        } catch (\Exception $e) {
            Log::error('Task update error: ' . $e->getMessage());
            return $this->errorResponse('Failed to update task', $e->getMessage());
        }
    }

    public function destroy(Request $request, Task $task): JsonResponse
    {
        try {
            Gate::authorize('delete', $task);
            $task->delete();

            return response()->json(['message' => 'Task deleted successfully'], 204);
        } catch (AuthorizationException $e) {
            Log::warning('Unauthorized delete attempt on task: ' . $task->id);
            return $this->errorResponse('Unauthorized', 'You do not have permission to delete this task', 403);
        } catch (\Exception $e) {
            Log::error('Task delete error: ' . $e->getMessage());
            return $this->errorResponse('Failed to delete task', $e->getMessage());
        }
    }

    public function toggleComplete(Request $request, Task $task): JsonResponse
    {
        try {
            Gate::authorize('update', $task);

            $isNowComplete = !$task->is_completed;
            $task->update([
                'is_completed' => $isNowComplete,
                'completed_at' => $isNowComplete ? now() : null,
            ]);

            $message = $isNowComplete ? 'Task marked as complete' : 'Task marked as incomplete';

            return $this->successResponse([
                'task' => new TaskResource($task),
            ], $message);
        } catch (AuthorizationException $e) {
            Log::warning('Unauthorized toggle attempt on task: ' . $task->id);
            return $this->errorResponse('Unauthorized', 'You do not have permission to update this task', 403);
        } catch (\Exception $e) {
            Log::error('Task toggle error: ' . $e->getMessage());
            return $this->errorResponse('Failed to toggle task', $e->getMessage());
        }
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'ids' => ['required', 'array'],
                'ids.*' => ['exists:tasks,id'],
            ]);

            $tasks = $request->user()->tasks()->whereIn('id', $request->ids)->get();

            foreach ($tasks as $task) {
                $task->delete();
            }

            return $this->successResponse([], count($tasks) . ' tasks deleted successfully');
        } catch (\Exception $e) {
            Log::error('Bulk delete error: ' . $e->getMessage());
            return $this->errorResponse('Failed to delete tasks', $e->getMessage());
        }
    }

    public function bulkComplete(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'ids' => ['required', 'array'],
                'ids.*' => ['exists:tasks,id'],
            ]);

            $tasks = $request->user()->tasks()->whereIn('id', $request->ids)->get();

            foreach ($tasks as $task) {
                $task->markAsComplete();
            }

            return $this->successResponse([], count($tasks) . ' tasks marked as complete');
        } catch (\Exception $e) {
            Log::error('Bulk complete error: ' . $e->getMessage());
            return $this->errorResponse('Failed to complete tasks', $e->getMessage());
        }
    }

    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'total' => 0,
                'completed' => 0,
                'pending' => 0,
                'overdue' => 0,
                'upcoming' => 0,
            ], 200);
        }

        $tasks = $user->tasks()->get();

        $total = $tasks->count();
        $completed = $tasks->filter(fn($t) => $t->is_completed)->count();
        $pending = $tasks->filter(fn($t) => !$t->is_completed)->count();

        $today = now()->toDateString();
        $overdue = $tasks->filter(function ($t) use ($today) {
            return !$t->is_completed && $t->due_date && $t->due_date < $today;
        })->count();

        $nextWeek = now()->addDays(7)->toDateString();
        $upcoming = $tasks->filter(function ($t) use ($today, $nextWeek) {
            return !$t->is_completed && $t->due_date && $t->due_date >= $today && $t->due_date <= $nextWeek;
        })->count();

        return response()->json([
            'total' => $total,
            'completed' => $completed,
            'pending' => $pending,
            'overdue' => $overdue,
            'upcoming' => $upcoming,
        ], 200);
    }

    public function chartTrendData(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $days = $request->input('days', 7);

            $data = [];

            for ($i = $days - 1; $i >= 0; $i--) {
                $dateObj = now()->subDays($i)->endOfDay();
                $dateStr = $dateObj->toDateString();

                // 1. 🟢 Count tasks completed EXACTLY on this date
                $completed = $user->tasks()
                    ->where('is_completed', true)
                    ->whereDate('completed_at', $dateStr)
                    ->count();

                // 2. 🟠 Count pending tasks AS OF this date (Historical Timeline)
                $pending = $user->tasks()
                    ->whereDate('created_at', '<=', $dateStr)
                    ->where(function ($query) use ($dateStr) {
                        $query->where('is_completed', false)
                            ->orWhere(function ($q) use ($dateStr) {
                                $q->where('is_completed', true)
                                    ->whereDate('completed_at', '>', $dateStr);
                            });
                    })
                    ->count();

                $data[] = [
                    'date' => $dateStr,
                    'label' => now()->parse($dateStr)->format('M d'),
                    'completed' => $completed,
                    'pending' => $pending,
                ];
            }

            return response()->json([
                'status' => 'success',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Chart trend data error: ' . $e->getMessage());
            return $this->errorResponse('Failed to fetch trend data', $e->getMessage());
        }
    }

    public function chartPriorityData(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            $data = [
                'high' => [
                    'total' => $user->tasks()->priority('high')->count(),
                    'completed' => $user->tasks()->priority('high')->completed()->count(),
                ],
                'medium' => [
                    'total' => $user->tasks()->priority('medium')->count(),
                    'completed' => $user->tasks()->priority('medium')->completed()->count(),
                ],
                'low' => [
                    'total' => $user->tasks()->priority('low')->count(),
                    'completed' => $user->tasks()->priority('low')->completed()->count(),
                ],
            ];

            return response()->json([
                'status' => 'success',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Chart priority data error: ' . $e->getMessage());
            return $this->errorResponse('Failed to fetch priority data', $e->getMessage());
        }
    }
}

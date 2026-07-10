<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Activity\ActivityRequest;
use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use App\Traits\HandleControllerErrors;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class ActivityController extends Controller
{
    use HandleControllerErrors;

    public function index(Request $request, $projectId): AnonymousResourceCollection
    {
        $activities = Activity::where('project_id', $projectId)->get();
        return ActivityResource::collection($activities);
    }

    public function store(ActivityRequest $request, $projectId): JsonResponse
    {
        try {
            $activity = Activity::create(array_merge($request->validated(), ['project_id' => $projectId]));

            return $this->successResponse([
                'activity' => new ActivityResource($activity),
            ], 'Activity created successfully', 201);
        } catch (\Exception $e) {
            Log::error('Activity creation error: ' . $e->getMessage());
            return $this->errorResponse('Failed to create activity', $e->getMessage());
        }
    }

    public function show(Request $request, $projectId, Activity $activity): ActivityResource
    {
        try {
            Gate::authorize('view', $activity);
            return new ActivityResource($activity);
        } catch (AuthorizationException $e) {
            Log::warning('Unauthorized access to activity: ' . $activity->id);
            throw $e;
        }
    }

    public function update(ActivityRequest $request, $projectId, Activity $activity): JsonResponse
    {
        try {
            Gate::authorize('update', $activity);
            $activity->update($request->validated());

            return $this->successResponse([
                'activity' => new ActivityResource($activity),
            ], 'Activity updated successfully');
        } catch (AuthorizationException $e) {
            Log::warning('Unauthorized update attempt on activity: ' . $activity->id);
            return $this->errorResponse('Unauthorized', 'You do not have permission to update this activity', 403);
        } catch (\Exception $e) {
            Log::error('Activity update error: ' . $e->getMessage());
            return $this->errorResponse('Failed to update activity', $e->getMessage());
        }
    }

    public function destroy(Request $request, $projectId, Activity $activity): JsonResponse
    {
        try {
            Gate::authorize('delete', $activity);
            $activity->delete();

            return response()->json(['message' => 'Activity deleted successfully'], 204);
        } catch (AuthorizationException $e) {
            Log::warning('Unauthorized delete attempt on activity: ' . $activity->id);
            return $this->errorResponse('Unauthorized', 'You do not have permission to delete this activity', 403);
        } catch (\Exception $e) {
            Log::error('Activity delete error: ' . $e->getMessage());
            return $this->errorResponse('Failed to delete activity', $e->getMessage());
        }
    }

    public function archive(Request $request, $projectId, Activity $activity): JsonResponse
    {
        try {
            Gate::authorize('update', $activity);
            $activity->archive();

            return $this->successResponse([
                'activity' => new ActivityResource($activity),
            ], 'Activity archived successfully');
        } catch (AuthorizationException $e) {
            Log::warning('Unauthorized archive attempt on activity: ' . $activity->id);
            return $this->errorResponse('Unauthorized', 'You do not have permission to archive this activity', 403);
        } catch (\Exception $e) {
            Log::error('Activity archive error: ' . $e->getMessage());
            return $this->errorResponse('Failed to archive activity', $e->getMessage());
        }
    }

    public function unarchive(Request $request, $projectId, Activity $activity): JsonResponse
    {
        try {
            Gate::authorize('update', $activity);
            $activity->unarchive();

            return $this->successResponse([
                'activity' => new ActivityResource($activity),
            ], 'Activity unarchived successfully');
        } catch (AuthorizationException $e) {
            Log::warning('Unauthorized unarchive attempt on activity: ' . $activity->id);
            return $this->errorResponse('Unauthorized', 'You do not have permission to unarchive this activity', 403);
        } catch (\Exception $e) {
            Log::error('Activity unarchive error: ' . $e->getMessage());
            return $this->errorResponse('Failed to unarchive activity', $e->getMessage());
        }
    }
}

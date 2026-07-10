<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'name' => $this->name,
            'description' => $this->description,
            'due_date' => $this->due_date,
            'priority' => $this->priority,
            'status' => $this->status,
            'estimated_duration' => $this->estimated_duration,
            'is_archived' => $this->is_archived,
            'tasks_count' => $this->tasks()->count(),
            'completed_tasks_count' => $this->tasks()->completed()->count(),
            'progress' => $this->calculateProgress(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

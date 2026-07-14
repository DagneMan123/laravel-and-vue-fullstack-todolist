<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'notes' => $this->notes,
            'is_completed' => (bool) $this->is_completed,
            'priority' => $this->priority,
            'category_id' => $this->category_id,
            'category_name' => $this->category?->name,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'start_time' => $this->start_time,
            'due_date' => $this->due_date?->format('Y-m-d'),
            'due_time' => $this->due_time,
            'completed_at' => $this->completed_at?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            'is_overdue' => !$this->is_completed && $this->due_date && $this->due_date->isPast(),
            'can_edit' => $request->user()?->id === $this->user_id,
        ];
    }
}

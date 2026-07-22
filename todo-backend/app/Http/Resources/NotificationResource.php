<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'type' => $this->type,
            'title' => $this->title,
            'message' => $this->message,
            'title_params' => $this->getTitleParams(),
            'message_params' => $this->getMessageParams(),
            'is_read' => $this->is_read,
            'read_at' => $this->read_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    /**
     * Extract parameters needed for title translation from data
     */
    private function getTitleParams(): array
    {
        $data = $this->data ?? [];
        $params = [];
        
        // Map common parameters
        if (isset($data['name'])) {
            $params['name'] = $data['name'];
        }
        
        return $params;
    }

    /**
     * Extract parameters needed for message translation from data
     */
    private function getMessageParams(): array
    {
        $data = $this->data ?? [];
        $params = [];
        
        // Map common parameters
        if (isset($data['name'])) {
            $params['name'] = $data['name'];
        }
        if (isset($data['hours'])) {
            $params['hours'] = $data['hours'];
        }
        
        return $params;
    }
}

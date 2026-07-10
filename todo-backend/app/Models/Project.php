<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'status',
        'priority',
        'start_date',
        'end_date',
        'progress',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'progress' => 'integer',
    ];

    protected $attributes = [
        'status' => 'pending',
        'priority' => 'medium',
        'progress' => 0,
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function calculateProgress(): int
    {
        $activities = $this->activities()->count();
        if ($activities === 0) {
            return 0;
        }

        $completedActivities = $this->activities()->where('is_archived', true)->count();
        return (int) (($completedActivities / $activities) * 100);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopePriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }
}

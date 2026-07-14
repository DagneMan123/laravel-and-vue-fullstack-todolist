<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'activity_id',
        'project_id',
        'category_id',
        'title',
        'description',

        'notes',
        'is_completed',
        'priority',
        'start_date',
        'start_time',
        'due_date',
        'due_time',
        'completed_at',
        'is_overdue',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'start_date' => 'date',
        'start_time' => 'string',
        'due_date' => 'date',
        'due_time' => 'string',
        'completed_at' => 'datetime',
    ];

    protected $attributes = [
        'priority' => 'medium',
    ];

    // Append computed properties to JSON
    protected $appends = [
        'is_overdue',
    ];

    // Computed property for is_overdue
    public function getIsOverdueAttribute()
    {
        if ($this->is_completed) {
            return false;
        }
        if (!$this->due_date) {
            return false;
        }
        return $this->due_date < now()->toDateString();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function markAsComplete(): void
    {
        $this->update([
            'is_completed' => true,
            'completed_at' => now(),
        ]);
    }

    public function markAsIncomplete(): void
    {
        $this->update([
            'is_completed' => false,
            'completed_at' => null,
        ]);
    }

    // Scopes
    public function scopeCompleted($query)
    {
        return $query->where('is_completed', true);
    }

    public function scopePending($query)
    {
        return $query->where('is_completed', false);
    }

    public function scopePriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeUpcoming($query, $days = 7)
    {
        $today = now()->toDateString();
        $endDate = now()->addDays($days)->toDateString();

        return $query->whereNotNull('due_date')
            ->whereRaw('DATE(due_date) >= ?', [$today])
            ->whereRaw('DATE(due_date) <= ?', [$endDate])
            ->where('is_completed', false);
    }

    public function scopeOverdue($query)
    {
        $today = now()->toDateString();

        return $query->whereNotNull('due_date')
            ->whereRaw('DATE(due_date) < ?', [$today])
            ->where('is_completed', false);
    }
}

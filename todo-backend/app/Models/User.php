<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // ወደ Task ሞዴል የሚወስደው መንገድ ተስተካክሏል
    public function tasks()
    {
        return $this->hasMany(\App\Models\Task::class);
    }

    // ወደ Project ሞዴል የሚወስደው መንገድ ተስተካክሏል
    public function projects()
    {
        return $this->hasMany(\App\Models\Project::class);
    }

    // ወደ Category ሞዴል የሚወስደው መንገድ ተስተካክሏል
    public function categories()
    {
        return $this->hasMany(\App\Models\Category::class);
    }

    // ወደ Notification ሞዴል የሚወስደው መንገድ ተስተካክሏል
    public function notifications()
    {
        return $this->hasMany(\App\Models\Notification::class);
    }

    public function getAvatarUrlAttribute(): string
    {
        return $this->avatar
            ? asset('storage/avatars/' . $this->avatar)
            : 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&background=random';
    }
}

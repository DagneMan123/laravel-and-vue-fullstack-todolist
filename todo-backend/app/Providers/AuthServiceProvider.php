<?php

namespace App\Providers;

use App\Models\Task;

use App\Models\Activity;
use App\Models\Category;
use App\Models\Notification;
use App\Policies\TaskPolicy;
use App\Policies\ProjectPolicy;
use App\Policies\ActivityPolicy;
use App\Policies\CategoryPolicy;
use App\Policies\NotificationPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Task::class => TaskPolicy::class,

        Activity::class => ActivityPolicy::class,
        Category::class => CategoryPolicy::class,
        Notification::class => NotificationPolicy::class,
    ];


    public function boot(): void
    {
        $this->registerPolicies();
    }
}

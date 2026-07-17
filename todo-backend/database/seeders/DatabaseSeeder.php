<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create test user
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        // Create sample tasks
        $user->tasks()->createMany([
            [
                'title' => 'Complete project documentation',
                'description' => 'Write comprehensive documentation for the API',
                'priority' => 'high',
                'due_date' => now()->addDays(2),
            ],
            [
                'title' => 'Review pull requests',
                'description' => 'Review and merge pending PRs',
                'priority' => 'medium',
                'due_date' => now()->addDays(1),
            ],
            [
                'title' => 'Setup CI/CD pipeline',
                'description' => 'Configure GitHub Actions for automated deployment',
                'priority' => 'high',
                'due_date' => now()->addDays(3),
            ],
            [
                'title' => 'Write unit tests',
                'description' => 'Add test coverage for critical features',
                'priority' => 'medium',
                'due_date' => now()->addDays(5),
            ],
            [
                'title' => 'Update dependencies',
                'description' => 'Update all packages to latest versions',
                'priority' => 'low',
                'due_date' => now()->addDays(7),
            ],
        ]);

        // Seed notifications
        $this->call(NotificationSeeder::class);
    }
}
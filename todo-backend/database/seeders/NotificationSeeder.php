<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all existing users or create one if none exist
        $users = User::all();
        
        if ($users->isEmpty()) {
            $users = User::factory(3)->create();
        }

        // Create notifications for each user
        foreach ($users as $user) {
            // Create a mix of read and unread notifications
            Notification::factory(5)
                ->unread()
                ->for($user)
                ->create();

            Notification::factory(10)
                ->read()
                ->for($user)
                ->create();

            // Create notifications with different types
            Notification::factory(2)
                ->unread()
                ->type('success')
                ->for($user)
                ->create();

            Notification::factory(2)
                ->unread()
                ->type('warning')
                ->for($user)
                ->create();

            Notification::factory(1)
                ->unread()
                ->type('error')
                ->for($user)
                ->create();
        }
    }
}

<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Notification>
 */
class NotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['info', 'success', 'warning', 'error'];
        $type = $this->faker->randomElement($types);

        $messages = [
            'info' => [
                'New task created',
                'Reminder: Check your tasks',
                'Your profile was updated',
                'New category added',
            ],
            'success' => [
                'Task completed successfully',
                'All tasks marked as complete',
                'Profile updated successfully',
                'Category created successfully',
            ],
            'warning' => [
                'You have overdue tasks',
                'Task due soon',
                'Multiple tasks pending',
                'Week is ending soon',
            ],
            'error' => [
                'Failed to create task',
                'Please try again later',
                'An error occurred',
                'Operation failed',
            ],
        ];

        $messageText = $this->faker->randomElement($messages[$type]);

        return [
            'user_id' => User::factory(),
            'title' => $messageText,
            'message' => $this->faker->sentence(8),
            'type' => $type,
            'is_read' => $this->faker->boolean(30), // 30% chance of being read
            'read_at' => $this->faker->boolean(30) ? $this->faker->dateTime() : null,
            'data' => [
                'related_model' => $this->faker->randomElement(['Task', 'Project', 'Activity', 'Category']),
                'related_id' => $this->faker->numberBetween(1, 100),
            ],
            'created_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ];
    }

    /**
     * Indicate that the notification is read.
     */
    public function read(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_read' => true,
            'read_at' => now(),
        ]);
    }

    /**
     * Indicate that the notification is unread.
     */
    public function unread(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_read' => false,
            'read_at' => null,
        ]);
    }

    /**
     * Indicate the notification type.
     */
    public function type(string $type): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => $type,
        ]);
    }
}

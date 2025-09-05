<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Users;
use App\Models\Students;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Users>
 */
class UsersFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $student = Students::whereNotIn('email', Users::pluck('email'))->inRandomOrder()->first();

        if (!$student) {
            // Fallback: if no students left without users, just return something safe
            return [
                'name' => 'No Student Available',
                'email' => $this->faker->unique()->safeEmail,
                'password' => bcrypt('password'),
            ];
        }

        return [
            //
            'email' => $student->email,
            'password_hash' => bcrypt('password'), // Default password for testing
            'role' => $this->faker->randomElement(['librarian', 'borrower']) // Random role
        ];
    }
}

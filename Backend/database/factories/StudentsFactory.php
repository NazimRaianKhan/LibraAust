<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Students;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Students>
 */
class StudentsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        return [
            //
            'student_id' => $this->faker->unique()->numberBetween(000, 999),
            'name' => $this->faker->name(),
            'department' => $this->faker->randomElement(['CSE', 'EEE', 'BBA', 'ME', 'TE', 'CE', 'IPE', 'ARCH']),
            'semester' => $this->faker->randomElement(['1.1', '1.2', '2.1', '2.2', '3.1', '3.2', '4.1', '4.2']),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->optional()->phoneNumber(),
            'borrowed_id' => null,
            'studentship' => 'true'
        ];
    }
}

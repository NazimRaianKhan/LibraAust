<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PublicationSeeder extends Seeder
{
    public function run(): void
    {
        // Insert sample books
        for ($i = 1; $i <= 20; $i++) {
            DB::table('publications')->insert([
                'title' => "Sample Book $i",
                'author' => "Author " . rand(1, 10),
                'isbn' => "ISBN-" . rand(100000, 999999),
                'publication_year' => rand(2000, 2022),
                'publisher' => "Publisher " . rand(1, 5),
                'department' => ['CSE', 'EEE', 'MPE', 'Textile', 'Arch', 'Civil'][array_rand(['CSE', 'EEE', 'MPE', 'Textile', 'Arch', 'Civil'])],
                'type' => 'book',
                'total_copies' => rand(5, 20),
                'available_copies' => rand(1, 15),
                'shelf_location' => "Shelf-" . rand(1, 10),
                'description' => "This is a description for Sample Book $i. It is used for testing.",
                'cover_url' => "https://picsum.photos/seed/book-$i/400/600",
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Insert sample thesis
        for ($i = 1; $i <= 10; $i++) {
            DB::table('publications')->insert([
                'title' => "Thesis Paper $i",
                'author' => "Student " . rand(1, 12),
                'isbn' => null,
                'publication_year' => rand(2010, 2022),
                'publisher' => null,
                'department' => ['CSE', 'EEE', 'MPE', 'Textile', 'Arch', 'Civil'][array_rand(['CSE', 'EEE', 'MPE', 'Textile', 'Arch', 'Civil'])],
                'type' => 'thesis',
                'total_copies' => 1,
                'available_copies' => 1,
                'shelf_location' => "Shelf-T" . rand(1, 5),
                'description' => "This is a placeholder abstract for Thesis Paper $i. Prepared for testing.",
                'cover_url' => "https://picsum.photos/seed/thesis-$i/400/600",
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}

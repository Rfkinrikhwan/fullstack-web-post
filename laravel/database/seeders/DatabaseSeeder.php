<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Post;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Data Dummy Users
        $user1 = User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('password123'),
        ]);

        $user2 = User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'password' => Hash::make('password123'),
        ]);

        // Data Dummy Posts
        Post::create([
            'title' => 'Getting Started with Laravel',
            'slug' => 'getting-started-with-laravel',
            'content' => 'Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience.',
            'user_id' => $user1->id,
        ]);

        Post::create([
            'title' => 'Understanding Repository Pattern',
            'slug' => 'understanding-repository-pattern',
            'content' => 'The Repository Pattern is a design pattern that mediates data from and to the domain and data access layers. It provides a collection interface for accessing domain entities.',
            'user_id' => $user1->id,
        ]);

        Post::create([
            'title' => 'Next.js App Router Guide',
            'slug' => 'nextjs-app-router-guide',
            'content' => 'The App Router is a new paradigm for building applications using React\'s latest features. It allows you to use Server Components, Streaming, and more.',
            'user_id' => $user2->id,
        ]);

        Post::create([
            'title' => 'DaisyUI Components',
            'slug' => 'daisyui-components',
            'content' => 'DaisyUI is a component library for Tailwind CSS. It adds beautiful component classes to Tailwind CSS and makes it easier to build responsive websites.',
            'user_id' => $user2->id,
        ]);

        Post::create([
            'title' => 'Full Stack Development Tips',
            'slug' => 'full-stack-development-tips',
            'content' => 'Full stack development requires knowledge of both frontend and backend technologies. The key is to understand how they work together to create seamless applications.',
            'user_id' => $user1->id,
        ]);
    }
}
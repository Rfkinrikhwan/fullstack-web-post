<?php

namespace App\Repositories\Implementations;

use App\Models\Post;
use App\Repositories\Interfaces\PostRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class PostRepository implements PostRepositoryInterface
{
    public function getAll($perPage = 10, $filters = [])
    {
        $query = Post::with('user')->latest();

        if (isset($filters['title']) && !empty($filters['title'])) {
            $query->where('title', 'like', '%' . $filters['title'] . '%');
        }

        if (isset($filters['slug']) && !empty($filters['slug'])) {
            $query->where('slug', $filters['slug']);
        }

        if (isset($filters['user_id']) && !empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        $query->where('user_id', Auth::user()->id);

        return $query->paginate($perPage);
    }

    public function find($identifier)
    {
        if (Str::isUuid($identifier)) {
            return Post::with('user')->findOrFail($identifier);
        }

        return Post::with('user')->where('slug', $identifier)->firstOrFail();
    }

    public function create(array $data)
    {
        return Post::create($data);
    }

    public function update($id, array $data)
    {
        $post = Post::findOrFail($id);
        $post->update($data);
        return $post;
    }

    public function delete($id)
    {
        return Post::destroy($id);
    }
}

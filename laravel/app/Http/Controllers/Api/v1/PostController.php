<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Post\StorePostRequest;
use App\Http\Requests\Post\UpdatePostRequest;
use App\Http\Resources\User\PostResource;
use App\Repositories\Interfaces\PostRepositoryInterface;
use Illuminate\Http\Request;

class PostController extends Controller
{
    protected $postRepository;

    public function __construct(PostRepositoryInterface $postRepository)
    {
        $this->postRepository = $postRepository;
    }

    public function index(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);

            $filters = [
                'title' => $request->get('title'),
                'slug' => $request->get('slug'),
                'user_id' => $request->get('user_id'),
            ];

            $posts = $this->postRepository->getAll($perPage, $filters);

            return PostResource::collection($posts);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'errors' => 'Data not found',
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            report($e);
            return response()->json([
                'errors' => 'Proses data gagal, silahkan coba lagi',
            ], $e->getCode() == 0 ? 500 : ($e->getCode() != 23000 ? $e->getCode() : 500));
        }
    }

    public function store(StorePostRequest $request)
    {
        try {
            $post = $this->postRepository->create([
                'title' => $request->title,
                'content' => $request->content,
                'user_id' => $request->user()->id,
            ]);

            return response()->json([
                'message' => 'Post created successfully',
                'data' => new PostResource($post->load('user'))
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            report($e);
            return response()->json([
                'errors' => 'Proses data gagal, silahkan coba lagi',
            ], $e->getCode() == 0 ? 500 : ($e->getCode() != 23000 ? $e->getCode() : 500));
        }
    }

    public function show($id)
    {
        try {
            $post = $this->postRepository->find($id);
            return new PostResource($post);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'errors' => 'Data not found',
            ], 404);
        } catch (\Exception $e) {
            report($e);
            return response()->json([
                'errors' => 'Proses data gagal, silahkan coba lagi',
            ], $e->getCode() == 0 ? 500 : ($e->getCode() != 23000 ? $e->getCode() : 500));
        }
    }

    public function update(UpdatePostRequest $request, $id)
    {
        try {
            $post = $this->postRepository->find($id);

            if ($post->user_id !== $request->user()->id) {
                return response()->json([
                    'errors' => 'Unauthorized'
                ], 403);
            }

            $post = $this->postRepository->update($id, $request->validated());

            return response()->json([
                'message' => 'Post updated successfully',
                'data' => new PostResource($post->load('user'))
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'errors' => 'Data not found',
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            report($e);
            return response()->json([
                'errors' => 'Proses data gagal, silahkan coba lagi',
            ], $e->getCode() == 0 ? 500 : ($e->getCode() != 23000 ? $e->getCode() : 500));
        }
    }

    public function destroy(Request $request, $id)
    {
        try {
            $post = $this->postRepository->find($id);

            if ($post->user_id !== $request->user()->id) {
                return response()->json([
                    'errors' => 'Unauthorized'
                ], 403);
            }

            $this->postRepository->delete($id);

            return response()->json([
                'message' => 'Post deleted successfully'
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'errors' => 'Data not found',
            ], 404);
        } catch (\Exception $e) {
            report($e);
            return response()->json([
                'errors' => 'Proses data gagal, silahkan coba lagi',
            ], $e->getCode() == 0 ? 500 : ($e->getCode() != 23000 ? $e->getCode() : 500));
        }
    }
}

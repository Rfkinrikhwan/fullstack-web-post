<?php

namespace App\Repositories\Interfaces;

interface PostRepositoryInterface
{
    public function getAll($perPage = 10, $filters = []);
    public function find($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
}
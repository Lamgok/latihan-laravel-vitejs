<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class TodoController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = $user->todos()->latest();

        // Fitur Pencarian
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Fitur Filter Status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('is_finished', $request->status === 'finished');
        }

        // Pagination 20 item per halaman
        $todos = $query->paginate(20)->withQueryString();

        // Menambahkan URL cover ke setiap item todo
        $todos->getCollection()->transform(function ($todo) {
            $todo->cover_url = $todo->cover_url;
            return $todo;
        });

        // Statistik untuk Diagram Bulat
        $stats = [
            'finished' => $user->todos()->where('is_finished', true)->count(),
            'unfinished' => $user->todos()->where('is_finished', false)->count(),
        ];

        return inertia('app/HomePage', [
            'auth' => $user,
            'todos' => $todos,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover' => 'nullable|image|max:2048', // Maks 2MB
        ]);

        $data = $request->only('title', 'description');
        $data['user_id'] = Auth::id();

        if ($request->hasFile('cover')) {
            $data['cover'] = $request->file('cover')->store('todos', 'public');
        }

        Todo::create($data);

        return redirect()->back()->with('success', 'Todo berhasil ditambahkan.');
    }

    public function update(Request $request, Todo $todo)
    {
        // Pastikan user hanya bisa edit punya sendiri
        if ($todo->user_id !== Auth::id()) abort(403);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_finished' => 'boolean',
            'cover' => 'nullable|image|max:2048',
        ]);

        $data = $request->only('title', 'description', 'is_finished');

        if ($request->hasFile('cover')) {
            // Hapus cover lama jika ada
            if ($todo->cover) {
                Storage::disk('public')->delete($todo->cover);
            }
            $data['cover'] = $request->file('cover')->store('todos', 'public');
        }

        $todo->update($data);

        return redirect()->back()->with('success', 'Todo berhasil diperbarui.');
    }

    public function destroy(Todo $todo)
    {
        if ($todo->user_id !== Auth::id()) abort(403);

        if ($todo->cover) {
            Storage::disk('public')->delete($todo->cover);
        }

        $todo->delete();

        return redirect()->back()->with('success', 'Todo berhasil dihapus.');
    }
}
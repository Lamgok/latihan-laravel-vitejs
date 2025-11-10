<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Menampilkan daftar semua To-Do.
     */
    public function index()
    {
        // Ambil semua To-Do, diurutkan berdasarkan yang terbaru
        $todos = Todo::orderBy('created_at', 'desc')->get();
        return view('todos.index', compact('todos'));
    }

    /**
     * Menyimpan To-Do baru.
     */
    public function store(Request $request)
    {
        // Validasi input: 'task' harus ada dan berupa string maksimal 255 karakter
        $request->validate([
            'task' => 'required|string|max:255',
        ]);

        // Simpan ke database
        Todo::create([
            'task' => $request->task,
            'is_completed' => false, // Default: belum selesai
        ]);

        return redirect()->route('todos.index')->with('success', 'To-Do baru berhasil ditambahkan!');
    }

    /**
     * Mengubah status (toggle) To-Do.
     */
    public function toggle(Todo $todo)
    {
        // Membalik nilai status: true menjadi false, dan sebaliknya
        $todo->is_completed = !$todo->is_completed;
        $todo->save(); // Simpan perubahan

        return back()->with('success', 'Status To-Do berhasil diperbarui.');
    }

    /**
     * Menghapus To-Do.
     */
    public function destroy(Todo $todo)
    {
        $todo->delete();

        return back()->with('success', 'To-Do berhasil dihapus.');
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class TodoController extends Controller
{
    /**
     * Tampilkan daftar todos.
     */
    public function index()
    {
        // Mengambil semua todo milik user yang sedang login, diurutkan berdasarkan ID terbaru
        $todos = Todo::where('user_id', Auth::id())
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('app/TodosPage', [
            'todos' => $todos,
        ]);
    }

    /**
     * Simpan todo baru.
     */
    public function store(Request $request)
    {
        $request->validate([
            // PERBAIKAN: Mengganti 'task' menjadi 'title'
            'title' => 'required|string|max:255',
        ]);

        Todo::create([
            'user_id' => Auth::id(),
            'title' => $request->title, // PERBAIKAN: Mengganti 'task' menjadi 'title'
        ]);

        // Menggunakan redirect dengan flash session untuk pesan sukses
        return redirect()->route('app.todos')->with('success', 'Todo berhasil ditambahkan!');
    }

    /**
     * Ubah status is_finished todo.
     */
    public function updateStatus(Todo $todo)
    {
        // Pastikan todo milik user yang sedang login
        if ($todo->user_id !== Auth::id()) {
            return redirect()->route('app.todos')->with('error', 'Anda tidak memiliki akses ke todo ini.');
        }

        // PERBAIKAN: Mengganti is_completed menjadi is_finished
        $todo->is_finished = !$todo->is_finished;
        $todo->save();

        return redirect()->route('app.todos');
    }

    /**
     * Hapus todo.
     */
    public function destroy(Todo $todo)
    {
        // Pastikan todo milik user yang sedang login
        if ($todo->user_id !== Auth::id()) {
            return redirect()->route('app.todos')->with('error', 'Anda tidak memiliki akses ke todo ini.');
        }

        $todo->delete();

        // Menggunakan redirect dengan flash session untuk pesan sukses
        return redirect()->route('app.todos')->with('success', 'Todo berhasil dihapus!');
    }
}
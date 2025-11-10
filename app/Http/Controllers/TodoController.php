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
            'task' => 'required|string|max:255',
        ]);

        Todo::create([
            'user_id' => Auth::id(),
            'task' => $request->task,
        ]);

        return redirect()->route('app.todos')->with('success', 'Todo berhasil ditambahkan!');
    }

    /**
     * Ubah status is_completed todo.
     */
    public function updateStatus(Todo $todo)
    {
        // Pastikan todo milik user yang sedang login
        if ($todo->user_id !== Auth::id()) {
            return redirect()->route('app.todos')->with('error', 'Anda tidak memiliki akses ke todo ini.');
        }

        $todo->is_completed = !$todo->is_completed;
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

        return redirect()->route('app.todos')->with('success', 'Todo berhasil dihapus!');
    }
}
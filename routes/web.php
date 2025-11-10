<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['handle.inertia'])->group(function () {
    // Auth Routes
    Route::group(['prefix' => 'auth'], function () {
        Route::get('/login', [AuthController::class, 'login'])->name('auth.login');
        Route::post('/login/post', [AuthController::class, 'postLogin'])->name('auth.login.post');

        Route::get('/register', [AuthController::class, 'register'])->name('auth.register');
        Route::post('/register/post', [AuthController::class, 'postRegister'])->name('auth.register.post');

        Route::get('/logout', [AuthController::class, 'logout'])->name('auth.logout');
    });

    Route::group(['middleware' => 'check.auth'], function () {
        Route::get('/', [HomeController::class, 'home'])->name('home');

    // [R] READ: Halaman Utama To-Do List (Menampilkan semua data)
Route::get('/', [TodoController::class, 'index'])->name('todos.index');

// [C] CREATE: Menyimpan To-Do baru
Route::post('/todos', [TodoController::class, 'store'])->name('todos.store');

// [U] UPDATE: Mengubah status (toggle: Selesai/Belum Selesai)
// Menggunakan PATCH karena hanya mengubah sebagian data (satu kolom: is_completed)
Route::patch('/todos/{todo}/toggle', [TodoController::class, 'toggle'])->name('todos.toggle');

// [D] DELETE: Menghapus To-Do
Route::delete('/todos/{todo}', [TodoController::class, 'destroy'])->name('todos.destroy');
    });
});
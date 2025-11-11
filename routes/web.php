<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Auth; // FIX: Import Auth untuk logic root route

// FIX: Ganti rute utama agar langsung mengarah ke login (jika belum login) atau todo (jika sudah login), menghapus kebutuhan untuk HomeController.
Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('app.todos');
    }
    return redirect()->route('auth.login');
})->name('home');

// Grup Rute Autentikasi
Route::prefix('auth')->name('auth.')->group(function () {
    Route::get('/login', [AuthController::class, 'login'])->name('login'); // Ganti getLogin menjadi login
    Route::post('/login/post', [AuthController::class, 'postLogin'])->name('login.post');
    Route::get('/register', [AuthController::class, 'register'])->name('register'); // Ganti getRegister menjadi register
    Route::post('/register/post', [AuthController::class, 'postRegister'])->name('register.post');
    // FIX: Menggunakan POST untuk logout adalah praktik keamanan yang lebih baik
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

// Grup Rute Aplikasi (Membutuhkan autentikasi)
Route::middleware(['check.auth'])->prefix('app')->name('app.')->group(function () {
    // Rute untuk Fitur Todo
    Route::get('/todos', [TodoController::class, 'index'])->name('todos');
    Route::post('/todos/store', [TodoController::class, 'store'])->name('todos.store');
    // Menggunakan Route Model Binding untuk Todo
    Route::put('/todos/{todo}/update-status', [TodoController::class, 'updateStatus'])->name('todos.update_status');
    Route::delete('/todos/{todo}/destroy', [TodoController::class, 'destroy'])->name('todos.destroy');
    
    // Rute /app/home dihapus dan diganti dengan logic root route di atas, agar lebih sederhana
});
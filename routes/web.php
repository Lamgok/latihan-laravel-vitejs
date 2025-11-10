<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TodoController; // Import TodoController

// Rute tanpa middleware (Halaman utama non-auth)
Route::get('/', [HomeController::class, 'home'])->name('home');

// Grup Rute Autentikasi
Route::prefix('auth')->name('auth.')->group(function () {
    Route::get('/login', [AuthController::class, 'getLogin'])->name('login');
    Route::post('/login/post', [AuthController::class, 'postLogin'])->name('login.post');
    Route::get('/register', [AuthController::class, 'getRegister'])->name('register');
    Route::post('/register/post', [AuthController::class, 'postRegister'])->name('register.post');
    Route::get('/logout', [AuthController::class, 'logout'])->name('logout');
});

// Grup Rute Aplikasi (Membutuhkan autentikasi)
Route::middleware(['check.auth'])->prefix('app')->name('app.')->group(function () {
    // Rute untuk Fitur Todo (Sesuai 5.1 Fitur Todos)
    Route::get('/todos', [TodoController::class, 'index'])->name('todos');
    Route::post('/todos/store', [TodoController::class, 'store'])->name('todos.store');
    Route::put('/todos/{todo}/update-status', [TodoController::class, 'updateStatus'])->name('todos.update_status');
    Route::delete('/todos/{todo}/destroy', [TodoController::class, 'destroy'])->name('todos.destroy');
    
    // Modifikasi rute 'home' agar mengarah ke todos
    Route::get('/home', [TodoController::class, 'index'])->name('home'); 
});
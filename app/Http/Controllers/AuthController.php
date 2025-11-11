<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    // Login
    // -------------------------------
    public function login()
    {
        if (Auth::check()) {
            // PERBAIKAN: Arahkan ke rute aplikasi utama yang spesifik
            return redirect()->route('app.todos');
        }

        $success = session('success');
        $data = ['success' => $success];
        return Inertia::render('auth/LoginPage', $data);
    }

    public function postLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:250',
            'password' => 'required|string|min:6',
        ]);

        if (!Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            return back()->withErrors(['email' => 'Email atau password salah.'])->onlyInput('email');
        }

        // PERBAIKAN: Redirect ke halaman todos setelah login berhasil
        return redirect()->route('app.todos');
    }

    // Register
    // -------------------------------
    public function register()
    {
        if (Auth::check()) {
            // PERBAIKAN: Jika sudah login, langsung ke halaman todos
            return redirect()->route('app.todos');
        }

        $data = [];
        return Inertia::render('auth/RegisterPage', $data);
    }

    public function postRegister(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6', // PERBAIKAN: Validasi minimal 6 karakter
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), 
        ]);

        return redirect()->route('auth.login')->with('success', 'Pendaftaran berhasil dilakukan! Silakan login.');
    }

    // Logout
    // -------------------------------
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('auth.login');
    }
}
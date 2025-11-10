<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    use HasFactory;

    // Definisikan kolom yang diizinkan untuk diisi (mass assignment)
    protected $fillable = [
        'task', 
        'is_completed'
    ];
}
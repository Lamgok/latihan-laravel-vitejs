<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Todo extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title', // FIX: Mengganti 'task' menjadi 'title' agar sesuai migrasi
        'is_finished', // FIX: Mengganti 'is_completed' menjadi 'is_finished' agar sesuai migrasi
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'is_finished' => 'boolean', // FIX: Mengganti 'is_completed' menjadi 'is_finished'
    ];

    /**
     * Get the user that owns the todo.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
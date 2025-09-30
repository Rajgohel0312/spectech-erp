<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Leave extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'type',
        'start_date',
        'end_date',
        'reason',
        'status'
    ];

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id'); // or Employee::class if separate
    }
}

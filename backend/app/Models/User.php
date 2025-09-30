<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'employee_id',
        'enrollment',
        'dob',
        'college_id',
        'department_id',
        'is_active',
        'must_change_password'
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'dob' => 'date',
        'is_active' => 'boolean',
        'must_change_password' => 'boolean',
    ];
    public function college()
    {
        return $this->belongsTo(College::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

}
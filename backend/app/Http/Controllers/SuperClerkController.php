<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
class SuperClerkController extends Controller
{
    public function createClerk(Request $req)
    {
        $req->validate([
            'name' => 'required',
            'employee_id' => 'required|unique:users',
            'email' => 'required|unique:users',
            'college_id' => 'required|exists:colleges,id'
        ]);

        $temp = 'temp@2025';

        $user = User::create([
            'name' => $req->name,
            'email' => $req->email,
            'employee_id' => $req->employee_id,
            'college_id' => $req->college_id,
            'password' => Hash::make($temp),
            'must_change_password' => true,
            'is_active' => true,
        ]);

        $user->assignRole('clerk');

        return response()->json(['message' => 'Clerk created', 'temp_password' => $temp]);
    }
    public function createEmployee(Request $req)
    {
        $req->validate([
            'name' => 'required|string|max:255',
            'employee_id' => 'required|string|unique:users',
            'email' => 'required|email|unique:users',
            'college_id' => 'required|exists:colleges,id',
            'department_id' => 'required|exists:departments,id',
        ]);

        $temp = 'temp@2026';

        $user = User::create([
            'name' => $req->name,
            'employee_id' => $req->employee_id,
            'email' => $req->email,
            'college_id' => $req->college_id,
            'department_id' => $req->department_id,
            'password' => Hash::make($temp),
            'must_change_password' => true,
            'is_active' => true,
        ]);

        $user->assignRole('employee');

        return response()->json([
            'message' => 'Employee created successfully',
            'temp_password' => $temp,
            'user' => $user->load(['college', 'department'])
        ]);
    }
}

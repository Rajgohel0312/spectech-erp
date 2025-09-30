<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SuperAccountantController extends Controller
{
    public function createAccountant(Request $req)
    {
        $req->validate([
            'name' => 'required',
            'employee_id' => 'required|unique:users',
            'email' => 'required|unique:users',
            'college_id' => 'required|exists:colleges,id',
        ]);

        $temp = 'temp@2026';

        $user = User::create([
            'name' => $req->name,
            'employee_id' => $req->employee_id,
            'email' => $req->email,
            'college_id' => $req->college_id,
            'password' => Hash::make($temp),
            'must_change_password' => true,
            'is_active' => true,
        ]);
        $user->assignRole('accountant');

        return response()->json(['message' => 'Accountant created', 'temp_password' => $temp]);
    }
}

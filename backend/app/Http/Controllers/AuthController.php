<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use Illuminate\Validation\ValidationException;
class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate(['username' => 'required', 'password' => 'required']);

        $user = User::where('email', $request->username)
            ->orWhere('employee_id', $request->username)
            ->orWhere('enrollment', $request->username)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages(['message' => 'Invalid credentials']);
        }

        if (!$user->is_active) {
            return response()->json(['message' => 'Account deactivated'], 403);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user->only('id', 'name', 'email', 'college'),
            'roles' => $user->getRoleNames(),
            'token' => $token,
            'must_change_password' => $user->must_change_password,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function changePassword(Request $request)
    {
        $request->validate(['new_password' => 'required|min:8|confirmed']);
        $user = $request->user();
        $user->password = Hash::make($request->new_password);
        $user->must_change_password = false;
        $user->save();

        return response()->json(['message' => 'Password updated']);
    }
}

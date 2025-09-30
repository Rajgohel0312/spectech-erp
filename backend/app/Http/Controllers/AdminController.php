<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function listUsers(Request $request) 
{
    $query = User::with(['roles','college']); // ✅ include college

    // Search
    if ($search = $request->input('search')) {
        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%$search%")
                ->orWhere('email', 'like', "%$search%")
                ->orWhere('employee_id', 'like', "%$search%")
                ->orWhere('enrollment', 'like', "%$search%");
        });
    }

    // Filter by role
    if ($role = $request->input('role')) {
        $query->whereHas('roles', fn($q) => $q->where('name', $role));
    }

    // Filter by status
    if ($status = $request->input('status')) {
        $query->where('is_active', $status === 'active');
    }

    // Paginate (default 10 per page)
    $users = $query->paginate($request->input('per_page', 10));

    // Transform
    $data = $users->getCollection()->map(function ($user) {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'employee_id' => $user->employee_id,
            'enrollment' => $user->enrollment,
            'is_active' => $user->is_active,
            'roles' => $user->getRoleNames(),
            'college' => $user->college ? [
                'id' => $user->college->id,
                'name' => $user->college->name,
                'code' => $user->college->code,
            ] : null,
        ];
    });

    return response()->json([
        'data' => $data,
        'pagination' => [
            'current_page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
            'per_page' => $users->perPage(),
            'total' => $users->total(),
        ]
    ]);
}

    public function createSuper(Request $req)
    {
        $req->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'role' => 'required|in:superClerk,superAccountant'
        ]);

        $temp = 'temp@2026';

        $user = User::create([
            'name' => $req->name,
            'email' => $req->email,
            'password' => Hash::make($temp),
            'must_change_password' => true,
            'is_active' => true,
        ]);
        $user->assignRole($req->role);

        return response()->json(['message' => 'Created', 'temp_password' => $temp, 'user' => $user]);
    }

    public function toggleActivation(User $user)
    {
        $user->is_active = !$user->is_active;
        $user->save();
        return response()->json(['message' => 'Updated', 'is_active' => $user->is_active]);
    }
}

<?php

use App\Http\Controllers\CollegeController;
use App\Http\Controllers\DepartmentController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\SuperClerkController;
use App\Http\Controllers\SuperAccountantController;
use App\Http\Controllers\ClerkController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| These routes are loaded by RouteServiceProvider inside "api" middleware.
| All APIs here are JSON-based, token authenticated via Sanctum.
|--------------------------------------------------------------------------
*/

// 🔑 Authentication
Route::post('login', [AuthController::class, 'login']);   // ✅ fixed here
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('change-password', [AuthController::class, 'changePassword'])->middleware('auth:sanctum');

// 👤 Get current user
Route::get('me', function (\Illuminate\Http\Request $request) {
    return $request->user()->load(['roles', 'college']);
})->middleware(['auth:sanctum', 'active']);

// 🛠️ Admin Routes
Route::middleware(['auth:sanctum', 'role:admin', 'active'])->group(function () {
    Route::post('admin/create-super', [AdminController::class, 'createSuper']);
    Route::post('admin/toggle-activation/{user}', [AdminController::class, 'toggleActivation']);
    Route::get('admin/users', [AdminController::class, 'listUsers']);

});

Route::middleware(['auth:sanctum', 'role:admin|superClerk|superAccountant', 'active'])->group(function () {
    // Colleges
    Route::get('colleges', [CollegeController::class, 'index']);
    Route::post('colleges', [CollegeController::class, 'store']); // keep Admin only
    Route::put('colleges/{college}', [CollegeController::class, 'update']); // Admin only
    Route::delete('colleges/{college}', [CollegeController::class, 'destroy']); // Admin only

    Route::get('departments', [DepartmentController::class, 'index']);
    Route::post('departments', [DepartmentController::class, 'store']);
    Route::put('departments/{department}', [DepartmentController::class, 'update']);
    Route::delete('departments/{department}', [DepartmentController::class, 'destroy']);
});

// 📂 Super Clerk Routes
Route::middleware(['auth:sanctum', 'role:superClerk', 'active'])->group(function () {
    Route::post('super-clerk/create-clerk', [SuperClerkController::class, 'createClerk']);
    Route::post('super-clerk/create-employee', [SuperClerkController::class, 'createEmployee']);
});

// 📊 Super Accountant Routes
Route::middleware(['auth:sanctum', 'role:superAccountant', 'active'])->group(function () {
    Route::post('super-accountant/create-accountant', [SuperAccountantController::class, 'createAccountant']);
});

// 🎓 Clerk Routes (import students)
Route::middleware(['auth:sanctum', 'role:clerk', 'active'])->group(function () {
    Route::post('clerk/import-students', [ClerkController::class, 'importStudents']);
});

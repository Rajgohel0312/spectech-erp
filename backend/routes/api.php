<?php

use App\Http\Controllers\CollegeController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\LeaveBalanceController;
use App\Http\Controllers\LeaveController;
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
Route::get('me', function (Request $request) {
    return $request->user()->load(['roles', 'college']);
})->middleware(['auth:sanctum', 'active']);

// 🛠️ Admin Routes
Route::middleware(['auth:sanctum', 'role:admin', 'active'])->group(function () {
    Route::post('admin/create-super', [AdminController::class, 'createSuper']);
    Route::post('admin/toggle-activation/{user}', [AdminController::class, 'toggleActivation']);
    Route::get('admin/users', [AdminController::class, 'listUsers']);

    Route::post('admin/create-store', [AdminController::class, 'createStore']);
    Route::post('admin/create-lab-assistant', [AdminController::class, 'createLabAssistant']);

});
Route::middleware(['auth:sanctum', 'role:admin|superClerk', 'active'])->group(function () {
    Route::post('leave-balance/{employeeId}', [LeaveBalanceController::class, 'storeOrUpdate']);
    Route::put('leave-balance/{employeeId}', [LeaveBalanceController::class, 'storeOrUpdate']);
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


Route::middleware(['auth:sanctum', 'role:employee|faculty', 'active'])->group(function () {
    Route::post('leaves/apply', [LeaveController::class, 'apply']);
    Route::get('leaves/history', [LeaveController::class, 'history']);

    Route::get('leave-balance', [LeaveBalanceController::class, 'show']);
    Route::put('leave-balance', [LeaveBalanceController::class, 'update']);
});

// Clerk / SuperClerk routes
Route::middleware(['auth:sanctum', 'role:clerk|superClerk', 'active'])->group(function () {
    Route::put('leaves/status/{id}', [LeaveController::class, 'updateStatus']);
});
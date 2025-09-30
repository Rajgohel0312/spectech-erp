<?php

namespace App\Http\Controllers;

use App\Models\LeaveBalance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LeaveBalanceController extends Controller
{
    public function show()
    {
        $balance = LeaveBalance::firstOrCreate(
            ['employee_id' => Auth::id()],
            ['cl' => 12, 'sl' => 10, 'vl' => 5]
        );
        return response()->json($balance);
    }
    public function storeOrUpdate(Request $request, $employeeId)
    {
        $request->validate([
            'cl' => 'nullable|numeric|min:0',
            'sl' => 'nullable|numeric|min:0',
            'vl' => 'nullable|numeric|min:0',
        ]);

        $balance = LeaveBalance::updateOrCreate(
            ['employee_id' => $employeeId],
            [
                'cl' => $request->cl ?? 12,
                'sl' => $request->sl ?? 10,
                'vl' => $request->vl ?? 5,
            ]
        );

        return response()->json([
            'message' => 'Leave balance updated successfully',
            'balance' => $balance
        ]);
    }
}

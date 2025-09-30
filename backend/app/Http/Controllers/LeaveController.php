<?php

namespace App\Http\Controllers;

use App\Models\Leave;
use App\Models\LeaveBalance;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
class LeaveController extends Controller
{
    public function apply(Request $request)
    {
        $request->validate([
            'type' => 'required|in:sick,casual,earned',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string'
        ]);

        $leave = Leave::create([
            'employee_id' => Auth::id(),
            'type' => $request->type,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'reason' => $request->reason,
        ]);

        return response()->json(['message' => 'Leave applied successfully', 'leave' => $leave], 201);
    }

    // Employee fetches their own leave history
    public function history()
    {
        $leaves = Leave::where('employee_id', Auth::id())->latest()->get();
        return response()->json($leaves);
    }

    // Clerk / SuperClerk updates leave status
    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:pending,approved,rejected']);

        $leave = Leave::findOrFail($id);
        $leave->status = $request->status;
        $leave->save();

        // ✅ Deduct balance only if approved
        if ($request->status === 'approved') {
            $balance = LeaveBalance::firstOrCreate(
                ['employee_id' => $leave->employee_id],
                ['cl' => 12, 'sl' => 10, 'vl' => 5]
            );

            if ($leave->type === 'casual' && $balance->cl > 0) {
                $balance->cl -= 1;
            } elseif ($leave->type === 'sick' && $balance->sl > 0) {
                $balance->sl -= 1;
            } elseif ($leave->type === 'earned' && $balance->vl > 0) {
                $balance->vl -= 1;
            }

            $balance->save();
        }

        return response()->json(['message' => 'Leave status updated', 'leave' => $leave]);
    }


}

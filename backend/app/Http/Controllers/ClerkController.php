<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Carbon\Carbon;
class ClerkController extends Controller
{
    public function importStudents(Request $req)
    {
        $req->validate(['file' => 'required|file|mimes:csv,txt']);
        $path = $req->file('file')->getRealPath();
        $file = fopen($path, 'r');
        $header = null;
        $count = 0;

        while (($row = fgetcsv($file)) !== false) {
            if (!$header) {
                $header = array_map('strtolower', $row);
                continue;
            }
            $data = array_combine($header, $row);

            $enroll = trim($data['enrollment']);
            $dob = Carbon::parse($data['dob'])->format('Y-m-d');
            $defaultPassword = $enroll . Carbon::parse($dob)->format('Ymd');

            if (User::where('enrollment', $enroll)->exists())
                continue;

            $user = User::create([
                'name' => $data['name'],
                'enrollment' => $enroll,
                'dob' => $dob,
                'college_id' => $data['college_id'] ?? auth()->user()->college_id,
                'department_id' => $data['department_id'] ?? null,
                'password' => Hash::make($defaultPassword),
                'must_change_password' => true,
                'is_active' => true,
            ]);
            $user->assignRole('student');
            $count++;
        }
        fclose($file);
        return response()->json(['message' => "Imported $count students"]);
    }
}

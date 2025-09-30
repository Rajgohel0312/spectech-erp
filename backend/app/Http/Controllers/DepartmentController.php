<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
   public function index()
    {
        return Department::with('college')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'=>'required',
            'code'=>'required|unique:departments',
            'college_id'=>'required|exists:colleges,id'
        ]);
        $dept = Department::create($request->only('name','code','college_id'));
        return response()->json(['message'=>'Department created','department'=>$dept]);
    }

    public function update(Request $request, Department $department)
    {
        $request->validate([
            'name'=>'required',
            'code'=>"required|unique:departments,code,$department->id",
            'college_id'=>'required|exists:colleges,id'
        ]);
        $department->update($request->only('name','code','college_id'));
        return response()->json(['message'=>'Department updated','department'=>$department]);
    }

    public function destroy(Department $department)
    {
        $department->delete();
        return response()->json(['message'=>'Department deleted']);
    }
}

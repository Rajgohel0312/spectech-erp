<?php

namespace App\Http\Controllers;

use App\Models\College;
use Illuminate\Http\Request;

class CollegeController extends Controller
{
    public function index()
    {
        return College::with('departments')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'code' => 'required|unique:colleges'
        ]);
        $college = College::create($request->only('name', 'code'));
        return response()->json(['message' => 'College created', 'college' => $college]);
    }

    public function update(Request $request, College $college)
    {
        $request->validate([
            'name' => 'required',
            'code' => "required|unique:colleges,code,$college->id"
        ]);
        $college->update($request->only('name', 'code'));
        return response()->json(['message' => 'College updated', 'college' => $college]);
    }

    public function destroy(College $college)
    {
        $college->delete();
        return response()->json(['message' => 'College deleted']);
    }
}

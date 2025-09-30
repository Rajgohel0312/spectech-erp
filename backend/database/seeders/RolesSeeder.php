<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            'admin',
            'superClerk',
            'clerk',
            'superAccountant',
            'accountant',
            'faculty',
            'student',
            'employee',
            'labAssistant',
            'store',
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate([
                'name' => $role,
                'guard_name' => 'web', // important for user guard
            ]);
        }
    }
}

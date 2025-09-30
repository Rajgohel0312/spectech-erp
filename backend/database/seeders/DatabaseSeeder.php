<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ensure admin role exists
        Role::firstOrCreate(['name' => 'admin']);

        // Create default admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'System Admin',
                'password' => Hash::make('Admin@123'),
                'is_active' => true,
                'must_change_password' => true, // force change on first login
            ]
        );

        // Assign role if not already assigned
        if (!$admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }

        $this->command->info('✅ Admin user created: admin@example.com / Admin@123');
    }
}

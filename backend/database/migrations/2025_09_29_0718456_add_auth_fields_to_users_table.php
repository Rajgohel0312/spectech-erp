<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('employee_id')->nullable()->index();   // for staff
            $table->string('enrollment')->nullable()->index();    // for students
            $table->date('dob')->nullable();

            $table->boolean('is_active')->default(true);
            $table->boolean('must_change_password')->default(false);

            $table->foreignId('college_id')->nullable()->constrained('colleges')->nullOnDelete();
            $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();

            $table->string('temp_password_note')->nullable(); // (optional: for dev only, remove in prod)
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'employee_id',
                'enrollment',
                'dob',
                'is_active',
                'must_change_password',
                'college_id',
                'department_id',
                'temp_password_note'
            ]);
        });
    }
};

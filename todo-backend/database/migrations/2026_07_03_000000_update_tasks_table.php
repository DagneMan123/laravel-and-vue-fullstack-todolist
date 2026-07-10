<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Add activity_id if it doesn't exist
            if (!Schema::hasColumn('tasks', 'activity_id')) {
                $table->foreignId('activity_id')->nullable()->constrained()->onDelete('cascade')->after('id');
            }
            
            // Add project_id if it doesn't exist
            if (!Schema::hasColumn('tasks', 'project_id')) {
                $table->foreignId('project_id')->nullable()->constrained()->onDelete('cascade')->after('activity_id');
            }
            
            // Add due_time if it doesn't exist
            if (!Schema::hasColumn('tasks', 'due_time')) {
                $table->time('due_time')->nullable()->after('due_date');
            }
            
            // Add category_id if it doesn't exist
            if (!Schema::hasColumn('tasks', 'category_id')) {
                $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null')->after('project_id');
            }
            
            // Add notes if it doesn't exist
            if (!Schema::hasColumn('tasks', 'notes')) {
                $table->text('notes')->nullable()->after('description');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeignKeyIfExists(['activity_id']);
            $table->dropForeignKeyIfExists(['project_id']);
            $table->dropForeignKeyIfExists(['category_id']);
            $table->dropColumnIfExists(['activity_id', 'project_id', 'due_time', 'category_id', 'notes']);
        });
    }
};

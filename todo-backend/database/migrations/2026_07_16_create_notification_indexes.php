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
        Schema::table('notifications', function (Blueprint $table) {
            // Composite index for user_id + is_read (most common query)
            $table->index(['user_id', 'is_read']);
            
            // Index on user_id for general queries
            $table->index('user_id');
            
            // Index on is_read for filtering
            $table->index('is_read');
            
            // Index on created_at for sorting
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'is_read']);
            $table->dropIndex(['user_id']);
            $table->dropIndex(['is_read']);
            $table->dropIndex(['created_at']);
        });
    }
};

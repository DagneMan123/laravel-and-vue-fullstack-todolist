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
            // 💡 የድሮውን ዳታ ሳይነካ 'start_date'ን ከ priority በኃላ ይጨምራታል
            $table->date('start_date')->nullable()->after('priority');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // ወደ ኋላ መመለስ (Rollback) ቢፈለግ ኮለሟን መልሶ ያጠፋታል
            $table->dropColumn('start_date');
        });
    }
};

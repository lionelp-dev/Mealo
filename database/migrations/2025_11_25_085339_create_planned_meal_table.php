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
        Schema::create('planned_meals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('workspace_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('recipe_id')->constrained('recipes')->onDelete('cascade');
            $table->foreignId('meal_time_id')->constrained('meal_times')->onDelete('cascade');
            $table->date('planned_date');
            $table->integer('serving_size')->default(1);

            $table->timestamps();

            $table->index(['workspace_id', 'planned_date']);
            $table->unique(['user_id', 'workspace_id', 'recipe_id', 'meal_time_id', 'planned_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('planned_meals');
    }
};

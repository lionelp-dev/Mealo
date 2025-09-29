<?php

use App\Models\MealTime;
use App\Models\Recipe;
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
        Schema::create('recipe_meal_time', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Recipe::class)->constrained('recipe')->onDelete('CASCADE');
            $table->foreignIdFor(MealTime::class)->constrained('meal_times');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipe_meal_time');
    }
};

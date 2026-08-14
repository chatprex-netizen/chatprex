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
        Schema::create('finance_transactions', function (Blueprint $table) {
            $table->increments('id');
            $table->string('type'); // ingreso, egreso
            $table->string('category');
            $table->decimal('amount', 12, 2)->default(0);
            $table->date('date');
            $table->string('status'); // completado, pendiente
            $table->text('description')->nullable();
            
            // Relacionado opcionalmente con un deal/negocio
            $table->integer('lead_id')->unsigned()->nullable();
            // Relacionado opcionalmente con un proyecto
            $table->integer('project_id')->unsigned()->nullable();
            
            $table->timestamps();

            // $table->foreign('lead_id')->references('id')->on('leads')->onDelete('set null');
            // $table->foreign('project_id')->references('id')->on('projects')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('finance_transactions');
    }
};

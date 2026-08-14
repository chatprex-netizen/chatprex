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
        Schema::create('contracts', function (Blueprint $table) {
            $table->increments('id');
            $table->string('reference_number')->unique();
            $table->string('type'); // Separación, Compraventa, Alquiler
            $table->string('status'); // Borrador, Enviado, Firmado, Anulado
            
            // Relación con Contacto/Cliente
            $table->integer('person_id')->unsigned()->nullable();
            
            // Relación con Propiedad (si usamos tabla de propiedades)
            $table->string('property_id')->nullable();
            $table->string('property_title')->nullable();
            
            $table->decimal('value', 12, 2)->default(0);
            $table->date('created_date')->nullable();
            $table->date('due_date')->nullable();
            $table->timestamps();

            // En un caso real Krayin persons_table es un foreign key:
            // $table->foreign('person_id')->references('id')->on('persons')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};

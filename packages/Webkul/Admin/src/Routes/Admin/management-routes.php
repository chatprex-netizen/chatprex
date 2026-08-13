<?php

use Illuminate\Support\Facades\Route;
use Webkul\Admin\Http\Controllers\Management\PipelineController;
use Webkul\Admin\Http\Controllers\Management\SourceController;
use Webkul\Admin\Http\Controllers\Management\UserController;

/**
 * Management group routes.
 */
Route::prefix('management')->group(function () {
    /**
     * Management Users Routes.
     */
    Route::controller(UserController::class)->prefix('users')->group(function () {
        Route::get('', 'index')->name('admin.management.users.index');

        Route::post('create', 'store')->name('admin.management.users.store');

        Route::get('edit/{id?}', 'edit')->name('admin.management.users.edit');

        Route::put('edit/{id}', 'update')->name('admin.management.users.update');

        Route::get('search', 'search')->name('admin.management.users.search');

        Route::delete('{id}', 'destroy')->name('admin.management.users.delete');

        Route::post('mass-update', 'massUpdate')->name('admin.management.users.mass_update');

        Route::post('mass-destroy', 'massDestroy')->name('admin.management.users.mass_delete');
    });

    /**
     * Management Pipelines Routes.
     */
    Route::controller(PipelineController::class)->prefix('pipelines')->group(function () {
        Route::get('', 'index')->name('admin.management.pipelines.index');

        Route::get('create', 'create')->name('admin.management.pipelines.create');

        Route::post('create', 'store')->name('admin.management.pipelines.store');

        Route::get('edit/{id?}', 'edit')->name('admin.management.pipelines.edit');

        Route::post('edit/{id}', 'update')->name('admin.management.pipelines.update');

        Route::delete('{id}', 'destroy')->name('admin.management.pipelines.delete');
    });

    /**
     * Management Sources Routes.
     */
    Route::controller(SourceController::class)->prefix('sources')->group(function () {
        Route::get('', 'index')->name('admin.management.sources.index');

        Route::post('create', 'store')->name('admin.management.sources.store');

        Route::get('edit/{id?}', 'edit')->name('admin.management.sources.edit');

        Route::put('edit/{id}', 'update')->name('admin.management.sources.update');

        Route::delete('{id}', 'destroy')->name('admin.management.sources.delete');
    });
});

<?php

namespace Webkul\Admin\Http\Controllers\Management;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Event;
use Illuminate\View\View;
use Webkul\Admin\DataGrids\Management\SourceDataGrid;
use Webkul\Admin\Http\Controllers\Controller;
use Webkul\Lead\Repositories\SourceRepository;

class SourceController extends Controller
{
    public function __construct(protected SourceRepository $sourceRepository) {}

    public function index(): View|JsonResponse
    {
        if (request()->ajax()) {
            return datagrid(SourceDataGrid::class)->process();
        }

        return view('admin::management.sources.index');
    }

    public function store(): JsonResponse
    {
        $this->validate(request(), [
            'name' => ['required', 'unique:lead_sources,name'],
        ]);

        Event::dispatch('management.source.create.before');

        $source = $this->sourceRepository->create(request()->only(['name']));

        Event::dispatch('management.source.create.after', $source);

        return new JsonResponse([
            'data' => $source,
            'message' => trans('admin::app.management.sources.index.create-success'),
        ]);
    }

    public function edit(int $id): View|JsonResponse
    {
        $source = $this->sourceRepository->findOrFail($id);

        return new JsonResponse([
            'data' => $source,
        ]);
    }

    public function update(int $id): JsonResponse
    {
        $this->validate(request(), [
            'name' => 'required|unique:lead_sources,name,'.$id,
        ]);

        Event::dispatch('management.source.update.before', $id);

        $source = $this->sourceRepository->update(request()->only(['name']), $id);

        Event::dispatch('management.source.update.after', $source);

        return new JsonResponse([
            'data' => $source,
            'message' => trans('admin::app.management.sources.index.update-success'),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $source = $this->sourceRepository->findOrFail($id);

        if ($source->leads()->count() > 0) {
            return new JsonResponse([
                'message' => trans('admin::app.management.sources.index.delete-failed-associated-leads'),
            ], 400);
        }

        try {
            Event::dispatch('management.source.delete.before', $id);

            $source->delete();

            Event::dispatch('management.source.delete.after', $id);

            return new JsonResponse([
                'message' => trans('admin::app.management.sources.index.delete-success'),
            ], 200);
        } catch (Exception $exception) {
            return new JsonResponse([
                'message' => trans('admin::app.management.sources.index.delete-failed'),
            ], 400);
        }
    }
}

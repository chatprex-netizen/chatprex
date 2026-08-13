<?php

namespace Webkul\Admin\Http\Controllers\Management;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Event;
use Illuminate\View\View;
use Webkul\Admin\DataGrids\Management\PipelineDataGrid;
use Webkul\Admin\Http\Controllers\Controller;
use Webkul\Admin\Http\Requests\PipelineForm;
use Webkul\Lead\Repositories\PipelineRepository;

class PipelineController extends Controller
{
    public function __construct(protected PipelineRepository $pipelineRepository) {}

    public function index(): View|JsonResponse
    {
        if (request()->ajax()) {
            return datagrid(PipelineDataGrid::class)->process();
        }

        return view('admin::management.pipelines.index');
    }

    public function create(): View
    {
        return view('admin::management.pipelines.create');
    }

    public function store(PipelineForm $request): RedirectResponse
    {
        $request->validated();

        $request->merge([
            'is_default' => request()->has('is_default') ? 1 : 0,
        ]);

        Event::dispatch('management.pipeline.create.before');

        $pipeline = $this->pipelineRepository->create($request->all());

        Event::dispatch('management.pipeline.create.after', $pipeline);

        session()->flash('success', trans('admin::app.management.pipelines.index.create-success'));

        return redirect()->route('admin.management.pipelines.index');
    }

    public function edit(int $id): View
    {
        $pipeline = $this->pipelineRepository->findOrFail($id);

        return view('admin::management.pipelines.edit', compact('pipeline'));
    }

    public function update(PipelineForm $request, int $id): RedirectResponse
    {
        $request->validated();

        $isDefault = request()->has('is_default') ? 1 : 0;

        if (! $isDefault) {
            $defaultCount = $this->pipelineRepository->findWhere(['is_default' => 1])->count();

            $pipeline = $this->pipelineRepository->find($id);

            if (
                $defaultCount === 1
                && $pipeline->is_default
            ) {
                session()->flash('error', trans('admin::app.management.pipelines.index.default-required'));

                return redirect()->back();
            }
        }

        $request->merge(['is_default' => $isDefault]);

        Event::dispatch('management.pipeline.update.before', $id);

        $pipeline = $this->pipelineRepository->update($request->all(), $id);

        Event::dispatch('management.pipeline.update.after', $pipeline);

        session()->flash('success', trans('admin::app.management.pipelines.index.update-success'));

        return redirect()->route('admin.management.pipelines.index');
    }

    public function destroy($id): JsonResponse
    {
        $pipeline = $this->pipelineRepository->findOrFail($id);

        if ($pipeline->is_default) {
            return response()->json([
                'message' => trans('admin::app.management.pipelines.index.default-delete-error'),
            ], 400);
        } else {
            $defaultPipeline = $this->pipelineRepository->getDefaultPipeline();

            $pipeline->leads()->update([
                'lead_pipeline_id' => $defaultPipeline->id,
                'lead_pipeline_stage_id' => $defaultPipeline->stages()->first()->id,
            ]);
        }

        try {
            Event::dispatch('management.pipeline.delete.before', $id);

            $this->pipelineRepository->delete($id);

            Event::dispatch('management.pipeline.delete.after', $id);

            return response()->json([
                'message' => trans('admin::app.management.pipelines.index.delete-success'),
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'message' => trans('admin::app.management.pipelines.index.delete-failed'),
            ], 400);
        }

        return response()->json([
            'message' => trans('admin::app.management.pipelines.index.delete-failed'),
        ], 400);
    }
}

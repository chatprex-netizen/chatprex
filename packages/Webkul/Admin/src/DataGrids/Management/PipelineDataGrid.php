<?php

namespace Webkul\Admin\DataGrids\Management;

use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;
use Webkul\DataGrid\DataGrid;

class PipelineDataGrid extends DataGrid
{
    public function prepareQueryBuilder(): Builder
    {
        $queryBuilder = DB::table('lead_pipelines')
            ->addSelect(
                'lead_pipelines.id',
                'lead_pipelines.name',
                'lead_pipelines.rotten_days',
                'lead_pipelines.is_default',
            );

        $this->addFilter('id', 'lead_pipelines.id');

        return $queryBuilder;
    }

    public function prepareColumns(): void
    {
        $this->addColumn([
            'index' => 'id',
            'label' => trans('admin::app.management.pipelines.index.datagrid.id'),
            'type' => 'string',
            'sortable' => true,
        ]);

        $this->addColumn([
            'index' => 'name',
            'label' => trans('admin::app.management.pipelines.index.datagrid.name'),
            'type' => 'string',
            'searchable' => true,
            'filterable' => true,
            'sortable' => true,
        ]);

        $this->addColumn([
            'index' => 'rotten_days',
            'label' => trans('admin::app.management.pipelines.index.datagrid.rotten-days'),
            'type' => 'string',
            'sortable' => true,
        ]);

        $this->addColumn([
            'index' => 'is_default',
            'label' => trans('admin::app.management.pipelines.index.datagrid.is-default'),
            'type' => 'boolean',
            'searchable' => true,
            'filterable' => true,
            'sortable' => true,
            'closure' => fn ($value) => trans('admin::app.management.pipelines.index.datagrid.'.($value->is_default ? 'yes' : 'no')),
        ]);
    }

    public function prepareActions(): void
    {
        if (bouncer()->hasPermission('settings.lead.pipelines.edit')) {
            $this->addAction([
                'index' => 'edit',
                'icon' => 'icon-edit',
                'title' => trans('admin::app.management.pipelines.index.datagrid.edit'),
                'method' => 'GET',
                'url' => fn ($row) => route('admin.management.pipelines.edit', $row->id),
            ]);
        }

        if (bouncer()->hasPermission('settings.lead.pipelines.delete')) {
            $this->addAction([
                'index' => 'delete',
                'icon' => 'icon-delete',
                'title' => trans('admin::app.management.pipelines.index.datagrid.delete'),
                'method' => 'DELETE',
                'url' => fn ($row) => route('admin.management.pipelines.delete', $row->id),
            ]);
        }
    }
}

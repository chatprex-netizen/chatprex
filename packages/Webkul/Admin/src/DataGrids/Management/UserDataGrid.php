<?php

namespace Webkul\Admin\DataGrids\Management;

use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Webkul\DataGrid\DataGrid;

class UserDataGrid extends DataGrid
{
    public function prepareQueryBuilder(): Builder
    {
        $queryBuilder = DB::table('users')
            ->distinct()
            ->addSelect(
                'id',
                'name',
                'email',
                'image',
                'status',
                'created_at'
            )
            ->leftJoin('user_groups', 'id', '=', 'user_groups.user_id');

        if ($userIds = bouncer()->getAuthorizedUserIds()) {
            $queryBuilder->whereIn('id', $userIds);
        }

        return $queryBuilder;
    }

    public function prepareColumns(): void
    {
        $this->addColumn([
            'index' => 'id',
            'label' => trans('admin::app.management.users.index.datagrid.id'),
            'type' => 'string',
            'sortable' => true,
        ]);

        $this->addColumn([
            'index' => 'name',
            'label' => trans('admin::app.management.users.index.datagrid.name'),
            'type' => 'string',
            'sortable' => true,
            'searchable' => true,
            'filterable' => true,
            'closure' => function ($row) {
                return [
                    'image' => $row->image ? Storage::url($row->image) : null,
                    'name' => $row->name,
                ];
            },
        ]);

        $this->addColumn([
            'index' => 'email',
            'label' => trans('admin::app.management.users.index.datagrid.email'),
            'type' => 'string',
            'sortable' => true,
            'searchable' => true,
            'filterable' => true,
        ]);

        $this->addColumn([
            'index' => 'status',
            'label' => trans('admin::app.management.users.index.datagrid.status'),
            'type' => 'boolean',
            'filterable' => true,
            'sortable' => true,
            'searchable' => true,
        ]);

        $this->addColumn([
            'index' => 'created_at',
            'label' => trans('admin::app.management.users.index.datagrid.created-at'),
            'type' => 'date',
            'sortable' => true,
            'searchable' => true,
            'filterable_type' => 'date_range',
            'filterable' => true,
        ]);
    }

    public function prepareActions(): void
    {
        if (bouncer()->hasPermission('settings.user.users.edit')) {
            $this->addAction([
                'index' => 'edit',
                'icon' => 'icon-edit',
                'title' => trans('admin::app.management.users.index.datagrid.edit'),
                'method' => 'GET',
                'url' => fn ($row) => route('admin.management.users.edit', $row->id),
            ]);
        }

        if (bouncer()->hasPermission('settings.user.users.delete')) {
            $this->addAction([
                'index' => 'delete',
                'icon' => 'icon-delete',
                'title' => trans('admin::app.management.users.index.datagrid.delete'),
                'method' => 'DELETE',
                'url' => fn ($row) => route('admin.management.users.delete', $row->id),
            ]);
        }
    }

    public function prepareMassActions(): void
    {
        $this->addMassAction([
            'icon' => 'icon-delete',
            'title' => trans('admin::app.management.users.index.datagrid.delete'),
            'method' => 'POST',
            'url' => route('admin.management.users.mass_delete'),
        ]);

        $this->addMassAction([
            'title' => trans('admin::app.management.users.index.datagrid.update-status'),
            'method' => 'POST',
            'url' => route('admin.management.users.mass_update'),
            'options' => [
                [
                    'label' => trans('admin::app.management.users.index.datagrid.active'),
                    'value' => 1,
                ],
                [
                    'label' => trans('admin::app.management.users.index.datagrid.inactive'),
                    'value' => 0,
                ],
            ],
        ]);
    }
}

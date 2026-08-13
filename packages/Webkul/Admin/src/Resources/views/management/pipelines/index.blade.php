<x-admin::layouts>
    <x-slot:title>
        @lang('admin::app.management.pipelines.index.title')
    </x-slot>

    <div class="flex flex-col gap-4">
        <div class="scroll-reactive-sticky sticky top-[60px] z-[1000] flex items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <div class="flex flex-col gap-2">
                {!! view_render_event('admin.management.pipelines.index.breadcrumbs.before') !!}

                <x-admin::breadcrumbs name="management.pipelines" />

                {!! view_render_event('admin.management.pipelines.index.breadcrumbs.after') !!}

                <div class="text-xl font-bold dark:text-white">
                    @lang('admin::app.management.pipelines.index.title')
                </div>
            </div>

            <div class="flex items-center gap-x-2.5">
                <div class="flex items-center gap-x-2.5">
                    {!! view_render_event('admin.management.pipelines.index.create_button.before') !!}
                    
                    @if (bouncer()->hasPermission('settings.lead.pipelines.create'))
                        <a
                            href="{{ route('admin.management.pipelines.create') }}"
                            class="primary-button"
                        >
                            @lang('admin::app.management.pipelines.index.create-btn')
                        </a>
                    @endif

                    {!! view_render_event('admin.management.pipelines.index.create_button.after') !!}
                </div>
            </div>
        </div>

        {!! view_render_event('admin.management.pipelines.index.datagrid.before') !!}

        <x-admin::datagrid :src="route('admin.management.pipelines.index')">
            <x-admin::shimmer.datagrid />
        </x-admin::datagrid>
        
        {!! view_render_event('admin.management.pipelines.index.datagrid.after') !!}
    </div>
</x-admin::layouts>

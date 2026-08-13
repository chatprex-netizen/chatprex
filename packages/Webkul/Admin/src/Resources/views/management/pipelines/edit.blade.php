<x-admin::layouts>
    <x-slot:title>
        @lang('admin::app.management.pipelines.edit.title')
    </x-slot>

    {!! view_render_event('admin.management.pipelines.edit.form.before', ['pipeline' => $pipeline]) !!}

    <x-admin::form
        :action="route('admin.management.pipelines.update', $pipeline->id)"
        method="POST"
    >
        @csrf
        @method('PUT')

        <div class="flex flex-col gap-2 rounded-lg border border-gray-300 bg-white text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <div class="flex items-center justify-between px-4 py-2">
                <div class="flex flex-col gap-2">
                    {!! view_render_event('admin.management.pipelines.edit.breadcrumbs.before', ['pipeline' => $pipeline]) !!}

                    <x-admin::breadcrumbs 
                        name="management.pipelines.edit"
                        :entity="$pipeline"
                    />

                    {!! view_render_event('admin.management.pipelines.edit.breadcrumbs.after', ['pipeline' => $pipeline]) !!}

                    <div class="text-xl font-bold dark:text-white">
                        @lang('admin::app.management.pipelines.edit.title')
                    </div>
                </div>

                <div class="flex items-center gap-x-2.5">
                    <div class="flex items-center gap-x-2.5">
                        {!! view_render_event('admin.management.pipelines.edit.save_button.before', ['pipeline' => $pipeline]) !!}

                        <button
                            type="submit"
                            class="primary-button"
                        >
                            @lang('admin::app.management.pipelines.edit.save-btn')
                        </button>

                        {!! view_render_event('admin.management.pipelines.edit.save_button.after', ['pipeline' => $pipeline]) !!}
                    </div>
                </div>
            </div>

            <div class="flex gap-4 border-t border-gray-300 px-4 py-2 align-top dark:border-gray-800 max-sm:flex-wrap">
                {!! view_render_event('admin.management.pipelines.edit.form.name.before', ['pipeline' => $pipeline]) !!}

                <x-admin::form.control-group>
                    <x-admin::form.control-group.label class="required">
                        @lang('admin::app.management.pipelines.edit.name')
                    </x-admin::form.control-group.label>

                    <x-admin::form.control-group.control
                        type="text"
                        name="name"
                        id="name"
                        rules="required"
                        :label="trans('admin::app.management.pipelines.edit.name')"
                        :placeholder="trans('admin::app.management.pipelines.edit.name')"
                        value="{{ old('name') ?: $pipeline->name }}"
                    />

                    <x-admin::form.control-group.error control-name="name" />
                </x-admin::form.control-group>

                {!! view_render_event('admin.management.pipelines.edit.form.name.after', ['pipeline' => $pipeline]) !!}

                {!! view_render_event('admin.management.pipelines.edit.form.rotten_days.before', ['pipeline' => $pipeline]) !!}
                
                <x-admin::form.control-group>
                    <x-admin::form.control-group.label class="required">
                        @lang('admin::app.management.pipelines.edit.rotten-days')
                    </x-admin::form.control-group.label>

                    <x-admin::form.control-group.control
                        type="text"
                        name="rotten_days"
                        id="rotten_days"
                        rules="required|numeric|min_value:1"
                        :label="trans('admin::app.management.pipelines.edit.rotten-days')"
                        :placeholder="trans('admin::app.management.pipelines.edit.rotten-days')"
                        value="{{ old('rotten_days') ?: $pipeline->rotten_days }}"
                    />

                    <x-admin::form.control-group.error control-name="rotten_days" />
                </x-admin::form.control-group>

                {!! view_render_event('admin.management.pipelines.edit.form.rotten_days.after', ['pipeline' => $pipeline]) !!}

                {!! view_render_event('admin.management.pipelines.edit.form.is_default.before', ['pipeline' => $pipeline]) !!}

                <x-admin::form.control-group class="mt-4 flex items-center gap-4">
                    <x-admin::form.control-group.label class="mb-0">
                        @lang('admin::app.management.pipelines.edit.mark-as-default')
                    </x-admin::form.control-group.label>

                    <x-admin::form.control-group.control
                        type="switch"
                        class="cursor-pointer"
                        name="is_default"
                        id="is_default"
                        value="1"
                        :checked="(boolean) $pipeline->is_default"
                        :label="trans('admin::app.management.pipelines.edit.mark-as-default')"
                    />

                    <x-admin::form.control-group.error control-name="is_default" />
                </x-admin::form.control-group>

                {!! view_render_event('admin.management.pipelines.edit.form.is_default.after', ['pipeline' => $pipeline]) !!}
            </div>
        </div>

        <div class="flex gap-2.5 overflow-auto py-3.5 max-xl:flex-wrap">
            <!-- Stages Component -->
            <v-stages-management-component>
                <x-admin::shimmer.pipelines.kanban />
            </v-stages-management-component>
        </div>
    </x-admin::form>

    {!! view_render_event('admin.management.pipelines.edit.form.after', ['pipeline' => $pipeline]) !!}

    @pushOnce('scripts')
        <script
            type="text/x-template"
            id="v-stages-management-component-template"
        >
            <div class="flex gap-4">
                <draggable
                    tag="div"
                    ghost-class="draggable-ghost"
                    :handle="isAnyDraggable ? '.icon-move' : ''"
                    v-bind="{animation: 200}"
                    item-key="id"
                    :list="stages"
                    :move="handleDragging"
                    class="flex gap-4"
                >
                    <template #item="{ element, index }">
                        <div ::class="{ draggable: isDragable(element) }" class="flex gap-4 overflow-x-auto">
                            <div class="flex min-w-[275px] max-w-[275px] flex-col justify-between rounded-lg border border-gray-300 bg-white dark:border-gray-800 dark:bg-gray-900">
                                <div class="flex flex-col gap-6 px-4 py-3">
                                    <div class="flex items-center justify-between">
                                        <span class="py-1 font-medium dark:text-gray-300">
                                            @{{ element.name ? element.name : '@lang('admin::app.management.pipelines.create.newly-added')' }} 
                                        </span>

                                        <i
                                            v-if="isDragable(element)" 
                                            class="icon-move cursor-grab rounded-md p-1 text-2xl transition-all hover:bg-gray-100 dark:hover:bg-gray-950"
                                        >
                                        </i>
                                    </div>
                                    
                                    <div>
                                        <input
                                            type="hidden"
                                            :value="slugify(element.code ? element.code : element.name)"
                                            :name="'stages[' + element.id + '][code]'"
                                        />

                                        {!! view_render_event('admin.management.pipelines.edit.form.stages.name.before', ['pipeline' => $pipeline]) !!}

                                        <x-admin::form.control-group>
                                            <x-admin::form.control-group.label class="required">
                                                @lang('admin::app.management.pipelines.edit.name')
                                            </x-admin::form.control-group.label>
                                            
                                            <x-admin::form.control-group.control
                                                type="text"
                                                ::name="'stages[' + element.id + '][name]'"
                                                v-model="element['name']"
                                                ::rules="{ required: true, unique_name: stages, min: 0, max: 100 }"
                                                :label="trans('admin::app.management.pipelines.edit.name')"
                                            />

                                            <x-admin::form.control-group.error ::name="'stages[' + element.id + '][name]'" />
                                        </x-admin::form.control-group>

                                        {!! view_render_event('admin.management.pipelines.edit.form.stages.name.after', ['pipeline' => $pipeline]) !!}

                                        <input
                                            type="hidden"
                                            :value="index + 1"
                                            :name="'stages[' + element.id + '][sort_order]'"
                                        />

                                        {!! view_render_event('admin.management.pipelines.edit.form.stages.probability.before', ['pipeline' => $pipeline]) !!}

                                        <x-admin::form.control-group>
                                            <x-admin::form.control-group.label class="required">
                                                @lang('admin::app.management.pipelines.edit.probability')
                                            </x-admin::form.control-group.label>

                                            <x-admin::form.control-group.control
                                                type="text"
                                                ::name="'stages[' + element.id + '][probability]'"
                                                v-model="element['probability']"
                                                rules="required|numeric|min_value:0|max_value:100"
                                                ::readonly="element?.code != 'new'"
                                                :label="trans('admin::app.management.pipelines.create.probability')"
                                            />
                                            <x-admin::form.control-group.error ::name="'stages[' + element.id + '][probability]'" />
                                        </x-admin::form.control-group>

                                        {!! view_render_event('admin.management.pipelines.edit.form.stages.probability.after', ['pipeline' => $pipeline]) !!}
                                    </div>
                                </div>
                                
                                {!! view_render_event('admin.management.pipelines.edit.form.stages.remove_button.before', ['pipeline' => $pipeline]) !!}

                                <div
                                    class="flex cursor-pointer items-center gap-2 border-t border-gray-300 p-2 text-red-600 dark:border-gray-800" 
                                    @click="remove(element)"
                                    v-if="isDragable(element)"
                                >
                                    <i class="icon-delete text-2xl"></i>
                                    
                                    @lang('admin::app.management.pipelines.edit.delete-stage')
                                </div>

                                {!! view_render_event('admin.management.pipelines.edit.form.stages.remove_button.after', ['pipeline' => $pipeline]) !!}
                            </div>
                        </div>

                    </template>
                </draggable>

                <div class="flex min-h-[400px] min-w-[275px] max-w-[275px] flex-col items-center justify-center gap-1 rounded-lg border border-gray-300 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <div class="flex flex-col items-center justify-center gap-6 px-4 py-3">
                        <div class="grid justify-center justify-items-center gap-3.5 text-center">
                            <div class="flex flex-col items-center gap-2">
                                <p class="text-xl font-semibold dark:text-gray-300">
                                    @lang('admin::app.management.pipelines.edit.add-new-stages')
                                </p>

                                <p class="text-gray-400">
                                    @lang('admin::app.management.pipelines.edit.add-stage-info')
                                </p>
                            </div>

                            {!! view_render_event('admin.management.pipelines.edit.form.stages.create_button.before', ['pipeline' => $pipeline]) !!}

                            <button
                                class="secondary-button"
                                @click="addStage"
                                type="button"
                            >
                                @lang('admin::app.management.pipelines.edit.stage-btn')
                            </button>

                            {!! view_render_event('admin.management.pipelines.edit.form.stages.create_button.after', ['pipeline' => $pipeline]) !!}
                        </div>
                    </div>
                </div>
            </div>
        </script>

        <script type="module">
            app.component('v-stages-management-component', {
                template: '#v-stages-management-component-template',

                data() {
                    return {
                        stages: @json($pipeline->stages),

                        stageCount: 1,

                        isAnyDraggable: true,
                    }
                },

                created() {
                    this.extendValidations();
                },

                methods: {
                    addStage() {
                        this.stages.splice((this.stages.length - 2), 0, {
                            'id': 'stage_' + this.stageCount++,
                            'code': '',
                            'name': '',
                            'probability': 100,
                        });
                    },

                    remove(stage) {
                        this.$emitter.emit('open-confirm-modal', {
                            agree: () => {
                                let tempStages = this.stages.filter(item => item.id !== stage.id);

                                this.stages = [];

                                this.$nextTick(() => this.stages = tempStages);

                                this.removeUniqueNameErrors();
                            },
                        });
                    },

                    slugify(name) {
                        return name
                            .toString()
                            .toLowerCase()
                            .replace(/[^\w\u0621-\u064A\u4e00-\u9fa5\u3402-\uFA6D\u3041-\u30A0\u30A0-\u31FF- ]+/g, '')
                            .replace(/ +/g, '-')
                            .replace('![-\s]+!u', '-')
                            .trim();
                    },

                    extendValidations() {
                        defineRule('unique_name', (value, stages) => {
                            if (
                                ! value
                                || ! value.length
                            ) {
                                return true;
                            }

                            let filteredStages = stages.filter((stage) => {
                                return stage.name.toLowerCase() === value.toLowerCase();
                            });

                            if (filteredStages.length > 1) {
                                return "{!! trans('admin::app.management.pipelines.create.duplicate-name') !!}";
                            }

                            this.removeUniqueNameErrors();

                            return true;
                        });
                    },

                    isDuplicateStageNameExists() {
                        let stageNames = this.stages.map((stage) => stage.name);

                        return stageNames.some((name, index) => stageNames.indexOf(name) !== index);
                    },

                    removeUniqueNameErrors() {
                        if (
                            ! this.isDuplicateStageNameExists()
                            && this.errors
                            && Array.isArray(this.errors.items)
                        ) {
                            const uniqueNameErrorIds = this.errors.items
                                .filter(error => error.rule === 'unique_name')
                                .map(error => error.id);

                            uniqueNameErrorIds.forEach(id => this.errors.removeById(id));
                        }
                    },

                    handleDragging(event) {
                        const draggedElement = event.draggedContext.element;
                        
                        const relatedElement = event.relatedContext.element;

                        return this.isDragable(draggedElement) && this.isDragable(relatedElement);
                    },

                    isDragable(stage) {
                        if (stage.code == 'new' || stage.code == 'won' || stage.code == 'lost') {
                            return false;
                        }

                        return true;
                    },
                },
            })
        </script>
    @endPushOnce
</x-admin::layouts>

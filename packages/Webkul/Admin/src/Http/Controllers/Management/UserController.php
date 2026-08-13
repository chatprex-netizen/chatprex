<?php

namespace Webkul\Admin\Http\Controllers\Management;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;
use Illuminate\View\View;
use Prettus\Repository\Criteria\RequestCriteria;
use Webkul\Admin\DataGrids\Management\UserDataGrid;
use Webkul\Admin\Http\Controllers\Controller;
use Webkul\Admin\Http\Requests\MassDestroyRequest;
use Webkul\Admin\Http\Requests\MassUpdateRequest;
use Webkul\Admin\Http\Resources\UserResource;
use Webkul\Admin\Notifications\User\Create as UserCreatedNotification;
use Webkul\User\Repositories\GroupRepository;
use Webkul\User\Repositories\RoleRepository;
use Webkul\User\Repositories\UserRepository;

class UserController extends Controller
{
    public function __construct(
        protected UserRepository $userRepository,
        protected GroupRepository $groupRepository,
        protected RoleRepository $roleRepository
    ) {}

    public function index(): View|JsonResponse
    {
        if (request()->ajax()) {
            return datagrid(UserDataGrid::class)->process();
        }

        $roles = $this->roleRepository->all();

        $groups = $this->groupRepository->all();

        return view('admin::management.users.index', compact('roles', 'groups'));
    }

    public function store(): View|JsonResponse
    {
        $this->validate(request(), [
            'email' => 'required|email|unique:users,email',
            'name' => 'required',
            'password' => 'nullable',
            'confirm_password' => 'nullable|required_with:password|same:password',
            'role_id' => 'required',
            'status' => 'boolean|in:0,1',
            'view_permission' => 'string|in:global,group,individual',
            'groups' => 'required_if:view_permission,group|array',
            'groups.*' => 'integer|exists:groups,id',
        ]);

        $data = request()->all();

        if (
            isset($data['password'])
            && $data['password']
        ) {
            $data['password'] = bcrypt($data['password']);
        }

        Event::dispatch('management.user.create.before');

        $admin = $this->userRepository->create($data);

        $admin->groups()->sync($data['groups'] ?? []);

        try {
            Mail::queue(new UserCreatedNotification($admin));
        } catch (\Exception $e) {
            report($e);
        }

        Event::dispatch('management.user.create.after', $admin);

        return new JsonResponse([
            'data' => $admin,
            'message' => trans('admin::app.management.users.index.create-success'),
        ]);
    }

    public function edit(int $id): View|JsonResponse
    {
        $admin = $this->userRepository->with(['role', 'groups'])->findOrFail($id);

        return new JsonResponse([
            'data' => $admin,
        ]);
    }

    public function update(int $id): JsonResponse
    {
        $this->validate(request(), [
            'email' => 'required|email|unique:users,email,'.$id,
            'name' => 'required|string',
            'password' => 'nullable|string|min:6',
            'confirm_password' => 'nullable|required_with:password|same:password',
            'role_id' => 'required|integer|exists:roles,id',
            'status' => 'nullable|boolean|in:0,1',
            'view_permission' => 'required|string|in:global,group,individual',
            'groups' => 'required_if:view_permission,group|array',
            'groups.*' => 'integer|exists:groups,id',
        ]);

        $data = request()->all();

        if (empty($data['password'])) {
            $data = Arr::except($data, ['password', 'confirm_password']);
        } else {
            $data['password'] = bcrypt($data['password']);
        }

        $authUser = auth()->guard('user')->user();

        if ($authUser->id == $id) {
            $data['status'] = true;
        }

        Event::dispatch('management.user.update.before', $id);

        $admin = $this->userRepository->update($data, $id);

        $admin->groups()->sync($data['groups'] ?? []);

        Event::dispatch('management.user.update.after', $admin);

        return new JsonResponse([
            'data' => $admin,
            'message' => trans('admin::app.management.users.index.update-success'),
        ]);
    }

    public function search(): JsonResource
    {
        $users = $this->userRepository
            ->pushCriteria(app(RequestCriteria::class))
            ->all();

        return UserResource::collection($users);
    }

    public function destroy(int $id): JsonResponse
    {
        if ($this->userRepository->count() == 1) {
            return new JsonResponse([
                'message' => trans('admin::app.management.users.index.last-delete-error'),
            ], 400);
        }

        try {
            Event::dispatch('user.admin.delete.before', $id);

            $this->userRepository->delete($id);

            Event::dispatch('user.admin.delete.after', $id);

            return new JsonResponse([
                'message' => trans('admin::app.management.users.index.delete-success'),
            ], 200);
        } catch (\Exception $e) {
        }

        return new JsonResponse([
            'message' => trans('admin::app.management.users.index.delete-failed'),
        ], 500);
    }

    public function massUpdate(MassUpdateRequest $massDestroyRequest): JsonResponse
    {
        $count = 0;

        $users = $this->userRepository->findWhereIn('id', $massDestroyRequest->input('indices'));

        foreach ($users as $users) {
            if (auth()->guard('user')->user()->id == $users->id) {
                continue;
            }

            Event::dispatch('management.user.update.before', $users->id);

            $this->userRepository->update([
                'status' => $massDestroyRequest->input('value'),
            ], $users->id);

            Event::dispatch('management.user.update.after', $users->id);

            $count++;
        }

        if (! $count) {
            return response()->json([
                'message' => trans('admin::app.management.users.index.mass-update-failed'),
            ], 400);
        }

        return response()->json([
            'message' => trans('admin::app.management.users.index.mass-update-success'),
        ]);
    }

    public function massDestroy(MassDestroyRequest $massDestroyRequest): JsonResponse
    {
        $count = 0;

        $users = $this->userRepository->findWhereIn('id', $massDestroyRequest->input('indices'));

        foreach ($users as $user) {
            if (auth()->guard('user')->user()->id == $user->id) {
                continue;
            }

            Event::dispatch('management.user.delete.before', $user->id);

            $this->userRepository->delete($user->id);

            Event::dispatch('management.user.delete.after', $user->id);

            $count++;
        }

        if (! $count) {
            return response()->json([
                'message' => trans('admin::app.management.users.index.mass-delete-failed'),
            ], 400);
        }

        return response()->json([
            'message' => trans('admin::app.management.users.index.mass-delete-success'),
        ]);
    }
}

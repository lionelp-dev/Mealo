import { useAdminUsersContext } from '../infrastructure/inertia.adapter';
import { AppMainContent } from '@/app/components/app-main-content';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import AdminLayout from '@/app/layouts/admin-layout';
import adminUsers from '@/routes/admin/users';
import adminUsersDemo from '@/routes/admin/users/demo';
import type { UserResource } from '@/types/generated';
import { Head, router } from '@inertiajs/react';
import { CalendarClock, Search, Trash2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

function formatDate(value: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString();
}

function UserTypeBadge({ user }: { user: UserResource }) {
  if (user.is_admin)
    return <span className="badge badge-sm badge-primary">Admin</span>;
  if (user.is_demo)
    return <span className="badge badge-sm badge-warning">Demo</span>;
  return <span className="badge badge-ghost badge-sm">User</span>;
}

export default function AdminUsersView() {
  const { users, filters } = useAdminUsersContext();

  const [search, setSearch] = useState(filters.search ?? '');
  const [userToDelete, setUserToDelete] = useState<UserResource | null>(null);
  const [detailUser, setDetailUser] = useState<UserResource | null>(null);

  useEffect(() => {
    if (search === (filters.search ?? '')) return;
    const timeout = setTimeout(() => {
      router.get(
        adminUsers.index.url(),
        { search },
        { preserveState: true, preserveScroll: true, replace: true },
      );
    }, 350);
    return () => clearTimeout(timeout);
  }, [search, filters.search]);

  const confirmDelete = () => {
    if (!userToDelete) return;
    router.delete(adminUsers.destroy(userToDelete.id).url, {
      preserveScroll: true,
      onFinish: () => setUserToDelete(null),
    });
  };

  const extendDemo = (user: UserResource) => {
    router.post(
      adminUsersDemo.extend(user.id).url,
      {},
      { preserveScroll: true },
    );
  };

  const revokeDemo = (user: UserResource) => {
    router.post(
      adminUsersDemo.revoke(user.id).url,
      {},
      { preserveScroll: true },
    );
  };

  return (
    <AdminLayout>
      <Head title="Users" />

      <AppMainContent>
        <div className="grid gap-6">
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-muted-foreground">
              Manage platform users and demo accounts
            </p>
          </div>

          <label className="input-bordered input flex max-w-sm items-center gap-2">
            <Search className="h-4 w-4 opacity-60" />
            <input
              type="text"
              className="grow"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Recipes</th>
                  <th>Workspaces</th>
                  <th>Joined</th>
                  <th>Demo expires</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.data.map((user) => (
                  <tr key={user.id} className="hover">
                    <td>
                      <button
                        className="link font-medium link-hover"
                        onClick={() => setDetailUser(user)}
                      >
                        {user.name}
                      </button>
                    </td>
                    <td className="text-muted-foreground">{user.email}</td>
                    <td>
                      <UserTypeBadge user={user} />
                    </td>
                    <td>{user.recipes_count}</td>
                    <td>{user.workspaces_count}</td>
                    <td>{formatDate(user.created_at)}</td>
                    <td>{formatDate(user.demo_expires_at)}</td>
                    <td>
                      <div className="flex justify-end gap-1">
                        {user.is_demo && (
                          <>
                            <button
                              className="btn btn-ghost btn-xs"
                              title="Extend demo"
                              onClick={() => extendDemo(user)}
                            >
                              <CalendarClock className="h-4 w-4" />
                            </button>
                            <button
                              className="btn text-warning btn-ghost btn-xs"
                              title="Revoke demo"
                              onClick={() => revokeDemo(user)}
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {!user.is_admin && (
                          <button
                            className="btn text-error btn-ghost btn-xs"
                            title="Delete user"
                            onClick={() => setUserToDelete(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.data.length === 0 && (
              <div className="py-10 text-center text-muted-foreground">
                No users found.
              </div>
            )}
          </div>
        </div>
      </AppMainContent>

      {/* Details dialog */}
      <Dialog
        open={detailUser !== null}
        onOpenChange={(open) => !open && setDetailUser(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{detailUser?.name}</DialogTitle>
          </DialogHeader>
          {detailUser && (
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <dt className="text-muted-foreground">Email</dt>
              <dd>{detailUser.email}</dd>
              <dt className="text-muted-foreground">Type</dt>
              <dd>
                <UserTypeBadge user={detailUser} />
              </dd>
              <dt className="text-muted-foreground">Recipes</dt>
              <dd>{detailUser.recipes_count}</dd>
              <dt className="text-muted-foreground">Workspaces</dt>
              <dd>{detailUser.workspaces_count}</dd>
              <dt className="text-muted-foreground">Joined</dt>
              <dd>{formatDate(detailUser.created_at)}</dd>
              {detailUser.is_demo && (
                <>
                  <dt className="text-muted-foreground">Demo expires</dt>
                  <dd>{formatDate(detailUser.demo_expires_at)}</dd>
                </>
              )}
            </dl>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={userToDelete !== null}
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete user</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently delete{' '}
            <span className="font-medium">{userToDelete?.name}</span> and all
            their recipes, workspaces and planned meals. This cannot be undone.
          </p>
          <DialogFooter>
            <button className="btn" onClick={() => setUserToDelete(null)}>
              Cancel
            </button>
            <button className="btn btn-error" onClick={confirmDelete}>
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

import { useAdminDemoInvitesContext } from '../infrastructure/inertia.adapter';
import DemoInviteFormModal from './demo-invite-form-modal';
import { AppMainContent } from '@/app/components/app-main-content';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/app/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import AdminLayout from '@/app/layouts/admin-layout';
import adminDemoInvites from '@/routes/admin/demo-invites';
import type { DemoInviteResource } from '@/types/generated';
import { Head, router } from '@inertiajs/react';
import { Check, ChevronDown, Copy, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

function formatDate(value: string | null): string {
  if (!value) return 'Never';
  return new Date(value).toLocaleDateString();
}

export default function AdminDemoInvitesView() {
  const { demoInvites } = useAdminDemoInvitesContext();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<DemoInviteResource | null>(null);
  const [toDelete, setToDelete] = useState<DemoInviteResource | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (invite: DemoInviteResource) => {
    setEditing(invite);
    setFormOpen(true);
  };

  const copyUrl = async (invite: DemoInviteResource) => {
    await navigator.clipboard.writeText(invite.url);
    setCopiedId(invite.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const toggle = (invite: DemoInviteResource) => {
    router.post(
      adminDemoInvites.toggle(invite.id).url,
      {},
      { preserveScroll: true },
    );
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    router.delete(adminDemoInvites.destroy(toDelete.id).url, {
      preserveScroll: true,
      onFinish: () => setToDelete(null),
    });
  };

  return (
    <AdminLayout>
      <Head title="Demo links" />

      <AppMainContent>
        <div className="grid gap-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">Demo links</h1>
              <p className="text-muted-foreground">
                Share links that let visitors create isolated demo accounts
              </p>
            </div>
            <button className="btn gap-2 btn-secondary" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              New link
            </button>
          </div>

          {demoInvites.length === 0 && (
            <div className="rounded-box border border-base-content/5 bg-base-100 py-10 text-center text-muted-foreground">
              No demo links yet.
            </div>
          )}

          <div className="grid gap-4">
            {demoInvites.map((invite) => (
              <div
                key={invite.id}
                className="rounded-box border border-base-content/5 bg-base-100 p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {invite.label ?? 'Untitled link'}
                      </h3>
                      {invite.is_usable ? (
                        <span className="badge badge-sm badge-success">
                          Usable
                        </span>
                      ) : (
                        <span className="badge badge-ghost badge-sm">
                          {invite.is_active
                            ? 'Exhausted / expired'
                            : 'Disabled'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <code className="max-w-xs truncate">{invite.url}</code>
                      <button
                        className="btn btn-ghost btn-xs"
                        title="Copy URL"
                        onClick={() => copyUrl(invite)}
                      >
                        {copiedId === invite.id ? (
                          <Check className="h-4 w-4 text-success" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <div className="mt-1 flex gap-4 text-sm text-muted-foreground">
                      <span>
                        Uses:{' '}
                        <span className="font-medium text-base-content">
                          {invite.used_count} / {invite.max_uses}
                        </span>
                      </span>
                      <span>Expires: {formatDate(invite.expires_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="toggle toggle-secondary toggle-sm"
                        checked={invite.is_active}
                        onChange={() => toggle(invite)}
                      />
                      Active
                    </label>
                    <button
                      className="btn btn-ghost btn-xs"
                      title="Edit"
                      onClick={() => openEdit(invite)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      className="btn text-error btn-ghost btn-xs"
                      title="Delete"
                      onClick={() => setToDelete(invite)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {invite.demo_accounts.length > 0 && (
                  <Collapsible className="mt-4">
                    <CollapsibleTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-base-content">
                      <ChevronDown className="h-4 w-4" />
                      {invite.demo_accounts.length} demo account(s) created
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <table className="table mt-2 table-sm">
                        <thead>
                          <tr>
                            <th>Email</th>
                            <th>Created</th>
                            <th>Expires</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invite.demo_accounts.map((account) => (
                            <tr key={account.id}>
                              <td>{account.user_email ?? '—'}</td>
                              <td>{formatDate(account.created_at)}</td>
                              <td>{formatDate(account.expires_at)}</td>
                              <td>
                                {account.is_expired ? (
                                  <span className="badge badge-ghost badge-sm">
                                    Expired
                                  </span>
                                ) : (
                                  <span className="badge badge-sm badge-success">
                                    Active
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            ))}
          </div>
        </div>
      </AppMainContent>

      {formOpen && (
        <DemoInviteFormModal
          key={editing?.id ?? 'new'}
          open={formOpen}
          invite={editing}
          onClose={() => setFormOpen(false)}
        />
      )}

      <Dialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete demo link</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This deletes the share link{' '}
            <span className="font-medium">
              {toDelete?.label ?? 'Untitled link'}
            </span>
            . Demo accounts already created will be kept and expire normally.
          </p>
          <DialogFooter>
            <button className="btn" onClick={() => setToDelete(null)}>
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

import { useAdminDemoInvitesContext } from '../infrastructure/inertia.adapter';
import DemoInviteFormModal from './demo-invite-form-modal';
import { Typography } from '@/app/components/Typography';
import { PageContainer } from '@/app/components/page-container';
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

      <PageContainer size="default">
        <div className="grid gap-6">
          <div className="flex items-start justify-between">
            <div>
              <Typography as="h1" variant="heading">
                Demo links
              </Typography>
              <Typography as="p" variant="body" tone="muted">
                Share links that let visitors create isolated demo accounts
              </Typography>
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
                      <Typography as="h3" variant="title">
                        {invite.label ?? 'Untitled link'}
                      </Typography>
                      {invite.is_usable ? (
                        <Typography
                          as="span"
                          variant="body-sm"
                          className="badge badge-sm badge-success"
                        >
                          Usable
                        </Typography>
                      ) : (
                        <Typography
                          as="span"
                          variant="body-sm"
                          className="badge badge-ghost badge-sm"
                        >
                          {invite.is_active
                            ? 'Exhausted / expired'
                            : 'Disabled'}
                        </Typography>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Typography
                        as="code"
                        variant="code"
                        className="max-w-xs truncate"
                      >
                        {invite.url}
                      </Typography>
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
                      <Typography as="span" variant="body-sm" tone="inherit">
                        Uses:{' '}
                        <Typography as="span" variant="body-sm" weight="medium">
                          {invite.used_count} / {invite.max_uses}
                        </Typography>
                      </Typography>
                      <Typography as="span" variant="body-sm" tone="inherit">
                        Expires: {formatDate(invite.expires_at)}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Typography
                      as="label"
                      variant="label"
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        className="toggle toggle-secondary toggle-sm"
                        checked={invite.is_active}
                        onChange={() => toggle(invite)}
                      />
                      Active
                    </Typography>
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
                                  <Typography
                                    as="span"
                                    variant="body-sm"
                                    className="badge badge-ghost badge-sm"
                                  >
                                    Expired
                                  </Typography>
                                ) : (
                                  <Typography
                                    as="span"
                                    variant="body-sm"
                                    className="badge badge-sm badge-success"
                                  >
                                    Active
                                  </Typography>
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
      </PageContainer>

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
          <Typography as="p" variant="body-sm" tone="muted">
            This deletes the share link{' '}
            <Typography
              as="span"
              variant="body-sm"
              tone="inherit"
              weight="medium"
            >
              {toDelete?.label ?? 'Untitled link'}
            </Typography>
            . Demo accounts already created will be kept and expire normally.
          </Typography>
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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { useAppForm } from '@/app/hooks/form-hook';
import adminDemoInvites from '@/routes/admin/demo-invites';
import type { DemoInviteResource } from '@/types/generated';
import { router } from '@inertiajs/react';

type Props = {
  open: boolean;
  onClose: () => void;
  invite: DemoInviteResource | null;
};

function toDateInput(value: string | null): string {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
}

export default function DemoInviteFormModal({ open, onClose, invite }: Props) {
  const isEdit = invite !== null;

  const form = useAppForm({
    defaultValues: {
      label: invite?.label ?? '',
      max_uses: invite?.max_uses ?? 50,
      expires_at: toDateInput(invite?.expires_at ?? null),
      is_active: invite?.is_active ?? true,
    },
    onSubmit: ({ value }) => {
      const payload = {
        label: value.label.trim() === '' ? null : value.label.trim(),
        max_uses: Number(value.max_uses),
        expires_at: value.expires_at === '' ? null : value.expires_at,
        is_active: value.is_active,
      };

      const options = {
        preserveScroll: true,
        onSuccess: () => onClose(),
      };

      if (isEdit && invite) {
        router.put(adminDemoInvites.update(invite.id).url, payload, options);
      } else {
        router.post(adminDemoInvites.store.url(), payload, options);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit demo link' : 'New demo link'}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <form.AppField
            name="label"
            children={(field) => (
              <field.TextField label="Label" placeholder="e.g. CV share link" />
            )}
          />
          <form.AppField
            name="max_uses"
            children={(field) => <field.NumberField label="Max uses" min={1} />}
          />
          <form.AppField
            name="expires_at"
            children={(field) => (
              <field.TextField label="Expires at (optional)" type="date" />
            )}
          />
          <form.AppField
            name="is_active"
            children={(field) => (
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  className="toggle toggle-secondary"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
                <span>Active</span>
              </label>
            )}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-secondary">
              {isEdit ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

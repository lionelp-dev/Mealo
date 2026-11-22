import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { Typography } from '@/app/components/Typography';
import InputError from '@/app/components/input-error';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Form } from '@inertiajs/react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function DeleteUser() {
  const { t } = useTranslation();
  const passwordInput = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      <header>
        <Typography as="h3" variant="title" weight="medium">
          {t('deleteAccount.title', 'Delete account')}
        </Typography>
        <Typography variant="body-sm" tone="muted">
          {t(
            'deleteAccount.description',
            'Delete your account and all of its resources',
          )}
        </Typography>
      </header>
      <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
        <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
          <Typography weight="medium">
            {t('deleteAccount.warning', 'Warning')}
          </Typography>
          <Typography variant="body-sm">
            {t(
              'deleteAccount.warningText',
              'Please proceed with caution, this cannot be undone.',
            )}
          </Typography>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <button className="btn btn-error" data-test="delete-user-button">
              {t('deleteAccount.deleteButton', 'Delete account')}
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>
              {t(
                'deleteAccount.confirmTitle',
                'Are you sure you want to delete your account?',
              )}
            </DialogTitle>
            <DialogDescription>
              {t(
                'deleteAccount.confirmDescription',
                'Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.',
              )}
            </DialogDescription>

            <Form
              {...ProfileController.destroy.form()}
              options={{
                preserveScroll: true,
              }}
              onError={() => passwordInput.current?.focus()}
              resetOnSuccess
              className="space-y-6"
            >
              {({ resetAndClearErrors, processing, errors }) => (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="sr-only">
                      {t('deleteAccount.confirmPassword', 'Password')}
                    </Label>

                    <Input
                      id="password"
                      type="password"
                      name="password"
                      ref={passwordInput}
                      placeholder={t(
                        'deleteAccount.confirmPassword',
                        'Password',
                      )}
                      autoComplete="current-password"
                    />

                    <InputError message={errors.password} />
                  </div>

                  <DialogFooter className="gap-2">
                    <DialogClose asChild>
                      <button
                        className="btn btn-secondary"
                        onClick={() => resetAndClearErrors()}
                      >
                        {t('deleteAccount.cancelButton', 'Cancel')}
                      </button>
                    </DialogClose>

                    <button
                      className="btn btn-error"
                      type="submit"
                      disabled={processing}
                      data-test="confirm-delete-user-button"
                    >
                      {t('deleteAccount.deleteButton', 'Delete account')}
                    </button>
                  </DialogFooter>
                </>
              )}
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

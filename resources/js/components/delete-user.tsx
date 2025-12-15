import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function DeleteUser() {
  const { t } = useTranslation();
  const passwordInput = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      <HeadingSmall
        title={t('deleteAccount.title')}
        description={t('deleteAccount.description')}
      />
      <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
        <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
          <p className="font-medium">{t('deleteAccount.warning')}</p>
          <p className="text-sm">
            {t('deleteAccount.warningText')}
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <button className="btn btn-error" data-test="delete-user-button">
              {t('deleteAccount.deleteButton')}
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>
              {t('deleteAccount.confirmTitle', 'Are you sure you want to delete your account?')}
            </DialogTitle>
            <DialogDescription>
              {t('deleteAccount.confirmDescription', 'Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.')}
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
                      {t('deleteAccount.confirmPassword')}
                    </Label>

                    <Input
                      id="password"
                      type="password"
                      name="password"
                      ref={passwordInput}
                      placeholder={t('deleteAccount.confirmPassword')}
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
                        {t('deleteAccount.cancelButton')}
                      </button>
                    </DialogClose>

                    <button
                      className="btn btn-error"
                      type="submit"
                      disabled={processing}
                      data-test="confirm-delete-user-button"
                    >
                      {t('deleteAccount.deleteButton')}
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

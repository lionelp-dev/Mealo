import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import HeadingSmall from '@/app/components/heading-small';
import InputError from '@/app/components/input-error';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/app/layouts/app-layout';
import SettingsLayout from '@/app/layouts/settings/layout';
import { edit } from '@/routes/password';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

// Breadcrumbs will be translated in the component

export default function Password() {
  const { t } = useTranslation();
  const passwordInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('settings.password.pageTitle', 'Password settings'),
      href: edit().url,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('settings.password.pageTitle', 'Password settings')} />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title={t('settings.password.sectionTitle', 'Update password')}
            description={t(
              'settings.password.sectionDescription',
              'Ensure your account is using a long, random password to stay secure',
            )}
          />

          <Form
            {...PasswordController.update.form()}
            options={{
              preserveScroll: true,
            }}
            resetOnError={[
              'password',
              'password_confirmation',
              'current_password',
            ]}
            resetOnSuccess
            onError={(errors) => {
              if (errors.password) {
                passwordInput.current?.focus();
              }

              if (errors.current_password) {
                currentPasswordInput.current?.focus();
              }
            }}
            className="space-y-6"
          >
            {({ errors, processing, recentlySuccessful }) => (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="current_password">
                    {t(
                      'settings.password.currentPasswordLabel',
                      'Current password',
                    )}
                  </Label>

                  <Input
                    id="current_password"
                    ref={currentPasswordInput}
                    name="current_password"
                    type="password"
                    className="mt-1 block w-full"
                    autoComplete="current-password"
                    placeholder={t(
                      'settings.password.currentPasswordPlaceholder',
                      'Current password',
                    )}
                  />

                  <InputError message={errors.current_password} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">
                    {t('settings.password.newPasswordLabel', 'New password')}
                  </Label>

                  <Input
                    id="password"
                    ref={passwordInput}
                    name="password"
                    type="password"
                    className="mt-1 block w-full"
                    autoComplete="new-password"
                    placeholder={t(
                      'settings.password.newPasswordPlaceholder',
                      'New password',
                    )}
                  />

                  <InputError message={errors.password} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password_confirmation">
                    {t(
                      'settings.password.confirmPasswordLabel',
                      'Confirm password',
                    )}
                  </Label>

                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    className="mt-1 block w-full"
                    autoComplete="new-password"
                    placeholder={t(
                      'settings.password.confirmPasswordPlaceholder',
                      'Confirm password',
                    )}
                  />

                  <InputError message={errors.password_confirmation} />
                </div>

                <div className="flex items-center gap-4">
                  <button
                    className="btn btn-primary"
                    disabled={processing}
                    data-test="update-password-button"
                  >
                    {t('settings.password.saveButton', 'Save')}
                  </button>

                  <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                  >
                    <p className="text-sm text-neutral-600">
                      {t('common.status.saved', 'Saved')}
                    </p>
                  </Transition>
                </div>
              </>
            )}
          </Form>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}

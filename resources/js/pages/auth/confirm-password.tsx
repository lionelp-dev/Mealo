import InputError from '@/app/components/input-error';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import AuthLayout from '@/app/layouts/auth-layout';
import { store } from '@/routes/password/confirm';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ConfirmPassword() {
  const { t } = useTranslation();

  return (
    <AuthLayout
      title={t('auth.confirmPassword.title', 'Confirm your password')}
      description={t(
        'auth.confirmPassword.description',
        'This is a secure area of the application. Please confirm your password before continuing.',
      )}
    >
      <Head title={t('auth.confirmPassword.pageTitle', 'Confirm password')} />

      <Form {...store.form()} resetOnSuccess={['password']}>
        {({ processing, errors }) => (
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="password">
                {t('auth.login.passwordLabel', 'Password')}
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder={t('auth.login.passwordPlaceholder', 'Password')}
                autoComplete="current-password"
                autoFocus
              />

              <InputError message={errors.password} />
            </div>

            <div className="flex items-center">
              <button
                className="btn w-full btn-primary"
                disabled={processing}
                data-test="confirm-password-button"
              >
                {processing && (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                )}
                Confirm password
              </button>
            </div>
          </div>
        )}
      </Form>
    </AuthLayout>
  );
}

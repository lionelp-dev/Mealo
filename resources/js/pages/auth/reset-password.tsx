import NewPasswordController from '@/actions/App/Http/Controllers/Auth/NewPasswordController';
import InputError from '@/app/components/input-error';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import AuthLayout from '@/app/layouts/auth-layout';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ResetPasswordProps {
  token: string;
  email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
  const { t } = useTranslation();

  return (
    <AuthLayout
      title={t('auth.resetPassword.title', 'Reset password')}
      description={t(
        'auth.resetPassword.description',
        'Enter your new password',
      )}
    >
      <Head title={t('auth.resetPassword.pageTitle', 'Reset password')} />

      <Form
        {...NewPasswordController.store.form()}
        transform={(data) => ({ ...data, token, email })}
        resetOnSuccess={['password', 'password_confirmation']}
      >
        {({ processing, errors }) => (
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">
                {t('auth.resetPassword.emailLabel', 'Email address')}
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                className="mt-1 block w-full"
                readOnly
              />
              <InputError message={errors.email} className="mt-2" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">
                {t('auth.resetPassword.passwordLabel', 'New password')}
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                autoComplete="new-password"
                className="mt-1 block w-full"
                autoFocus
                placeholder={t(
                  'auth.resetPassword.passwordLabel',
                  'New password',
                )}
              />
              <InputError message={errors.password} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password_confirmation">
                {t(
                  'auth.resetPassword.confirmPasswordLabel',
                  'Confirm new password',
                )}
              </Label>
              <Input
                id="password_confirmation"
                type="password"
                name="password_confirmation"
                autoComplete="new-password"
                className="mt-1 block w-full"
                placeholder={t(
                  'auth.resetPassword.confirmPasswordLabel',
                  'Confirm new password',
                )}
              />
              <InputError
                message={errors.password_confirmation}
                className="mt-2"
              />
            </div>

            <button
              type="submit"
              className="btn mt-4 w-full btn-secondary"
              disabled={processing}
              data-test="reset-password-button"
            >
              {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {t('auth.resetPassword.resetButton', 'Reset password')}
            </button>
          </div>
        )}
      </Form>
    </AuthLayout>
  );
}

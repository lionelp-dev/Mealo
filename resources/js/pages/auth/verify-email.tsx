// Components
import EmailVerificationNotificationController from '@/actions/App/Http/Controllers/Auth/EmailVerificationNotificationController';
import { logout } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import TextLink from '@/components/text-link';
import AuthLayout from '@/layouts/auth-layout';
import { useTranslation } from 'react-i18next';

export default function VerifyEmail({ status }: { status?: string }) {
  const { t } = useTranslation();

  return (
    <AuthLayout
      title={t('auth.verifyEmail.title', 'Verify your email')}
      description={t(
        'auth.verifyEmail.description',
        'A verification link has been sent to your email address',
      )}
    >
      <Head title={t('auth.verifyEmail.pageTitle', 'Email verification')} />

      {status === 'verification-link-sent' && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">
          {t(
            'auth.verifyEmail.description',
            'A verification link has been sent to your email address',
          )}
        </div>
      )}

      <Form
        {...EmailVerificationNotificationController.store.form()}
        className="space-y-6 text-center"
      >
        {({ processing }) => (
          <>
            <button disabled={processing} className="btn btn-secondary">
              {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {t('auth.verifyEmail.resendButton', 'Resend verification email')}
            </button>

            <TextLink href={logout()} className="mx-auto block text-sm">
              {t('auth.verifyEmail.logoutButton', 'Log out')}
            </TextLink>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}

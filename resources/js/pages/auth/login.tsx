import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const { t } = useTranslation();

  return (
    <AuthLayout
      title={t('auth.login.title', 'Log in to your account')}
      description={t('auth.login.description', 'Enter your email and password below to log in')}
    >
      <Head title={t('auth.login.pageTitle', 'Log in')} />

      <Form
        {...AuthenticatedSessionController.store.form()}
        resetOnSuccess={['password']}
        className="flex flex-col gap-6"
      >
        {({ processing, errors }) => (
          <>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{t('auth.login.emailLabel', 'Email address')}</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoFocus
                  tabIndex={1}
                  autoComplete="email"
                  placeholder={t('auth.login.emailPlaceholder', 'email@example.com')}
                />
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t('auth.login.passwordLabel', 'Password')}</Label>
                  {canResetPassword && (
                    <TextLink
                      href={request()}
                      className="ml-auto text-sm"
                      tabIndex={5}
                    >
                      {t('auth.login.forgotPassword', 'Forgot password?')}
                    </TextLink>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  tabIndex={2}
                  autoComplete="current-password"
                  placeholder={t('auth.login.passwordPlaceholder', 'Password')}
                />
                <InputError message={errors.password} />
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox id="remember" name="remember" tabIndex={3} />
                <Label htmlFor="remember">{t('auth.login.rememberMe', 'Remember me')}</Label>
              </div>

              <button
                type="submit"
                className="btn btn-primary mt-4 w-full"
                tabIndex={4}
                disabled={processing}
                data-test="login-button"
              >
                {processing && (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                )}
                {t('auth.login.loginButton', 'Log in')}
              </button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              {t('auth.login.noAccount', "Don't have an account?")}{' '}
              <TextLink href={register()} tabIndex={5}>
                {t('auth.login.signUp', 'Sign up')}
              </TextLink>
            </div>
          </>
        )}
      </Form>

      {status && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">
          {status}
        </div>
      )}
    </AuthLayout>
  );
}

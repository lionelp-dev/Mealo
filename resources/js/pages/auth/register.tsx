import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Register() {
  const { t } = useTranslation();

  return (
    <AuthLayout
      title={t('auth.register.title', 'Create an account')}
      description={t(
        'auth.register.description',
        'Enter your information below to create your account',
      )}
    >
      <Head title={t('auth.register.pageTitle', 'Sign up')} />
      <Form
        {...RegisteredUserController.store.form()}
        resetOnSuccess={['password', 'password_confirmation']}
        disableWhileProcessing
        className="flex flex-col gap-6"
      >
        {({ processing, errors }) => (
          <>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">
                  {t('auth.register.nameLabel', 'Name')}
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  autoFocus
                  tabIndex={1}
                  autoComplete="name"
                  name="name"
                  placeholder={t('auth.register.namePlaceholder', 'Your name')}
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">
                  {t('auth.register.emailLabel', 'Email address')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  tabIndex={2}
                  autoComplete="email"
                  name="email"
                  placeholder={t(
                    'auth.register.emailPlaceholder',
                    'email@example.com',
                  )}
                />
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">
                  {t('auth.register.passwordLabel', 'Password')}
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  tabIndex={3}
                  autoComplete="new-password"
                  name="password"
                  placeholder={t(
                    'auth.register.passwordPlaceholder',
                    'Password',
                  )}
                />
                <InputError message={errors.password} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password_confirmation">
                  {t('auth.register.confirmPasswordLabel', 'Confirm password')}
                </Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  required
                  tabIndex={4}
                  autoComplete="new-password"
                  name="password_confirmation"
                  placeholder={t(
                    'auth.register.confirmPasswordPlaceholder',
                    'Confirm password',
                  )}
                />
                <InputError message={errors.password_confirmation} />
              </div>

              <button
                type="submit"
                className="btn mt-2 w-full btn-primary"
                tabIndex={5}
                data-test="register-user-button"
              >
                {processing && (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                )}
                {t('auth.register.registerButton', 'Sign up')}
              </button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              {t(
                'auth.register.alreadyHaveAccount',
                'Already have an account?',
              )}{' '}
              <TextLink href={login()} tabIndex={6}>
                {t('auth.register.logIn', 'Log in')}
              </TextLink>
            </div>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}

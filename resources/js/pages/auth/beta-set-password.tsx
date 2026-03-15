import InputError from '@/app/components/input-error';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import AuthLayout from '@/app/layouts/auth-layout';
import { Form, Head } from '@inertiajs/react';
import { AlertCircle, LoaderCircle } from 'lucide-react';

interface BetaSetPasswordProps {
  token: string;
  email: string;
  expiresAt: string;
}

export default function BetaSetPassword({
  token,
  email,
  expiresAt,
}: BetaSetPasswordProps) {
  const expirationDate = new Date(expiresAt);
  const daysRemaining = Math.ceil(
    (expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  return (
    <AuthLayout
      title="Activez votre compte beta"
      description={`Bienvenue ! Créez votre mot de passe pour accéder à Mealo.`}
    >
      <Head title="Activer le compte beta" />

      {/* Warning Banner */}
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-warning-content">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-semibold">Compte beta temporaire</p>
          <p className="mt-1 text-xs opacity-90">
            Ce compte expirera dans <strong>{daysRemaining} jours</strong>.
            Toutes vos données seront supprimées à la fin de la période de test.
          </p>
        </div>
      </div>

      <Form
        action={`/beta/accept/${token}`}
        method="post"
        resetOnSuccess
        className="flex flex-col gap-6"
      >
        {({ processing, errors }) => (
          <>
            <div className="grid gap-6">
              {/* Email (read-only) */}
              <div className="grid gap-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-base-200"
                />
              </div>

              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  required
                  autoFocus
                  placeholder="Jean Dupont"
                  maxLength={255}
                />
                <InputError message={errors.name} />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  placeholder="Minimum 8 caractères"
                />
                <InputError message={errors.password} />
              </div>

              {/* Password Confirmation */}
              <div className="grid gap-2">
                <Label htmlFor="password_confirmation">
                  Confirmer le mot de passe
                </Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  required
                  minLength={8}
                  placeholder="Retapez votre mot de passe"
                />
                <InputError message={errors.password_confirmation} />
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="btn w-full btn-primary"
            >
              {processing ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Activation en cours...
                </>
              ) : (
                'Activer mon compte'
              )}
            </button>

            <p className="text-center text-xs text-base-content/60">
              Ce lien est valable jusqu'au{' '}
              <strong>
                {expirationDate.toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </strong>
            </p>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}

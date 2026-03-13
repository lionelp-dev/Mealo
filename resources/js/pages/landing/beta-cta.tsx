import { useAppForm } from '@/hooks/form-hook';
import beta from '@/routes/beta';
import { router } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { z } from 'zod';

const betaRequestSchema = z.object({
  email: z
    .string()
    .min(1, "L'adresse email est requise.")
    .email({ message: "L'adresse email doit être valide." })
    .max(255, "L'adresse email ne doit pas dépasser 255 caractères."),
});

export function BetaCTA() {
  const form = useAppForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onSubmit: betaRequestSchema,
    },
    onSubmit: ({ value }) => {
      console.log('hello');
      router.post(beta.request.url(), value);
    },
  });

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-secondary px-8 py-16 md:px-16 md:py-24">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="grid"
                  width="32"
                  height="32"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 32 0 L 0 0 0 32"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
              Places limitées disponibles
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-semibold tracking-tight text-balance text-primary-foreground md:text-4xl lg:text-5xl">
                Rejoignez la Beta Fermée
              </h2>

              <p className="text-lg text-pretty text-primary-foreground/70">
                Nous testons actuellement Mealo avec un petit groupe
                d'utilisateurs. Demandez l'accès pour être notifié quand une
                place se libère.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
                <form.AppField name="email">
                  {(field) => (
                    <field.TextField
                      placeholder="votre@email.com"
                      className="rounded-full border-white bg-transparent pb-0.5 pl-6 text-white !outline-white btn-outline"
                    />
                  )}
                </form.AppField>
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <button
                      type="submit"
                      className="btn gap-2 rounded-full bg-accent pl-6 text-primary-foreground btn-accent hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!canSubmit}
                    >
                      {isSubmitting ? (
                        '...'
                      ) : (
                        <>
                          Demander l'accès
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

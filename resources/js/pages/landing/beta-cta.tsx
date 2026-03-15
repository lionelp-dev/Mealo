import { useAppForm } from '@/app/hooks/form-hook';
import beta from '@/routes/beta';
import { router } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export function BetaCTA() {
  const { t } = useTranslation();

  const betaRequestSchema = z.object({
    email: z
      .string()
      .min(1, t('landing.betaCta.validation.emailRequired'))
      .email({ message: t('landing.betaCta.validation.emailInvalid') })
      .max(255, t('landing.betaCta.validation.emailMaxLength')),
  });

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
    <section id="join-beta" className="py-26 pb-30">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-secondary px-8 py-16 md:px-16 md:py-28">
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

          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
              {t('landing.betaCta.badge')}
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-semibold tracking-tight text-balance text-primary-foreground md:text-4xl lg:text-5xl">
                {t('landing.betaCta.title')}
              </h2>

              <p className="text-lg text-pretty text-primary-foreground/70">
                {t('landing.betaCta.description')}
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
                      placeholder={t('landing.betaCta.emailPlaceholder')}
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
                        t('landing.betaCta.submitting')
                      ) : (
                        <>
                          {t('landing.betaCta.submitButton')}
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

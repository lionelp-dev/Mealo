import { Typography } from '@/app/components/Typography';
import { useTranslation } from 'react-i18next';

const stepKeys = [
  { number: '01', key: 'buildLibrary' },
  { number: '02', key: 'planWeek' },
  { number: '03', key: 'shareCollaborate' },
  { number: '04', key: 'shopConfidence' },
];

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <Typography as="h2" variant="heading" tone="secondary">
            {t('landing.howItWorks.sectionTitle')}
          </Typography>
          <Typography
            as="p"
            variant="body"
            tone="muted"
            className="mx-auto mt-4 max-w-2xl text-pretty"
          >
            {t('landing.howItWorks.sectionDescription')}
          </Typography>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {stepKeys.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < stepKeys.length - 1 && (
                <div className="absolute top-8 left-1/2 hidden h-0.5 w-full -translate-y-1/2 bg-border md:block" />
              )}

              <div className="relative flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-2xl font-semibold text-primary-foreground shadow-lg">
                  {step.number}
                </div>
                <Typography as="h3" variant="title" tone="secondary">
                  {t(`landing.howItWorks.steps.${step.key}.title`)}
                </Typography>
                <Typography
                  as="p"
                  variant="body"
                  tone="muted"
                  className="mt-3 max-w-xs"
                >
                  {t(`landing.howItWorks.steps.${step.key}.description`)}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

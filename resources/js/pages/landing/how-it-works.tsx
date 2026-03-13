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
          <h2 className="text-3xl font-semibold tracking-tight text-secondary md:text-4xl">
            {t('landing.howItWorks.sectionTitle')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-pretty text-muted-foreground">
            {t('landing.howItWorks.sectionDescription')}
          </p>
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
                <h3 className="text-xl font-semibold text-secondary">
                  {t(`landing.howItWorks.steps.${step.key}.title`)}
                </h3>
                <p className="mt-3 max-w-xs leading-relaxed text-muted-foreground">
                  {t(`landing.howItWorks.steps.${step.key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

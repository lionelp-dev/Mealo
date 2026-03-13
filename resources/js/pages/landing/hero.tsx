import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Hero() {
  const { t } = useTranslation();

  return (
    <section id="features" className="relative overflow-hidden py-26">
      <div className="mx-auto flex max-w-6xl flex-col gap-34 px-6">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-base-300 bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
            <span className="h-2 w-2 rounded-full bg-accent" />
            {t('landing.hero.badge')}
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl text-4xl leading-15.5 font-semibold tracking-tight text-balance text-secondary md:text-5xl lg:text-6xl">
            {t('landing.hero.title')}
            <br />
            <span className="text-secondary/70">
              {t('landing.hero.subtitle')}
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-lg leading-7.5 text-pretty text-muted-foreground md:text-xl">
            {t('landing.hero.description')}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#join-beta"
              className="btn gap-2 rounded-full px-8 pb-[1px] shadow-sm btn-secondary"
            >
              {t('landing.hero.cta')}
              <ArrowRight className="h-4 w-4" />
            </a>
            {/*
                <button className="btn gap-2 rounded-full px-8 btn-secondary">
                  <Play className="h-4 w-4" />
                  See how it works
                </button>
            */}
          </div>
        </div>

        {/* App Preview */}
        <div className="relative mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-2xl bg-card shadow-2xl shadow-foreground/5">
            <img src="/hero.png" alt={t('landing.hero.imageAlt')} />
          </div>
        </div>
      </div>
    </section>
  );
}

import { Typography } from '@/app/components/Typography';
import { useTranslation } from 'react-i18next';

export function ProductPreview() {
  const { t } = useTranslation();

  return (
    <section id="preview" className="bg-card py-26">
      <div className="mx-auto flex max-w-7xl flex-col gap-15 px-6">
        <div className="text-center">
          <Typography as="h2" variant="heading" tone="secondary">
            {t('landing.productPreview.sectionTitle')}
          </Typography>
          <Typography
            as="p"
            variant="body"
            tone="muted"
            className="mx-auto mt-4 max-w-2xl text-pretty"
          >
            {t('landing.productPreview.sectionDescription')}
          </Typography>
        </div>

        <div className="grid gap-9 px-2 md:grid-cols-2">
          <img
            src="/product-preview-1.png"
            alt={t('landing.productPreview.imageAlt')}
          />
          <img
            src="/product-preview-2.png"
            alt={t('landing.productPreview.imageAlt')}
          />
          <img
            src="/product-preview-3.png"
            alt={t('landing.productPreview.imageAlt')}
          />
          <img
            src="/product-preview-4.png"
            alt={t('landing.productPreview.imageAlt')}
          />
        </div>
      </div>
    </section>
  );
}

import { useTranslation } from 'react-i18next';

export function ProductPreview() {
  const { t } = useTranslation();

  return (
    <section id="preview" className="bg-card py-26">
      <div className="mx-auto flex max-w-7xl flex-col gap-15 px-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-secondary md:text-4xl">
            {t('landing.productPreview.sectionTitle')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-pretty text-muted-foreground">
            {t('landing.productPreview.sectionDescription')}
          </p>
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

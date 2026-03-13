import {
  Calendar,
  ShoppingCart,
  BookOpen,
  Wand,
  Sparkles,
  Share2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const featureKeys = [
  { icon: BookOpen, key: 'recipeOrganization' },
  { icon: Wand, key: 'aiRecipeGeneration' },
  { icon: Calendar, key: 'weeklyMealPlanning' },
  { icon: Sparkles, key: 'aiMealPlanning' },
  { icon: ShoppingCart, key: 'smartGroceryLists' },
  { icon: Share2, key: 'shareYourMealPlans' },
];

export function Features() {
  const { t } = useTranslation();

  return (
    <section id="features" className="bg-card py-26">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-secondary md:text-4xl">
            {t('landing.features.sectionTitle')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-pretty text-muted-foreground">
            {t('landing.features.sectionDescription')}
          </p>
        </div>

        <div className="grid gap-x-7 gap-y-9 md:grid-cols-3">
          {featureKeys.map((feature) => (
            <div
              key={feature.key}
              className="group rounded-2xl border border-base-300/50 bg-background p-8 transition-all hover:border-secondary/50 hover:shadow-lg hover:shadow-secondary/5"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                <feature.icon className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-secondary">
                {t(`landing.features.items.${feature.key}.title`)}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {t(`landing.features.items.${feature.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import {
  Calendar,
  ShoppingCart,
  BookOpen,
  Wand,
  Sparkles,
  Share2,
} from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Recipe Organization',
    description:
      'Save and organize your favorite recipes in one place. Create custom recipes or browse your collection anytime.',
  },
  {
    icon: Wand,
    title: 'AI Recipe Generation',
    description:
      'Let AI create personalized recipes for you. Generate unique meal ideas tailored to your preferences with a single click.',
  },
  {
    icon: Calendar,
    title: 'Weekly Meal Planning',
    description:
      'Plan your breakfasts, lunches and dinners in a simple weekly view. Drag and drop meals to organize your week effortlessly.',
  },
  {
    icon: Sparkles,
    title: 'AI Meal Planning',
    description:
      'Let AI plan your entire week for you. Get intelligent meal suggestions that fit your schedule and preferences automatically.',
  },
  {
    icon: ShoppingCart,
    title: 'Smart Grocery Lists',
    description:
      'Automatically generate your shopping list based on planned meals. Never forget an ingredient again.',
  },
  {
    icon: Share2,
    title: 'Share Your Meal Plans',
    description:
      "Collaborate with family and friends by sharing your meal plans. Keep everyone on the same page about what's for dinner.",
  },
];

export function Features() {
  return (
    <section className="bg-card py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-secondary md:text-4xl">
            Everything you need to plan meals
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-pretty text-muted-foreground">
            Simple tools designed to make meal planning effortless and
            enjoyable.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-base-300 bg-background p-8 transition-all hover:border-secondary/50 hover:shadow-lg hover:shadow-secondary/5"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                <feature.icon className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-secondary">
                {feature.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

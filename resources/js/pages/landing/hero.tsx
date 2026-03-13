import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pt-24 md:pt-34">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-base-300 bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Currently in Closed Beta
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance text-secondary md:text-5xl lg:text-6xl">
            Plan your meals.
            <br />
            <span className="text-secondary/70">Simplify your week.</span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-lg text-pretty text-muted-foreground md:text-xl">
            Mealo Planner helps you organize weekly meals, generate smart
            grocery lists, and keep all your favorite recipes in one place.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button className="btn gap-2 rounded-full px-8 shadow-sm btn-secondary">
              Join the Closed Beta
              <ArrowRight className="h-4 w-4" />
            </button>
            {/*
                <button className="btn gap-2 rounded-full px-8 btn-secondary">
                  <Play className="h-4 w-4" />
                  See how it works
                </button>
            */}
          </div>
        </div>

        {/* App Preview */}
        <div className="mt-16 md:mt-20">
          <div className="relative mx-auto max-w-5xl">
            <div className="overflow-hidden rounded-2xl bg-card shadow-2xl shadow-foreground/5">
              <img src="/hero.png" alt="Meal Planner App Preview" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

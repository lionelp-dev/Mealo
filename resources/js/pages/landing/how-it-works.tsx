const steps = [
  {
    number: '01',
    title: 'Build your recipe library',
    description:
      'Add your favorite recipes manually or generate new ones instantly with AI assistance.',
  },
  {
    number: '02',
    title: 'Plan your week',
    description:
      'Organize meals with drag & drop or let AI create your weekly plan automatically.',
  },
  {
    number: '03',
    title: 'Share and collaborate',
    description:
      'Share your meal plans with family and friends to keep everyone aligned.',
  },
  {
    number: '04',
    title: 'Shop with confidence',
    description:
      'Generate complete shopping lists automatically from your planned meals.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-secondary md:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-pretty text-muted-foreground">
            Get started in minutes with a simple, powerful workflow.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute top-8 left-1/2 hidden h-0.5 w-full -translate-y-1/2 bg-border md:block" />
              )}

              <div className="relative flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-2xl font-semibold text-primary-foreground shadow-lg">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-secondary">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

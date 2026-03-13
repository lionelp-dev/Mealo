export function ProductPreview() {
  return (
    <section className="bg-card pt-24 md:pt-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-secondary md:text-4xl">
            A peek inside Mealo
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-pretty text-muted-foreground">
            Clean, intuitive interfaces designed to make meal planning a joy.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <img src="/product-preview-1.png" alt="Product preview" />
          <img src="/product-preview-2.png" alt="Product preview" />
          <img src="/product-preview-3.png" alt="Product preview" />
          <img src="/product-preview-4.png" alt="Product preview" />
        </div>
      </div>
    </section>
  );
}

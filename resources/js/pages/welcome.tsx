import { BetaCTA } from './landing/beta-cta';
import { Features } from './landing/features';
import { Footer } from './landing/footer';
import { Header } from './landing/header';
import { Hero } from './landing/hero';
import { HowItWorks } from './landing/how-it-works';
import { ProductPreview } from './landing/product-preview';

export default function Welcome() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <Hero />
        <section id="features">
          <Features />
        </section>
        <section id="how-it-works">
          <HowItWorks />
        </section>
        <section id="preview">
          <ProductPreview />
        </section>
        <BetaCTA />
      </main>
      <Footer />
    </>
  );
}

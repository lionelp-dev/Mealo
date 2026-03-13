import { BetaCTA } from './landing/beta-cta';
import { Features } from './landing/features';
import { Footer } from './landing/footer';
import { Header } from './landing/header';
import { Hero } from './landing/hero';
import { ProductPreview } from './landing/product-preview';

export default function Welcome() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <Hero />
        <Features />
        <ProductPreview />
        <BetaCTA />
      </main>
      <Footer />
    </>
  );
}

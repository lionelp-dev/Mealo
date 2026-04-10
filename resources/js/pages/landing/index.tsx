import { DemoCTA } from './demo-cta';
import { Features } from './features';
import { Footer } from './footer';
import { Header } from './header';
import { Hero } from './hero';
import { ProductPreview } from './product-preview';

export default function Landing() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <Hero />
        <Features />
        <ProductPreview />
        <DemoCTA />
      </main>
      <Footer />
    </>
  );
}

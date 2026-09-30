import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { Shunya } from '@/components/sections/Shunya';
import { Philosophy } from '@/components/sections/Philosophy';
import { Stack } from '@/components/sections/Stack';
import { Work } from '@/components/sections/Work';
import { Contact } from '@/components/sections/Contact';

/**
 * Home page composition.
 *
 * Section order is the narrative: capability → conviction → proof → contact.
 * The only section that changes atmosphere is Shunya, which is why it is the
 * one full-bleed scene with its own colour ground.
 *
 * `H1` is the hero heading; every other heading is an `h2`, so the document
 * outline is correct for screen readers and for search engines.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="rule" />
      <Services />
      <Shunya />
      <Philosophy />
      <div className="rule" />
      <Stack />
      <Work />
      <Contact />
    </>
  );
}

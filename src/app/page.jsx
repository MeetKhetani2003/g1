"use client";

import HeroCarousel from "../components/home/HeroCarousel";
import SearchPanel from "../components/home/SearchPanel";
import ServicesGrid from "../components/home/ServicesGrid";
import HealthCardPreview from "../components/home/HealthCardPreview";
import HowItWorks from "../components/home/HowItWorks";
import FeaturedProviders from "../components/home/FeaturedProviders";
import PartnerSection from "../components/home/PartnerSection";
import TrustPrivacy from "../components/home/TrustPrivacy";
import FaqAccordion from "../components/home/FaqAccordion";
import FinalCta from "../components/home/FinalCta";

export default function Page() {
  return (
    <>
      <HeroCarousel />
      <SearchPanel />
      <ServicesGrid />
      <HealthCardPreview />
      <HowItWorks />
      <FeaturedProviders />
      <PartnerSection />
      <TrustPrivacy />
      <FaqAccordion />
      <FinalCta />
    </>
  );
}

import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../sections/HeroSection';
import EventInfoStrip from '../sections/EventInfoStrip';
import AboutSection from '../sections/AboutSection';
import CategoriesSection from '../sections/CategoriesSection';
import HowItWorksSection from '../sections/HowItWorksSection';
import ImportantInfoSection from '../sections/ImportantInfoSection';
import RulesSection from '../sections/RulesSection';
import FaqSection from '../sections/FaqSection';
import RegistrationCtaSection from '../sections/RegistrationCtaSection';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#08080a] text-[#F4E7D0] flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <EventInfoStrip />
        <AboutSection />
        <CategoriesSection />
        <HowItWorksSection />
        <ImportantInfoSection />
        <RulesSection />
        <FaqSection />
        <RegistrationCtaSection />
      </main>
      <Footer />
    </div>
  );
}
  
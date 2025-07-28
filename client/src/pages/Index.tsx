import React from "react";
import { useTheme } from "@/hooks/use-theme";
import Navigation from "@/components/Navigation";
import SoftwareCostEstimator from "@/components/SoftwareCostEstimator-new";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  useTheme(); // Initialize theme on page load
  return (
    <div className="min-h-screen">
      <Navigation />
      <main id="software-estimation">
        <SoftwareCostEstimator />
        <section id="contact">
          <ContactSection />
        </section>
      </main>
    </div>
  );
};

export default Index;

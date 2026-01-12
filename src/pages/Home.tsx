import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { SocialProof } from "@/components/SocialProof";
import { PricingTeaser } from "@/components/PricingTeaser";
import { RulesBlock } from "@/components/RulesBlock";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";

export default function Home() {
  return (
    <div className="animate-fade-in">
      <Hero />
      <HowItWorks />
      <Features />
      <SocialProof />
      <PricingTeaser />
      <RulesBlock />
      <FAQ />
      <FinalCTA />
    </div>
  );
}
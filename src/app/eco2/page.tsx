import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { AgentDrivenSection } from "@/components/sections/agent-driven-section";
import { CategoriesSection } from "@/components/sections/categories-section";
import { ArchitectureSection } from "@/components/sections/architecture-section";
import { TechStackSection } from "@/components/sections/tech-stack-section";
import { TimelineSection } from "@/components/sections/timeline-section";

export default function Eco2Page() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <HeroSection />
        <AgentDrivenSection />
        <CategoriesSection />
        <ArchitectureSection />
        <TechStackSection />
        <TimelineSection />
      </main>
      <Footer />
    </>
  );
}

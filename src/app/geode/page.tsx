import { GeodeNavigation } from "@/components/geode/geode-navigation";
import { Footer } from "@/components/layout/footer";
import { GeodeHeroSection } from "@/components/geode/geode-hero-section";
import { GeodeArchitectureSection } from "@/components/geode/geode-architecture-section";
import { GeodePipelineSection } from "@/components/geode/geode-pipeline-section";
import { GeodeCategoriesSection } from "@/components/geode/geode-categories-section";
import { GeodeTechStackSection } from "@/components/geode/geode-tech-stack-section";
import { GeodeBlogSection } from "@/components/geode/geode-blog-section";

export default function GeodePage() {
  return (
    <div className="geode-theme">
      <GeodeNavigation />
      <main className="min-h-screen bg-background">
        <GeodeHeroSection />
        <GeodeArchitectureSection />
        <GeodePipelineSection />
        <GeodeCategoriesSection />
        <GeodeTechStackSection />
        <GeodeBlogSection />
      </main>
      <Footer />
    </div>
  );
}

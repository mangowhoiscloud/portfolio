import { LandingHero } from "@/components/landing/landing-hero";
import { LandingProjects } from "@/components/landing/landing-projects";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <LandingHero />
      <LandingProjects />
      <LandingFooter />
    </main>
  );
}

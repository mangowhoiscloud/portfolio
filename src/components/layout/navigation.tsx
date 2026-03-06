"use client";

import { LanguageToggle, T } from "@/lib/i18n";
import Link from "next/link";

interface NavLink {
  href: string;
  labelKo: string;
  labelEn: string;
}

const navLinks: NavLink[] = [
  { href: "#overview", labelKo: "Overview", labelEn: "Overview" },
  { href: "#methodology", labelKo: "Methodology", labelEn: "Methodology" },
  { href: "#categories", labelKo: "Categories", labelEn: "Categories" },
  { href: "#architecture", labelKo: "Architecture", labelEn: "Architecture" },
  { href: "#tech", labelKo: "Tech Stack", labelEn: "Tech Stack" },
  { href: "#timeline", labelKo: "Timeline", labelEn: "Timeline" },
];

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo + Project Switcher */}
        <div className="flex items-center gap-3">
          <Link
            href="/eco2"
            className="font-extrabold text-xl text-accent tracking-tight"
          >
            Eco²
          </Link>
          <Link
            href="/geode"
            className="text-xs px-2 py-1 rounded-md bg-white/5 border border-border/50 text-muted-foreground hover:text-foreground hover:border-[#818CF8]/30 transition-colors"
          >
            GEODE →
          </Link>
        </div>

        {/* Nav Links - Hidden on mobile */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <T ko={link.labelKo} en={link.labelEn} />
              </a>
            </li>
          ))}
        </ul>

        {/* Language Toggle */}
        <LanguageToggle />
      </div>
    </nav>
  );
}

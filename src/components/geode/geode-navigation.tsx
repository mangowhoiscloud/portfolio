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
  { href: "#architecture", labelKo: "Architecture", labelEn: "Architecture" },
  { href: "#pipeline", labelKo: "Pipeline", labelEn: "Pipeline" },
  { href: "#categories", labelKo: "Categories", labelEn: "Categories" },
  { href: "#tech", labelKo: "Tech Stack", labelEn: "Tech Stack" },
  { href: "#blog", labelKo: "Blog", labelEn: "Blog" },
];

export function GeodeNavigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo + Project Switcher */}
        <div className="flex items-center gap-3">
          <Link
            href="/geode"
            className="font-extrabold text-xl text-[#818CF8] tracking-tight"
          >
            GEODE
          </Link>
          <Link
            href="/eco2"
            className="text-xs px-2 py-1 rounded-md bg-white/5 border border-border/50 text-muted-foreground hover:text-foreground hover:border-[#E5A83B]/30 transition-colors"
          >
            <T ko="← Eco²" en="← Eco²" />
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

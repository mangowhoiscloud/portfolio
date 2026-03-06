"use client";

import { T } from "@/lib/i18n";

export function LandingFooter() {
  return (
    <footer className="py-12 px-4 md:px-8 border-t border-border/50">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-sm text-muted-foreground">
          © 2024-2025 Jihwan Ryu
        </span>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/mangowhoiscloud"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://rooftopsnow.tistory.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <T ko="기술 블로그" en="Tech Blog" />
          </a>
        </div>
      </div>
    </footer>
  );
}

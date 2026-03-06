"use client";

import { T } from "@/lib/i18n";

export function Footer() {
  return (
    <footer className="py-12 px-4 md:px-8 border-t border-border/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-extrabold text-xl text-accent">Eco²</span>
            <span className="text-sm text-muted-foreground">
              © 2024-2025 Jihwan Ryu. All rights reserved.
            </span>
          </div>

          {/* Links */}
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
            <a
              href="https://frontend.dev.growbin.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <T ko="라이브 서비스" en="Live Service" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

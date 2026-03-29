"use client";

import { useState, useEffect, useRef } from "react";

const navItems = [
  { id: "hero", label: "Overview" },
  { id: "scaffold", label: "Scaffold" },
  { id: "kanban", label: "Kanban" },
  { id: "loop", label: "Loop" },
  { id: "reasoning", label: "Reasoning" },
  { id: "architecture", label: "Architecture" },
  { id: "gateway", label: "Gateway" },
  { id: "headless", label: "Headless" },
  { id: "scheduler", label: "Scheduler" },
  { id: "hooks", label: "Hooks" },
  { id: "agents", label: "Agents" },
  { id: "tools", label: "Tool Use" },
  { id: "context", label: "Context" },
  { id: "llm", label: "Multi-LLM" },
  { id: "domain", label: "Domain" },
  { id: "scoring", label: "Scoring" },
  { id: "feedback", label: "Feedback" },
  { id: "verify", label: "Verify" },
  { id: "timeline", label: "Timeline" },
];

export function GeodeNav() {
  const [active, setActive] = useState("hero");
  const [visible, setVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // IntersectionObserver for auto-highlighting
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observerRef.current?.disconnect();
    };
  }, []);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!visible) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B1628]/85 backdrop-blur-md border-b border-white/[0.04]">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        <span className="text-xs font-mono font-bold text-white/30 shrink-0 mr-2">GEODE</span>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="shrink-0 px-2.5 py-1 rounded text-[11px] font-mono transition-all duration-200"
            style={{
              color: active === item.id ? "#4ECDC4" : "#7A8CA8",
              background: active === item.id ? "rgba(78,205,196,0.08)" : "transparent",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

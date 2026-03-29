"use client";

import { useState, useEffect, useRef } from "react";

/* ── Grouped navigation: 19 sections → 9 nav items ── */
type NavItem = {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
};

const navGroups: NavItem[] = [
  { id: "hero", label: "Overview" },
  {
    id: "scaffold", label: "Scaffold",
    children: [
      { id: "scaffold", label: "Workflow" },
      { id: "kanban", label: "Kanban" },
    ],
  },
  {
    id: "loop", label: "Loop",
    children: [
      { id: "loop", label: "AgenticLoop" },
      { id: "reasoning", label: "Reasoning" },
    ],
  },
  {
    id: "architecture", label: "Arch",
    children: [
      { id: "architecture", label: "6-Layer Stack" },
      { id: "gateway", label: "Gateway" },
      { id: "headless", label: "Headless" },
      { id: "scheduler", label: "Scheduler" },
    ],
  },
  {
    id: "hooks", label: "Runtime",
    children: [
      { id: "hooks", label: "Hooks" },
      { id: "agents", label: "Agents" },
      { id: "tools", label: "Tool Use" },
    ],
  },
  {
    id: "context", label: "Memory",
    children: [
      { id: "context", label: "Context" },
      { id: "llm", label: "Multi-LLM" },
    ],
  },
  {
    id: "domain", label: "Domain",
    children: [
      { id: "domain", label: "Domain DAG" },
      { id: "scoring", label: "Scoring" },
      { id: "feedback", label: "Feedback" },
    ],
  },
  { id: "verify", label: "Verify" },
  { id: "timeline", label: "Timeline" },
];

/* All section IDs for IntersectionObserver */
const allSectionIds = navGroups.flatMap((g) =>
  g.children ? g.children.map((c) => c.id) : [g.id]
);

/* Find which group a section belongs to */
function findGroupForSection(sectionId: string): string {
  for (const g of navGroups) {
    if (g.id === sectionId) return g.id;
    if (g.children?.some((c) => c.id === sectionId)) return g.id;
  }
  return "hero";
}

export function GeodeNav() {
  const [activeSection, setActiveSection] = useState("hero");
  const [visible, setVisible] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeGroup = findGroupForSection(activeSection);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    allSectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observerRef.current?.disconnect();
    };
  }, []);

  function scrollTo(id: string) {
    setOpenGroup(null);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleEnter(groupId: string) {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setOpenGroup(groupId);
  }

  function handleLeave() {
    closeTimerRef.current = setTimeout(() => setOpenGroup(null), 200);
  }

  if (!visible) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B1628]/85 backdrop-blur-md border-b border-white/[0.04]">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-0.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        <span className="text-xs font-mono font-bold text-white/30 shrink-0 mr-3">GEODE</span>
        {navGroups.map((group) => {
          const isActive = activeGroup === group.id;
          const isOpen = openGroup === group.id;
          const hasChildren = group.children && group.children.length > 1;

          return (
            <div
              key={group.id}
              className="relative shrink-0"
              onMouseEnter={() => hasChildren && handleEnter(group.id)}
              onMouseLeave={handleLeave}
            >
              <button
                onClick={() => scrollTo(group.id)}
                className="px-2.5 py-1 rounded text-[11px] font-mono transition-all duration-200 flex items-center gap-1"
                style={{
                  color: isActive ? "#4ECDC4" : "#7A8CA8",
                  background: isActive ? "rgba(78,205,196,0.08)" : "transparent",
                }}
              >
                {group.label}
                {hasChildren && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" opacity={0.4}>
                    <path d="M2 3l2 2 2-2" stroke="currentColor" strokeWidth="1" fill="none" />
                  </svg>
                )}
              </button>

              {/* Dropdown */}
              {hasChildren && isOpen && (
                <div
                  className="absolute top-full left-0 mt-1 py-1 rounded-lg border border-white/[0.06] bg-[#0B1628]/95 backdrop-blur-md min-w-[120px] shadow-xl"
                  onMouseEnter={() => handleEnter(group.id)}
                  onMouseLeave={handleLeave}
                >
                  {group.children!.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => scrollTo(child.id)}
                      className="block w-full text-left px-3 py-1.5 text-[11px] font-mono transition-colors duration-150 hover:bg-white/[0.04]"
                      style={{
                        color: activeSection === child.id ? "#4ECDC4" : "#7A8CA8",
                      }}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

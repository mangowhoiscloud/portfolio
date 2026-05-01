/**
 * GEODE Docs sitemap — single source of truth for navigation and route generation.
 *
 * Each leaf entry maps to a static page at /geode/docs/<slug>.
 * Sections are rendered in the sidebar in the order declared.
 */

export type DocPage = {
  slug: string; // path segments joined by "/" (no leading slash)
  title: string;
  summary?: string;
  status?: "draft" | "stub" | "ready";
};

export type DocSection = {
  id: string;
  title: string;
  pages: DocPage[];
};

export const DOCS_SITEMAP: DocSection[] = [
  {
    id: "intro",
    title: "Introduction",
    pages: [
      { slug: "", title: "Overview", summary: "What GEODE is and how the docs are organized", status: "ready" },
      { slug: "quick-start", title: "Quick Start", summary: "Install and run", status: "ready" },
    ],
  },
  {
    id: "architecture",
    title: "Architecture",
    pages: [
      { slug: "architecture/overview", title: "4-Layer Stack", summary: "Model → Runtime → Harness → Agent", status: "ready" },
      { slug: "architecture/agentic-loop", title: "Agentic Loop", summary: "while(tool_use) primitive", status: "ready" },
      { slug: "architecture/system-index", title: "System Index", summary: "All subsystems catalog", status: "ready" },
    ],
  },
  {
    id: "runtime-llm",
    title: "Runtime · LLM",
    pages: [
      { slug: "runtime/llm/prompt-system", title: "Prompt System", summary: "5-layer prompt architecture", status: "ready" },
      { slug: "runtime/llm/prompt-caching", title: "Prompt Caching", summary: "STATIC/DYNAMIC boundary + ephemeral", status: "ready" },
      { slug: "runtime/llm/prompt-hashing", title: "Prompt Hashing", summary: "Karpathy P4 ratchet, 20 pinned hashes", status: "ready" },
      { slug: "runtime/llm/providers", title: "Providers", summary: "Anthropic / OpenAI / Codex / GLM", status: "ready" },
      { slug: "runtime/llm/langsmith", title: "LangSmith", summary: "Opt-in tracing", status: "ready" },
    ],
  },
  {
    id: "runtime-tools",
    title: "Runtime · Tools",
    pages: [
      { slug: "runtime/tools/protocol", title: "Tool Protocol", summary: "Tool registry, deferred loading", status: "ready" },
      { slug: "runtime/tools/mcp", title: "MCP Servers", summary: "16 servers, 25K guard", status: "ready" },
    ],
  },
  {
    id: "runtime-memory",
    title: "Runtime · Memory",
    pages: [
      { slug: "runtime/memory/5-tier", title: "5-Tier Context", summary: "raw → assembled → projected", status: "ready" },
    ],
  },
  {
    id: "harness",
    title: "Harness",
    pages: [
      { slug: "harness/cli", title: "CLI & Slash Commands", summary: "Thin gateway + IPC", status: "ready" },
      { slug: "harness/hooks", title: "Hook System", summary: "58 events lifecycle", status: "ready" },
      { slug: "harness/lifecycle", title: "Lifecycle", summary: "Bootstrap / serve / shutdown", status: "ready" },
    ],
  },
  {
    id: "verification",
    title: "Verification",
    pages: [
      { slug: "verification/guardrails", title: "Guardrails G1-G4", summary: "Schema/Range/Grounding/Coherence", status: "ready" },
      { slug: "verification/biasbuster", title: "BiasBuster", summary: "6 bias detection", status: "ready" },
    ],
  },
  {
    id: "plugins",
    title: "Plugins",
    pages: [
      { slug: "plugins/game-ip", title: "Game IP Plugin", summary: "4 Analysts + 3 Evaluators + Synthesizer", status: "ready" },
    ],
  },
  {
    id: "reference",
    title: "Reference",
    pages: [
      { slug: "reference/changelog", title: "Changelog", summary: "Version history", status: "ready" },
      { slug: "reference/frontier-comparison", title: "Frontier Comparison", summary: "GEODE vs Hermes/OpenClaw/Claude Code", status: "ready" },
    ],
  },
];

/** Flat list of all leaf pages — used by [...slug]/generateStaticParams. */
export function flattenSitemap(): DocPage[] {
  const out: DocPage[] = [];
  for (const section of DOCS_SITEMAP) {
    for (const page of section.pages) {
      out.push(page);
    }
  }
  return out;
}

/** Look up a page by slug (no leading slash, may be empty for index). */
export function findPage(slug: string): { page: DocPage; section: DocSection } | undefined {
  for (const section of DOCS_SITEMAP) {
    for (const page of section.pages) {
      if (page.slug === slug) return { page, section };
    }
  }
  return undefined;
}

/** Compute prev/next navigation for a given slug. */
export function adjacentPages(slug: string): { prev?: DocPage; next?: DocPage } {
  const all = flattenSitemap();
  const idx = all.findIndex((p) => p.slug === slug);
  if (idx < 0) return {};
  return {
    prev: idx > 0 ? all[idx - 1] : undefined,
    next: idx < all.length - 1 ? all[idx + 1] : undefined,
  };
}

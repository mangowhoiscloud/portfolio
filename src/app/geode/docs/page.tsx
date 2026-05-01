import Link from "next/link";
import { DocsShell } from "@/components/geode-docs/docs-shell";
import { DOCS_SITEMAP } from "@/lib/geode-docs/sitemap";

export default function DocsIndex() {
  return (
    <DocsShell
      slug=""
      title="GEODE Documentation"
      summary="A general-purpose autonomous execution agent built on LangGraph. v0.64.0, Python 3.12+, 223 core + 13 plugins, 4360+ tests, 58 hooks, 56 tools."
    >
      <h2>What you&apos;ll find here</h2>
      <p>
        This site documents GEODE&apos;s architecture, runtime, harness, and plugin
        ecosystem. It is generated from the codebase and the wiki at
        {" "}
        <code>mango-wiki/projects/geode</code>, and reflects the current
        production version.
      </p>

      <h2>Sections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 not-prose">
        {DOCS_SITEMAP.filter((s) => s.id !== "intro").map((section) => (
          <Link
            key={section.id}
            href={`/geode/docs/${section.pages[0]?.slug ?? ""}`}
            className="block rounded-lg border border-white/[0.06] hover:border-white/[0.14] p-4 transition-colors group"
          >
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 mb-1.5">
              {section.id}
            </div>
            <div className="text-[#F0F0FF] font-display font-semibold text-lg group-hover:text-white">
              {section.title}
            </div>
            <div className="mt-1 text-sm text-white/60">
              {section.pages.length} page{section.pages.length === 1 ? "" : "s"}
              {" — "}
              {section.pages.slice(0, 3).map((p, i) => (
                <span key={p.slug}>
                  {i > 0 && ", "}
                  {p.title}
                </span>
              ))}
              {section.pages.length > 3 && ", …"}
            </div>
          </Link>
        ))}
      </div>

      <h2>Status</h2>
      <p>
        All sections are content-complete as of the date in the footer.
        Pages are hand-curated narrative — no auto-generated API reference.
      </p>

      <h2>Out of scope</h2>
      <ul>
        <li>API reference auto-generation (this site is hand-curated narrative)</li>
        <li>Search index (the sidebar is the navigation surface)</li>
        <li>Versioned docs (the site reflects the current main branch)</li>
      </ul>
    </DocsShell>
  );
}

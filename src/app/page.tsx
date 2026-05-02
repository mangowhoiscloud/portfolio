import Link from "next/link";

const projects = [
  {
    id: "geode",
    title: "GEODE",
    subtitle: "Agentic OS, built by its own scaffold.",
    description: "v0.65.0 · 236 modules · 4380+ tests · 64+ releases · 20 pinned prompts. Two apps proven on the same harness: Game IP (plugin) and Migration / REODE (fork).",
    status: "v0.65.0",
    color: "#7BD2FF",
    badge: "Main thesis",
  },
  {
    id: "geode/scaffold",
    title: "Scaffold",
    subtitle: "The line that ships GEODE.",
    description: "8-Step workflow + CANNOT/CAN 22 rules + 5 Karpathy P4 ratchets + MD kanban. The discipline behind one person running 64+ releases without regression.",
    status: "deep-dive",
    color: "#F4B8C8",
    badge: "Production line",
  },
  {
    id: "reode",
    title: "REODE",
    subtitle: "Migration / autonomous code transformation.",
    description: "GEODE v0.12 fork → Java 1.8→22, Spring 4.3→6.1. 5,523 files · 83/83 tests · 5h48m · $388. OpenRewrite (70%) + LLM (30%) hybrid.",
    status: "case study",
    color: "#34D399",
    badge: "App on the OS",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-16 px-6 py-16">
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-extrabold tracking-tight font-[family-name:var(--font-inter)]">
          Jihwan Ryu
        </h1>
        <p className="text-lg text-white/55 font-[family-name:var(--font-fira-code)]">
          Backend · Agentic AI · Harness Engineering
        </p>
        <p className="text-[13px] text-white/35 max-w-xl mx-auto leading-relaxed">
          LLM is the new compute. The agent is its OS. Three exhibits below — one
          OS, one production line, one app proven on the line.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl w-full">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/${p.id}`}
            className="group block rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.04] hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-70"
                style={{ color: p.color }}
              >
                {p.badge}
              </span>
              <span className="text-[10px] font-mono text-white/35">
                {p.status}
              </span>
            </div>
            <h2
              className="text-2xl font-bold mb-1 tracking-tight"
              style={{ color: p.color }}
            >
              {p.title}
            </h2>
            <p className="text-sm text-white/55 font-mono mb-3 leading-snug">
              {p.subtitle}
            </p>
            <p className="text-[13px] text-white/55 leading-relaxed">
              {p.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="text-[11px] text-white/30 font-mono text-center">
        github.com/mangowhoiscloud · Last updated 2026-05-02
      </div>
    </main>
  );
}

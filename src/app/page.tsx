import Link from "next/link";

const projects = [
  {
    id: "geode",
    title: "GEODE",
    subtitle: "Agentic OS, built by its own scaffold.",
    description:
      "v0.65.0 · 236 modules · 4380+ tests · 64+ releases · 20 pinned prompts. Two apps proven on the same harness — Game IP (plugin) and Migration / REODE (fork).",
    status: "v0.65.0",
    badge: "Main thesis",
    accent: "var(--acc-artifact)",
  },
  {
    id: "geode/scaffold",
    title: "Scaffold",
    subtitle: "The line that ships GEODE.",
    description:
      "8-Step workflow + CANNOT/CAN 22 rules + 5 Karpathy P4 ratchets + MD kanban. The discipline behind one person running 64+ releases without regression.",
    status: "deep-dive",
    badge: "Production line",
    accent: "var(--acc-line)",
  },
  {
    id: "reode",
    title: "REODE",
    subtitle: "Migration / autonomous code transformation.",
    description:
      "GEODE v0.12 fork → Java 1.8→22, Spring 4.3→6.1. 5,523 files · 83/83 tests · 5h48m · $388. OpenRewrite (70%) + LLM (30%) hybrid.",
    status: "case study",
    badge: "App on the OS",
    accent: "var(--acc-artifact)",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)] px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <div className="mb-20">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--ink-3)]">
            Portfolio · 2026-05-02
          </span>
          <h1 className="mt-6 font-display tracking-tight text-[clamp(3rem,7vw,4.5rem)] leading-[1.05] font-semibold text-[var(--ink)]">
            Jihwan Ryu
          </h1>
          <p className="mt-3 font-display text-[clamp(1.1rem,2vw,1.4rem)] text-[var(--ink-1)]">
            Backend · Agentic AI · Harness Engineering
          </p>
          <p className="mt-6 max-w-2xl text-[16px] leading-[1.75] text-[var(--ink-2)]">
            LLM이 새 컴퓨트라면, 그 위의 운영체제는 자율 에이전트다. 아래의
            세 전시가 그 한 문장을 받친다. 출시되는 운영체제 자체, 매주 그것을
            세상에 내보내는 생산 라인, 그리고 그 라인이 만들어 낸 앱 하나.
          </p>
        </div>

        <div className="space-y-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/${p.id}`}
              className="group block rounded border border-[var(--rule)] bg-[var(--paper-2)] px-6 py-6 transition-colors hover:border-[var(--ink-3)]"
            >
              <div className="flex items-baseline justify-between mb-2">
                <span
                  className="font-mono text-[10px] tracking-widest uppercase"
                  style={{ color: p.accent }}
                >
                  {p.badge}
                </span>
                <span className="font-mono text-[10px] text-[var(--ink-3)]">
                  {p.status}
                </span>
              </div>
              <h2
                className="font-display text-2xl font-semibold mb-1 tracking-tight"
                style={{ color: p.accent }}
              >
                {p.title}
              </h2>
              <p className="text-[14px] text-[var(--ink-1)] mb-3 leading-snug">
                {p.subtitle}
              </p>
              <p className="text-[13px] text-[var(--ink-2)] leading-relaxed">
                {p.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-20 text-[11px] font-mono text-[var(--ink-3)]">
          github.com/mangowhoiscloud · Last updated 2026-05-02
        </div>
      </div>
    </main>
  );
}

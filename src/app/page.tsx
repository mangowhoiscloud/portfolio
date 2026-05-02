import Link from "next/link";

const projects = [
  {
    id: "geode",
    title: "GEODE",
    subtitle: "자율 에이전트 기반 운영체제 구현",
    description:
      "v0.65.0, 236 모듈, 4,380 테스트, 64회 릴리스. 동일 하네스 위에서 두 도메인(Game IP 플러그인, Migration fork)을 검증했습니다. 안드레이 카르파시의 LLM-OS 다이어그램을 코드로 옮긴 사례입니다.",
    status: "v0.65.0",
    badge: "Main thesis",
    accent: "var(--acc-artifact)",
  },
  {
    id: "reode",
    title: "REODE",
    subtitle: "자율 코드 마이그레이션 에이전트",
    description:
      "GEODE v0.12 fork. Java 1.8 → 22, Spring 4.3 → 6.1 마이그레이션을 자율적으로 수행했습니다. 5,523 파일, 83/83 모듈 통과, 5시간 48분, $388. OpenRewrite 70% + LLM 30% 하이브리드 구조입니다.",
    status: "case study",
    badge: "Application",
    accent: "var(--acc-line)",
  },
];

const now = [
  { date: "2026-05-03", body: "GEODE v0.65.0 운영 중. Anthropic messages cache_control 도입 후 다음 우선순위는 Layer 2 verification 강화." },
  { date: "2026-05-02", body: "Portfolio Editorial 디자인 언어 정립. amethyst × citrine accent, 합니다체 voice." },
  { date: "2026-05-01", body: "messages cache_control PR #864 → #865 머지. 프롬프트 시스템 wiki 시리즈 6편 ingest." },
];

const recognition = [
  { label: "SeSACTHON 2025 Excellence", detail: "Eco² · 181팀 중 4위 · 단독 풀스택" },
  { label: "Nexon AI Engineer 코딩 과제 합격", detail: "GEODE의 시작점. 면접 탈락 후 자율 실행 하네스로 전환" },
  { label: "기술 블로그 361편 / YouTube 213 subs", detail: "rooftopsnow.tistory.com / Harness 카테고리" },
];

const influences = [
  { name: "Andrej Karpathy", note: "LLM-OS sketch (Intro to LLMs, 2023), autoresearch ratchet discipline (P1–P10)" },
  { name: "Anthropic Claude Code", note: "while(tool_use) primitive, hook system, CLAUDE.md 스캐폴드 패턴" },
  { name: "OpenClaw", note: "Policy Chain, Lane Queue, Session 격리, Plugin discovery" },
  { name: "Hermes Agent", note: "system_and_3 cache_control, 멀티채널 personal agent 패턴" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)] px-6 py-24">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-20">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--ink-3)]">
            Portfolio · 2026-05-03
          </span>
          <h1 className="mt-6 font-display tracking-tight text-[clamp(3rem,7vw,4.5rem)] leading-[1.05] font-semibold text-[var(--ink)]">
            Jihwan Ryu
          </h1>
          <p className="mt-3 font-display text-[clamp(1.1rem,2vw,1.4rem)] text-[var(--ink-1)]">
            Backend · Agentic AI · Harness Engineering
          </p>
          <p className="mt-6 max-w-2xl text-[16px] leading-[1.75] text-[var(--ink-2)]">
            자율 에이전트를 컴퓨팅의 운영체제로 다루는 작업을 하고 있습니다.
            아래의 두 가지 작업물과 부수적인 운영 항목을 정리해 두었습니다.
          </p>
        </header>

        {/* Now */}
        <section className="mb-20">
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-3)]">
              § Now
            </span>
            <span className="font-mono text-[10px] text-[var(--ink-3)]">
              현재 작업
            </span>
          </div>
          <ul className="space-y-3">
            {now.map((entry, i) => (
              <li key={i} className="flex gap-4 text-[14px]">
                <span className="font-mono text-[12px] text-[var(--ink-3)] shrink-0 w-24 pt-0.5">
                  {entry.date}
                </span>
                <span className="text-[var(--ink-2)] leading-relaxed">
                  {entry.body}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Selected Work */}
        <section className="mb-20">
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-3)]">
              § Selected Work
            </span>
            <span className="font-mono text-[10px] text-[var(--ink-3)]">
              주요 작업물
            </span>
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
        </section>

        {/* Recognition */}
        <section className="mb-20">
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-3)]">
              § Recognition
            </span>
            <span className="font-mono text-[10px] text-[var(--ink-3)]">
              수상 / 활동
            </span>
          </div>
          <ul className="space-y-3">
            {recognition.map((r, i) => (
              <li key={i} className="text-[14px] leading-relaxed">
                <div className="text-[var(--ink-1)]">{r.label}</div>
                <div className="text-[13px] text-[var(--ink-3)] mt-0.5">
                  {r.detail}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Influences */}
        <section className="mb-20">
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-3)]">
              § Influences
            </span>
            <span className="font-mono text-[10px] text-[var(--ink-3)]">
              참고한 작업
            </span>
          </div>
          <ul className="space-y-3">
            {influences.map((inf, i) => (
              <li key={i} className="text-[14px] leading-relaxed">
                <span className="text-[var(--ink-1)] font-medium">
                  {inf.name}
                </span>
                <span className="text-[var(--ink-3)] mx-2">·</span>
                <span className="text-[var(--ink-2)]">{inf.note}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-[var(--rule)] text-[11px] font-mono text-[var(--ink-3)] flex flex-wrap gap-x-6 gap-y-2">
          <span>github.com/mangowhoiscloud</span>
          <span>last updated 2026-05-03</span>
          <Link href="/geode" className="hover:text-[var(--acc-artifact)] transition-colors">
            → /geode
          </Link>
          <Link href="/geode/docs" className="hover:text-[var(--acc-artifact)] transition-colors">
            → /geode/docs
          </Link>
          <a
            href="https://rooftopsnow.tistory.com/category/Harness"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--acc-artifact)] transition-colors"
          >
            → dev blog
          </a>
        </footer>
      </div>
    </main>
  );
}

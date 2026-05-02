import Link from "next/link";

const projects = [
  {
    id: "geode",
    title: "GEODE",
    subtitle: "자율 에이전트 기반 운영체제 구현",
    description:
      "v0.65.0, 236 모듈, 4,380 테스트, 64회 릴리스, 핀 고정 프롬프트 20개. 동일 하네스 위에서 두 도메인(Game IP 플러그인, Migration fork)을 검증했습니다.",
    status: "v0.65.0",
    badge: "Main thesis",
    accent: "var(--acc-artifact)",
  },
  {
    id: "geode/scaffold",
    title: "Scaffold",
    subtitle: "GEODE를 빌드하는 생산 라인",
    description:
      "8단계 워크플로, CANNOT/CAN 22개 규칙, Karpathy P4 ratchet 5종, 마크다운 칸반. 단독 개발자가 64회 릴리스를 무회귀로 운영한 디시플린입니다.",
    status: "deep-dive",
    badge: "Production line",
    accent: "var(--acc-line)",
  },
  {
    id: "reode",
    title: "REODE",
    subtitle: "자율 코드 마이그레이션 에이전트",
    description:
      "GEODE v0.12 fork. Java 1.8 → 22, Spring 4.3 → 6.1 마이그레이션. 5,523 파일, 83/83 모듈 통과, 5시간 48분, $388. OpenRewrite 70% + LLM 30% 하이브리드 구조입니다.",
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
            자율 에이전트를 컴퓨팅의 운영체제로 다루는 작업을 하고 있습니다.
            아래는 그 작업의 세 가지 전시 항목입니다. 운영체제 자체, 그것을
            빌드하는 생산 라인, 그리고 그 라인에서 출시된 적용 사례입니다.
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

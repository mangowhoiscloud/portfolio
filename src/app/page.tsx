import Link from "next/link";

type Entry = {
  id: string;
  href?: string;
  external?: boolean;
  clickable?: boolean;
  range: string;
  status: string;
  titleKo: string;
  taglineKo: string;
  bodyKo?: string;
  bulletsKo?: string[];
  chips: string[];
  accent: string;
};

const personal: Entry[] = [
  {
    id: "geode",
    href: "/geode",
    range: "2026.03 → 진행 중",
    status: "v0.65.0 · 64 releases",
    titleKo: "GEODE",
    taglineKo: "자율 에이전트 기반 운영체제 구현",
    bodyKo:
      "LLM 위에서 동작하는 자율 에이전트를 운영체제로 다룹니다. 동일한 4계층 하네스 위에서 두 도메인(Game IP 분석 플러그인, Java 1.8 → 22 마이그레이션 fork)을 검증했습니다. 64회 릴리스, 236 모듈, 4,380 테스트, 핀 고정 프롬프트 20개, 단독 개발. 안드레이 카르파시의 LLM-OS 다이어그램을 코드로 옮긴 사례입니다.",
    chips: ["LangGraph", "Hook 58 events", "4-Layer", "Plugin namespace", "Cache control"],
    accent: "var(--acc-artifact)",
  },
  {
    id: "eco2",
    href: "/eco2",
    range: "2025.10 → 2026.02",
    status: "SeSACTHON 2025 Excellence · 4 / 181",
    titleKo: "Eco²",
    taglineKo: "멀티에이전트 재활용 챗봇 백엔드",
    bodyKo:
      "5인 팀 MVP에서 백엔드와 인프라를 단독으로 맡으면서, Cursor 기반 스캐폴드로 LLM을 “생산과 개발의 체계”로 처음 운용해 본 프로젝트입니다. 본선 우수상 이후 약 3개월간 단독으로 고도화하면서 Chat 도메인을 LangGraph 멀티 에이전트로 재구성해 사용자 입장에서의 Agent 사용성을 끌어올렸고, LLM × 2 + Rule-based 파이프라인을 VU 1,000 / 97.8% / 373 RPM까지 스케일업했습니다. EFK · Prometheus · Grafana · Jaeger 4-pillar 관측 스택은 직접 세웠습니다. GEODE의 직접적인 발판이 된 작업입니다.",
    chips: [
      "Cursor + Scaffold (LLM as dev system)",
      "Chat Agent UX",
      "LangGraph multi-agent",
      "Event Bus 3-Tier",
      "Swiss Cheese eval 99.8 / 100",
      "K8s 14 → 24",
    ],
    accent: "var(--acc-line)",
  },
];

const freelance: Entry[] = [
  {
    id: "reode",
    clickable: false,
    range: "2026.03 → 2026.05 (@ pinxlab)",
    status: "GEODE v0.12 fork · case study",
    titleKo: "REODE",
    taglineKo: "자율 코드 마이그레이션 에이전트",
    bulletsKo: [
      "GEODE v0.12에서 분기해 Java 1.8 → 22, Spring 4.3 → 6.1 마이그레이션을 자율 수행했습니다.",
      "5,523 파일 엔터프라이즈 프로젝트에서 83 / 83 모듈 빌드를 통과시켰습니다.",
      "에러 4분류 라우팅(CONFIG / CODE / BEHAVIOR / ENV)과 Architect / Editor 분리 구조 위에서 OpenRewrite 70 % + LLM 30 % 하이브리드로 동작합니다.",
      "5시간 48분, 1,133턴 자율 수행, 누적 비용 $388에 마쳤습니다.",
    ],
    chips: ["Java 1.8 → 22", "Spring 4.3 → 6.1", "83 / 83 modules", "5h 48m · $388", "OpenRewrite + LLM"],
    accent: "var(--acc-artifact)",
  },
  {
    id: "kiki",
    clickable: false,
    range: "2026.04 → 진행 중 (@ pinxlab)",
    status: "Paperclip plugin · 184 commits · 60 PRs",
    titleKo: "Kiki",
    taglineKo: "Slack 행동 관측 기반 멀티 에이전트 거버넌스",
    bulletsKo: [
      "Slack 채널 관측에서 시작해 행동 시그널을 추출하고, Profile Merge → Directive Generation → Paperclip Company Skills API PATCH로 이어지는 파이프라인으로 에이전트 시스템 프롬프트에 직접 주입합니다. 원문은 수집하지 않고 시그널만 보관합니다.",
      "Confidence scoring + temporal decay 기반 4축 프로파일 모델, C1–C21 워크플로우 가드레일, Per-agent / company-wide circuit breaker로 운영 안전선을 구성합니다.",
      "12개 런타임 에이전트(Engineering 9 + Finance 3) + 16 Skill + 24 event handler + 9개 Slack intent command + Hub-Spoke(CTO 라우터 → PO·Planner → Lead·Dev·QA) 구조입니다.",
      "자매 코드베이스 kiki-appmaker로 install / lifecycle / 17-agent provisioning을 분리해서, kiki는 정체성·플러그인·MCP·스킬을, AppMaker는 부트스트랩·OAuth 회전·대시보드·PIN 데모를 담당합니다.",
      "v0.3.0 Jira-style 칸반 대시보드 운영 중. 184 commits · 60 PRs · 46 TS modules(12,623 LOC) 누적.",
    ],
    chips: [
      "Slack signal → directive",
      "Hub-Spoke 12 agents",
      "C1–C21 가드레일",
      "Circuit breaker",
      "Paperclip Skills API",
      "Sister: kiki-appmaker",
    ],
    accent: "var(--acc-line)",
  },
];

const now = [
  { date: "2026-05-03", body: "포트폴리오에 Eco² (SeSACTHON 2025 Excellence)와 Kiki(@ pinxlab) 합류. 개인 / 프리랜서 작업을 분리해 정리." },
  { date: "2026-05-02", body: "GEODE v0.65.0 messages cache_control 도입. CHANGELOG 64 릴리스를 7챕터 타임라인으로 재구성." },
  { date: "2026-05-01", body: "베이글코드 과제 전형으로 Claude Code · Codex · Gemini CLI 기반 멀티 에이전트 시스템 Crumb 개발 중." },
];

const recognition = [
  {
    label: "SeSACTHON 2025 Excellence",
    detail: "Eco² · 181팀 중 4위 · MVP 백엔드/인프라 단독 + 본선 이후 단독 고도화 (2025.10 → 2026.02)",
  },
  {
    label: "Furiosa AI · SWE, Agent System 면접 진출",
    detail: "서류 합격, 면접 탈락",
  },
  {
    label: "Nexon AI Engineer 면접 진출",
    detail: "코딩 과제 합격, 면접 탈락 — GEODE의 시작점이 된 전형",
  },
  {
    label: "기술 블로그 361편 / YouTube 213 subs",
    detail: "rooftopsnow.tistory.com / Harness 카테고리",
  },
];

const influences = [
  { name: "Andrej Karpathy", note: "LLM-OS sketch (Intro to LLMs, 2023), autoresearch ratchet discipline (P1–P10)" },
  { name: "Anthropic Claude Code", note: "while(tool_use) primitive, hook system, CLAUDE.md 스캐폴드 패턴" },
  { name: "OpenClaw", note: "Policy Chain, Lane Queue, Session 격리, Plugin discovery" },
  { name: "Hermes Agent", note: "system_and_3 cache_control, 멀티채널 personal agent 패턴" },
];

function ProjectEntry({ e }: { e: Entry }) {
  const inner = (
    <div className="grid grid-cols-1 sm:grid-cols-[170px_1fr] gap-x-8 gap-y-3 py-7">
      {/* Left rail — period + status */}
      <div>
        <div
          className="font-mono text-[11px] tracking-[0.04em] mb-1.5"
          style={{ color: e.accent }}
        >
          {e.range}
        </div>
        <div className="font-mono text-[10.5px] text-[var(--ink-3)] leading-snug">
          {e.status}
        </div>
      </div>

      {/* Body */}
      <div>
        <h3
          className="font-display text-[26px] font-semibold tracking-tight mb-1 leading-tight"
          style={{ color: e.accent }}
        >
          {e.titleKo}
          <span className="ml-2 font-sans text-[14px] font-normal text-[var(--ink-1)]">
            — {e.taglineKo}
          </span>
        </h3>
        {e.bodyKo && (
          <p className="text-[14px] text-[var(--ink-2)] leading-[1.75] mb-3 max-w-2xl">
            {e.bodyKo}
          </p>
        )}
        {e.bulletsKo && (
          <ul className="text-[14px] text-[var(--ink-2)] leading-[1.7] mb-3 max-w-2xl space-y-1.5">
            {e.bulletsKo.map((b, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="shrink-0 text-[var(--ink-3)] font-mono pt-0.5" style={{ color: e.accent }}>
                  ·
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-1.5">
          {e.chips.map((c) => (
            <span
              key={c}
              className="px-2 py-0.5 rounded text-[10.5px] font-mono text-[var(--ink-2)] bg-[var(--paper-2)] border border-[var(--rule)]"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const wrapBase = "block border-b border-[var(--rule)] last:border-b-0";
  if (e.clickable === false || !e.href) {
    return <div className={wrapBase}>{inner}</div>;
  }
  if (e.external) {
    return (
      <a
        href={e.href}
        target="_blank"
        rel="noreferrer"
        className={`${wrapBase} group hover:bg-[var(--paper-2)]/40 transition-colors`}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link
      href={e.href}
      className={`${wrapBase} group hover:bg-[var(--paper-2)]/40 transition-colors`}
    >
      {inner}
    </Link>
  );
}

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
            아래에 개인 작업과 프리랜서로 수행한 작업을 분리해서 정리해 두었습니다.
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

        {/* Selected Work — split into Personal × Freelance, ledger layout */}
        <section className="mb-20">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-3)]">
              § Selected Work
            </span>
            <span className="font-mono text-[10px] text-[var(--ink-3)]">
              주요 작업물
            </span>
          </div>

          {/* Personal */}
          <div className="mt-8">
            <div className="flex items-baseline gap-3 pb-3 border-b border-[var(--rule)]">
              <span className="font-display text-[15px] text-[var(--ink-1)] font-semibold tracking-tight">
                개인 프로젝트
              </span>
              <span className="font-mono text-[10px] text-[var(--ink-3)] tracking-[0.08em]">
                Personal · solo
              </span>
            </div>
            <div className="divide-y divide-[var(--rule)]">
              {personal.map((e) => (
                <ProjectEntry key={e.id} e={e} />
              ))}
            </div>
          </div>

          {/* Freelance @ pinxlab */}
          <div className="mt-12">
            <div className="flex items-baseline gap-3 pb-3 border-b border-[var(--rule)]">
              <span className="font-display text-[15px] text-[var(--ink-1)] font-semibold tracking-tight">
                pinxlab · 프리랜서
              </span>
              <span className="font-mono text-[10px] text-[var(--ink-3)] tracking-[0.08em]">
                Freelance contract · solo IC
              </span>
            </div>
            <div className="divide-y divide-[var(--rule)]">
              {freelance.map((e) => (
                <ProjectEntry key={e.id} e={e} />
              ))}
            </div>
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
          <Link href="/eco2" className="hover:text-[var(--acc-line)] transition-colors">
            → /eco2
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

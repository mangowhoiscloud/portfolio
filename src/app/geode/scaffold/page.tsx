"use client";

import Link from "next/link";
import { LocaleProvider, useLocale, t } from "@/components/geode/locale-context";

const eightSteps = [
  { n: 0, label: "Board + Worktree", labelKo: "보드 + 워크트리" },
  { n: 1, label: "GAP Audit", labelKo: "GAP 감사" },
  { n: 2, label: "Plan + Socratic Gate", labelKo: "플랜 + 소크라틱 게이트" },
  { n: 3, label: "Implement + Test", labelKo: "구현 + 테스트" },
  { n: 4, label: "Verify (GAP audit)", labelKo: "검증 (구현 GAP 감사)" },
  { n: 5, label: "Docs-Sync", labelKo: "Docs 동기화" },
  { n: 6, label: "PR + Merge", labelKo: "PR + 머지" },
  { n: 7, label: "Rebuild + Restart", labelKo: "재빌드 + 재시작" },
  { n: 8, label: "Board Update", labelKo: "보드 갱신" },
];

const cannots = [
  { area: "Git", count: 7 },
  { area: "Planning", count: 1 },
  { area: "Quality", count: 5 },
  { area: "Docs", count: 3 },
  { area: "PR", count: 4 },
];

const ratchets = [
  {
    name: "Prompt Hash Ratchet (P4)",
    nameKo: "프롬프트 해시 래칫 (P4)",
    body: "20 prompts pinned with SHA-256[:12]. CI breaks on drift. Re-pin requires conscious commit.",
    bodyKo: "20개 프롬프트가 SHA-256[:12] 로 핀 고정. 드리프트 시 CI 깨짐. 재핀은 의식적 커밋 필요.",
    file: "core/llm/prompts/__init__.py:_PINNED_HASHES",
  },
  {
    name: "Test Count Ratchet",
    nameKo: "테스트 카운트 래칫",
    body: "4380+ tests. Test count never decreases without explicit reason in CHANGELOG.",
    bodyKo: "4380+ 테스트. CHANGELOG 의 명시적 사유 없이 감소 금지.",
    file: "uv run pytest tests/ -m \"not live\"",
  },
  {
    name: "Module Count Ratchet",
    nameKo: "모듈 카운트 래칫",
    body: "236 modules (core 223 + plugins 13). Decrease requires CHANGELOG entry justifying removal.",
    bodyKo: "236 모듈 (core 223 + plugins 13). 감소 시 CHANGELOG 항목으로 제거 근거 명시.",
    file: "find core/ plugins/ -name \"*.py\" | wc -l",
  },
  {
    name: "CI 5-Job Ratchet",
    nameKo: "CI 5-Job 래칫",
    body: "lint → test → typecheck → security → docs. PR blocked on red. No --no-verify.",
    bodyKo: "lint → test → typecheck → security → docs. red 시 PR 차단. --no-verify 금지.",
    file: ".github/workflows/ci.yml",
  },
  {
    name: "Dependency Ratchet",
    nameKo: "의존성 래칫",
    body: "pyproject.toml deps add-only. Removal requires explicit CHANGELOG justification.",
    bodyKo: "pyproject.toml 의존성 add-only. 제거 시 CHANGELOG 의 명시적 근거 필요.",
    file: "pyproject.toml",
  },
];

function ScaffoldHero() {
  const locale = useLocale();
  return (
    <section className="px-6 py-24 max-w-5xl mx-auto">
      <Link
        href="/geode"
        className="text-sm text-white/55 hover:text-white transition-colors"
      >
        ← /geode
      </Link>
      <div className="mt-8">
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#7A8CA8] mb-3">
          {t(locale, "GEODE — DEEP DIVE", "GEODE — DEEP DIVE")}
        </div>
        <h1 className="font-display font-black tracking-tight text-4xl md:text-6xl text-white/95 leading-[1.05]">
          {t(locale, "라인.", "The line.")}
        </h1>
        <p className="mt-4 text-white/60 max-w-2xl text-[16px] leading-relaxed">
          {t(
            locale,
            "GEODE 가 출시되는 OS 라면, 스캐폴드는 그 OS 가 매주 출시되는 라인이다. 8-Step 워크플로, CANNOT/CAN 22 룰, MD 칸반, 5 종 Karpathy 래칫. 한 사람이 64+ 릴리스를 무회귀로 운영하는 디시플린.",
            "If GEODE is the OS that ships, the scaffold is the line that ships it weekly. 8-Step workflow, 22 CANNOT/CAN rules, MD kanban, 5 Karpathy ratchets. The discipline behind one person running 64+ releases without regression."
          )}
        </p>
        <p className="mt-3 text-white/40 max-w-2xl text-[13px] font-mono">
          GEODE v0.65.0 · 64+ releases · 4380+ tests · solo · 236 modules
        </p>
      </div>
    </section>
  );
}

function EightStep() {
  const locale = useLocale();
  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#7A8CA8] mb-3">
        {t(locale, "§ 1. 8-STEP WORKFLOW", "§ 1. 8-STEP WORKFLOW")}
      </div>
      <h2 className="font-display font-bold text-2xl md:text-3xl text-white/90 mb-3">
        {t(locale, "보드에서 시작해서 보드로 끝난다.", "Board to board.")}
      </h2>
      <p className="text-white/55 text-[14px] leading-relaxed max-w-3xl mb-8">
        {t(
          locale,
          "각 단계는 다음 단계의 입력을 만든다. 스킵 불가. 단계마다 게이트가 있고, 게이트가 닫혀 있으면 PR 자체가 막힌다. 단순한 to-do 리스트가 아니라 라인의 conveyor belt.",
          "Each step produces input for the next. No skipping. Each step has a gate; if a gate is closed, the PR is blocked. Not a to-do list — a line's conveyor belt."
        )}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {eightSteps.map((s) => (
          <div key={s.n} className="rounded-lg border border-white/[0.06] p-4 hover:border-white/[0.12] transition-colors">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[11px] text-[#4ECDC4]">step {s.n}</span>
              <span className="font-display font-medium text-[#F0F0FF]">
                {locale === "ko" ? s.labelKo : s.label}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-[12px] font-mono text-white/40">
        Source: CLAUDE.md (Implementation Workflow § Workflow Steps)
      </p>
    </section>
  );
}

function CannotCan() {
  const locale = useLocale();
  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#7A8CA8] mb-3">
        {t(locale, "§ 2. CANNOT / CAN", "§ 2. CANNOT / CAN")}
      </div>
      <h2 className="font-display font-bold text-2xl md:text-3xl text-white/90 mb-3">
        {t(locale, "20 절대 금지 + 5 자유.", "22 absolute prohibitions + 5 freedoms.")}
      </h2>
      <p className="text-white/55 text-[14px] leading-relaxed max-w-3xl mb-8">
        {t(
          locale,
          "OpenClaw Policy Chain + Codex Sandbox + Karpathy P1 의 직접 차용. CANNOT 가 먼저 — 자유는 나중에. 제약이 품질을 보장.",
          "Direct adoption of OpenClaw's Policy Chain + Codex Sandbox + Karpathy P1. CANNOT first, freedom later. Constraints guarantee quality."
        )}
      </p>
      <div className="rounded-lg border border-white/[0.06] overflow-hidden">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.02]">
              <th className="text-left p-3 font-mono uppercase tracking-wider text-[10px] text-white/45 w-[40%]">
                {t(locale, "영역", "Area")}
              </th>
              <th className="text-left p-3 font-mono uppercase tracking-wider text-[10px] text-white/45 w-[20%]">
                {t(locale, "룰 수", "Rules")}
              </th>
              <th className="text-left p-3 font-mono uppercase tracking-wider text-[10px] text-white/45 w-[40%]">
                {t(locale, "예시", "Examples")}
              </th>
            </tr>
          </thead>
          <tbody>
            {cannots.map((c) => (
              <tr key={c.area} className="border-b border-white/[0.04]">
                <td className="p-3 text-[#F0F0FF] font-medium">{c.area}</td>
                <td className="p-3 font-mono text-[#7BD2FF]/85">{c.count}</td>
                <td className="p-3 text-white/55 text-[13px]">
                  {c.area === "Git" && t(locale, "워크트리 없는 코드 작업 금지, main 직접 push 금지", "no work without worktree, no direct push to main")}
                  {c.area === "Planning" && t(locale, "Socratic Gate 없는 구현 시작 금지", "no implementation without Socratic Gate")}
                  {c.area === "Quality" && t(locale, "lint/type/test 실패 커밋 금지, # type: ignore 남발 금지", "no commit on lint/type/test fail, no excessive type:ignore")}
                  {c.area === "Docs" && t(locale, "CHANGELOG 누락 금지, 4 위치 버전 불일치 금지", "no missing CHANGELOG, no 4-location version mismatch")}
                  {c.area === "PR" && t(locale, "HEREDOC 없는 PR body 금지, Why 없는 PR 금지", "no PR body without HEREDOC, no PR without Why")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-[12px] font-mono text-white/40">
        Source: CLAUDE.md (Implementation Workflow § CANNOT)
      </p>
    </section>
  );
}

function Ratchets() {
  const locale = useLocale();
  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#7A8CA8] mb-3">
        {t(locale, "§ 3. KARPATHY P4 RATCHETS", "§ 3. KARPATHY P4 RATCHETS")}
      </div>
      <h2 className="font-display font-bold text-2xl md:text-3xl text-white/90 mb-3">
        {t(locale, "단방향 게이트 5종.", "Five one-way gates.")}
      </h2>
      <p className="text-white/55 text-[14px] leading-relaxed max-w-3xl mb-8">
        {t(
          locale,
          "Karpathy autoresearch 의 ratchet 디시플린 직접 차용. 한 번 통과한 품질 게이트는 그 아래로 내려가지 못하게 만든다. 모든 ratchet 은 CI 가 강제.",
          "Direct adoption of Karpathy's autoresearch ratchet discipline. A quality gate, once passed, cannot regress below itself. All ratchets enforced by CI."
        )}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ratchets.map((r, i) => (
          <div key={i} className="rounded-lg border border-white/[0.06] p-5 hover:border-white/[0.12] transition-colors">
            <h3 className="font-display font-semibold text-[#F0F0FF] text-[16px] mb-2">
              {locale === "ko" ? r.nameKo : r.name}
            </h3>
            <p className="text-white/55 text-[13px] leading-relaxed mb-3">
              {locale === "ko" ? r.bodyKo : r.body}
            </p>
            <div className="font-mono text-[11px] text-[#FFD8A8]/70">{r.file}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  const locale = useLocale();
  return (
    <footer className="px-6 py-12 max-w-5xl mx-auto text-[12px] text-white/40 border-t border-white/[0.06] mt-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="font-mono">
          GEODE v0.65.0 · scaffold deep-dive · 2026-05-02
        </div>
        <div className="flex gap-4">
          <Link href="/geode" className="hover:text-white">
            ← {t(locale, "GEODE 메인", "GEODE main")}
          </Link>
          <Link href="/geode/docs" className="hover:text-white">
            /geode/docs
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function ScaffoldPage() {
  return (
    <LocaleProvider>
      <main className="min-h-screen bg-[#0B1628] text-[#F0F0FF]">
        <ScaffoldHero />
        <div className="max-w-5xl mx-auto border-t border-white/[0.04]" />
        <EightStep />
        <div className="max-w-5xl mx-auto border-t border-white/[0.04]" />
        <CannotCan />
        <div className="max-w-5xl mx-auto border-t border-white/[0.04]" />
        <Ratchets />
        <Footer />
      </main>
    </LocaleProvider>
  );
}

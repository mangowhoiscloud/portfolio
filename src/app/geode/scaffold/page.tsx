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
        className="text-sm text-[var(--ink-2)] hover:text-white transition-colors"
      >
        ← /geode
      </Link>
      <div className="mt-8">
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--ink-3)] mb-3">
          {t(locale, "GEODE — DEEP DIVE", "GEODE — DEEP DIVE")}
        </div>
        <h1 className="font-display font-black tracking-tight text-4xl md:text-6xl text-[var(--ink)] leading-[1.05]">
          {t(locale, "라인.", "The line.")}
        </h1>
        <p className="mt-4 text-[var(--ink-2)] max-w-2xl text-[16px] leading-relaxed">
          {t(
            locale,
            "GEODE 가 출시되는 OS 라면, 스캐폴드는 그 OS 가 매주 출시되는 라인이다. 8-Step 워크플로, CANNOT/CAN 22 룰, MD 칸반, 5 종 Karpathy 래칫. 한 사람이 64+ 릴리스를 무회귀로 운영하는 디시플린.",
            "If GEODE is the OS that ships, the scaffold is the line that ships it weekly. 8-Step workflow, 22 CANNOT/CAN rules, MD kanban, 5 Karpathy ratchets. The discipline behind one person running 64+ releases without regression."
          )}
        </p>
        <p className="mt-3 text-[var(--ink-3)] max-w-2xl text-[13px] font-mono">
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
      <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--ink-3)] mb-3">
        {t(locale, "§ 1. 8-STEP WORKFLOW", "§ 1. 8-STEP WORKFLOW")}
      </div>
      <h2 className="font-display font-bold text-2xl md:text-3xl text-[var(--ink-1)] mb-3">
        {t(locale, "보드에서 시작해서 보드로 끝난다.", "Board to board.")}
      </h2>
      <p className="text-[var(--ink-2)] text-[14px] leading-relaxed max-w-3xl mb-8">
        {t(
          locale,
          "각 단계는 다음 단계의 입력을 만든다. 스킵 불가. 단계마다 게이트가 있고, 게이트가 닫혀 있으면 PR 자체가 막힌다. 단순한 to-do 리스트가 아니라 라인의 conveyor belt.",
          "Each step produces input for the next. No skipping. Each step has a gate; if a gate is closed, the PR is blocked. Not a to-do list — a line's conveyor belt."
        )}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {eightSteps.map((s) => (
          <div key={s.n} className="rounded-lg border border-[var(--rule)] p-4 hover:border-[var(--ink-3)] transition-colors">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[11px] text-[var(--acc-line)]">step {s.n}</span>
              <span className="font-display font-medium text-[var(--ink)]">
                {locale === "ko" ? s.labelKo : s.label}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-[12px] font-mono text-[var(--ink-3)]">
        Source: CLAUDE.md (Implementation Workflow § Workflow Steps)
      </p>
    </section>
  );
}

function CannotCan() {
  const locale = useLocale();
  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--ink-3)] mb-3">
        {t(locale, "§ 2. CANNOT / CAN", "§ 2. CANNOT / CAN")}
      </div>
      <h2 className="font-display font-bold text-2xl md:text-3xl text-[var(--ink-1)] mb-3">
        {t(locale, "20 절대 금지 + 5 자유.", "22 absolute prohibitions + 5 freedoms.")}
      </h2>
      <p className="text-[var(--ink-2)] text-[14px] leading-relaxed max-w-3xl mb-8">
        {t(
          locale,
          "OpenClaw Policy Chain + Codex Sandbox + Karpathy P1 의 직접 차용. CANNOT 가 먼저 — 자유는 나중에. 제약이 품질을 보장.",
          "Direct adoption of OpenClaw's Policy Chain + Codex Sandbox + Karpathy P1. CANNOT first, freedom later. Constraints guarantee quality."
        )}
      </p>
      <div className="rounded-lg border border-[var(--rule)] overflow-hidden">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="border-b border-[var(--rule)] bg-[var(--paper-2)]">
              <th className="text-left p-3 font-mono uppercase tracking-wider text-[10px] text-[var(--ink-2)] w-[40%]">
                {t(locale, "영역", "Area")}
              </th>
              <th className="text-left p-3 font-mono uppercase tracking-wider text-[10px] text-[var(--ink-2)] w-[20%]">
                {t(locale, "룰 수", "Rules")}
              </th>
              <th className="text-left p-3 font-mono uppercase tracking-wider text-[10px] text-[var(--ink-2)] w-[40%]">
                {t(locale, "예시", "Examples")}
              </th>
            </tr>
          </thead>
          <tbody>
            {cannots.map((c) => (
              <tr key={c.area} className="border-b border-[var(--rule-soft)]">
                <td className="p-3 text-[var(--ink)] font-medium">{c.area}</td>
                <td className="p-3 font-mono text-[var(--acc-line)]">{c.count}</td>
                <td className="p-3 text-[var(--ink-2)] text-[13px]">
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
      <p className="mt-6 text-[12px] font-mono text-[var(--ink-3)]">
        Source: CLAUDE.md (Implementation Workflow § CANNOT)
      </p>
    </section>
  );
}

function Ratchets() {
  const locale = useLocale();
  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--ink-3)] mb-3">
        {t(locale, "§ 3. KARPATHY P4 RATCHETS", "§ 3. KARPATHY P4 RATCHETS")}
      </div>
      <h2 className="font-display font-bold text-2xl md:text-3xl text-[var(--ink-1)] mb-3">
        {t(locale, "단방향 게이트 5종.", "Five one-way gates.")}
      </h2>
      <p className="text-[var(--ink-2)] text-[14px] leading-relaxed max-w-3xl mb-8">
        {t(
          locale,
          "Karpathy autoresearch 의 ratchet 디시플린 직접 차용. 한 번 통과한 품질 게이트는 그 아래로 내려가지 못하게 만든다. 모든 ratchet 은 CI 가 강제.",
          "Direct adoption of Karpathy's autoresearch ratchet discipline. A quality gate, once passed, cannot regress below itself. All ratchets enforced by CI."
        )}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ratchets.map((r, i) => (
          <div key={i} className="rounded-lg border border-[var(--rule)] p-5 hover:border-[var(--ink-3)] transition-colors">
            <h3 className="font-display font-semibold text-[var(--ink)] text-[16px] mb-2">
              {locale === "ko" ? r.nameKo : r.name}
            </h3>
            <p className="text-[var(--ink-2)] text-[13px] leading-relaxed mb-3">
              {locale === "ko" ? r.bodyKo : r.body}
            </p>
            <div className="font-mono text-[11px] text-[var(--acc-line)]/85">{r.file}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WorkingExample() {
  const locale = useLocale();
  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--ink-3)] mb-3">
        {t(locale, "§ 4. WORKING EXAMPLE", "§ 4. WORKING EXAMPLE")}
      </div>
      <h2 className="font-display font-bold text-2xl md:text-3xl text-[var(--ink-1)] mb-3">
        {t(locale, "어디서든 geode를 친다.", "Type geode anywhere.")}
      </h2>
      <p className="text-[var(--ink-2)] text-[14px] leading-relaxed max-w-3xl mb-6">
        {t(
          locale,
          "OS-grade 시스템의 첫 시그널은 PATH에 살아있는 단일 명령이다. 한 번 설치하면 어느 디렉토리에서든 geode가 부팅한다. 프로젝트 종속이 아니라 컴퓨팅 substrate에 종속.",
          "The first signal of an OS-grade system is a single command living on PATH. Install once, and geode boots from any directory. It belongs to the compute substrate, not to a project."
        )}
      </p>

      <div className="rounded-lg overflow-hidden border border-[var(--rule)] mb-6">
        <div className="bg-[var(--code-bg)] px-5 py-4 font-mono text-[12.5px] leading-[1.7] text-[var(--code-text)]">
          <div className="text-[var(--ink-3)] mb-2">{`# 1. 한 번 설치 (uv tool — PATH 에 등록)`}</div>
          <div><span className="text-[var(--code-string)]">$</span> uv tool install -e .</div>
          <div><span className="text-[var(--code-string)]">$</span> which geode</div>
          <div className="text-[var(--ink-2)]">~/.local/bin/geode</div>
          <div className="mt-4 text-[var(--ink-3)]">{`# 2. 어느 디렉토리에서든`}</div>
          <div><span className="text-[var(--code-string)]">$</span> cd ~/projects/anywhere</div>
          <div><span className="text-[var(--code-string)]">$</span> geode</div>
          <div className="mt-1 text-[var(--ink-2)]">{`  ╲╲( ◕ ᵕ ◕ )╱╱  GEODE v0.65.0`}</div>
          <div className="text-[var(--ink-2)]">{`                       claude-opus-4-7 · autonomous execution agent`}</div>
          <div className="text-[var(--ink-2)]">{`                       /Users/mango/projects/anywhere`}</div>
          <div className="mt-2 text-[var(--ink-2)]">{`  harness: GEODE`}</div>
          <div className="text-[var(--ink-2)]">{`  ✓ LLM Analysis  ✓ Project Memory  ✓ User Profile`}</div>
          <div className="text-[var(--ink-2)]">{`  ✓ Connected to serve via IPC  ✓ Session: cli-2f985c53`}</div>
          <div className="mt-2"><span className="text-[var(--code-string)]">{`>`}</span> _</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-lg border border-[var(--rule)] p-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--acc-line)] mb-2">
            {t(locale, "PATH-installed", "PATH-installed")}
          </div>
          <p className="text-[13px] text-[var(--ink-2)] leading-relaxed">
            {t(
              locale,
              "geode 는 단일 entrypoint (geode.cli:app). uv tool install -e . 로 ~/.local/bin/geode 에 심볼릭 링크 등록. python 모듈 호출이 아니라 unix 명령.",
              "geode is a single entrypoint (geode.cli:app). uv tool install -e . links it into ~/.local/bin/geode. Not a python module invocation — a unix command."
            )}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--rule)] p-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--acc-line)] mb-2">
            {t(locale, "Auto-spawn serve", "Auto-spawn serve")}
          </div>
          <p className="text-[13px] text-[var(--ink-2)] leading-relaxed">
            {t(
              locale,
              "thin CLI 가 첫 호출에서 daemon (geode serve) 미실행을 감지하면 spawn 후 IPC 연결. 사용자는 \"geode\" 한 줄로 시작, daemon 라이프사이클은 투명.",
              "If the daemon is not running on first call, the thin CLI spawns it and connects over IPC. Users start with a single \"geode\"; daemon lifecycle is invisible."
            )}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--rule)] p-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--acc-line)] mb-2">
            {t(locale, "Project-aware, not bound", "Project-aware, not bound")}
          </div>
          <p className="text-[13px] text-[var(--ink-2)] leading-relaxed">
            {t(
              locale,
              "현재 디렉토리는 working context — .geode/MEMORY.md, project rules, vault 모두 cwd 기준. 그러나 binary 자체는 한 곳에 설치되고 cwd 가 컨텍스트 셀렉터로 동작.",
              "The current directory becomes the working context — .geode/MEMORY.md, project rules, and the vault all key off cwd. The binary lives in one place; cwd selects the context."
            )}
          </p>
        </div>
      </div>

      <p className="mt-6 text-[12px] font-mono text-[var(--ink-3)]">
        Source: <span className="text-[var(--acc-line)]">pyproject.toml</span> [project.scripts] geode = &quot;geode.cli:app&quot;
        <br />
        IPC bootstrap: <span className="text-[var(--acc-line)]">core/cli/__init__.py</span> +{" "}
        <span className="text-[var(--acc-line)]">core/server/</span>
      </p>
    </section>
  );
}

function SkillCatalog() {
  const locale = useLocale();
  const skills = [
    { group: "Karpathy / frontier", groupKo: "Karpathy / 프론티어", items: ["karpathy-patterns", "openclaw-patterns", "frontier-harness-research"] },
    { group: "Code review", groupKo: "코드 리뷰", items: ["kent-beck-review", "code-review-quality", "dependency-review", "anti-deception-checklist", "verification-team"] },
    { group: "Implementation", groupKo: "구현", items: ["explore-reason-act", "architecture-patterns", "agent-ops-debugging", "codebase-audit"] },
    { group: "GEODE-specific", groupKo: "GEODE 전용", items: ["geode-pipeline", "geode-scoring", "geode-analysis", "geode-verification", "geode-e2e", "geode-gitflow", "geode-changelog", "geode-serve"] },
    { group: "Operations", groupKo: "운영", items: ["model-onboarding", "tech-blog-writer", "workflow-orchestrator"] },
  ];
  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--ink-3)] mb-3">
        {t(locale, "§ 5. SKILL CATALOG", "§ 5. SKILL CATALOG")}
      </div>
      <h2 className="font-display font-bold text-2xl md:text-3xl text-[var(--ink-1)] mb-3">
        {t(locale, "23 스캐폴드 스킬, 5 그룹.", "23 scaffold skills, 5 groups.")}
      </h2>
      <p className="text-[var(--ink-2)] text-[14px] leading-relaxed max-w-3xl mb-8">
        {t(
          locale,
          ".claude/skills/ 의 frontmatter + Markdown 파일들. 각 스킬은 한 가지 디시플린 (예: kent-beck-review) 또는 한 가지 도메인 작업 (예: geode-changelog) 의 절차서. 디스커버리는 5계층 (bundled → user → project) 우선순위로 작동.",
          "Frontmatter + Markdown files in .claude/skills/. Each skill is a procedure for one discipline (e.g. kent-beck-review) or one domain task (e.g. geode-changelog). Discovery walks a 5-tier priority (bundled → user → project)."
        )}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {skills.map((g) => (
          <div key={g.group} className="rounded-lg border border-[var(--rule)] p-5">
            <h3 className="font-display font-semibold text-[var(--ink-1)] text-[15px] mb-3">
              {locale === "ko" ? g.groupKo : g.group}
              <span className="ml-2 font-mono text-[11px] text-[var(--ink-3)]">
                {g.items.length}
              </span>
            </h3>
            <ul className="space-y-1.5">
              {g.items.map((s) => (
                <li key={s} className="font-mono text-[12px] text-[var(--ink-2)]">
                  <span className="text-[var(--acc-line)]">.claude/skills/</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-6 text-[12px] font-mono text-[var(--ink-3)]">
        {t(
          locale,
          "총 23 스킬. CLAUDE.md 의 8단계 워크플로 안에서 적절한 단계가 자동으로 해당 스킬을 발화한다. 예: GAP audit 단계 → explore-reason-act, PR 단계 → geode-gitflow.",
          "23 skills total. The CLAUDE.md 8-step workflow auto-invokes the appropriate skill per stage. E.g. GAP audit → explore-reason-act; PR → geode-gitflow."
        )}
      </p>
    </section>
  );
}

function Footer() {
  const locale = useLocale();
  return (
    <footer className="px-6 py-12 max-w-5xl mx-auto text-[12px] text-[var(--ink-3)] border-t border-[var(--rule)] mt-12">
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
      <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
        <ScaffoldHero />
        <div className="max-w-5xl mx-auto border-t border-[var(--rule-soft)]" />
        <EightStep />
        <div className="max-w-5xl mx-auto border-t border-[var(--rule-soft)]" />
        <CannotCan />
        <div className="max-w-5xl mx-auto border-t border-[var(--rule-soft)]" />
        <Ratchets />
        <div className="max-w-5xl mx-auto border-t border-[var(--rule-soft)]" />
        <WorkingExample />
        <div className="max-w-5xl mx-auto border-t border-[var(--rule-soft)]" />
        <SkillCatalog />
        <Footer />
      </main>
    </LocaleProvider>
  );
}

"use client";

import { useLocale, t } from "../locale-context";

const mirrors = [
  {
    pattern: "Karpathy P4 ratchet",
    artifactLabel: "Hash ratchet on prompts",
    artifactBody: "_PINNED_HASHES × 20 entries. CI gate breaks build on drift.",
    artifactFile: "core/llm/prompts/__init__.py:167",
    scaffoldLabel: "CI Ratchet 5-Job",
    scaffoldBody: "lint → test → typecheck → security → docs. PR blocked on red.",
    scaffoldFile: ".github/workflows/ci.yml + uv run pytest -m \"not live\"",
  },
  {
    pattern: "Layered memory",
    artifactLabel: "5-tier context",
    artifactBody: "GEODE.md → User → Org → Project → Session. Lower overrides higher.",
    artifactFile: "core/memory/context.py:46",
    scaffoldLabel: "4-tier CLAUDE.md",
    scaffoldBody: "managed → user → project → local. Same override semantics.",
    scaffoldFile: "CLAUDE.md + ~/.claude/CLAUDE.md + .claude/CLAUDE.md",
  },
  {
    pattern: "Discovery + extension points",
    artifactLabel: "58 runtime hooks",
    artifactBody: "PROMPT_ASSEMBLED, TOOL_EXEC_*, SESSION_START, etc. 14 groups.",
    artifactFile: "core/hooks/system.py:28 (HookEvent enum)",
    scaffoldLabel: "41 scaffold skills",
    scaffoldBody: "frontmatter + body. 5-tier discovery (bundled → user → project).",
    scaffoldFile: ".claude/skills/*/SKILL.md",
  },
  {
    pattern: "Declarative guardrails",
    artifactLabel: "G1-G4 verification",
    artifactBody: "Schema → Range → Grounding → Coherence. Fail-fast ladder on output.",
    artifactFile: "core/verification/guardrails.py",
    scaffoldLabel: "CANNOT/CAN rules",
    scaffoldBody: "22 absolute prohibitions on actions. Wiring Verification anti-disconnect.",
    scaffoldFile: "CLAUDE.md (Implementation Workflow § CANNOT)",
  },
  {
    pattern: "Loop + termination conditions",
    artifactLabel: "AgenticLoop while(tool_use)",
    artifactBody: "50 round limit, 5 termination paths, 200-turn sliding window.",
    artifactFile: "core/agent/loop.py:162",
    scaffoldLabel: "8-Step Workflow",
    scaffoldBody: "Board → Worktree → GAP Audit → Plan → Implement → Verify → Docs → PR → Board.",
    scaffoldFile: "CLAUDE.md (Workflow Steps)",
  },
  {
    pattern: "Plugin discovery",
    artifactLabel: "DomainPort protocol",
    artifactBody: "plugins/* discovered via core/domains/loader.py registry.",
    artifactFile: "core/domains/port.py:18",
    scaffoldLabel: ".claude/skills/* discovery",
    scaffoldBody: "5-tier directory walk. Frontmatter + Markdown body convention.",
    scaffoldFile: "core/skills/skill_registry.py (mirrored mechanism)",
  },
  {
    pattern: "Resource isolation",
    artifactLabel: "Token + MCP guards",
    artifactBody: "200K absolute token guard; 25K MCP result guard with HTML→MD fallback.",
    artifactFile: "core/agent/loop.py + core/mcp/",
    scaffoldLabel: "Worktree isolation",
    scaffoldBody: ".owner file blocks cross-session deletion. Worktree per task.",
    scaffoldFile: ".claude/worktrees/*/.owner + git worktree add",
  },
  {
    pattern: "Multi-perspective verification",
    artifactLabel: "Cross-LLM verification",
    artifactBody: "RESCORE + DUAL_VERIFY across 4 providers. CV<0.05 anchoring detection.",
    artifactFile: "core/llm/prompts/cross_llm.md",
    scaffoldLabel: "Verification Team",
    scaffoldBody: "4 personas (Beck/Karpathy/Steinberger/Cherny) + Anti-Deception checklist.",
    scaffoldFile: ".claude/skills/verification-team/SKILL.md",
  },
  {
    pattern: "Single-direction gates",
    artifactLabel: "Hash ratchet vs prompt drift",
    artifactBody: "Prompts can change only via conscious re-pin commit.",
    artifactFile: "verify_prompt_integrity()",
    scaffoldLabel: "Test/Module/Dep ratchet",
    scaffoldBody: "Test count never decreases without explicit reason. Module count too.",
    scaffoldFile: "CLAUDE.md (Quality Gates)",
  },
];

export function RecursionSection() {
  const locale = useLocale();
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--ink-3)] mb-3">
            {t(locale, "§ 3. RECURSION", "§ 3. RECURSION")}
          </div>
          <h2 className="font-display font-bold tracking-tight text-3xl md:text-4xl text-[var(--ink-1)] leading-tight">
            {t(
              locale,
              "스캐폴드는 GEODE의 패턴, 자기 자신에게 적용된 것.",
              "The scaffold is GEODE's pattern, applied to itself."
            )}
          </h2>
          <p className="mt-4 text-[var(--ink-2)] max-w-3xl leading-relaxed text-[15px]">
            {t(
              locale,
              "왼쪽 열은 출시되는 운영체제다. 자율 에이전트가 잘못된 출력을 내지 않도록 막는, 출력 쪽 디시플린이다. 오른쪽 열은 그 운영체제를 만드는 라인이다. 작업 자체가 어긋나지 않도록 막는, 과정 쪽 디시플린이다. 두 열은 같은 패턴을 다른 스코프에서 풀어낸 결과다. 카르파시의 autoresearch가 보여 준 ratchet 디시플린의 직계 후손이다.",
              "The left column is the operating system that ships — output-side discipline that keeps the agent from going wrong. The right column is the line that builds it — process-side discipline that keeps the build itself from drifting. Two columns, one pattern, two scopes. A direct descendant of the ratchet discipline in Karpathy's autoresearch."
            )}
          </p>
        </div>

        <div className="rounded-lg border border-[var(--rule)] overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[var(--rule)] bg-[var(--paper-2)]">
                <th className="text-left p-3 font-mono uppercase tracking-wider text-[10px] text-[var(--ink-2)] w-[18%]">
                  {t(locale, "패턴", "Pattern")}
                </th>
                <th className="text-left p-3 font-mono uppercase tracking-wider text-[10px] text-[var(--acc-artifact)] w-[41%]">
                  {t(locale, "Artifact (출시되는 OS)", "Artifact (the OS that ships)")}
                </th>
                <th className="text-left p-3 font-mono uppercase tracking-wider text-[10px] text-[var(--acc-line)] w-[41%]">
                  {t(locale, "Line (그것을 만드는 라인)", "Line (the line that builds it)")}
                </th>
              </tr>
            </thead>
            <tbody>
              {mirrors.map((row, i) => (
                <tr key={i} className="border-b border-[var(--rule-soft)] hover:bg-[var(--paper-2)] transition-colors align-top">
                  <td className="p-3 font-mono text-[12px] text-[var(--ink-2)] italic">
                    {row.pattern}
                  </td>
                  <td className="p-3">
                    <div className="text-[var(--ink-1)] font-medium mb-1">{row.artifactLabel}</div>
                    <div className="text-[var(--ink-2)] text-[12px] leading-relaxed mb-1.5">
                      {row.artifactBody}
                    </div>
                    <div className="font-mono text-[10.5px] text-[var(--acc-artifact)]/85">
                      {row.artifactFile}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-[var(--ink-1)] font-medium mb-1">{row.scaffoldLabel}</div>
                    <div className="text-[var(--ink-2)] text-[12px] leading-relaxed mb-1.5">
                      {row.scaffoldBody}
                    </div>
                    <div className="font-mono text-[10.5px] text-[var(--acc-artifact)]/85">
                      {row.scaffoldFile}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-[var(--ink-2)] max-w-3xl leading-relaxed text-[14px]">
          {t(
            locale,
            "아홉 행 모두 같은 모양으로 떨어진다. 한쪽이 출력의 안전을 보고, 다른 한쪽이 과정의 안전을 본다. GEODE가 자기 일관성을 유지하는 시스템이라는 사실을, 표 한 장에 압축한 것이다. 프론티어의 다른 시스템들은 이런 자기 적용성을 이렇게까지 명시적으로 노출하지 않는다.",
            "All nine rows fall into the same shape — one side watches output safety, the other watches process safety. One page that compresses the claim that GEODE is a self-consistent system. No other frontier surfaces its own self-applicability this explicitly."
          )}
        </p>
      </div>
    </section>
  );
}

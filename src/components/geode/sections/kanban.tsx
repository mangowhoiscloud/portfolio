"use client";

import { useState } from "react";
import { ScrollReveal } from "../scroll-reveal";

/* ── Kanban Columns ── */
const columns = [
  { id: "backlog",     label: "Backlog",     color: "#7A8CA8", desc: "대기. plan 문서 링크, 우선순위 태깅" },
  { id: "in-progress", label: "In Progress", color: "#818CF8", desc: "워크트리 할당됨. .owner에 세션 ID 기록" },
  { id: "in-review",   label: "In Review",   color: "#F5C542", desc: "PR 생성됨. CI 5/5 대기" },
  { id: "done",        label: "Done",        color: "#34D399", desc: "main 머지 완료. 세션별 그룹핑" },
];

/* ── Rules ── */
const rules = [
  { rule: "main-only write", desc: "feature/develop 브랜치에서 progress.md 수정 금지. main에서만 업데이트.", color: "#E87080" },
  { rule: ".owner 격리", desc: "워크트리마다 .owner 파일에 session + task_id 기록. 타 세션 삭제 차단.", color: "#818CF8" },
  { rule: "Backlog→Done 점프 금지", desc: "반드시 In Progress를 거쳐야 Done. 모든 작업에 실행 흔적 보장.", color: "#F5C542" },
  { rule: "3-Checkpoint", desc: "Alloc(Step 0) → Free(PR merge) → Cross-check(세션 시작). 누수 탐지.", color: "#4ECDC4" },
];

/* ── Example board items ── */
const exampleItems = [
  { col: 0, id: "shared-services", title: "SharedServices 통합", priority: "P1", plan: "docs/plans/shared-services.md" },
  { col: 0, id: "hook-approval", title: "Hook Approval UI 개선", priority: "P2", plan: "docs/plans/hook-approval.md" },
  { col: 1, id: "skill-2.0", title: "Skill 2.0 Progressive Disclosure", branch: "feature/skill-2.0", owner: "session=2026-03-29T04:06" },
  { col: 1, id: "data-path", title: "Data Path Migration", branch: "feature/data-path", owner: "session=2026-03-29T03:15" },
  { col: 2, id: "sub-process", title: "SubAgent Subprocess Isolation", pr: "PR #523", ci: "5/5 ✓" },
  { col: 3, id: "en-md", title: "LLM 문서 영어 전환 (39 files)", pr: "PR #522", date: "2026-03-29" },
  { col: 3, id: "scheduler-fix", title: "Scheduler Hardening 6건", pr: "PR #520", date: "2026-03-28" },
];

export function KanbanSection() {
  const [activeCol, setActiveCol] = useState(1);

  return (
    <section className="relative py-28 sm:py-32 px-4 sm:px-6">
      <div className="relative z-10 max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-sm font-mono font-bold text-[#F4B8C8]/60 uppercase tracking-[0.25em] mb-3">
            Kanban
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white/90 mb-3">
            Markdown Collaboration Board
          </h2>
          <p className="text-sm sm:text-base text-[#8B9CC0] max-w-xl mb-8 leading-relaxed">
            <code className="text-[#F4B8C8]/60">docs/progress.md</code> 하나로 사람과 에이전트가 협업합니다.
            Git이 트랜잭션 로그, main 브랜치가 단일 진실 소스.
            30+ 세션의 작업 이력이 추적됩니다.
          </p>
        </ScrollReveal>

        {/* ── 4-Column Board SVG ── */}
        <ScrollReveal delay={0.05}>
          <div className="overflow-x-auto -mx-4 px-4 pb-2 mb-8">
            <svg viewBox="0 0 800 200" className="w-full min-w-[640px]" style={{ maxHeight: 230 }}>
              {columns.map((col, i) => {
                const x = 10 + i * 198;
                const isActive = activeCol === i;
                const items = exampleItems.filter((item) => item.col === i);
                return (
                  <g key={col.id} style={{ cursor: "pointer" }} onClick={() => setActiveCol(i)}>
                    {/* Column header */}
                    <rect x={x} y={10} width={185} height={30} rx={8}
                      fill={isActive ? `${col.color}15` : `${col.color}08`}
                      stroke={col.color} strokeWidth={isActive ? 1 : 0.5} strokeOpacity={isActive ? 0.5 : 0.2}
                      style={{ transition: "all 0.3s" }} />
                    <text x={x + 92} y={30} textAnchor="middle" fill={col.color}
                      fillOpacity={isActive ? 1 : 0.5}
                      fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={700}>
                      {col.label}
                    </text>

                    {/* Cards */}
                    {items.map((item, j) => {
                      const cy = 52 + j * 44;
                      return (
                        <g key={item.id}>
                          <rect x={x + 4} y={cy} width={177} height={36} rx={6}
                            fill="#0A0F1A" stroke={col.color} strokeWidth={0.5} strokeOpacity={0.2} />
                          <text x={x + 14} y={cy + 15} fill="white" fillOpacity={0.6}
                            fontSize={8} fontFamily="ui-monospace, monospace" fontWeight={600}>
                            {item.id}
                          </text>
                          <text x={x + 14} y={cy + 28} fill={col.color} fillOpacity={0.4}
                            fontSize={7} fontFamily="ui-monospace, monospace">
                            {"pr" in item ? item.pr : "priority" in item ? item.priority : "branch" in item ? item.branch?.split("/")[1] : ""}
                          </text>
                        </g>
                      );
                    })}

                    {/* Flow arrows */}
                    {i < 3 && (
                      <text x={x + 192} y={25} fill="white" fillOpacity={0.2} fontSize={12}>→</text>
                    )}
                  </g>
                );
              })}

              {/* Main-only badge */}
              <rect x={300} y={175} width={200} height={22} rx={6}
                fill="#0A0F1A" stroke="#E87080" strokeWidth={0.6} strokeOpacity={0.3} />
              <text x={400} y={190} textAnchor="middle" fill="#E87080" fillOpacity={0.5}
                fontSize={8} fontFamily="ui-monospace, monospace" fontWeight={600}>
                main-only write (CANNOT)
              </text>
            </svg>
          </div>
        </ScrollReveal>

        {/* ── Active column detail ── */}
        <ScrollReveal delay={0.08}>
          <div className="grid grid-cols-4 gap-1 mb-6">
            {columns.map((col, i) => (
              <button key={col.id} onClick={() => setActiveCol(i)}
                className="py-2 rounded-lg text-center text-[10px] font-mono font-bold transition-all"
                style={{
                  color: activeCol === i ? col.color : "#5A6A8A",
                  background: activeCol === i ? `${col.color}08` : "transparent",
                  borderBottom: activeCol === i ? `2px solid ${col.color}40` : "2px solid transparent",
                }}>
                {col.label}
              </button>
            ))}
          </div>
          <div className="rounded-xl border border-white/[0.04] px-5 py-4 mb-8"
            style={{ background: `${columns[activeCol].color}03` }}>
            <div className="text-sm font-semibold text-white/70 mb-2">{columns[activeCol].label}</div>
            <p className="text-xs text-[#8B9CC0] mb-3">{columns[activeCol].desc}</p>
            <div className="space-y-1.5">
              {exampleItems.filter((item) => item.col === activeCol).map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-white/[0.04]">
                  <code className="text-xs font-mono font-bold text-white/60">{item.id}</code>
                  <span className="text-xs text-[#8B9CC0] flex-1">{item.title}</span>
                  {"pr" in item && <span className="text-[10px] font-mono text-[#34D399]/60">{item.pr}</span>}
                  {"priority" in item && <span className="text-[10px] font-mono text-[#F5C542]/60">{item.priority}</span>}
                  {"ci" in item && <span className="text-[10px] font-mono text-[#34D399]/60">{item.ci}</span>}
                  {"date" in item && <span className="text-[10px] font-mono text-white/25">{item.date}</span>}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ── Worktree + .owner isolation ── */}
        <ScrollReveal delay={0.1}>
          <div className="rounded-xl border border-white/[0.04] px-5 py-4 mb-6">
            <div className="text-sm font-semibold text-white/70 mb-3">Worktree + .owner Isolation</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-[#8B9CC0] leading-relaxed mb-3">
                  작업마다 <code className="text-[#818CF8]/60">git worktree add</code>로 격리 환경을 할당합니다.
                  <code className="text-[#F4B8C8]/60 ml-1">.owner</code> 파일에 세션 ID + task_id를 기록하여
                  타 세션이 워크트리를 삭제하는 것을 방지합니다.
                </div>
                <div className="rounded-lg bg-[#060B14] px-4 py-3 font-mono text-[11px] text-white/40 leading-relaxed">
                  <div className="text-[#7A8CA8]">$ cat .claude/worktrees/skill-2.0/.owner</div>
                  <div className="text-[#4ECDC4]/60 mt-1">session=2026-03-29T04:06:08+09:00</div>
                  <div className="text-[#4ECDC4]/60">task_id=skill-2.0</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-[#8B9CC0] leading-relaxed mb-3">
                  동시에 여러 워크트리를 운영하여 병렬 작업이 가능합니다.
                  세션 시작 시 Cross-check로 고아 워크트리(In Progress인데 워크트리 없음)를 탐지합니다.
                </div>
                <div className="rounded-lg bg-[#060B14] px-4 py-3 font-mono text-[11px] text-white/40 leading-relaxed">
                  <div className="text-[#7A8CA8]">$ git worktree list</div>
                  <div className="mt-1"><span className="text-white/30">/workspace/geode</span> <span className="text-[#34D399]/50">main</span></div>
                  <div><span className="text-white/30">.claude/worktrees/skill-2.0</span> <span className="text-[#818CF8]/50">feature/skill-2.0</span></div>
                  <div><span className="text-white/30">.claude/worktrees/data-path</span> <span className="text-[#818CF8]/50">feature/data-path</span></div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Board Rules ── */}
        <ScrollReveal delay={0.12}>
          <div className="space-y-2">
            {rules.map((r) => (
              <div key={r.rule} className="flex items-start gap-3 px-4 py-2.5 rounded-lg border border-white/[0.04]"
                style={{ background: `${r.color}03` }}>
                <span className="shrink-0 w-2 h-2 rounded-full mt-1.5" style={{ background: r.color, opacity: 0.5 }} />
                <div>
                  <span className="text-sm font-mono font-semibold text-white/70">{r.rule}</span>
                  <p className="text-xs text-[#8B9CC0] mt-0.5">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { ScrollReveal } from "../scroll-reveal";
import { DagRenderer } from "../dag-renderer";

/* ── SubAgent System ── */
const subAgentSpecs = [
  { label: "Max Concurrent", value: "5", color: "#4ECDC4" },
  { label: "Max Depth", value: "1", color: "#818CF8" },
  { label: "Max Total", value: "15", color: "#C084FC" },
  { label: "Timeout", value: "120s", color: "#F5C542" },
  { label: "Max Rounds", value: "∞", color: "#34D399" },
  { label: "Max Tokens", value: "32K", color: "#60A5FA" },
];

/* ── SubAgent Architecture Details ── */
const subAgentDetails = [
  { title: "Memory Isolation", color: "#F4B8C8",
    desc: "부모 메모리 read-only 스냅샷 상속. 자식은 task_id-scoped 버퍼(.geode/agent-memory/{task_id}/)에만 쓰기. 완료 후 부모가 summary만 병합. 두 에이전트가 동시에 공유 메모리에 쓰지 않음." },
  { title: "Tool Inheritance + Sandbox", color: "#4ECDC4",
    desc: "부모의 52 native + 44 MCP + skills 전체 상속. 6개 위험 도구(set_api_key, manage_auth, profile_update, calendar_create/sync, delegate_task) 샌드박스 차단. auto_approve=True(STANDARD만)." },
  { title: "Context Explosion 방지", color: "#818CF8",
    desc: "독립 200K context window. announce=False로 delegate_task 이중 주입(tool_result + announce) 제거. 동기 호출만 비활성화, 비동기 경로는 True 유지. 2파일 4줄 변경." },
  { title: "SessionLane per-key 직렬화", color: "#C084FC",
    desc: "같은 session key는 Semaphore(1)로 직렬 실행. 다른 key는 병렬. Lane(\"global\", max=8)로 전체 동시성 제어." },
  { title: "Error Classification", color: "#E87080",
    desc: "TIMEOUT, API_ERROR는 retryable. VALIDATION, RESOURCE, DEPTH_EXCEEDED는 즉시 실패. 부모에게 error_category + retryable 플래그 반환." },
  { title: "Subprocess Isolation", color: "#F5C542",
    desc: "IsolatedRunner가 python -m core.agent.worker로 자식 프로세스 실행. 크래시 시 SIGKILL 보장. 쓰레드 모드 대비 완전 격리." },
];

/* ── Task DAG nodes ── */
const taskNodes = [
  { id: "router", label: "Router", color: "#4ECDC4", col: 0 },
  { id: "signals", label: "Signals", color: "#F5C542", col: 1 },
  { id: "analyst_gm", label: "Game\nMech", color: "#818CF8", col: 2, row: 0 },
  { id: "analyst_pe", label: "Player\nExp", color: "#818CF8", col: 2, row: 1 },
  { id: "analyst_gp", label: "Growth", color: "#818CF8", col: 2, row: 2 },
  { id: "analyst_d", label: "Discovery", color: "#818CF8", col: 2, row: 3 },
  { id: "evaluators", label: "Evaluators", color: "#C084FC", col: 3 },
  { id: "scoring", label: "Scoring\n+PSM", color: "#F5C542", col: 4 },
  { id: "verify", label: "Verify\n+Cross", color: "#34D399", col: 5 },
  { id: "synthesis", label: "Synthesis\n+Report", color: "#F4B8C8", col: 6 },
];

/* ── PlanMode lifecycle ── */
const planStates = ["DRAFT", "PRESENTED", "APPROVED", "EXECUTING", "COMPLETED"];

/* ── Tabs ── */
type Tab = "subagent" | "taskgraph" | "planmode";

export function AgentsTasksSection() {
  const [activeTab, setActiveTab] = useState<Tab>("subagent");

  return (
    <section className="relative py-28 sm:py-32 px-4 sm:px-6">
      <div className="relative z-10 max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-sm font-mono font-bold text-[#C084FC]/60 uppercase tracking-[0.25em] mb-3">
            Orchestration
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white/90 mb-3">
            SubAgent · TaskGraph · PlanMode
          </h2>
          <p className="text-sm sm:text-base text-[#A0B4D4] max-w-xl mb-8 leading-relaxed">
            병렬 에이전트 위임(SubAgent), 의존성 기반 작업 DAG(TaskGraph),
            실행 전 계획 승인(PlanMode). 세 시스템이 연동하여 복잡한 작업을 분할·병렬·검증합니다.
          </p>
        </ScrollReveal>

        {/* ── Tab bar ── */}
        <ScrollReveal delay={0.05}>
          <div className="flex gap-2 mb-8 flex-wrap">
            {([
              { id: "subagent" as Tab, label: "SubAgent", sub: "병렬 위임", color: "#4ECDC4" },
              { id: "taskgraph" as Tab, label: "TaskGraph", sub: "DAG 추적", color: "#818CF8" },
              { id: "planmode" as Tab, label: "PlanMode", sub: "계획 → 실행", color: "#F5C542" },
            ]).map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className="px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all duration-300"
                style={{
                  color: activeTab === t.id ? t.color : "#5A6A8A",
                  background: activeTab === t.id ? `${t.color}08` : "transparent",
                  border: `1px solid ${activeTab === t.id ? `${t.color}20` : "rgba(255,255,255,0.04)"}`,
                }}
              >
                {t.label}
                <span className="ml-2 text-[10px] opacity-50">{t.sub}</span>
              </button>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          {/* ── SubAgent Tab ── */}
          {activeTab === "subagent" && (
            <div>
              {/* Spawn → Execute → Announce flow diagram */}
              <div className="overflow-x-auto -mx-4 px-4 pb-2 mb-6">
                <svg viewBox="0 0 700 240" className="w-full min-w-[540px]" style={{ maxHeight: 280 }}>
                  {/* Parent agent */}
                  <rect x={15} y={60} width={100} height={55} rx={10} fill="#0C1220" stroke="#F4B8C8" strokeWidth={1} strokeOpacity={0.4} />
                  <text x={65} y={83} textAnchor="middle" fill="#F4B8C8" fontSize={11} fontFamily="ui-monospace, monospace" fontWeight={700}>Parent</text>
                  <text x={65} y={100} textAnchor="middle" fill="#F4B8C8" fillOpacity={0.4} fontSize={9} fontFamily="ui-monospace, monospace">AgenticLoop</text>

                  {/* Spawn: Parent → 3 SubAgents */}
                  <text x={140} y={55} fill="#4ECDC4" fillOpacity={0.5} fontSize={9} fontFamily="ui-monospace, monospace">delegate()</text>
                  {[30, 85, 140].map((y, i) => (
                    <path key={`sp-${i}`} d={`M115,87 C140,87 150,${y + 20} 175,${y + 20}`} fill="none" stroke="#4ECDC4" strokeOpacity={0.25} strokeWidth={1} strokeDasharray="4 3" />
                  ))}

                  {/* 3 SubAgents */}
                  {[
                    { y: 30, label: "Sub-A", task: "analyze" },
                    { y: 85, label: "Sub-B", task: "search" },
                    { y: 140, label: "Sub-C", task: "compare" },
                  ].map((sa) => (
                    <g key={sa.label}>
                      <rect x={175} y={sa.y} width={90} height={40} rx={8} fill="#0C1220" stroke="#4ECDC4" strokeWidth={0.8} strokeOpacity={0.3} />
                      <text x={220} y={sa.y + 17} textAnchor="middle" fill="#4ECDC4" fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={600}>{sa.label}</text>
                      <text x={220} y={sa.y + 31} textAnchor="middle" fill="#9BB0CC" fontSize={8} fontFamily="ui-monospace, monospace">{sa.task}</text>
                    </g>
                  ))}

                  {/* Execute → Results */}
                  {[30, 85, 140].map((y, i) => (
                    <path key={`ex-${i}`} d={`M265,${y + 20} C285,${y + 18} 305,${y + 18} 325,${y + 20}`} fill="none" stroke="#34D399" strokeOpacity={0.25} strokeWidth={1} />
                  ))}

                  {/* Results */}
                  {[
                    { y: 30, score: "81.2 S" },
                    { y: 85, score: "12 results" },
                    { y: 140, score: "3 matches" },
                  ].map((r, i) => (
                    <g key={`r-${i}`}>
                      <rect x={325} y={r.y} width={80} height={40} rx={8} fill="#0C1220" stroke="#34D399" strokeWidth={0.6} strokeOpacity={0.3} />
                      <text x={365} y={r.y + 17} textAnchor="middle" fill="#34D399" fontSize={9} fontFamily="ui-monospace, monospace">ok</text>
                      <text x={365} y={r.y + 31} textAnchor="middle" fill="#9BB0CC" fontSize={8} fontFamily="ui-monospace, monospace">{r.score}</text>
                    </g>
                  ))}

                  {/* Announce → Queue */}
                  {[30, 85, 140].map((y, i) => (
                    <path key={`an-${i}`} d={`M405,${y + 20} C430,${y + 18} 450,90 470,95`} fill="none" stroke="#F5C542" strokeOpacity={0.25} strokeWidth={1} strokeDasharray="3 3" />
                  ))}

                  <rect x={470} y={72} width={75} height={46} rx={8} fill="#0C1220" stroke="#F5C542" strokeWidth={0.8} strokeOpacity={0.35} />
                  <text x={507} y={92} textAnchor="middle" fill="#F5C542" fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={600}>Queue</text>
                  <text x={507} y={107} textAnchor="middle" fill="#F5C542" fillOpacity={0.4} fontSize={8} fontFamily="ui-monospace, monospace">announce</text>

                  {/* Drain: Queue → Parent (smooth arc BELOW everything) */}
                  <path d="M507,118 C507,160 507,200 400,210 C250,220 100,210 65,200 C40,195 15,170 15,115" fill="none" stroke="#F4B8C8" strokeOpacity={0.3} strokeWidth={1.2} strokeDasharray="5 4" />
                  <text x={280} y={220} textAnchor="middle" fill="#F4B8C8" fillOpacity={0.45} fontSize={9} fontFamily="ui-monospace, monospace">drain → parent 컨텍스트 주입</text>
                </svg>
              </div>

              {/* Spec numbers */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mb-6">
                {subAgentSpecs.map((s) => (
                  <div key={s.label} className="text-center px-2 py-3 rounded-xl border border-white/[0.04]" style={{ background: `${s.color}04` }}>
                    <div className="text-lg sm:text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-[10px] sm:text-xs text-[#9BB0CC] font-mono mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Architecture details */}
              <div className="space-y-2">
                {subAgentDetails.map((d) => (
                  <div key={d.title} className="flex items-start gap-3 px-4 py-3 rounded-lg border border-white/[0.04]"
                    style={{ background: `${d.color}03` }}>
                    <div className="shrink-0 w-1.5 h-full min-h-[28px] rounded-full mt-0.5" style={{ background: d.color, opacity: 0.35 }} />
                    <div>
                      <span className="text-sm font-semibold text-white/75">{d.title}</span>
                      <p className="text-xs text-[#A0B4D4] leading-relaxed mt-0.5">{d.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TaskGraph Tab — Two separate visualizations ── */}
          {activeTab === "taskgraph" && (
            <div className="space-y-8">
              {/* 1. Pipeline DAG (Game IP) — DagRenderer */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#818CF8]/10 text-[#818CF8]/80 border border-[#818CF8]/15">PIPELINE</span>
                  <span className="text-sm font-semibold text-white/80">TaskGraph. Game IP 가치추론</span>
                </div>
                <DagRenderer
                  nodes={[
                    { id: "router", label: "Router", color: "#4ECDC4", column: 0 },
                    { id: "signals", label: "Signals", color: "#F5C542", column: 1 },
                    { id: "a0", label: "Market", color: "#818CF8", column: 2, row: -1.5 },
                    { id: "a1", label: "Creative", color: "#818CF8", column: 2, row: -0.5 },
                    { id: "a2", label: "Audience", color: "#818CF8", column: 2, row: 0.5 },
                    { id: "a3", label: "Risk", color: "#818CF8", column: 2, row: 1.5 },
                    { id: "eval", label: "Eval ×3", color: "#C084FC", column: 3 },
                    { id: "score", label: "Scoring", color: "#F5C542", column: 4 },
                    { id: "verify", label: "Verify", color: "#34D399", column: 5 },
                  ]}
                  edges={[
                    { from: "router", to: "signals" },
                    { from: "signals", to: "a0", label: "Send API" },
                    { from: "signals", to: "a1" },
                    { from: "signals", to: "a2" },
                    { from: "signals", to: "a3" },
                    { from: "a0", to: "eval" },
                    { from: "a1", to: "eval" },
                    { from: "a2", to: "eval" },
                    { from: "a3", to: "eval" },
                    { from: "eval", to: "score" },
                    { from: "score", to: "verify" },
                  ]}
                  loopback={{ from: "verify", to: "signals", label: "confidence < 0.7 loopback", color: "#E87080" }}
                  nodeRadius={24}
                />
                <p className="text-sm text-[#A0B4D4] leading-relaxed mt-2">
                  TaskGraphHookBridge가 NODE_ENTER/EXIT/ERROR를 수신하여 ~13개 Task 상태를 자동 갱신합니다. 실패 시 하류 Task를 자동 SKIP.
                </p>
              </div>

              {/* 1.5 REODE Migration Pipeline — DagRenderer */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#34D399]/10 text-[#34D399]/80 border border-[#34D399]/15">REODE</span>
                  <span className="text-sm font-semibold text-white/80">TaskGraph. Migration Pipeline</span>
                </div>
                <DagRenderer
                  nodes={[
                    { id: "assess", label: "Assess", color: "#60A5FA", column: 0 },
                    { id: "plan", label: "Plan", color: "#818CF8", column: 1 },
                    { id: "transform", label: "Transform", color: "#4ECDC4", column: 2 },
                    { id: "validate", label: "Validate", color: "#F5C542", column: 3 },
                    { id: "fix", label: "Fix", color: "#E87080", column: 4 },
                    { id: "measure", label: "Measure", color: "#34D399", column: 5 },
                  ]}
                  edges={[
                    { from: "assess", to: "plan" },
                    { from: "plan", to: "transform" },
                    { from: "transform", to: "validate" },
                    { from: "validate", to: "fix" },
                    { from: "validate", to: "measure", color: "#34D399" },
                  ]}
                  loopback={{ from: "fix", to: "validate", label: "fix loop (4-class routing)", color: "#E87080" }}
                  nodeRadius={24}
                />
                <p className="text-sm text-[#A0B4D4] leading-relaxed mt-2">
                  Java 1.8→22 자동 마이그레이션. 4분류 에러 라우팅(CONFIG/CODE/BEHAVIOR/ENV) + Architect/Editor 분리.
                </p>
              </div>

              {/* 2. Agentic Loop Task System */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#4ECDC4]/10 text-[#4ECDC4]/80 border border-[#4ECDC4]/15">AGENTIC</span>
                  <span className="text-sm font-semibold text-white/80">TaskGraph. Agentic Loop Task System</span>
                </div>
                <div className="overflow-x-auto -mx-4 px-4 pb-2">
                  <svg viewBox="0 0 700 180" className="w-full min-w-[540px]" style={{ maxHeight: 210 }}>
                    {/* User request */}
                    <rect x={20} y={60} width={110} height={50} rx={10} fill="#0C1220" stroke="#F4B8C8" strokeWidth={0.8} strokeOpacity={0.35} />
                    <text x={75} y={80} textAnchor="middle" fill="#F4B8C8" fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={600}>User Request</text>
                    <text x={75} y={95} textAnchor="middle" fill="#F4B8C8" fillOpacity={0.45} fontSize={8} fontFamily="ui-monospace, monospace">복합 요청</text>

                    {/* Arrow */}
                    <line x1={130} y1={85} x2={180} y2={85} stroke="white" strokeOpacity={0.22} strokeWidth={1} />

                    {/* GoalDecomposer */}
                    <rect x={180} y={55} width={130} height={60} rx={10} fill="#0C1220" stroke="#818CF8" strokeWidth={1} strokeOpacity={0.4} />
                    <text x={245} y={78} textAnchor="middle" fill="#818CF8" fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={700}>GoalDecomposer</text>
                    <text x={245} y={95} textAnchor="middle" fill="#818CF8" fillOpacity={0.35} fontSize={8} fontFamily="ui-monospace, monospace">분해 → sub-goals</text>

                    {/* Fan-out to tasks */}
                    {[35, 85, 135].map((y, i) => (
                      <g key={`task-${i}`}>
                        <path d={`M310,85 C340,85 350,${y} 380,${y}`} fill="none" stroke="#4ECDC4" strokeOpacity={0.28} strokeWidth={1} />
                        <rect x={380} y={y - 18} width={100} height={36} rx={8} fill="#0C1220" stroke="#4ECDC4" strokeWidth={0.6} strokeOpacity={0.2} />
                        <text x={430} y={y - 2} textAnchor="middle" fill="#4ECDC4" fontSize={9} fontFamily="ui-monospace, monospace" fontWeight={600}>
                          {["Task A", "Task B", "Task C"][i]}
                        </text>
                        <text x={430} y={y + 12} textAnchor="middle" fill="#5A6A8A" fontSize={8} fontFamily="ui-monospace, monospace">
                          {["RUNNING", "READY", "PENDING"][i]}
                        </text>
                      </g>
                    ))}

                    {/* CLI /tasks */}
                    <rect x={530} y={55} width={80} height={60} rx={10} fill="#0C1220" stroke="#F5C542" strokeWidth={0.7} strokeOpacity={0.2} />
                    <text x={570} y={78} textAnchor="middle" fill="#F5C542" fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={600}>/tasks</text>
                    <text x={570} y={95} textAnchor="middle" fill="#F5C542" fillOpacity={0.45} fontSize={8} fontFamily="ui-monospace, monospace">CLI 조회</text>

                    {/* Connection */}
                    {[35, 85, 135].map((y, i) => (
                      <line key={`conn-${i}`} x1={480} y1={y} x2={530} y2={85} stroke="#F5C542" strokeOpacity={0.2} strokeWidth={1} />
                    ))}

                    {/* ContextVar label */}
                    <text x={430} y={168} textAnchor="middle" fill="#4ECDC4" fillOpacity={0.30} fontSize={9} fontFamily="ui-monospace, monospace">
                      세션별 ContextVar. 독립 TaskGraph
                    </text>

                    {/* Dependency arrows between tasks */}
                    <path d="M430,53 L430,67" stroke="white" strokeOpacity={0.2} strokeWidth={1} strokeDasharray="2 3" />
                    <path d="M430,103 L430,117" stroke="white" strokeOpacity={0.2} strokeWidth={1} strokeDasharray="2 3" />
                  </svg>
                </div>
                <p className="text-sm text-[#A0B4D4] leading-relaxed mt-2">
                  GoalDecomposer가 복합 요청을 sub-goal로 분해하고, 세션별 ContextVar에 독립 TaskGraph를 생성합니다. CLI /tasks로 실시간 상태를 조회할 수 있습니다.
                </p>
              </div>
            </div>
          )}

          {/* ── PlanMode Tab ── */}
          {activeTab === "planmode" && (
            <div>
              {/* PlanMode lifecycle SVG */}
              <div className="overflow-x-auto -mx-4 px-4 pb-2 mb-6">
                <svg viewBox="0 0 760 200" className="w-full min-w-[560px]" style={{ maxHeight: 230 }}>
                  {/* Planner (route selection) */}
                  <rect x={20} y={60} width={100} height={60} rx={10} fill="#0C1220" stroke="#60A5FA" strokeWidth={1} strokeOpacity={0.4} />
                  <text x={70} y={83} textAnchor="middle" fill="#60A5FA" fontSize={11} fontFamily="ui-monospace, monospace" fontWeight={700}>Planner</text>
                  <text x={70} y={100} textAnchor="middle" fill="#60A5FA" fillOpacity={0.35} fontSize={8} fontFamily="ui-monospace, monospace">route 선택</text>

                  <line x1={120} y1={90} x2={160} y2={90} stroke="white" strokeOpacity={0.22} strokeWidth={1} />

                  {/* Plan lifecycle states */}
                  {[
                    { label: "DRAFT", x: 190, color: "#5A6A8A" },
                    { label: "PRESENT", x: 290, color: "#818CF8" },
                    { label: "APPROVE", x: 390, color: "#F5C542" },
                    { label: "EXECUTE", x: 490, color: "#4ECDC4" },
                    { label: "COMPLETE", x: 590, color: "#34D399" },
                  ].map((s, i) => (
                    <g key={s.label}>
                      <rect x={s.x - 40} y={65} width={80} height={50} rx={8} fill="#0A0F1A" stroke={s.color} strokeWidth={0.8} strokeOpacity={0.35} />
                      <text x={s.x} y={85} textAnchor="middle" fill={s.color} fontSize={9} fontFamily="ui-monospace, monospace" fontWeight={700}>{s.label}</text>
                      <text x={s.x} y={100} textAnchor="middle" fill={s.color} fillOpacity={0.45} fontSize={8} fontFamily="ui-monospace, monospace">
                        {["생성", "리뷰", "HITL 승인", "실행 중", "완료"][i]}
                      </text>
                      {i < 4 && (
                        <line x1={s.x + 40} y1={90} x2={[290, 390, 490, 590][i] - 40} y2={90} stroke="white" strokeOpacity={0.22} strokeWidth={1} />
                      )}
                    </g>
                  ))}

                  {/* REJECTED fork */}
                  <path d="M390,115 L390,150 L190,150 L190,115" fill="none" stroke="#E87080" strokeOpacity={0.28} strokeWidth={1} strokeDasharray="4 4" />
                  <text x={290} y={163} textAnchor="middle" fill="#E87080" fillOpacity={0.35} fontSize={8} fontFamily="ui-monospace, monospace">REJECTED → DRAFT로 복귀</text>

                  {/* Templates */}
                  <rect x={640} y={30} width={100} height={42} rx={8} fill="#0C1220" stroke="#F5C542" strokeWidth={0.6} strokeOpacity={0.2} />
                  <text x={690} y={48} textAnchor="middle" fill="#F5C542" fontSize={9} fontFamily="ui-monospace, monospace" fontWeight={600}>full_pipeline</text>
                  <text x={690} y={62} textAnchor="middle" fill="#5A6A8A" fontSize={8} fontFamily="ui-monospace, monospace">10 steps · $1.50</text>

                  <rect x={640} y={80} width={100} height={42} rx={8} fill="#0C1220" stroke="#818CF8" strokeWidth={0.6} strokeOpacity={0.2} />
                  <text x={690} y={98} textAnchor="middle" fill="#818CF8" fontSize={9} fontFamily="ui-monospace, monospace" fontWeight={600}>prospect</text>
                  <text x={690} y={112} textAnchor="middle" fill="#5A6A8A" fontSize={8} fontFamily="ui-monospace, monospace">6 steps · $0.80</text>

                  {/* Connection to templates */}
                  <line x1={630} y1={90} x2={640} y2={51} stroke="#F5C542" strokeOpacity={0.22} strokeWidth={1} />
                  <line x1={630} y1={90} x2={640} y2={101} stroke="#818CF8" strokeOpacity={0.22} strokeWidth={1} />

                  {/* Top label */}
                  <text x={400} y={25} textAnchor="middle" fill="white" fillOpacity={0.28} fontSize={9} fontFamily="ui-monospace, monospace" letterSpacing="0.1em">
                    PLANNER → DRAFT → PRESENT → APPROVE(HITL) → EXECUTE → COMPLETE
                  </text>
                </svg>
              </div>

              <p className="text-sm text-[#A0B4D4] leading-relaxed">
                Planner가 요청을 6개 Route(FULL_PIPELINE, PROSPECT, PARTIAL_RERUN 등)로 분류하고,
                PlanMode가 DRAFT → PRESENTED → APPROVED(HITL) → EXECUTING → COMPLETED 생애주기를 관리합니다.
                REJECTED되면 DRAFT로 복귀합니다.
              </p>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}

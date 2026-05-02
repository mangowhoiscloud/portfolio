import Link from "next/link";

const phases = [
  {
    id: "P1",
    range: "2025.10.31 → 2025.12.02",
    span: "33 days",
    titleKo: "MVP. 5인 팀, 단독 백엔드 / 인프라",
    bodyKo:
      "Cursor와 스캐폴드를 운용해 14-node Kubernetes 클러스터 위에 FastAPI 도메인 7개를 올렸습니다. 인증·캐릭터·챗·스캔·위치·유저·이미지 도메인의 골격을 만들면서 Vision OCR 파이프라인과 Celery 비동기 작업도 같은 라인에서 묶었습니다. 12월 2일 새싹톤 본선에서 우수상(181팀 중 4위)을 받았습니다.",
    bodyEn:
      "Operated Cursor + scaffold to bring up 7 FastAPI domains on a 14-node Kubernetes cluster — Auth, Character, Chat, Scan, Location, Users, Image. The Vision OCR pipeline and Celery async workers were wired in the same line. December 2nd: Excellence Prize (4th of 181 teams) at the SeSACTHON 2025 finals.",
    accent: "var(--acc-line)",
    chips: ["14-node k8s", "FastAPI · 7 domains", "Cursor + Scaffold", "Vision OCR", "Celery"],
  },
  {
    id: "P2",
    range: "2025.12.02 → 2026.02",
    span: "≈ 3 months · solo",
    titleKo: "단독 고도화. VU 1,000 RPS·TPM까지 스케일업",
    bodyKo:
      "팀 해산 이후 단독으로 운영하면서 LLM 2개 + Rule-based 파이프라인 기준 VU 1,000 부하에서 97.8% 완료율, 373 RPM을 만들었습니다. Chat 도메인을 LangGraph StateGraph 멀티 에이전트로 재구성했고(병렬 실행, Stateless + Priority Preemptive Reducer, Eval Pipeline, Function-calling, Event Bus), 인프라 측에서는 EFK · Prometheus · Grafana · Jaeger 4-pillar 관측 스택을 직접 세웠습니다. K8s 노드는 14개에서 24개까지 확장됐습니다.",
    bodyEn:
      "After the team wound down, the line was operated solo. Under VU 1,000 (LLM × 2 + rule-based pipeline) the system held 97.8% completion at 373 RPM. The Chat domain was rebuilt as a LangGraph StateGraph multi-agent (parallel execution, stateless + priority-preemptive reducer, eval pipeline, function-calling, event bus). On the infrastructure side, the EFK / Prometheus / Grafana / Jaeger 4-pillar observability stack was raised by hand. Cluster grew from 14 nodes to 24.",
    accent: "var(--acc-artifact)",
    chips: [
      "VU 1,000 · 97.8% · 373 RPM",
      "LangGraph StateGraph",
      "Event Bus 3-Tier",
      "EFK · Prom · Grafana · Jaeger",
      "K8s 14 → 24 nodes",
    ],
  },
];

const beats = [
  {
    titleKo: "Multi-Agent Harness",
    bodyKo:
      "단일 프롬프트 LLM 호출이 \"이거 어디서 버려? 이코는 뭐 좋아해?\" 같은 복합 질의에서 후속 답변을 누락했습니다. 9분류 Intent Classification(waste / character / location / bulk_waste / recyclable_price / collection_point / web_search / image_generation / general)을 도입하고, LangGraph Send API로 11종 서브에이전트를 의도별 병렬 실행했습니다. final_confidence는 LLM 신뢰도 + Keyword Map 보정(+0.2) + Chain-of-Intent 전이 보너스(+0.15) − 짧은 질문 페널티(−0.1)로 산출하고, 0.6 미만은 general로 폴백시켰습니다. Aggregator는 Lamport Clock 기반 Priority Preemptive Reducer로 결과를 병합합니다.",
  },
  {
    titleKo: "Event Bus 4-Stage Evolution",
    bodyKo:
      "Scan 파이프라인은 LLM I/O가 85%인 11.3초짜리 비동기 작업이라 SSE 실시간 전달이 필요했습니다. Phase 0(Sync Thread Pool 6, VU 100 → 0% 완료)는 GIL 병목, Phase 1(Celery + SSE 직결, VU 50 → 35%)은 SSE 1건당 RabbitMQ 21개 연결 폭발, Phase 2(KEDA, VU 100 → 86.3%)는 SSE Pod의 N개 코루틴 XREAD가 CPU 85%를 잡아먹었습니다. Phase 3에서 Redis Streams(영속) + Pub/Sub(실시간) + State KV(복구) 3-Tier로 책임을 분리하고, hash(job_id)%4로 shard 채널을 나눠 SSE Gateway 연결을 O(N)에서 O(4)로 줄였습니다. VU 1,000에서 97.8% 완료, Connection Pool 84% 감소(212 → 33).",
  },
  {
    titleKo: "Swiss Cheese 3-Tier Evaluation",
    bodyKo:
      "James Reason(1990) Swiss Cheese 모델을 따라 직교 슬라이스로 평가를 쌓았습니다. L1 Code Grader는 Critical Path에서 50ms 안에 결정적 검증을 수행하고 C-Grade 시 즉시 Regeneration을 트리거합니다. L2 LLM Judge는 5-Axis BARS 루브릭(Faithfulness 0.30, Relevance 0.25, Completeness 0.20, Safety 0.15→위험물 0.25, Communication 0.10) + Self-Consistency 3회로 평가합니다. L3 Calibration Monitor는 CUSUM(k=0.5, h=4.0)으로 시간 드리프트를 감지하고, Krippendorff α≥0.75 목표로 50-sample Calibration Set을 주기적으로 검증합니다. 5라운드 Expert Review로 평가 정확도를 69.4 → 89.2 → 95.4 → 98.8 → 99.8/100까지 끌어올렸습니다.",
  },
  {
    titleKo: "Offloading. Auth + Persistence",
    bodyKo:
      "JWT 인증과 LangGraph Checkpoint 동기 쓰기가 임계경로 레이턴시 원인이었습니다. Auth는 Istio ext-authz(Go gRPC) + sync.Map 로컬 캐시 + RabbitMQ Fanout broadcast로 사이드카에 떼어내 42 → 1,477 RPS(35배), Cache Hit 99% 이상이 됐습니다. Persistence는 ReadThroughCheckpointer(Redis HSET ~1ms L1 + PG batch L2)로 구성해 PG 커넥션을 192 → 8(96% 감소)로 줄였습니다. State KV + Last-Event-ID 기반으로 SSE 재연결 시 무손실 catch-up이 가능합니다.",
  },
  {
    titleKo: "Observability 4-Pillar (단독 구축)",
    bodyKo:
      "Prometheus + Grafana는 Per-Agent / Per-Provider / Per-Intent / Per-Domain 13개 이상 대시보드. Jaeger + OpenTelemetry는 W3C traceparent 전파로 API → Worker Taskiq Middleware bridge까지 11종 LLM 호출 경로를 잇습니다. EFK는 ECS 포맷으로 trace_id를 연동해 500K — 1.1M docs/day를 받습니다. AlertManager는 3-replica HA로 Critical / Warning을 분리해 Slack에 흘립니다. K6 부하테스트로 LLM × 2 파이프라인 VU 1,000 / 97.8% / 373 RPM, ext-authz VU 2,500 / 1,477 RPS를 검증했습니다.",
  },
];

const loop = {
  titleKo: "Recursive Self-Improvement Loop (단독 운용)",
  bodyKo:
    "MVP 이후 단독 운영 구간은 Cursor + Claude Code 위에서 27개 커스텀 Skill을 사용한 \"설계 → 구현 → 테스트 → 관측 → 검증\" 피드백 루프로 굴렸습니다. ADR · 장애 로그 · 도메인 규칙은 자체 RAG로 축적되어 Sub-agent 온보딩 시간을 단축하고, Anthropic · Vercel 등 공식 벤더 Skill도 함께 주입합니다. 25일 표본 기준 8,251 세션, 평균 330 세션/일, 2,059 메시지/일, 32,796 파일 수정, Task 도구 호출 7,527건. 누적 LLM 비용은 약 $7,473($200/월 구독선 × 멀티 컨텍스트 운용).",
  stats: [
    { label: "Sessions", value: "8,251" },
    { label: "Sessions / day", value: "330" },
    { label: "Messages / day", value: "2,059" },
    { label: "Files touched", value: "32,796" },
    { label: "Task tool calls", value: "7,527" },
    { label: "Total LLM spend", value: "$7,473" },
  ],
};

export default function Eco2Page() {
  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)] px-6 py-24">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-16">
          <div className="flex items-baseline justify-between mb-12">
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--ink-3)]">
              Eco² / portfolio
            </span>
            <span className="font-mono text-[11px] text-[var(--ink-3)] border border-[var(--rule)] rounded px-2 py-0.5">
              SeSACTHON 2025 Excellence · 4 / 181
            </span>
          </div>

          <h1 className="font-display tracking-tight text-[var(--ink)] text-[clamp(3rem,8vw,5rem)] leading-[1.02] font-semibold">
            Eco²
          </h1>
          <p className="mt-4 font-display text-[clamp(1.2rem,2.4vw,1.55rem)] text-[var(--ink-1)] leading-snug">
            Cursor 스캐폴드로 LLM을 생산·개발 체계로 처음 운용한 프로젝트.
            Chat 도메인에서 Agent의 사용성을 끌어올리는 데 집중했습니다.
          </p>

          <div className="mt-8 space-y-4 text-[15.5px] text-[var(--ink-2)] leading-[1.75]">
            <p>
              5인 팀 MVP에서 백엔드와 인프라를 단독으로 맡으면서, Cursor 기반 스캐폴드를 운용해 LLM을 단순 호출이 아닌 “생산과 개발의 체계”로 처음 다뤄본 작업입니다.
              스캐폴드 위에서 ADR, 장애 로그, 도메인 규칙을 자체 RAG로 축적하고 27개 커스텀 Skill을 Sub-agent에 주입하면서 “설계 → 구현 → 테스트 → 관측 → 검증” 피드백 루프를 돌렸습니다.
              이 경험이 GEODE의 직접적인 발판이 됐습니다.
            </p>
            <p>
              본선 우수상 이후 약 3개월 동안은 혼자 운영하면서 Chat 도메인을 LangGraph 멀티 에이전트로 재구성해 사용자 입장에서의 Agent 사용성을 끌어올렸고, LLM × 2 + Rule-based 파이프라인의 부하 한계를 4단계에 걸쳐 풀어 VU 1,000에서 97.8% 완료율까지 가져갔습니다.
              Multi-Agent · Event Bus · Swiss Cheese Evaluation · Offloading · 4-Pillar Observability — 다섯 축을 세우고, 모든 전환의 근거는 Grafana 메트릭과 EFK 로그였습니다.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="https://rooftopsnow.tistory.com/category/Eco%C2%B2"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-[var(--rule)] hover:border-[var(--acc-artifact)] text-[13px] font-mono text-[var(--ink-1)] hover:text-[var(--acc-artifact)] transition-colors"
            >
              Dev Blog
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-[var(--rule)] hover:border-[var(--acc-line)] text-[13px] font-mono text-[var(--ink-1)] hover:text-[var(--acc-line)] transition-colors"
            >
              ← Portfolio
            </Link>
          </div>
        </header>

        {/* Two-phase ribbon */}
        <section className="mb-20">
          <div className="flex items-baseline gap-3 mb-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-3)]">
              § Phases
            </span>
            <span className="font-mono text-[10px] text-[var(--ink-3)]">두 구간</span>
          </div>

          <div className="space-y-12">
            {phases.map((p) => (
              <div key={p.id} className="grid grid-cols-[120px_1fr] gap-6">
                {/* Left rail */}
                <div className="border-l-2 pl-4" style={{ borderColor: p.accent }}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: p.accent }}>
                    {p.id}
                  </div>
                  <div className="font-mono text-[11px] text-[var(--ink-2)] mt-1 leading-tight">
                    {p.range}
                  </div>
                  <div className="font-mono text-[10.5px] text-[var(--ink-3)] mt-1">
                    {p.span}
                  </div>
                </div>

                {/* Body */}
                <div>
                  <h3 className="font-display text-[18px] font-semibold text-[var(--ink-1)] tracking-tight mb-2">
                    {p.titleKo}
                  </h3>
                  <p className="text-[14px] text-[var(--ink-2)] leading-relaxed mb-3">
                    {p.bodyKo}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.chips.map((c) => (
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
            ))}
          </div>
        </section>

        {/* Architecture beats */}
        <section className="mb-20">
          <div className="flex items-baseline gap-3 mb-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-3)]">
              § Architecture
            </span>
            <span className="font-mono text-[10px] text-[var(--ink-3)]">5축</span>
          </div>

          <div className="space-y-10">
            {beats.map((b, i) => (
              <article key={b.titleKo} className="grid grid-cols-[44px_1fr] gap-6">
                <div className="font-mono text-[11px] text-[var(--ink-3)] pt-1.5">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="font-display text-[17px] font-semibold text-[var(--ink-1)] tracking-tight mb-2">
                    {b.titleKo}
                  </h3>
                  <p className="text-[14px] text-[var(--ink-2)] leading-[1.75]">
                    {b.bodyKo}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Recursive Loop */}
        <section className="mb-20 pt-10 border-t border-[var(--rule)]">
          <div className="flex items-baseline gap-3 mb-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-3)]">
              § Loop
            </span>
            <span className="font-mono text-[10px] text-[var(--ink-3)]">재귀개선루프</span>
          </div>

          <h3 className="font-display text-[20px] font-semibold text-[var(--ink-1)] tracking-tight mb-3">
            {loop.titleKo}
          </h3>
          <p className="text-[14.5px] text-[var(--ink-2)] leading-[1.75] mb-8 max-w-2xl">
            {loop.bodyKo}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4 pt-6 border-t border-[var(--rule)]">
            {loop.stats.map((s) => (
              <div key={s.label}>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-3)] mb-1">
                  {s.label}
                </div>
                <div className="font-mono text-[15px] text-[var(--ink-1)]">{s.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-[var(--rule)] text-[11px] font-mono text-[var(--ink-3)] flex flex-wrap gap-x-6 gap-y-2">
          <span>github.com/mangowhoiscloud</span>
          <span>last updated 2026-05-03</span>
          <Link href="/" className="hover:text-[var(--acc-artifact)] transition-colors">
            ← Portfolio
          </Link>
          <Link href="/geode" className="hover:text-[var(--acc-artifact)] transition-colors">
            → /geode
          </Link>
          <a
            href="https://rooftopsnow.tistory.com/category/Eco%C2%B2"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--acc-line)] transition-colors"
          >
            → dev blog
          </a>
        </footer>
      </div>
    </main>
  );
}

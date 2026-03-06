import { Modal } from "../modal-types";

export const geodeModals: Modal[] = [
  // ─── Memory ───
  {
    id: "modal-geode-org-context",
    category: "geode",
    titleKo: "Organization Memory",
    titleEn: "Organization Memory",
    icon: "🏢",
    maxWidth: 1000,
    content: [
      {
        type: "explanation",
        titleKo: "MonoLake/Snowflake SSOT — IP 마스터 데이터",
        titleEn: "MonoLake/Snowflake SSOT — IP Master Data",
        contentKo:
          "Organization Memory는 MonoLake(Snowflake Cortex) 기반 전사 통합 데이터베이스입니다. DIM_IP, DIM_GAME, FACT_PERFORMANCE, FACT_REVIEW, DIM_PSM_COVARIATE, AGG_IP_ANALYSIS 6개 테이블로 IP 마스터 데이터를 관리합니다. Cortex Analyst(자연어→SQL), Cortex Search(RAG), AI_COMPLETE(SQL 내 LLM)을 지원합니다.",
        contentEn:
          "Organization Memory is an enterprise-wide database based on MonoLake (Snowflake Cortex). It manages IP master data across 6 tables: DIM_IP, DIM_GAME, FACT_PERFORMANCE, FACT_REVIEW, DIM_PSM_COVARIATE, AGG_IP_ANALYSIS. Supports Cortex Analyst (NL→SQL), Cortex Search (RAG), and AI_COMPLETE (in-SQL LLM).",
        highlight: true,
        borderColor: "#34D399",
      },
      {
        type: "table",
        titleKo: "MonoLake 데이터 스키마",
        titleEn: "MonoLake Data Schema",
        headers: ["Table", "Role", "Key Fields"],
        rows: [
          {
            cells: [
              "DIM_IP",
              "IP 마스터",
              "ip_id, ip_name, ip_type, origin_media",
            ],
          },
          {
            cells: [
              "DIM_GAME",
              "게임 마스터",
              "game_id, game_name, ip_id, platform",
            ],
          },
          {
            cells: [
              "FACT_PERFORMANCE",
              "성과 지표",
              "dau, revenue, retention_d1/d7/d30",
            ],
          },
          {
            cells: [
              "FACT_REVIEW",
              "리뷰 텍스트",
              "source, text, sentiment, timestamp",
            ],
          },
          {
            cells: [
              "DIM_PSM_COVARIATE",
              "PSM 공변량 (14개)",
              "genre, dev_tier, platform, ...",
            ],
          },
          {
            cells: [
              "AGG_IP_ANALYSIS",
              "분석 결과",
              "scores, tier, cause",
            ],
          },
        ],
      },
      {
        type: "code",
        titleKo: "Cortex AI 기능",
        titleEn: "Cortex AI Functions",
        language: "python",
        content: `# Cortex Analyst: 자연어 → SQL
cortex_analyst(
    semantic_model="ip_undervaluation_model",
    query="귀멸의칼날 게임의 최근 30일 성과 보여줘"
)

# Cortex Search: RAG 검색
cortex_search(
    service="ip_review_search",
    query="플레이어가 언급한 게임 밸런스 문제",
    columns=["review_text", "sentiment"], limit=10
)`,
      },
    ],
  },
  {
    id: "modal-geode-project-context",
    category: "geode",
    titleKo: "Project Memory",
    titleEn: "Project Memory",
    icon: "📁",
    content: [
      {
        type: "explanation",
        titleKo: ".claude/MEMORY.md — 루브릭 오버라이드",
        titleEn: ".claude/MEMORY.md — Rubric Override",
        contentKo:
          "Project Memory는 .claude/MEMORY.md + rules 파일로 구성됩니다. Organization 기본 루브릭 가중치를 프로젝트별로 오버라이드할 수 있습니다. 우선순위: Project > Organization(루브릭 가중치). POST_ANALYSIS hook에서 분석 결과를 MEMORY.md에 자동 write-back합니다.",
        contentEn:
          "Project Memory consists of .claude/MEMORY.md + rules files. Can override Organization default rubric weights per-project. Priority: Project > Organization for rubric weights. Auto write-back analysis results to MEMORY.md at POST_ANALYSIS hook.",
        highlight: true,
        borderColor: "#34D399",
      },
      {
        type: "metrics",
        cards: [
          { value: "3", label: "IP Fixtures", color: "#34D399" },
          { value: "YAML", label: "Serialization", color: "#60A5FA" },
          { value: "Port", label: "Storage Abstraction", color: "#818CF8" },
          {
            value: "Auto",
            label: "POST_ANALYSIS Write-back",
            color: "#F472B6",
          },
        ],
      },
    ],
  },
  {
    id: "modal-geode-session-context",
    category: "geode",
    titleKo: "Session Memory",
    titleEn: "Session Memory",
    icon: "💬",
    content: [
      {
        type: "explanation",
        titleKo: "Redis L1 (4hr TTL) + PostgreSQL L2 영구 저장",
        titleEn: "Redis L1 (4hr TTL) + PostgreSQL L2 Permanent Storage",
        contentKo:
          "2-Tier Checkpointing 아키텍처: L1 Redis(4시간 TTL, 실시간 세션, 빠른 복구), L2 PostgreSQL(영구, 장기 히스토리, 감사 추적). 세션별 messages.jsonl, tool_calls.jsonl, checkpoints/{timestamp}.json, subagents/{agent_id}.jsonl로 구조화합니다.",
        contentEn:
          "2-Tier Checkpointing architecture: L1 Redis (4hr TTL, real-time sessions, fast recovery), L2 PostgreSQL (permanent, long-term history, audit trail). Structured per-session: messages.jsonl, tool_calls.jsonl, checkpoints/{timestamp}.json, subagents/{agent_id}.jsonl.",
        highlight: true,
        borderColor: "#34D399",
      },
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "L1 Redis",
            color: "#34D399",
            items: ["4시간 TTL", "실시간 세션", "빠른 복구"],
          },
          {
            title: "L2 PostgreSQL",
            color: "#60A5FA",
            items: ["영구 저장", "장기 히스토리", "감사 추적"],
          },
        ],
      },
    ],
  },

  // ─── Runtime ───
  {
    id: "modal-geode-settings",
    category: "geode",
    titleKo: "6-Route Planner",
    titleEn: "6-Route Planner",
    icon: "⚙️",
    maxWidth: 1000,
    content: [
      {
        type: "explanation",
        titleKo: "Gemini 3.0 Flash 기반 비용 최적화 라우팅",
        titleEn: "Gemini 3.0 Flash Cost-Optimized Routing",
        contentKo:
          "Planner는 Gemini 3.0 Flash로 6개 라우트 중 최적 경로를 선택합니다. IP 장르, 미디어 유형, 시장 규모에 따라 비용 대비 효과가 최적인 라우트로 분기합니다.",
        contentEn:
          "Planner uses Gemini 3.0 Flash to select the optimal route from 6 options. Routes to the most cost-effective path based on IP genre, media type, and market size.",
        highlight: true,
        borderColor: "#60A5FA",
      },
      {
        type: "table",
        titleKo: "6 라우트 비용 테이블",
        titleEn: "6 Route Cost Table",
        headers: ["Route", "Cost", "Use Case"],
        rows: [
          {
            cells: [
              "full_pipeline",
              "$1.50",
              "전체 14축 분석 (게임화 IP)",
            ],
          },
          {
            cells: [
              "prospect",
              "$0.80",
              "미게임화 IP 9축 분석",
            ],
          },
          {
            cells: [
              "partial_rerun",
              "$0.15",
              "특정 분석가만 재실행",
            ],
          },
          {
            cells: [
              "data_refresh",
              "$0.30",
              "외부 시그널 갱신 후 재채점",
            ],
          },
          {
            cells: [
              "direct_answer",
              "$0.02",
              "메모리 기반 즉답",
            ],
          },
          {
            cells: [
              "script_route",
              "$0.05",
              "사전 정의 스크립트 실행",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "modal-geode-factory",
    category: "geode",
    titleKo: "Plan Mode",
    titleEn: "Plan Mode",
    icon: "🏭",
    content: [
      {
        type: "explanation",
        titleKo: "분석 전략 수립 → 사용자 승인 → 실행",
        titleEn: "Analysis Strategy → User Approval → Execution",
        contentKo:
          "Plan Mode는 실행 전 계획 수립 + 사용자 승인 패턴입니다. Planner가 IP 특성에 맞는 분석 전략(라우트 선택, 분석가 가중치, 평가 기준)을 수립하면, 사용자가 확인/수정 후 실행을 승인합니다.",
        contentEn:
          "Plan Mode is a plan-before-execute + user-approval pattern. After the Planner creates an analysis strategy (route, analyst weights, evaluation criteria) based on IP characteristics, the user reviews/modifies and approves execution.",
        highlight: true,
        borderColor: "#60A5FA",
      },
      {
        type: "grid",
        columns: 3,
        cards: [
          {
            title: "1. 전략 수립",
            color: "#60A5FA",
            items: [
              "IP 특성 분석",
              "라우트 선택",
              "가중치 조정",
            ],
          },
          {
            title: "2. 사용자 승인",
            color: "#818CF8",
            items: ["전략 미리보기", "수정 가능", "승인/거부"],
          },
          {
            title: "3. 실행",
            color: "#34D399",
            items: [
              "승인된 전략 실행",
              "실시간 진행 표시",
              "결과 보고",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "modal-geode-di",
    category: "geode",
    titleKo: "LLMClientPort 추상화",
    titleEn: "LLMClientPort Abstraction",
    icon: "💉",
    maxWidth: 1000,
    content: [
      {
        type: "explanation",
        titleKo: "Port/Adapter 패턴 — 5모델 DI",
        titleEn: "Port/Adapter Pattern — 5-model DI",
        contentKo:
          "LLMClientPort 인터페이스로 complete(), embed() 메서드를 추상화하고, ClaudeClient, GPTClient, GeminiClient 어댑터를 런타임에 주입합니다. Native SDK First 원칙으로 각 모델 고유 기능을 활용합니다.",
        contentEn:
          "LLMClientPort interface abstracts complete() and embed() methods. ClaudeClient, GPTClient, GeminiClient adapters are injected at runtime. Native SDK First principle leverages each model's unique capabilities.",
        highlight: true,
        borderColor: "#60A5FA",
      },
      {
        type: "table",
        titleKo: "5모델 배치 전략 (SOT §2.3.2)",
        titleEn: "5-Model Deployment Strategy (SOT §2.3.2)",
        headers: ["Role", "Model", "Rationale"],
        rows: [
          { cells: ["Planner", "Gemini 3.0 Flash", "빠른 라우팅, Tool Calling 우수"] },
          { cells: ["Cortex Agent", "GPT-5.2", "SQL 생성 정확도"] },
          { cells: ["Analyst×4 / Evaluator×3 / Synthesizer", "Claude Opus 4.5", "깊은 추론, 도메인 분석"] },
          { cells: ["LLM Judge / Memory Responder", "Claude Sonnet 4", "비용 효율적 종합"] },
          { cells: ["Per-Agent Guardrail", "Claude Haiku", "경량 검증"] },
        ],
      },
      {
        type: "code",
        titleKo: "LLMClientPort 인터페이스",
        titleEn: "LLMClientPort Interface",
        language: "python",
        content: `class LLMClientPort(ABC):
    """LLM 클라이언트 추상화 (Port/Adapter 패턴)"""

    @abstractmethod
    async def complete(
        self,
        messages: list[dict],
        tools: list[dict] | None = None,
        response_format: type[BaseModel] | None = None,
        stream: bool = False
    ) -> dict | AsyncIterator[dict]:
        pass

    @abstractmethod
    async def embed(self, text: str) -> list[float]:
        pass`,
      },
    ],
  },

  // ─── Pipeline ───
  {
    id: "modal-geode-stategraph",
    category: "geode",
    titleKo: "StateGraph 토폴로지",
    titleEn: "StateGraph Topology",
    icon: "🗺️",
    content: [
      {
        type: "diagram",
        titleKo: "13-Node Pipeline + Confidence Loop",
        titleEn: "13-Node Pipeline + Confidence Loop",
        content: `START → router → cortex → signals
                                  ↓
                  ┌──────── Send API ────────┐
                  ↓       ↓        ↓        ↓
               Market Creative Audience   Risk
                  ↓       ↓        ↓        ↓
                  └──────── Fan-in ─────────┘
                                  ↓
            evaluators → scoring → verification → synthesizer → END
                                  ↑                    │
                                  └── Confidence < 0.7 ┘
                                      (max 3 loops)`,
      },
      {
        type: "explanation",
        titleKo: "Confidence Loop",
        titleEn: "Confidence Loop",
        contentKo:
          "Confidence가 0.7 미만이면 cortex로 루프백하여 추가 데이터를 수집합니다. 최대 3회 반복 후 강제 종료합니다. graph.stream()으로 각 노드의 실시간 진행 상태를 추적합니다.",
        contentEn:
          "Loops back to cortex for additional data if confidence < 0.7. Force-terminates after max 3 iterations. graph.stream() tracks real-time progress of each node.",
        highlight: true,
        borderColor: "#818CF8",
      },
      {
        type: "metrics",
        cards: [
          { value: "13", label: "Nodes", color: "#818CF8" },
          { value: "4", label: "Parallel Analysts", color: "#60A5FA" },
          { value: "< 0.7", label: "Loop Threshold", color: "#FBBF24" },
          { value: "3", label: "Max Loop Count", color: "#F472B6" },
        ],
      },
    ],
  },
  {
    id: "modal-geode-send-api",
    category: "geode",
    titleKo: "Send API Fan-out",
    titleEn: "Send API Fan-out",
    icon: "📡",
    content: [
      {
        type: "explanation",
        titleKo: "Clean Context 병렬 실행 — 앵커링 바이어스 방지",
        titleEn: "Clean Context Parallel Execution — Anchoring Bias Prevention",
        contentKo:
          "Send API로 4명의 분석가를 병렬 실행할 때, analyses 필드를 제거한 Clean Context를 전달합니다. 이는 선행 분석가의 결과가 후행 분석가에게 앵커링 바이어스를 유발하는 것을 방지하는 핵심 설계 결정입니다.",
        contentEn:
          "When executing 4 analysts in parallel via Send API, Clean Context (without analyses field) is passed. This is a key design decision preventing anchoring bias from prior analyst results affecting subsequent analysts.",
        highlight: true,
        borderColor: "#818CF8",
      },
      {
        type: "code",
        titleKo: "Send API 구현",
        titleEn: "Send API Implementation",
        language: "python",
        content: `# Clean Context: state WITHOUT analyses
def fan_out_analysts(state: GeodeState) -> list[Send]:
    clean = {k: v for k, v in state.items()
             if k != "analyses"}
    return [
        Send("analyst_market", clean),
        Send("analyst_creative", clean),
        Send("analyst_audience", clean),
        Send("analyst_risk", clean),
    ]`,
      },
    ],
  },
  {
    id: "modal-geode-reducer",
    category: "geode",
    titleKo: "Reducer Pattern",
    titleEn: "Reducer Pattern",
    icon: "➕",
    content: [
      {
        type: "code",
        titleKo: "Annotated Reducer — 병렬 결과 자동 병합",
        titleEn: "Annotated Reducer — Parallel Result Auto-merge",
        language: "python",
        content: `class GeodeState(TypedDict):
    # Reducer fields: auto-merge parallel results
    analyses: Annotated[list[Analysis], operator.add]
    errors: Annotated[list[str], operator.add]

    # Regular fields
    ip_name: str
    ip_data: dict
    signals: dict
    evaluations: list[Evaluation]
    final_score: float
    tier: str`,
      },
      {
        type: "explanation",
        titleKo: "Annotated[list, operator.add]",
        titleEn: "Annotated[list, operator.add]",
        contentKo:
          "LangGraph의 Reducer 패턴을 사용하여, Send API 병렬 실행 결과를 analyses 리스트에 자동 병합합니다. 각 노드는 자신의 output key만 반환하는 Node Contract를 준수합니다.",
        contentEn:
          "Uses LangGraph's Reducer pattern to auto-merge Send API parallel execution results into the analyses list. Each node follows the Node Contract of returning only its output keys.",
        highlight: true,
        borderColor: "#818CF8",
      },
    ],
  },
  {
    id: "modal-geode-node-contract",
    category: "geode",
    titleKo: "Node Contract",
    titleEn: "Node Contract",
    icon: "📋",
    content: [
      {
        type: "table",
        titleKo: "노드별 입출력 규약",
        titleEn: "Per-Node I/O Contract",
        headers: ["Node", "Input", "Output Keys"],
        rows: [
          { cells: ["router", "ip_name", "mode, route_info"] },
          { cells: ["cortex", "ip_name", "ip_data"] },
          { cells: ["signals", "ip_name", "signals"] },
          { cells: ["analyst×4", "ip_data, signals", "analyses (reducer)"] },
          { cells: ["evaluators×3", "analyses", "evaluations"] },
          { cells: ["scoring", "evaluations", "final_score, tier, subscores"] },
          { cells: ["verification", "all", "verified, warnings"] },
          { cells: ["synthesizer", "all", "report, cause, action_type"] },
        ],
      },
      {
        type: "explanation",
        titleKo: "Node Contract 규칙",
        titleEn: "Node Contract Rule",
        contentKo:
          "각 노드는 dict(output keys only)만 반환합니다. 다른 노드의 키를 반환하면 안 됩니다. Reducer 필드(analyses, errors)는 Annotated[list, operator.add]로 자동 병합됩니다.",
        contentEn:
          "Each node returns only dict with its output keys. Must not return other nodes' keys. Reducer fields (analyses, errors) auto-merge via Annotated[list, operator.add].",
        highlight: true,
        borderColor: "#818CF8",
      },
    ],
  },

  // ─── Orchestration ───
  {
    id: "modal-geode-hooks",
    category: "geode",
    titleKo: "Hook System",
    titleEn: "Hook System",
    icon: "🪝",
    maxWidth: 1000,
    content: [
      {
        type: "explanation",
        titleKo: "11 이벤트 × CONTINUE/ABORT/MODIFY 제어",
        titleEn: "11 Events × CONTINUE/ABORT/MODIFY Control",
        contentKo:
          "Hook System은 11개 이벤트로 파이프라인 라이프사이클을 관리합니다. 각 Hook 결과는 CONTINUE(계속), ABORT(중단), MODIFY(상태 수정 후 계속) 3가지로 파이프라인 흐름을 제어합니다.",
        contentEn:
          "Hook System manages pipeline lifecycle via 11 events. Each hook result controls flow with 3 actions: CONTINUE, ABORT, MODIFY (modify state then continue).",
        highlight: true,
        borderColor: "#F472B6",
      },
      {
        type: "table",
        titleKo: "11 Hook 이벤트",
        titleEn: "11 Hook Events",
        headers: ["Event", "Timing", "Use Case"],
        rows: [
          { cells: ["SESSION_START", "세션 시작", "초기화, 컨텍스트 설정"] },
          { cells: ["SESSION_END", "세션 종료", "리소스 정리, 로그 저장"] },
          { cells: ["PRE_ANALYSIS", "분석 전", "데이터 검증, 전략 확인"] },
          { cells: ["POST_ANALYSIS", "분석 후", "결과 검증, 메모리 write-back"] },
          { cells: ["PRE_TOOL_USE", "도구 호출 전", "파라미터 검증"] },
          { cells: ["POST_TOOL_USE", "도구 호출 후", "결과 검증"] },
          { cells: ["TASK_START", "작업 시작", "작업 로깅"] },
          { cells: ["TASK_COMPLETE", "작업 완료", "결과 저장"] },
          { cells: ["TASK_FAIL", "작업 실패", "에러 핸들링"] },
          { cells: ["ON_ERROR", "에러 발생", "복구 시도, 알림"] },
          { cells: ["ON_NOTIFICATION", "알림 발생", "분석 완료 알림, 외부 연동"] },
        ],
      },
    ],
  },
  {
    id: "modal-geode-task-system",
    category: "geode",
    titleKo: "TaskSystem",
    titleEn: "TaskSystem",
    icon: "📝",
    content: [
      {
        type: "explanation",
        titleKo: "의존성 그래프 기반 분석 작업 스케줄링",
        titleEn: "Dependency Graph-based Analysis Job Scheduling",
        contentKo:
          "TaskSystem은 복잡한 작업을 세분화된 Task로 분해하고, 의존성 그래프를 기반으로 병렬/순차 실행을 스케줄링합니다. 배치 분석 시 여러 IP를 효율적으로 처리합니다.",
        contentEn:
          "TaskSystem decomposes complex work into granular Tasks and schedules parallel/sequential execution based on dependency graphs. Efficiently processes multiple IPs in batch analysis.",
        highlight: true,
        borderColor: "#F472B6",
      },
      {
        type: "grid",
        columns: 3,
        cards: [
          {
            title: "Task Decomposition",
            color: "#F472B6",
            items: ["복잡한 작업 분해", "독립 단위 분리"],
          },
          {
            title: "Dependency Graph",
            color: "#818CF8",
            items: ["의존성 자동 추적", "병렬 실행 최적화"],
          },
          {
            title: "Batch Processing",
            color: "#34D399",
            items: ["다중 IP 동시 분석", "우선순위 스케줄링"],
          },
        ],
      },
    ],
  },
  {
    id: "modal-geode-planner",
    category: "geode",
    titleKo: "Planner",
    titleEn: "Planner",
    icon: "🧭",
    content: [
      {
        type: "explanation",
        titleKo: "Gemini 3.0 Flash 기반 능동 라우팅",
        titleEn: "Gemini 3.0 Flash Active Routing",
        contentKo:
          "Planner는 Gemini 3.0 Flash를 사용하여 IP 특성에 맞는 분석 경로를 능동적으로 선택합니다. 6개 라우트(full_pipeline, prospect, partial_rerun, data_refresh, direct_answer, script_route) 중 비용 대비 효과가 최적인 경로로 분기합니다.",
        contentEn:
          "Planner uses Gemini 3.0 Flash to actively select analysis paths suited to IP characteristics. Routes to the optimal cost-effective path among 6 routes: full_pipeline, prospect, partial_rerun, data_refresh, direct_answer, script_route.",
        highlight: true,
        borderColor: "#F472B6",
      },
    ],
  },
  {
    id: "modal-geode-bootstrap",
    category: "geode",
    titleKo: "Bootstrap",
    titleEn: "Bootstrap",
    icon: "🔌",
    content: [
      {
        type: "diagram",
        titleKo: "서비스 초기화 순서",
        titleEn: "Service Initialization Order",
        content: `Bootstrap Flow:
  1. Config Loading   → GeodeConfig from .env
  2. Memory Init      → 3-tier context setup
  3. LLM Client       → 5 model adapters (DI)
  4. Hook Registry    → 11 events (incl. ON_NOTIFICATION)
  5. Graph Build      → StateGraph compile
  6. Runtime Ready    → CLI / REPL start`,
      },
    ],
  },

  // ─── Verification ───
  {
    id: "modal-geode-guardrails",
    category: "geode",
    titleKo: "G1-G4 Per-Agent Guardrails",
    titleEn: "G1-G4 Per-Agent Guardrails",
    icon: "🚧",
    maxWidth: 1000,
    content: [
      {
        type: "explanation",
        titleKo: "Layer 1: Claude Haiku 경량 검증",
        titleEn: "Layer 1: Claude Haiku Lightweight Validation",
        contentKo:
          "Per-Agent Guardrail은 Claude Haiku 경량 모델로 각 에이전트 출력을 즉시 검증합니다. G1 Schema(JSON 스키마 일치), G2 Range(점수 1-5 범위), G3 Grounding(evidence 존재 여부), G4 Consistency(Analyst-Evaluator 간 괴리 ≤ 1.5점)를 검사합니다.",
        contentEn:
          "Per-Agent Guardrail validates each agent output instantly using Claude Haiku. Checks G1 Schema (JSON schema match), G2 Range (scores 1-5), G3 Grounding (evidence existence), G4 Consistency (Analyst-Evaluator gap ≤ 1.5 points).",
        highlight: true,
        borderColor: "#FBBF24",
      },
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "G1 Schema",
            color: "#FBBF24",
            items: [
              "JSON 스키마 일치 검증",
              "필수 필드 존재 확인",
              "Pydantic model_validate",
            ],
          },
          {
            title: "G2 Range",
            color: "#34D399",
            items: [
              "점수 1-5 범위 확인",
              "정규화 0-100 범위 검증",
              "이상치 탐지",
            ],
          },
          {
            title: "G3 Grounding",
            color: "#60A5FA",
            items: [
              "evidence 필드 존재",
              "데이터 출처 추적",
              "Fixture vs Real 구분",
            ],
          },
          {
            title: "G4 Consistency",
            color: "#F472B6",
            items: [
              "Analyst-Evaluator 괴리 ≤ 1.5",
              "D-E-F 점수 ↔ cause 일치",
              "cause → action 매핑 검증",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "modal-geode-biasbuster",
    category: "geode",
    titleKo: "BiasBuster 4-Step",
    titleEn: "BiasBuster 4-Step",
    icon: "⚖️",
    content: [
      {
        type: "explanation",
        titleKo: "Layer 2: RECOGNIZE → EXPLAIN → ALTER → EVALUATE",
        titleEn: "Layer 2: RECOGNIZE → EXPLAIN → ALTER → EVALUATE",
        contentKo:
          "BiasBuster 4-Step 프로세스: 1) RECOGNIZE — CV(Coefficient of Variation) 기반 앵커링 감지, 분석가 간 점수 분산 측정. 2) EXPLAIN — 편향 원인 설명(장르 편향, 최신성 편향, 인기 편향). 3) ALTER — 편향 보정 적용. 4) EVALUATE — 보정 후 재검증.",
        contentEn:
          "BiasBuster 4-Step process: 1) RECOGNIZE — CV-based anchoring detection, analyst score variance measurement. 2) EXPLAIN — Explain bias cause (genre, recency, popularity bias). 3) ALTER — Apply bias correction. 4) EVALUATE — Re-validate after correction.",
        highlight: true,
        borderColor: "#FBBF24",
      },
      {
        type: "grid",
        columns: 4,
        cards: [
          {
            title: "1. RECOGNIZE",
            color: "#FBBF24",
            items: ["CV 기반 감지", "분산 측정"],
          },
          {
            title: "2. EXPLAIN",
            color: "#FB923C",
            items: ["원인 분류", "편향 유형 식별"],
          },
          {
            title: "3. ALTER",
            color: "#818CF8",
            items: ["편향 보정", "가중치 조정"],
          },
          {
            title: "4. EVALUATE",
            color: "#34D399",
            items: ["보정 후 재검증", "품질 확인"],
          },
        ],
      },
    ],
  },
  {
    id: "modal-geode-decision-tree",
    category: "geode",
    titleKo: "Decision Tree (§13.9.2)",
    titleEn: "Decision Tree (§13.9.2)",
    icon: "🌳",
    maxWidth: 1100,
    content: [
      {
        type: "explanation",
        titleKo: "D-E-F 축 코드 기반 원인 분류 (LLM 미사용)",
        titleEn: "D-E-F Axis Code-based Cause Classification (No LLM)",
        contentKo:
          "Cause Classification은 코드 기반 Decision Tree로 수행합니다 (LLM 아님). D(Acquisition Gap), E(Monetization Gap), F(Expansion Potential) 3축 점수와 release_timing_issue 플래그로 6개 원인을 분류합니다. D축은 recovery_potential에서 제외됩니다 (PSM exposure_lift와 이중 계산 방지).",
        contentEn:
          "Cause Classification is performed by a code-based Decision Tree (NOT LLM). Classifies 6 causes using D (Acquisition Gap), E (Monetization Gap), F (Expansion Potential) 3-axis scores and release_timing_issue flag. D-axis excluded from recovery_potential (prevents double-counting with PSM exposure_lift).",
        highlight: true,
        borderColor: "#FBBF24",
      },
      {
        type: "table",
        titleKo: "6종 원인 분류 테이블",
        titleEn: "6 Cause Classification Table",
        headers: ["Cause", "D-E-F Profile", "Action", "Description"],
        rows: [
          { cells: ["timing_mismatch", "D≥3 + timing_issue", "timing_optimization", "출시 타이밍 실패 → 리런치/리마스터"] },
          { cells: ["conversion_failure", "D≥3, E≥3", "marketing_boost", "마케팅+수익화 모두 미달 → 퍼널+과금 동시 개선"] },
          { cells: ["undermarketed", "D≥3, E<3", "marketing_boost", "IP 파워 대비 마케팅 부족 → 예산 증액"] },
          { cells: ["monetization_misfit", "D≤2, E≥3", "monetization_pivot", "유저는 오는데 수익 미달 → 과금 모델 재설계"] },
          { cells: ["niche_gem", "D≤2, E≤2, F≥3", "platform_expansion", "품질 좋으나 확장 미진출 → 플랫폼 확장"] },
          { cells: ["discovery_failure", "D≤2, E≤2, F≤2", "community_activation", "복합 요인 → 종합 전략 수립"] },
        ],
      },
      {
        type: "table",
        titleKo: "3 IP Fixture 검증 결과",
        titleEn: "3 IP Fixture Validation Results",
        headers: ["IP", "Score", "Tier", "Cause"],
        rows: [
          { cells: ["Berserk", "82.2", "S", "conversion_failure"] },
          { cells: ["Cowboy Bebop", "69.4", "A", "undermarketed"] },
          { cells: ["Ghost in the Shell", "54.0", "B", "discovery_failure"] },
        ],
      },
    ],
  },

  // ─── Automation ───
  {
    id: "modal-geode-cusum",
    category: "geode",
    titleKo: "Trigger Manager",
    titleEn: "Trigger Manager",
    icon: "📊",
    content: [
      {
        type: "explanation",
        titleKo: "4종 트리거 + 10 자동화 템플릿",
        titleEn: "4 Trigger Types + 10 Automation Templates",
        contentKo:
          "4종 트리거로 파이프라인 실행을 자동화합니다: Manual(CLI 직접 실행), Scheduled(CronTimer 주기 실행), Event(Hook 이벤트 연동), Webhook(POST 엔드포인트). 10개 사전 정의 자동화 템플릿으로 반복 작업을 표준화합니다.",
        contentEn:
          "Automates pipeline execution with 4 trigger types: Manual (CLI), Scheduled (CronTimer), Event (Hook-linked), Webhook (POST endpoint). 10 pre-defined automation templates standardize repetitive tasks.",
        highlight: true,
        borderColor: "#A78BFA",
      },
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "Manual CLI",
            color: "#A78BFA",
            items: ["uv run geode analyze", "직접 실행 트리거"],
          },
          {
            title: "Scheduled CronTimer",
            color: "#818CF8",
            items: ["주기적 자동 분석", "배치 스케줄링"],
          },
          {
            title: "Event Hook",
            color: "#60A5FA",
            items: ["POST_ANALYSIS 연동", "조건부 재분석"],
          },
          {
            title: "Webhook POST",
            color: "#34D399",
            items: ["외부 시스템 연동", "REST 엔드포인트"],
          },
        ],
      },
    ],
  },
  {
    id: "modal-geode-feedback",
    category: "geode",
    titleKo: "FeedbackLoop 5-Stage",
    titleEn: "FeedbackLoop 5-Stage",
    icon: "🔁",
    maxWidth: 1000,
    content: [
      {
        type: "explanation",
        titleKo: "RLHF + RLAIF 하이브리드 피드백 루프",
        titleEn: "RLHF + RLAIF Hybrid Feedback Loop",
        contentKo:
          "5단계 Feedback Loop: Phase 1 PREDICTION(T+0, 스냅샷 저장), Phase 2 OUTCOME TRACKING(T+30/90/180d, 실제 성과 수집), Phase 3 CORRELATION(분기별, Spearman ρ≥0.50 목표), Phase 4 MODEL IMPROVEMENT(반기별, 루브릭/가중치/프롬프트 튜닝), Phase 5 RLAIF(선택적, AI Feedback으로 Human 보완).",
        contentEn:
          "5-stage Feedback Loop: Phase 1 PREDICTION (T+0, snapshot), Phase 2 OUTCOME TRACKING (T+30/90/180d, actual performance), Phase 3 CORRELATION (quarterly, Spearman ρ≥0.50 target), Phase 4 MODEL IMPROVEMENT (bi-annual, rubric/weight/prompt tuning), Phase 5 RLAIF (optional, AI feedback supplements human).",
        highlight: true,
        borderColor: "#A78BFA",
      },
      {
        type: "table",
        titleKo: "KPI 목표 (NDC25 성과 연결)",
        titleEn: "KPI Targets (NDC25 Outcome Link)",
        headers: ["Metric", "Target", "Warning", "Critical"],
        rows: [
          { cells: ["Spearman ρ", "≥ 0.50", "0.40", "< 0.30"] },
          { cells: ["Kendall τ", "≥ 0.45", "0.35", "< 0.25"] },
          { cells: ["Precision@10", "≥ 0.60", "0.50", "< 0.40"] },
          { cells: ["S-Tier Lift", "≥ 1.5x", "1.2x", "< 1.0x"] },
          { cells: ["Human-LLM α", "≥ 0.80", "0.67", "< 0.50"] },
        ],
      },
    ],
  },
  {
    id: "modal-geode-expert-panel",
    category: "geode",
    titleKo: "Expert Panel (NDC25)",
    titleEn: "Expert Panel (NDC25)",
    icon: "👨‍🏫",
    maxWidth: 1000,
    content: [
      {
        type: "explanation",
        titleKo: "NDC25 기반 3-Tier 전문가 패널",
        titleEn: "NDC25-based 3-Tier Expert Panel",
        contentKo:
          "NDC25 \"예측 잘하는 전문가\" 기준: 더 많은 면을 더 객관적으로 보는 사람 (직무 무관). 게임 콘텐츠 소비 시간, 신규 게임 플레이 빈도, 출시 후 성과 확인 습관, 낮은 예측 과신도가 핵심 지표입니다. ⚠️ 플레이 시간/사용 금액이 많다고 예측을 잘하는 것이 아닙니다.",
        contentEn:
          "NDC25 'good predictor' criteria: person who sees more aspects more objectively (role-agnostic). Key indicators: game content consumption, new game play frequency, post-release tracking habit, low prediction overconfidence. ⚠️ More playtime/spending ≠ better predictions.",
        highlight: true,
        borderColor: "#A78BFA",
      },
      {
        type: "table",
        titleKo: "3-Tier 전문가 계층",
        titleEn: "3-Tier Expert Hierarchy",
        headers: ["Tier", "Qualification", "Role", "Size"],
        rows: [
          { cells: ["Tier 3 Verified", "Score≥0.85, ρ≥0.50, ≥30건", "최종 Tier 승인, 루브릭 개정", "3-5명"] },
          { cells: ["Tier 2 Provisional", "Score≥0.70, ρ≥0.40, ≥10건", "분석 리뷰, LLM 검증", "5-10명"] },
          { cells: ["Tier 1 Candidate", "Score≥0.50, 경력≥3년", "평가 참여 (가중치 낮음)", "무제한"] },
        ],
      },
    ],
  },

  // ─── LLM ───
  {
    id: "modal-geode-claude-client",
    category: "geode",
    titleKo: "5-Model Deployment",
    titleEn: "5-Model Deployment",
    icon: "🤖",
    maxWidth: 1100,
    content: [
      {
        type: "explanation",
        titleKo: "역할별 최적 모델 할당",
        titleEn: "Role-optimized Model Assignment",
        contentKo:
          "LLMClientPort 추상화로 5개 모델을 역할에 최적 배치합니다. Native SDK First 원칙으로 각 모델의 고유 강점을 활용합니다. Claude Opus 4.5는 깊은 추론이 필요한 분석/평가에, Gemini Flash는 빠른 라우팅에, GPT-5.2는 SQL 생성에 배치합니다.",
        contentEn:
          "LLMClientPort abstraction deploys 5 models to optimal roles. Native SDK First principle leverages each model's unique strengths. Claude Opus 4.5 for deep reasoning in analysis/evaluation, Gemini Flash for fast routing, GPT-5.2 for SQL generation.",
        highlight: true,
        borderColor: "#FB923C",
      },
      {
        type: "table",
        titleKo: "5모델 배치 전략 (SOT §2.3.2)",
        titleEn: "5-Model Deployment Strategy (SOT §2.3.2)",
        headers: ["Model", "Role", "Rationale"],
        rows: [
          { cells: ["Claude Opus 4.5", "Analyst×4, Evaluator×3, Synthesizer", "깊은 추론, 도메인 분석"] },
          { cells: ["Claude Sonnet 4", "LLM Judge, Memory Responder", "비용 효율적 종합"] },
          { cells: ["Claude Haiku", "Per-Agent Guardrail", "경량 검증"] },
          { cells: ["GPT-5.2", "Cortex Agent (SQL)", "SQL 생성 정확도"] },
          { cells: ["Gemini 3.0 Flash", "Planner (Routing)", "빠른 라우팅, Tool Calling"] },
        ],
      },
    ],
  },
  {
    id: "modal-geode-structured-output",
    category: "geode",
    titleKo: "14축 루브릭",
    titleEn: "14-Axis Rubric",
    icon: "📐",
    maxWidth: 1100,
    content: [
      {
        type: "explanation",
        titleKo: "Route 1 게임화 IP: Quality(8) + Hidden Value(3) + Momentum(3)",
        titleEn: "Route 1 Gamified IP: Quality(8) + Hidden Value(3) + Momentum(3)",
        contentKo:
          "14축 루브릭은 3개 카테고리로 구성됩니다. Quality 8축(A Core Mechanics, B IP Integration, C Engagement, B.1 Trailer, C.1 Conversion, C.2 Experience, M Polish, N Fun), Hidden Value 3축(D Acquisition Gap, E Monetization Gap, F Expansion Potential), Momentum 3축(J Growth, K Social, L Platform). 각 축 1-5 스케일.",
        contentEn:
          "14-axis rubric has 3 categories. Quality 8 axes (A Core Mechanics, B IP Integration, C Engagement, B.1 Trailer, C.1 Conversion, C.2 Experience, M Polish, N Fun), Hidden Value 3 axes (D Acquisition Gap, E Monetization Gap, F Expansion Potential), Momentum 3 axes (J Growth, K Social, L Platform). Each axis 1-5 scale.",
        highlight: true,
        borderColor: "#FB923C",
      },
      {
        type: "table",
        titleKo: "14축 루브릭 상세 (SOT §13.11.1)",
        titleEn: "14-Axis Rubric Detail (SOT §13.11.1)",
        headers: ["Category", "Axis", "1 (Poor)", "5 (Outstanding)"],
        rows: [
          { cells: ["Quality", "A. Core Mechanics", "기본 조작 불량", "혁신적 메카닉"] },
          { cells: ["Quality", "B. IP Integration", "IP 무관", "IP 핵심 구현"] },
          { cells: ["Quality", "C. Engagement", "D1 < 10%", "D1 > 70%"] },
          { cells: ["Quality", "B.1 Trailer", "like/view < 1%", "≥ 8%"] },
          { cells: ["Quality", "C.1 Conversion", "Store < 50", "≥ 90"] },
          { cells: ["Quality", "C.2 Experience", "Mixed", "Overwhelmingly+"] },
          { cells: ["Quality", "M. Polish", "버그 다수", "완벽"] },
          { cells: ["Quality", "N. Fun", "재미없음", "Flow 달성"] },
          { cells: ["Hidden", "D. Acquisition Gap", "마케팅 충분", "심각 부족"] },
          { cells: ["Hidden", "E. Monetization Gap", "수익화 양호", "심각 미달"] },
          { cells: ["Hidden", "F. Expansion Potential", "확장 완료", "큰 기회"] },
          { cells: ["Momentum", "J. Growth", "MoM < 0%", "> 10%"] },
          { cells: ["Momentum", "K. Social", "UGC 없음", "바이럴"] },
          { cells: ["Momentum", "L. Platform", "스트리밍 없음", "활발"] },
        ],
      },
    ],
  },
  {
    id: "modal-geode-prompts",
    category: "geode",
    titleKo: "PSM Engine",
    titleEn: "PSM Engine",
    icon: "📝",
    maxWidth: 1100,
    content: [
      {
        type: "explanation",
        titleKo: "14-covariate Propensity Score Matching (ATT)",
        titleEn: "14-covariate Propensity Score Matching (ATT)",
        contentKo:
          "PSM Engine은 14개 공변량으로 인과 추정(ATT)을 수행합니다. Treatment: T=1 마케팅 노출 상위 50%. Outcome: Y = DAU×0.3 + Revenue×0.4 + Retention_D30×0.3. 통계 요건: SMD < 0.1(모든 공변량), Z > 1.645(α=0.05), Rosenbaum Γ ≤ 2.0, Caliper = 0.2×SD(PS), Abadie-Imbens robust SE.",
        contentEn:
          "PSM Engine performs causal inference (ATT) with 14 covariates. Treatment: T=1 top 50% marketing exposure. Outcome: Y = DAU×0.3 + Revenue×0.4 + Retention_D30×0.3. Stats requirements: SMD < 0.1 (all covariates), Z > 1.645 (α=0.05), Rosenbaum Γ ≤ 2.0, Caliper = 0.2×SD(PS), Abadie-Imbens robust SE.",
        highlight: true,
        borderColor: "#FB923C",
      },
      {
        type: "table",
        titleKo: "14 공변량 (SOT §2.2.1 DIM_PSM_COVARIATE)",
        titleEn: "14 Covariates (SOT §2.2.1 DIM_PSM_COVARIATE)",
        headers: ["Category", "Covariates"],
        rows: [
          { cells: ["IP 속성 (5)", "genre, dev_tier, platform, price_tier, release_year"] },
          { cells: ["시장 환경 (4)", "region, age_rating, competitor_density, marketing_spend_tier"] },
          { cells: ["IP 특성 (5)", "ip_origin_media, ip_franchise_size, metacritic_score, store_page_score, ip_age_years"] },
        ],
      },
      {
        type: "metrics",
        cards: [
          { value: "14", label: "Covariates", color: "#FB923C" },
          { value: "ATT", label: "Estimand", color: "#818CF8" },
          { value: "< 0.1", label: "SMD Threshold", color: "#34D399" },
          { value: "0.2×SD", label: "Caliper", color: "#FBBF24" },
        ],
      },
    ],
  },

  // ─── CLI ───
  {
    id: "modal-geode-cli",
    category: "geode",
    titleKo: "Typer CLI + 17 Tools",
    titleEn: "Typer CLI + 17 Tools",
    icon: "⌨️",
    content: [
      {
        type: "code",
        titleKo: "CLI 명령 체계",
        titleEn: "CLI Command System",
        language: "bash",
        content: `# 단일 IP 분석
$ uv run geode analyze "Cowboy Bebop"

# DryRun (fixture only, no LLM)
$ uv run geode analyze "Cowboy Bebop" --dry-run

# Verbose 모드
$ uv run geode analyze "Cowboy Bebop" --verbose

# 배치 분석
$ uv run geode batch "Berserk" "Cowboy Bebop" "Ghost in the Shell"

# 대화형 REPL
$ uv run geode`,
      },
      {
        type: "table",
        titleKo: "17 Tools × 5 카테고리",
        titleEn: "17 Tools × 5 Categories",
        headers: ["Category", "Count", "Tools"],
        rows: [
          { cells: ["Data", "3", "IP lookup, Game search, Performance query"] },
          { cells: ["Signal", "5", "YouTube, Reddit, Twitch, Steam, Trends"] },
          { cells: ["Analysis", "3", "Analyze, Compare, Batch"] },
          { cells: ["Memory", "3", "History, Context, Snapshot"] },
          { cells: ["Output", "3", "Report, Export, Status"] },
        ],
      },
    ],
  },
  {
    id: "modal-geode-rich-display",
    category: "geode",
    titleKo: "Rich Live Display",
    titleEn: "Rich Live Display",
    icon: "🎨",
    content: [
      {
        type: "explanation",
        titleKo: "graph.stream() 실시간 파이프라인 시각화",
        titleEn: "graph.stream() Real-time Pipeline Visualization",
        contentKo:
          "Rich Live Display로 graph.stream() 이벤트를 실시간 렌더링합니다. 각 노드의 진행 상태를 Rich Panel로 시각화하고, 분석가별 결과, 평가 점수, 최종 점수와 티어를 Rich Table로 표시합니다. invoke()가 아닌 stream()을 사용하여 단계별 진행 추적이 가능합니다.",
        contentEn:
          "Renders graph.stream() events in real-time via Rich Live Display. Visualizes each node's progress via Rich Panels, showing per-analyst results, evaluation scores, final score and tier in Rich Tables. Uses stream() instead of invoke() for step-by-step progress tracking.",
        highlight: true,
        borderColor: "#2DD4BF",
      },
    ],
  },
  {
    id: "modal-geode-nl-router",
    category: "geode",
    titleKo: "NL Router",
    titleEn: "NL Router",
    icon: "🗣️",
    content: [
      {
        type: "twoColumn",
        left: {
          title: "자연어 입력",
          color: "#2DD4BF",
          items: [
            '"카우보이 비밥 분석해줘"',
            '"Berserk와 비교"',
            '"지난 분석 결과 보여줘"',
            '"도움말"',
          ],
        },
        right: {
          title: "CLI 명령 변환",
          color: "#818CF8",
          items: [
            'analyze "Cowboy Bebop"',
            'compare "Berserk" "Cowboy Bebop"',
            "history --last 5",
            "help",
          ],
        },
      },
    ],
  },

  // ─── Scoring ───
  {
    id: "modal-geode-scoring",
    category: "geode",
    titleKo: "PSM Scoring Engine",
    titleEn: "PSM Scoring Engine",
    icon: "🎯",
    maxWidth: 1000,
    content: [
      {
        type: "code",
        titleKo: "Final Score 산출 공식 (SOT §13.8.1)",
        titleEn: "Final Score Formula (SOT §13.8.1)",
        language: "python",
        content: `# Final Score Calculation (v5.5 weights preserved)
Final = (
    0.25 × exposure_lift +      # PSM (↑ 0.20→0.25)
    0.20 × quality +            # A·B·C·M·N
    0.18 × recovery_potential + # E·F only (D excluded)
    0.12 × growth +             # Trend + IP Expandability
    0.20 × community_momentum + # J·K·L (↓ 0.30→0.20)
    0.05 × developer_track      # NEW in v5.5
) × (0.7 + 0.3 × Confidence / 100)

# Confidence = 1 - CV(analyst_scores)
# CV = Coefficient of Variation = std / mean

# Tier Classification
S ≥ 80 (≥70% 성공률)  |  A ≥ 60 (40-69%)
B ≥ 40 (20-39%)       |  C < 40 (<20%)`,
      },
      {
        type: "explanation",
        titleKo: "D축 제외 사유",
        titleEn: "D-Axis Exclusion Rationale",
        contentKo:
          "D축(Acquisition Gap)은 recovery_potential에서 제외됩니다. PSM exposure_lift_score(가중치 0.25)가 마케팅/노출 차원을 통계적으로 이미 포착하므로, D를 중복 포함하면 노출 차원이 Final Score의 ~31%를 차지하는 이중 계산이 발생합니다. D축은 6 Types 원인 분류(§13.9.2)에서만 활용합니다.",
        contentEn:
          "D-axis (Acquisition Gap) is excluded from recovery_potential. PSM exposure_lift_score (weight 0.25) already statistically captures the marketing/exposure dimension. Including D would cause double-counting where exposure dimension accounts for ~31% of Final Score. D-axis is only used in 6-Types cause classification (§13.9.2).",
        highlight: true,
        borderColor: "#818CF8",
      },
      {
        type: "table",
        titleKo: "3 IP Fixture 검증 결과",
        titleEn: "3 IP Fixture Validation Results",
        headers: ["IP", "Score", "Tier", "Cause", "Action"],
        rows: [
          { cells: ["Berserk", "82.2", "S", "conversion_failure", "marketing_boost"] },
          { cells: ["Cowboy Bebop", "69.4", "A", "undermarketed", "marketing_boost"] },
          { cells: ["Ghost in the Shell", "54.0", "B", "discovery_failure", "community_activation"] },
        ],
      },
    ],
  },
];

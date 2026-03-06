import { Modal } from "../modal-types";

export const geodeModals: Modal[] = [
  // ─── Memory ───
  {
    id: "modal-geode-org-context",
    category: "geode",
    titleKo: "Organization Context",
    titleEn: "Organization Context",
    icon: "🏢",
    content: [
      {
        type: "explanation",
        titleKo: "글로벌 설정 관리",
        titleEn: "Global Configuration Management",
        contentKo: "Organization 레벨에서 장르별 파라미터(r_genre, LTV_mult), 가중치 설정(w_ml, w_llm), 임계값(GREEN/YELLOW/RED)을 중앙 관리합니다.",
        contentEn: "Centrally manages genre parameters (r_genre, LTV_mult), weight settings (w_ml, w_llm), and thresholds (GREEN/YELLOW/RED) at the Organization level.",
        highlight: true,
        borderColor: "#34D399",
      },
      {
        type: "code",
        titleKo: "메모리 계층 구조",
        titleEn: "Memory Hierarchy",
        language: "python",
        content: `# 3-Tier Memory Architecture
Organization (global)
  ├── genre_params: {r_genre, LTV_mult}
  ├── weights: {w_ml: 0.5, w_llm: 0.5}
  └── thresholds: {GREEN: 250K, YELLOW: 250K}

Project (per-IP)
  ├── analysis_history: List[AnalysisResult]
  ├── cached_signals: ExternalSignals
  └── metadata: {created_at, updated_at}

Session (per-run)
  ├── current_state: GeodeState
  ├── pipeline_events: List[HookEvent]
  └── context_var: ContextVar[SessionCtx]`,
      },
    ],
  },
  {
    id: "modal-geode-project-context",
    category: "geode",
    titleKo: "Project Context",
    titleEn: "Project Context",
    icon: "📁",
    content: [
      {
        type: "explanation",
        titleKo: "IP별 분석 히스토리",
        titleEn: "Per-IP Analysis History",
        contentKo: "각 IP(예: Cowboy Bebop)별로 분석 결과, 시그널 캐시, 메타데이터를 누적 관리합니다. 반복 분석 시 이전 결과를 참조하여 트렌드를 추적합니다.",
        contentEn: "Accumulates analysis results, signal cache, and metadata per IP (e.g., Cowboy Bebop). References previous results for trend tracking on repeated analyses.",
        highlight: true,
        borderColor: "#34D399",
      },
      {
        type: "metrics",
        cards: [
          { value: "3", label: "IP Fixtures", color: "#34D399" },
          { value: "YAML", label: "Serialization", color: "#60A5FA" },
          { value: "Port", label: "Storage Abstraction", color: "#818CF8" },
          { value: "∞", label: "History Depth", color: "#F472B6" },
        ],
      },
    ],
  },
  {
    id: "modal-geode-session-context",
    category: "geode",
    titleKo: "Session Context",
    titleEn: "Session Context",
    icon: "💬",
    content: [
      {
        type: "diagram",
        titleKo: "ContextVar 기반 세션 격리",
        titleEn: "ContextVar-based Session Isolation",
        content: `Thread-1: ContextVar[Session_A] ──→ Pipeline Run A
Thread-2: ContextVar[Session_B] ──→ Pipeline Run B
Thread-3: ContextVar[Session_C] ──→ Pipeline Run C

각 스레드는 독립된 세션 컨텍스트를 가짐
→ 동시 분석 시에도 상태 격리 보장`,
      },
    ],
  },

  // ─── Runtime ───
  {
    id: "modal-geode-settings",
    category: "geode",
    titleKo: "Pydantic Settings",
    titleEn: "Pydantic Settings",
    icon: "⚙️",
    content: [
      {
        type: "code",
        titleKo: "설정 구조",
        titleEn: "Configuration Structure",
        language: "python",
        content: `class GeodeConfig(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    anthropic_api_key: str
    model_name: str = "claude-sonnet-4-20250514"
    dry_run: bool = False
    verbose: bool = False
    max_retries: int = 3`,
      },
    ],
  },
  {
    id: "modal-geode-factory",
    category: "geode",
    titleKo: "Runtime Factory",
    titleEn: "Runtime Factory",
    icon: "🏭",
    content: [
      {
        type: "grid",
        columns: 3,
        cards: [
          { title: "🧪 DryRun", color: "#34D399", items: ["Fixture 데이터 사용", "LLM 호출 없음", "빠른 테스트"] },
          { title: "🚀 Full", color: "#818CF8", items: ["Claude Opus 호출", "실제 분석 수행", "프로덕션 모드"] },
          { title: "🔍 Verbose", color: "#FBBF24", items: ["상세 로그 출력", "파이프라인 추적", "디버그 모드"] },
        ],
      },
    ],
  },
  {
    id: "modal-geode-di",
    category: "geode",
    titleKo: "DI Container",
    titleEn: "DI Container",
    icon: "💉",
    content: [
      {
        type: "explanation",
        titleKo: "의존성 주입",
        titleEn: "Dependency Injection",
        contentKo: "Port/Adapter 패턴으로 LLM 클라이언트, 외부 API, 스토리지를 추상화하여 런타임에 구현체를 교체할 수 있습니다.",
        contentEn: "Abstracts LLM client, external API, and storage via Port/Adapter pattern for runtime implementation swapping.",
        highlight: true,
        borderColor: "#60A5FA",
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
        titleKo: "13-Node Pipeline",
        titleEn: "13-Node Pipeline",
        content: `START → router → cortex → signals
                                    ↓
                    ┌──────────── Send API ────────────┐
                    ↓        ↓         ↓         ↓
                 Market  Creative  Audience    Risk
                    ↓        ↓         ↓         ↓
                    └──────────── Fan-in ──────────────┘
                                    ↓
              evaluators → scoring → verification → synthesizer → END`,
      },
      {
        type: "metrics",
        cards: [
          { value: "13", label: "Nodes", color: "#818CF8" },
          { value: "4", label: "Parallel Analysts", color: "#60A5FA" },
          { value: "stream()", label: "Real-time", color: "#34D399" },
          { value: "TypedDict", label: "State Schema", color: "#F472B6" },
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
        titleKo: "Clean Context 병렬 실행",
        titleEn: "Clean Context Parallel Execution",
        contentKo: "Send API로 4명의 분석가를 병렬 실행할 때, analyses 필드를 제거한 Clean Context를 전달합니다. 이는 선행 분석가의 결과가 후행 분석가에게 앵커링 바이어스를 유발하는 것을 방지합니다.",
        contentEn: "When executing 4 analysts in parallel via Send API, Clean Context (without analyses field) is passed. This prevents anchoring bias from prior analyst results affecting subsequent analysts.",
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
        titleKo: "Annotated Reducer",
        titleEn: "Annotated Reducer",
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
          { cells: ["evaluators", "analyses", "evaluations"] },
          { cells: ["scoring", "evaluations", "final_score, tier"] },
          { cells: ["verification", "all", "verified, warnings"] },
          { cells: ["synthesizer", "all", "report, cause"] },
        ],
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
    content: [
      {
        type: "grid",
        columns: 2,
        cards: [
          { title: "🚀 PIPELINE_START", color: "#818CF8", items: ["초기화 로깅", "타이머 시작", "컨텍스트 설정"] },
          { title: "🏁 PIPELINE_END", color: "#34D399", items: ["결과 저장", "메모리 write-back", "리소스 정리"] },
          { title: "➡️ NODE_ENTER", color: "#60A5FA", items: ["노드 시작 로깅", "Rich 상태 업데이트", "타임스탬프 기록"] },
          { title: "⬅️ NODE_EXIT", color: "#FBBF24", items: ["노드 완료 로깅", "결과 검증", "에러 체크"] },
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
        titleKo: "분석 작업 관리",
        titleEn: "Analysis Job Management",
        contentKo: "TaskSystem은 IP 분석 작업을 큐에 등록하고 우선순위에 따라 스케줄링합니다. 배치 분석 시 여러 IP를 순차/병렬로 처리할 수 있습니다.",
        contentEn: "TaskSystem enqueues IP analysis jobs and schedules by priority. For batch analysis, multiple IPs can be processed sequentially or in parallel.",
        highlight: true,
        borderColor: "#F472B6",
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
        titleKo: "동적 분석 전략",
        titleEn: "Dynamic Analysis Strategy",
        contentKo: "IP의 장르, 미디어 유형, 시장 규모에 따라 분석가 가중치와 평가 기준을 동적으로 조정합니다. Plan Mode에서는 사용자가 전략을 미리 확인하고 수정할 수 있습니다.",
        contentEn: "Dynamically adjusts analyst weights and evaluation criteria based on IP genre, media type, and market size. Plan Mode allows users to preview and modify strategies before execution.",
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
  3. LLM Client       → Anthropic SDK + retry
  4. Hook Registry    → Event listeners
  5. Graph Build      → StateGraph compile
  6. Runtime Ready    → CLI / REPL start`,
      },
    ],
  },

  // ─── Verification ───
  {
    id: "modal-geode-guardrails",
    category: "geode",
    titleKo: "G1-G4 Guardrails",
    titleEn: "G1-G4 Guardrails",
    icon: "🚧",
    content: [
      {
        type: "grid",
        columns: 2,
        cards: [
          { title: "G1 범위", color: "#FBBF24", items: ["분석 범위 검증", "IP 데이터 완전성 확인", "필수 필드 존재 검사"] },
          { title: "G2 일관성", color: "#34D399", items: ["분석가 간 점수 편차 검사", "이상치 탐지", "합의 수준 측정"] },
          { title: "G3 출처", color: "#60A5FA", items: ["데이터 출처 추적", "Fixture vs Real 구분", "신뢰도 레벨 태깅"] },
          { title: "G4 편향", color: "#F472B6", items: ["BiasBuster 연동", "장르 편향 보정", "최신성 편향 감지"] },
        ],
      },
    ],
  },
  {
    id: "modal-geode-biasbuster",
    category: "geode",
    titleKo: "BiasBuster",
    titleEn: "BiasBuster",
    icon: "⚖️",
    content: [
      {
        type: "explanation",
        titleKo: "편향 감지 시스템",
        titleEn: "Bias Detection System",
        contentKo: "LLM이 특정 장르나 인기 IP에 편향된 분석을 제공하는 것을 방지합니다. 분석가 간 점수 분산, 장르별 평균 비교, 최신성 편향 지표를 종합하여 편향 경고를 발생시킵니다.",
        contentEn: "Prevents LLM from providing biased analysis toward specific genres or popular IPs. Generates bias warnings by combining analyst score variance, genre average comparison, and recency bias metrics.",
        highlight: true,
        borderColor: "#FBBF24",
      },
    ],
  },
  {
    id: "modal-geode-decision-tree",
    category: "geode",
    titleKo: "Decision Tree",
    titleEn: "Decision Tree",
    icon: "🌳",
    content: [
      {
        type: "diagram",
        titleKo: "원인 분류 (§13.9.2)",
        titleEn: "Cause Classification (§13.9.2)",
        content: `D-E-F Axis Decision Tree (Code-based, NOT LLM):

  D≥3, E≥3 → conversion_failure
  D≥3, E<3 → undermarketed
  D≤2, E≥3 → monetization_misfit
  D≤2, E≤2, F≥3 → niche_gem
  D≤2, E≤2, F≤2 → discovery_failure

※ D-axis excluded from recovery_potential
  (PSM already covers same dimension)`,
      },
      {
        type: "table",
        titleKo: "Fixture 결과",
        titleEn: "Fixture Results",
        headers: ["IP", "Tier", "Score", "Cause"],
        rows: [
          { cells: ["Berserk", "S (82.2)", "82.2", "conversion_failure"] },
          { cells: ["Cowboy Bebop", "A (69.4)", "69.4", "undermarketed"] },
          { cells: ["Ghost in the Shell", "B (54.0)", "54.0", "discovery_failure"] },
        ],
      },
    ],
  },

  // ─── Automation ───
  {
    id: "modal-geode-cusum",
    category: "geode",
    titleKo: "CUSUM 변화점 감지",
    titleEn: "CUSUM Change-Point Detection",
    icon: "📊",
    content: [
      {
        type: "explanation",
        titleKo: "시장 트렌드 모니터링",
        titleEn: "Market Trend Monitoring",
        contentKo: "누적합(CUSUM) 알고리즘으로 장르별 시장 지표의 변화점을 실시간 감지합니다. 임계값 초과 시 자동 재분석을 트리거하여 과거 분석 결과의 유효성을 검증합니다.",
        contentEn: "Detects change-points in genre market metrics in real-time using CUSUM algorithm. Triggers automatic re-analysis when threshold exceeded to validate past analysis results.",
        highlight: true,
        borderColor: "#A78BFA",
      },
    ],
  },
  {
    id: "modal-geode-feedback",
    category: "geode",
    titleKo: "FeedbackLoop",
    titleEn: "FeedbackLoop",
    icon: "🔁",
    content: [
      {
        type: "diagram",
        titleKo: "자동 보정 루프",
        titleEn: "Auto Calibration Loop",
        content: `Analysis Result ──→ Outcome Tracking ──→ Compare
     ↑                                       ↓
     └──── Weight Adjustment ←── Deviation Score

• 예측 vs 실제 성과 비교
• 편차가 크면 가중치 자동 조정
• PIPELINE_END hook에서 MEMORY.md write-back`,
      },
    ],
  },
  {
    id: "modal-geode-expert-panel",
    category: "geode",
    titleKo: "Expert Panel",
    titleEn: "Expert Panel",
    icon: "👨‍🏫",
    content: [
      {
        type: "explanation",
        titleKo: "RLHF 기반 품질 개선",
        titleEn: "RLHF-based Quality Improvement",
        contentKo: "도메인 전문가 패널이 LLM 분석 결과를 평가하고, 피드백을 프롬프트 개선에 반영합니다. 전문가 합의 점수와 LLM 점수의 갭을 분석하여 프롬프트 템플릿을 지속적으로 최적화합니다.",
        contentEn: "Domain expert panel evaluates LLM analysis results and reflects feedback in prompt improvements. Analyzes gap between expert consensus scores and LLM scores to continuously optimize prompt templates.",
        highlight: true,
        borderColor: "#A78BFA",
      },
    ],
  },

  // ─── LLM ───
  {
    id: "modal-geode-claude-client",
    category: "geode",
    titleKo: "Claude Opus Client",
    titleEn: "Claude Opus Client",
    icon: "🤖",
    content: [
      {
        type: "code",
        titleKo: "LLM 클라이언트 구조",
        titleEn: "LLM Client Structure",
        language: "python",
        content: `class ClaudeClient:
    """Anthropic Claude wrapper with structured output."""

    def analyze(self, prompt: str, model: Type[T]) -> T:
        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            messages=[{"role": "user", "content": prompt}],
        )
        return model.model_validate_json(response.content)

    # Retry with exponential backoff
    # Fallback to lighter model on rate limit
    # All responses validated by Pydantic`,
      },
    ],
  },
  {
    id: "modal-geode-structured-output",
    category: "geode",
    titleKo: "Structured Output",
    titleEn: "Structured Output",
    icon: "📐",
    content: [
      {
        type: "explanation",
        titleKo: "Pydantic 강제 JSON 응답",
        titleEn: "Pydantic Enforced JSON Response",
        contentKo: "모든 LLM 호출에서 Pydantic 모델을 통해 JSON 응답을 강제합니다. 분석 결과, 평가 점수, 루브릭 항목이 모두 타입-세이프하게 검증됩니다.",
        contentEn: "Enforces JSON responses via Pydantic models in all LLM calls. Analysis results, evaluation scores, and rubric items are all type-safely validated.",
        highlight: true,
        borderColor: "#FB923C",
      },
      {
        type: "metrics",
        cards: [
          { value: "100%", label: "Type-safe Output", color: "#FB923C" },
          { value: "14", label: "Rubric Axes", color: "#818CF8" },
          { value: "5", label: "Dimensions", color: "#34D399" },
          { value: "0", label: "Schema Violations", color: "#FBBF24" },
        ],
      },
    ],
  },
  {
    id: "modal-geode-prompts",
    category: "geode",
    titleKo: "Prompt Engineering",
    titleEn: "Prompt Engineering",
    icon: "📝",
    content: [
      {
        type: "twoColumn",
        left: {
          title: "5-Dim Rubric",
          color: "#818CF8",
          items: [
            "A-C: Market (시장 규모·성장률)",
            "D-F: Creative (IP 창작 잠재력)",
            "G-I: Audience (팬덤·커뮤니티)",
            "J-L: Risk (리스크 요인)",
            "M-N: Momentum (트렌드·모멘텀)",
          ],
        },
        right: {
          title: "PromptAssembler",
          color: "#FB923C",
          items: [
            "System prompt 조립",
            "IP 데이터 주입",
            "장르별 가중치 적용",
            "Few-shot 예시 포함",
            "출력 스키마 명시",
          ],
        },
      },
    ],
  },

  // ─── CLI ───
  {
    id: "modal-geode-cli",
    category: "geode",
    titleKo: "Typer CLI",
    titleEn: "Typer CLI",
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

# 대화형 REPL
$ uv run geode
> Cowboy Bebop 분석해줘
> Berserk와 비교해줘`,
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
        titleKo: "실시간 파이프라인 시각화",
        titleEn: "Real-time Pipeline Visualization",
        contentKo: "Rich Live Display로 graph.stream() 이벤트를 실시간 렌더링합니다. 각 노드의 진행 상태, 분석가별 결과, 최종 점수와 티어를 Rich Panel로 시각화합니다.",
        contentEn: "Renders graph.stream() events in real-time via Rich Live Display. Visualizes each node's progress, per-analyst results, final score and tier via Rich Panels.",
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
            "\"카우보이 비밥 분석해줘\"",
            "\"Berserk와 비교\"",
            "\"지난 분석 결과 보여줘\"",
            "\"도움말\"",
          ],
        },
        right: {
          title: "CLI 명령 변환",
          color: "#818CF8",
          items: [
            "analyze \"Cowboy Bebop\"",
            "compare \"Berserk\" \"Cowboy Bebop\"",
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
    content: [
      {
        type: "code",
        titleKo: "Scoring Formula (§13.8.1)",
        titleEn: "Scoring Formula (§13.8.1)",
        language: "python",
        content: `# Final Score Calculation
Final = (
    0.25 × PSM +
    0.20 × Quality +
    0.18 × Recovery +
    0.12 × Growth +
    0.20 × Momentum +
    0.05 × Dev
) × (0.7 + 0.3 × Confidence / 100)

# Tier Classification
S ≥ 80  |  A ≥ 60  |  B ≥ 40  |  C < 40`,
      },
      {
        type: "table",
        titleKo: "3 IP Fixture 결과",
        titleEn: "3 IP Fixture Results",
        headers: ["IP", "Score", "Tier", "Cause"],
        rows: [
          { cells: ["Berserk", "82.2", "S", "conversion_failure"] },
          { cells: ["Cowboy Bebop", "69.4", "A", "undermarketed"] },
          { cells: ["Ghost in the Shell", "54.0", "B", "discovery_failure"] },
        ],
      },
    ],
  },
];

import { Achievement, CategoryData } from "../categories";

export const geodeCategories: CategoryData[] = [
  {
    id: "memory",
    icon: "🧠",
    title: "3-Tier Memory",
    postsCount: 3,
    statusKo: "Organization > Project > Session 3계층",
    statusEn: "Organization > Project > Session 3-tier",
    techBadges: ["ContextVar", "YAML", "Port/Adapter", "Pydantic"],
    descriptionKo:
      "Organization → Project → Session 3계층 메모리 아키텍처로, 분석 컨텍스트를 계층적으로 관리합니다. ContextVar 기반 스레드-세이프 구현과 YAML 직렬화를 통해 세션 간 컨텍스트를 유지하고, Port/Adapter 패턴으로 저장소를 추상화합니다.",
    descriptionEn:
      "3-tier memory architecture (Organization → Project → Session) for hierarchical analysis context management. Thread-safe implementation with ContextVar, YAML serialization for cross-session persistence, and Port/Adapter pattern for storage abstraction.",
    achievements: [
      { icon: "🏢", titleKo: "Organization Context 글로벌 설정 + 장르 파라미터 관리", titleEn: "Organization Context global config + genre parameter management", modalId: "modal-geode-org-context" },
      { icon: "📁", titleKo: "Project Context IP별 분석 히스토리 누적", titleEn: "Project Context per-IP analysis history accumulation", modalId: "modal-geode-project-context" },
      { icon: "💬", titleKo: "Session Context ContextVar 기반 스레드-세이프 세션 격리", titleEn: "Session Context ContextVar-based thread-safe session isolation", modalId: "modal-geode-session-context" },
    ],
    blogLink: "",
    color: "#34D399",
  },
  {
    id: "runtime",
    icon: "▶️",
    title: "Runtime Factory",
    postsCount: 2,
    statusKo: "DryRun / Full / Verbose 3-mode",
    statusEn: "DryRun / Full / Verbose 3-mode",
    techBadges: ["Pydantic", "Factory", "DI", "Settings"],
    descriptionKo:
      "Pydantic Settings 기반 구성 관리와 Factory 패턴 런타임 생성을 통해 DryRun(fixture), Full(LLM), Verbose 3가지 실행 모드를 지원합니다. 의존성 주입으로 LLM 클라이언트와 외부 API를 런타임에 교체할 수 있습니다.",
    descriptionEn:
      "Pydantic Settings-based configuration and Factory pattern runtime creation supporting 3 execution modes: DryRun (fixture), Full (LLM), and Verbose. Dependency injection enables runtime swapping of LLM clients and external APIs.",
    achievements: [
      { icon: "⚙️", titleKo: "Pydantic Settings .env + 환경 변수 통합 관리", titleEn: "Pydantic Settings .env + environment variable unified management", modalId: "modal-geode-settings" },
      { icon: "🏭", titleKo: "Factory Pattern DryRun/Full/Verbose 런타임 생성", titleEn: "Factory Pattern DryRun/Full/Verbose runtime creation", modalId: "modal-geode-factory" },
      { icon: "💉", titleKo: "DI Container LLM 클라이언트 + API 포트 주입", titleEn: "DI Container LLM client + API port injection", modalId: "modal-geode-di" },
    ],
    blogLink: "",
    color: "#60A5FA",
  },
  {
    id: "pipeline",
    icon: "🔀",
    title: "LangGraph Pipeline",
    postsCount: 5,
    statusKo: "StateGraph + Send API 병렬 Fan-out",
    statusEn: "StateGraph + Send API Parallel Fan-out",
    techBadges: ["LangGraph", "StateGraph", "Send API", "Reducer", "TypedDict"],
    descriptionKo:
      "LangGraph StateGraph 기반 13-노드 파이프라인으로, router → cortex → signals → analyst×4 (Send API fan-out) → evaluators → scoring → verification → synthesizer 흐름을 구현합니다. Send API로 4명의 분석가를 Clean Context로 병렬 실행하여 앵커링 바이어스를 방지합니다.",
    descriptionEn:
      "13-node pipeline based on LangGraph StateGraph: router → cortex → signals → analyst×4 (Send API fan-out) → evaluators → scoring → verification → synthesizer. Send API executes 4 analysts in parallel with Clean Context to prevent anchoring bias.",
    achievements: [
      { icon: "🗺️", titleKo: "StateGraph 13-node 토폴로지 stream() 기반 실시간 진행", titleEn: "StateGraph 13-node topology stream()-based real-time progress", modalId: "modal-geode-stategraph" },
      { icon: "📡", titleKo: "Send API Fan-out 4 분석가 Clean Context 병렬 실행", titleEn: "Send API Fan-out 4 analysts Clean Context parallel execution", modalId: "modal-geode-send-api" },
      { icon: "➕", titleKo: "Reducer Pattern analyses: Annotated[list, operator.add] 병합", titleEn: "Reducer Pattern analyses: Annotated[list, operator.add] merge", modalId: "modal-geode-reducer" },
      { icon: "📋", titleKo: "Node Contract 각 노드 → dict(output keys only) 반환 규약", titleEn: "Node Contract each node → dict(output keys only) return rule", modalId: "modal-geode-node-contract" },
    ],
    blogLink: "",
    color: "#818CF8",
  },
  {
    id: "orchestration",
    icon: "🎛️",
    title: "Orchestration",
    postsCount: 4,
    statusKo: "Hooks + TaskSystem + Planner",
    statusEn: "Hooks + TaskSystem + Planner",
    techBadges: ["Hooks", "TaskSystem", "Planner", "Plan Mode", "Bootstrap"],
    descriptionKo:
      "Hook 기반 이벤트 시스템으로 파이프라인 라이프사이클(PIPELINE_START/END, NODE_ENTER/EXIT)을 관리합니다. TaskSystem으로 분석 작업을 스케줄링하고, Planner가 IP 특성에 따라 분석 전략을 동적으로 수립합니다.",
    descriptionEn:
      "Hook-based event system managing pipeline lifecycle (PIPELINE_START/END, NODE_ENTER/EXIT). TaskSystem schedules analysis jobs, and Planner dynamically builds analysis strategies based on IP characteristics.",
    achievements: [
      { icon: "🪝", titleKo: "Hook System PIPELINE_START/END, NODE_ENTER/EXIT 이벤트", titleEn: "Hook System PIPELINE_START/END, NODE_ENTER/EXIT events", modalId: "modal-geode-hooks" },
      { icon: "📝", titleKo: "TaskSystem 분석 작업 큐 + 우선순위 스케줄링", titleEn: "TaskSystem analysis job queue + priority scheduling", modalId: "modal-geode-task-system" },
      { icon: "🧭", titleKo: "Planner IP 특성 기반 동적 분석 전략 수립", titleEn: "Planner dynamic analysis strategy based on IP characteristics", modalId: "modal-geode-planner" },
      { icon: "🔌", titleKo: "Bootstrap 의존성 와이어링 + 서비스 초기화", titleEn: "Bootstrap dependency wiring + service initialization", modalId: "modal-geode-bootstrap" },
    ],
    blogLink: "",
    color: "#F472B6",
  },
  {
    id: "verification",
    icon: "🛡️",
    title: "Verification System",
    postsCount: 3,
    statusKo: "Guardrails + BiasBuster + Cross-LLM",
    statusEn: "Guardrails + BiasBuster + Cross-LLM",
    techBadges: ["Guardrails", "BiasBuster", "Cross-LLM", "Decision Tree"],
    descriptionKo:
      "G1-G4 4단계 가드레일(범위, 일관성, 출처, 편향)과 BiasBuster 편향 감지 시스템으로 LLM 분석 품질을 보장합니다. Decision Tree로 D-E-F 축 기반 원인을 분류하고, Cross-LLM 교차 검증으로 단일 모델 편향을 방지합니다.",
    descriptionEn:
      "G1-G4 four-stage guardrails (scope, consistency, source, bias) and BiasBuster bias detection ensure LLM analysis quality. Decision Tree classifies causes based on D-E-F axes, Cross-LLM cross-validation prevents single-model bias.",
    achievements: [
      { icon: "🚧", titleKo: "G1-G4 Guardrails 범위·일관성·출처·편향 4단계 검증", titleEn: "G1-G4 Guardrails scope·consistency·source·bias 4-stage verification", modalId: "modal-geode-guardrails" },
      { icon: "⚖️", titleKo: "BiasBuster 편향 감지 + 신뢰도 보정 시스템", titleEn: "BiasBuster bias detection + confidence calibration", modalId: "modal-geode-biasbuster" },
      { icon: "🌳", titleKo: "Decision Tree D-E-F 축 기반 코드 분류 (LLM 미사용)", titleEn: "Decision Tree D-E-F axis code-based classification (no LLM)", modalId: "modal-geode-decision-tree" },
    ],
    blogLink: "",
    color: "#FBBF24",
  },
  {
    id: "automation",
    icon: "🔄",
    title: "L4.5 Automation",
    postsCount: 3,
    statusKo: "CUSUM + FeedbackLoop + RLHF",
    statusEn: "CUSUM + FeedbackLoop + RLHF",
    techBadges: ["CUSUM", "FeedbackLoop", "Outcome Tracking", "Expert Panel"],
    descriptionKo:
      "CUSUM 변화점 감지로 시장 트렌드 이상을 실시간 모니터링하고, FeedbackLoop으로 분석 결과 → 실제 성과를 추적하여 모델을 자동 보정합니다. Expert Panel 기반 RLHF로 LLM 판단 품질을 지속적으로 개선합니다.",
    descriptionEn:
      "Real-time market trend anomaly monitoring with CUSUM change-point detection, FeedbackLoop tracking analysis results → actual outcomes for automatic model calibration. Expert Panel-based RLHF continuously improves LLM judgment quality.",
    achievements: [
      { icon: "📊", titleKo: "CUSUM 변화점 감지 시장 트렌드 이상 모니터링", titleEn: "CUSUM change-point detection market trend anomaly monitoring", modalId: "modal-geode-cusum" },
      { icon: "🔁", titleKo: "FeedbackLoop 분석→성과 추적 + 자동 보정", titleEn: "FeedbackLoop analysis→outcome tracking + auto calibration", modalId: "modal-geode-feedback" },
      { icon: "👨‍🏫", titleKo: "Expert Panel RLHF 기반 LLM 판단 품질 개선", titleEn: "Expert Panel RLHF-based LLM judgment quality improvement", modalId: "modal-geode-expert-panel" },
    ],
    blogLink: "",
    color: "#A78BFA",
  },
  {
    id: "llm",
    icon: "✨",
    title: "LLM Client",
    postsCount: 4,
    statusKo: "Claude Opus + Structured Output",
    statusEn: "Claude Opus + Structured Output",
    techBadges: ["Claude Opus", "Structured Output", "Pydantic", "Prompt Engineering"],
    descriptionKo:
      "Anthropic Claude Opus 기반 LLM 클라이언트로, 모든 분석·평가 호출에서 Pydantic 모델로 JSON Structured Output을 강제합니다. 5-Dimension Rubric 프롬프트 템플릿과 PromptAssembler로 일관된 분석 품질을 보장합니다.",
    descriptionEn:
      "Anthropic Claude Opus-based LLM client enforcing JSON Structured Output via Pydantic models for all analysis/evaluation calls. 5-Dimension Rubric prompt templates and PromptAssembler ensure consistent analysis quality.",
    achievements: [
      { icon: "🤖", titleKo: "Claude Opus 클라이언트 Anthropic SDK + retry + fallback", titleEn: "Claude Opus client Anthropic SDK + retry + fallback", modalId: "modal-geode-claude-client" },
      { icon: "📐", titleKo: "Structured Output Pydantic 모델 강제 JSON 응답", titleEn: "Structured Output Pydantic model enforced JSON response", modalId: "modal-geode-structured-output" },
      { icon: "📝", titleKo: "Prompt Engineering 5-Dim Rubric + PromptAssembler", titleEn: "Prompt Engineering 5-Dim Rubric + PromptAssembler", modalId: "modal-geode-prompts" },
    ],
    blogLink: "",
    color: "#FB923C",
  },
  {
    id: "cli",
    icon: "💻",
    title: "CLI + REPL",
    postsCount: 3,
    statusKo: "Typer + Rich + NL Router",
    statusEn: "Typer + Rich + NL Router",
    techBadges: ["Typer", "Rich", "NL Router", "REPL", "Live Display"],
    descriptionKo:
      "Typer 기반 CLI와 대화형 REPL로 분석을 실행합니다. Rich Live Display로 실시간 파이프라인 진행 상황을 시각화하고, NL Router가 자연어 입력을 CLI 명령으로 자동 변환합니다. --dry-run, --verbose 플래그로 실행 모드를 제어합니다.",
    descriptionEn:
      "Typer-based CLI and interactive REPL for running analyses. Rich Live Display visualizes real-time pipeline progress, NL Router auto-converts natural language to CLI commands. --dry-run, --verbose flags control execution mode.",
    achievements: [
      { icon: "⌨️", titleKo: "Typer CLI analyze, batch, compare 명령 체계", titleEn: "Typer CLI analyze, batch, compare command system", modalId: "modal-geode-cli" },
      { icon: "🎨", titleKo: "Rich Live Display 실시간 파이프라인 진행 시각화", titleEn: "Rich Live Display real-time pipeline progress visualization", modalId: "modal-geode-rich-display" },
      { icon: "🗣️", titleKo: "NL Router 자연어 → CLI 명령 자동 변환", titleEn: "NL Router natural language → CLI command auto-conversion", modalId: "modal-geode-nl-router" },
    ],
    blogLink: "",
    color: "#2DD4BF",
  },
];

import { Modal } from "../modal-types";

export const chatModals: Modal[] = [
  {
    id: "modal-chat-evaluation",
    category: "chat",
    titleKo: "LLM Evaluation Pipeline (Swiss Cheese Model)",
    titleEn: "LLM Evaluation Pipeline (Swiss Cheese Model)",
    icon: "🧀",
    maxWidth: 1100,
    content: [
      {
        type: "explanation",
        titleKo: "Swiss Cheese Model: 단일 Grader는 반드시 실패한다",
        titleEn: "Swiss Cheese Model: A Single Grader Must Fail",
        contentKo: "James Reason(1990)의 Swiss Cheese Model을 LLM Agent 평가에 적용. 사고는 단일 실패가 아닌 '다층 방어의 구멍이 동시에 정렬될 때' 발생합니다. 3종 Grader(Code/LLM/Human)의 직교 슬라이스로 방어 깊이를 확보합니다.",
        contentEn: "Applied James Reason's Swiss Cheese Model (1990) to LLM Agent evaluation. Accidents occur not from single failures but when 'multiple defense layers' holes align simultaneously.' Defense in depth via 3 orthogonal Grader slices (Code/LLM/Human).",
        highlight: true,
        borderColor: "#f59e0b",
      },
      {
        type: "diagram",
        titleKo: "3-Tier Evaluation Architecture",
        titleEn: "3-Tier Evaluation Architecture",
        content: `┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        LLM Evaluation Pipeline (Swiss Cheese)                        │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│   ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐             │
│   │   L1: Code      │      │   L2: LLM       │      │   L3: Calibration│             │
│   │   Grader        │─────▶│   Judge         │─────▶│   Monitor        │             │
│   │   <50ms         │      │   ~1-2s         │      │   Periodic       │             │
│   └─────────────────┘      └─────────────────┘      └─────────────────┘             │
│           │                         │                        │                       │
│           ▼                         ▼                        ▼                       │
│   ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐             │
│   │ Regex, Token    │      │ 5-Axis BARS     │      │ CUSUM Drift     │             │
│   │ Count, Keywords │      │ Structured Eval │      │ Detection       │             │
│   └─────────────────┘      └─────────────────┘      └─────────────────┘             │
│                                                                                      │
│   Execution Modes:                                                                   │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐                                          │
│   │  sync    │  │  async   │  │  shadow  │                                          │
│   │ L1 only  │  │ L1+L2/L3 │  │ Full eval│                                          │
│   │ Cost: 0  │  │ Cost:~800│  │Cost:~7500│                                          │
│   └──────────┘  └──────────┘  └──────────┘                                          │
└─────────────────────────────────────────────────────────────────────────────────────┘`,
      },
      {
        type: "grid",
        columns: 3,
        cards: [
          {
            title: "⚡ L1: Code Grader",
            color: "#22c55e",
            items: [
              "Latency: <50ms (Critical Path)",
              "Regex, Token Count, Keywords",
              "Deterministic, Reproducible",
              "C-Grade → Regeneration 트리거",
            ],
          },
          {
            title: "🧠 L2: LLM Judge (BARS)",
            color: "#3b82f6",
            items: [
              "5-Axis: Faithfulness(0.30), Relevance(0.25), Completeness(0.20), Safety(0.15), Communication(0.10)",
              "Structured Output (Pydantic)",
              "Self-Consistency 3x (CV<0.2)",
              "Cross-model 검증 (10% sample)",
            ],
          },
          {
            title: "📊 L3: Calibration Monitor",
            color: "#f59e0b",
            items: [
              "CUSUM (k=0.5, h=4.0)",
              "Krippendorff's α ≥0.75 target",
              "50-sample Calibration Set",
              "0.5-point drift @ 80% power",
            ],
          },
        ],
      },
      {
        type: "table",
        titleKo: "🎯 5-Axis BARS Rubric (1-5 Scale)",
        titleEn: "🎯 5-Axis BARS Rubric (1-5 Scale)",
        headers: ["Axis", "Weight", "Description", "Info Loss"],
        rows: [
          { cells: ["Faithfulness", "0.30", "Factual grounding in context", "—"] },
          { cells: ["Relevance", "0.25", "Direct answer to query", "—"] },
          { cells: ["Completeness", "0.20", "TREC Nugget-based coverage", "—"] },
          { cells: ["Safety", "0.15→0.25", "Risk mitigation (hazmat boost)", "—"] },
          { cells: ["Communication", "0.10", "Clarity and tone", "—"] },
          { cells: ["Total", "5^5=3,125", "→ 4 Grades (S/A/B/C)", "~9.61 bits"] },
        ],
      },
      {
        type: "metrics",
        cards: [
          { value: "99.8", label: "Expert Review Score", color: "#22c55e" },
          { value: "5", label: "Review Rounds", color: "#3b82f6" },
          { value: "≥96", label: "Target Threshold", color: "#f59e0b" },
          { value: "69→99", label: "Score Progression", color: "#8b5cf6" },
        ],
      },
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "📈 Expert Review Progression",
            color: "#10b981",
            items: [
              "Round 1 (Initial): 69.4/100",
              "Round 2 (v2): 89.2/100 (+19.8)",
              "Round 3 (v2.1): 95.4/100 (+6.2)",
              "Round 4 (v2.2): 98.8/100 (+3.4) ✅",
              "Round 5 (Gap Fix): 99.8/100 ✅",
            ],
          },
          {
            title: "🎭 Bias Mitigation (7 Techniques)",
            color: "#ec4899",
            items: [
              "Central Tendency: Logprob norm, extreme anchors",
              "Leniency: Explicit 1-2pt failure behaviors",
              "Sycophancy: Separate LLM prompts per axis",
              "Position: Randomized axis sequence",
              "Self-Consistency: 3x runs, CV<0.2",
              "Verbosity: Length↔Score Pearson r guard",
              "Self-Enhancement: Cross-model (Judge≠Gen)",
            ],
          },
        ],
      },
      {
        type: "grid",
        columns: 4,
        cards: [
          {
            title: "📊 Grade Thresholds",
            color: "#8b5cf6",
            items: ["S ≥90", "A: 75-89", "B: 55-74", "C <55"],
          },
          {
            title: "💰 Cost Model (10K/day)",
            color: "#f59e0b",
            items: ["L1: $0", "L2: ~$20/mo", "L2×3: ~$60/mo", "Full: ~$190/mo"],
          },
          {
            title: "🔄 Lifecycle Phases",
            color: "#22c55e",
            items: ["1. Capability (30-50%)", "2. Graduation (90%+)", "3. Regression (pre-merge)", "4. Refresh (100%×4wk)"],
          },
          {
            title: "🚨 Alerts",
            color: "#ef4444",
            items: ["Cost >80%: WARNING", "Cost >100%: CRITICAL", "CUSUM crit: 2h SLA", "α<0.75: HITL escalate"],
          },
        ],
      },
      {
        type: "explanation",
        titleKo: "Regeneration Logic: C-Grade 자동 재생성",
        titleEn: "Regeneration Logic: Auto-Regenerate on C-Grade",
        contentKo: "sync 모드에서 C-Grade 응답 감지 시 eval_improvement_hints와 함께 1-turn 재생성을 시도합니다. 최소 5점 개선 미달 시 원본을 유지하고, SSE event 'eval_regeneration_started'로 프론트엔드에 'preparing better answer' 표시를 트리거합니다.",
        contentEn: "In sync mode, C-grade response triggers 1-turn retry with eval_improvement_hints. If improvement is less than 5 points, original is kept. SSE event 'eval_regeneration_started' triggers frontend 'preparing better answer' display.",
        highlight: false,
      },
      {
        type: "link",
        labelKo: "📚 Swiss Cheese Model for LLM Evaluation →",
        labelEn: "📚 Swiss Cheese Model for LLM Evaluation →",
        href: "https://rooftopsnow.tistory.com/273",
      },
      {
        type: "link",
        labelKo: "📚 LLM-as-Judge 루브릭 설계 →",
        labelEn: "📚 LLM-as-Judge Rubric Design →",
        href: "https://rooftopsnow.tistory.com/274",
      },
      {
        type: "link",
        labelKo: "📚 Chat Eval Pipeline Integration Plan →",
        labelEn: "📚 Chat Eval Pipeline Integration Plan →",
        href: "https://rooftopsnow.tistory.com/275",
      },
      {
        type: "link",
        labelKo: "📚 ADR: Chat LangGraph Eval Pipeline →",
        labelEn: "📚 ADR: Chat LangGraph Eval Pipeline →",
        href: "https://rooftopsnow.tistory.com/276",
      },
    ],
  },
  {
    id: "modal-chat-langgraph",
    category: "chat",
    titleKo: "Multi-Agent Chat LangGraph Workflow",
    titleEn: "Multi-Agent Chat LangGraph Workflow",
    icon: "🔀",
    maxWidth: 1100,
    content: [
      {
        type: "image",
        src: "assets/images/langgraph_chat_worker.png",
        alt: "LangGraph Chat Worker Workflow",
      },
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "🎯 Intent Node",
            color: "#8b5cf6",
            items: [
              "Multi-Intent ICL (arxiv:2304.11384)",
              "Chain-of-Intent (CIKM '25 논문)",
              "IntentSignals = llm_confidence + keyword_boost + transition_boost",
              "전이 부스트 상한: MAX_TRANSITION_BOOST = 0.15",
              "신뢰도 < 0.6 → general fallback",
              "Cache: SHA256 해싱, TTL 1h",
            ],
          },
          {
            title: "🔀 Dynamic Router (Send API)",
            color: "#3b82f6",
            items: [
              "Multi-intent fanout: additional_intents → 병렬 Send",
              "Intent enrichment: waste/bulk_waste → weather 자동",
              "Conditional: user_location → weather 조건부",
            ],
          },
          {
            title: "📦 Aggregator",
            color: "#22c55e",
            items: [
              "병렬 결과 수집: 9개 context 필드 병합",
              "Required/Optional: contracts.py SSOT",
              "필수 누락: needs_fallback=True 트리거",
            ],
          },
          {
            title: "📝 Summarize (Context Compression)",
            color: "#f59e0b",
            items: [
              "OpenCode 스타일: context_window - max_output 초과 시",
              "GPT-5.2: 400K context, 트리거 272K, 요약 60K",
              "구조화된 5섹션 요약",
              "PRUNE_PROTECT: 40K 토큰 보호",
            ],
          },
        ],
      },
      {
        type: "subagentTable",
        titleKo: "11 Subagent Nodes",
        titleEn: "11 Subagent Nodes",
        headers: ["Node", "Intent", "Data Source", "Protocol"],
        rows: [
          { node: "waste_rag", intent: "waste", dataSource: "JSON 규정 + Feedback Loop", protocol: "In-Memory" },
          { node: "character", intent: "character", dataSource: "Character Service", protocol: "gRPC" },
          { node: "location", intent: "location", dataSource: "Kakao Local API", protocol: "HTTP" },
          { node: "bulk_waste", intent: "bulk_waste", dataSource: "행정안전부 MOIS API", protocol: "HTTP" },
          { node: "recyclable_price", intent: "recyclable_price", dataSource: "한국환경공단 KECO", protocol: "HTTP" },
          { node: "collection_point", intent: "collection_point", dataSource: "한국환경공단 KECO", protocol: "HTTP" },
          { node: "weather", intent: "weather / enrichment", dataSource: "기상청 KMA API", protocol: "HTTP" },
          { node: "web_search", intent: "web_search", dataSource: "DuckDuckGo/Tavily", protocol: "HTTP" },
          { node: "image_generation", intent: "image_generation", dataSource: "gemini-3-pro-image + Images gRPC", protocol: "gRPC" },
          { node: "feedback", intent: "(after waste_rag)", dataSource: "LLM Evaluator + Fallback", protocol: "Internal" },
          { node: "general", intent: "general", dataSource: "Passthrough (LLM Only)", protocol: "-" },
        ],
      },
      {
        type: "explanation",
        titleKo: "왜 LangGraph를 단일 Task로 큐잉하는가?",
        titleEn: "Why queue LangGraph as a single Task?",
        contentKo: "@broker.task(\"chat.process\")는 LangGraph StateGraph 전체를 하나의 Task 단위로 큐잉합니다. 1. 런타임 동적 라우팅 — Send API는 실행 시점에 additional_intents와 Enrichment Rules를 평가. 2. Conditional Edges — route_after_feedback처럼 노드 결과에 따라 다음 경로 결정. 3. State 일관성 — ChatState는 모든 노드가 공유하는 단일 상태 객체.",
        contentEn: "@broker.task(\"chat.process\") queues the entire LangGraph StateGraph as a single Task. 1. Runtime dynamic routing — Send API evaluates additional_intents and Enrichment Rules at execution. 2. Conditional Edges — Like route_after_feedback, next path is determined by node results. 3. State consistency — ChatState is a single state object shared by all nodes.",
        highlight: true,
        borderColor: "#8b5cf6",
      },
      {
        type: "code",
        titleKo: "💾 3-Tier Memory (ReadThroughCheckpointer)",
        titleEn: "💾 3-Tier Memory (ReadThroughCheckpointer)",
        content: `// 노드 실행마다 Checkpoint 저장 → 8개 서브에이전트 병렬 시 동시 write
Worker → Redis Primary (~1ms, pool 불필요)
    └─ SyncableRedisSaver: chat:checkpoint:cache:{thread_id} (TTL 24h)
    └─ Sync Queue 적재 (RPUSH checkpoint:sync:queue)
CheckpointSyncService (별도 Deployment, replicas=1)
    └─ BRPOP → Bulk Upsert PostgreSQL (5초 주기 배치)
    └─ pool_max_size=5 (단일 인스턴스)
Read Miss (Cold Start) → PostgreSQL → Redis promote (LRU)
    └─ Temporal Locality: 연속 요청 hit rate ≈ 99%+
// Connection Pool: 212 → 33 (84% 감소), psycopg_pool.PoolTimeout 해결`,
      },
      {
        type: "link",
        labelKo: "→ 3-Tier Memory 상세 보기",
        labelEn: "→ View 3-Tier Memory Details",
        href: "#",
        isModal: true,
        modalId: "modal-3tier-memory",
      },
    ],
  },
  {
    id: "modal-chat-eventbus",
    category: "chat",
    titleKo: "Chat Event Bus Architecture",
    titleEn: "Chat Event Bus Architecture",
    icon: "🚌",
    maxWidth: 900,
    content: [
      {
        type: "diagram",
        titleKo: "Event Bus: Redis Streams + Pub/Sub",
        titleEn: "Event Bus: Redis Streams + Pub/Sub",
        content: `┌───────────────────────────────────────────────────────────────────────────────────┐
│                           Chat Event Bus Architecture                              │
├───────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  ┌─────────────────┐     XADD      ┌────────────────────┐    XREADGROUP           │
│  │   Chat Worker   │──────────────▶│   Redis Streams    │◀──────────────┐         │
│  │   (LangGraph)   │               │ chat:events:{shard}│               │         │
│  └────────┬────────┘               │     (4 shards)     │    ┌──────────┴───────┐ │
│           │                        └────────────────────┘    │   Event Router   │ │
│           │ Token v2                                         │ (Consumer Group) │ │
│           ▼                                                  └──────────┬───────┘ │
│  ┌─────────────────┐               ┌────────────────────┐               │         │
│  │ chat:tokens:    │               │    State KV        │◀──────────────┤ Lua     │
│  │   {job_id}      │               │ chat:state:{job_id}│   UPDATE      │ Script  │
│  └─────────────────┘               └────────────────────┘               │         │
│           │                                 │                           │ PUBLISH │
│           │ Catch-up                        │ Fallback                  ▼         │
│           │                                 │                ┌─────────────────┐  │
│           ▼                                 ▼                │     Pub/Sub     │  │
│  ┌───────────────────────────────────────────────────────┐   │sse:events:      │  │
│  │                     SSE Gateway                        │◀─┤   {job_id}      │  │
│  │  SUBSCRIBE + State Fallback + Streams Catch-up         │   └─────────────────┘  │
│  └────────────────────────────┬──────────────────────────┘                        │
│                               │ SSE                                                │
│                               ▼                                                    │
│                          [ Client ]                                                │
│                                                                                    │
├───────────────────────────────────────────────────────────────────────────────────┤
│  Checkpoint: Redis Primary + PostgreSQL Async Sync                                 │
│  ┌─────────────────┐   ~1ms    ┌──────────────┐  5s batch  ┌──────────────────┐   │
│  │ SyncableRedis   │──────────▶│    Redis     │───────────▶│   PostgreSQL     │   │
│  │    Saver        │   SET     │  checkpoint  │  UPSERT    │  (Durable Store) │   │
│  └─────────────────┘           └──────────────┘            └──────────────────┘   │
│  ReadThroughCheckpointer: Redis Hit → return / Miss → PG read → Redis promote     │
└───────────────────────────────────────────────────────────────────────────────────┘`,
      },
      {
        type: "grid",
        columns: 4,
        cards: [
          {
            title: "📝 Stream Key",
            color: "#3b82f6",
            items: ["chat:tokens:{job_id}", "TTL: 3600s (1시간)", "Max Length: 10,000", "Seq-based ID"],
          },
          {
            title: "📸 State Snapshot",
            color: "#22c55e",
            items: ["10토큰마다 스냅샷", "chat:state:{job_id}", "재연결 시 catch-up", "Last-Event-ID"],
          },
          {
            title: "🔄 Catch-up",
            color: "#f59e0b",
            items: ["클라이언트 재연결", "Last-Event-ID 전송", "XREAD STREAMS", "누락 이벤트 복구"],
          },
          {
            title: "📊 Event Types",
            color: "#ec4899",
            items: ["progress", "token", "agent_state", "metadata", "complete", "error"],
          },
        ],
      },
      {
        type: "grid",
        columns: 3,
        cards: [
          {
            title: "Chat Worker",
            color: "#8b5cf6",
            items: ["Trigger: RabbitMQ Queue Length", "Queue: chat.process", "Threshold: 5 messages", "Replicas: 1 → 4"],
          },
          {
            title: "SSE Gateway",
            color: "#10b981",
            items: ["Trigger: Prometheus", "Metric: sse_active_connections", "Threshold: 100/pod", "Replicas: 1 → 3"],
          },
          {
            title: "Event Router",
            color: "#3b82f6",
            items: ["Trigger: Prometheus", "Metric: pending_events", "Threshold: 100", "Replicas: 1 → 2"],
          },
        ],
      },
    ],
  },
  {
    id: "modal-chat-taskiq",
    category: "chat",
    titleKo: "Taskiq: asyncio-native Worker",
    titleEn: "Taskiq: asyncio-native Worker",
    icon: "🔄",
    maxWidth: 1000,
    content: [
      {
        type: "diagram",
        titleKo: "Taskiq Worker Architecture",
        titleEn: "Taskiq Worker Architecture",
        content: `┌─────────────────────────────────────────────────────────────────────────────┐
│                     Taskiq Worker Architecture                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Command:                                                                   │
│   taskiq worker chat_worker.main:broker --workers 4 --max-async-tasks 10    │
│                                                                              │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │  Worker Pool (4 processes × 10 async = 40 concurrent tasks)          │  │
│   │  ─────────────────────────────────────────────────────────────────   │  │
│   │                                                                       │  │
│   │   Worker 1        Worker 2        Worker 3        Worker 4           │  │
│   │   ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐          │  │
│   │   │asyncio  │    │asyncio  │    │asyncio  │    │asyncio  │          │  │
│   │   │loop     │    │loop     │    │loop     │    │loop     │          │  │
│   │   │ 10 tasks│    │ 10 tasks│    │ 10 tasks│    │ 10 tasks│          │  │
│   │   └─────────┘    └─────────┘    └─────────┘    └─────────┘          │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│   Task Definition:                                                           │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │  @broker.task(task_name="chat.process", timeout=120, max_retries=2)  │  │
│   │  async def process_chat(job_id, session_id, message, image_url=None):│  │
│   │      async with LangGraphApp(...) as app:                            │  │
│   │          await app.ainvoke(...)                                      │  │
│   │          await event_bus.publish(...)                                │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘`,
      },
      {
        type: "table",
        titleKo: "⚡ Celery vs Taskiq 비교",
        titleEn: "⚡ Celery vs Taskiq Comparison",
        headers: ["항목", "Celery (Scan Worker)", "Taskiq (Chat Worker)"],
        rows: [
          { cells: ["동시성 모델", "gevent (greenlet)", "asyncio (native)"] },
          { cells: ["LangGraph 호환", "△ (래핑 필요)", "✅ Native async"] },
          { cells: ["Broker", "RabbitMQ", "RabbitMQ (AioPikaBroker)"] },
          { cells: ["결과 반환", "AsyncResult", "TaskiqResult"] },
          { cells: ["사용처", "Scan Worker (Vision)", "Chat Worker (LangGraph)"] },
        ],
      },
      {
        type: "metrics",
        cards: [
          { value: "40", label: "동시 처리 태스크", color: "#10b981" },
          { value: "120s", label: "태스크 타임아웃", color: "#3b82f6" },
          { value: "2", label: "최대 재시도", color: "#f59e0b" },
        ],
      },
      {
        type: "link",
        labelKo: "📚 Taskiq asyncio 워커 설정 →",
        labelEn: "📚 Taskiq asyncio Worker Configuration →",
        href: "https://rooftopsnow.tistory.com/243",
      },
    ],
  },
  {
    id: "modal-chat-sse",
    category: "chat",
    titleKo: "SSE Gateway: Token v2 Streaming",
    titleEn: "SSE Gateway: Token v2 Streaming",
    icon: "📺",
    maxWidth: 1000,
    content: [
      {
        type: "diagram",
        titleKo: "SSE Gateway Architecture",
        titleEn: "SSE Gateway Architecture",
        content: `┌─────────────────────────────────────────────────────────────────────────────┐
│                        SSE Gateway Architecture                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌───────────────────┐                      ┌──────────────────────────┐   │
│   │   Event Router    │    PUBLISH           │     SSE Gateway          │   │
│   │  (Consumer Group) │ ────────────────────▶│                          │   │
│   └───────────────────┘                      │   ┌──────────────────┐   │   │
│                                               │   │ In-memory fan-out│   │──▶│ SSE
│   ┌───────────────────┐                      │   └──────────────────┘   │   │
│   │   Redis Streams   │    XRANGE            │   ┌──────────────────┐   │   │
│   │ chat:events:{id}  │ ◀────────────────────│   │ State recovery   │   │   │
│   └───────────────────┘   (catch-up)         │   │ (Redis KV)       │   │   │
│                                               │   └──────────────────┘   │   │
│   ┌───────────────────┐                      │   ┌──────────────────┐   │   │
│   │   Redis Pub/Sub   │    SUBSCRIBE         │   │ Last-Event-ID    │   │   │
│   │ chat:{job_id}     │ ────────────────────▶│   │ header           │   │   │
│   └───────────────────┘                      │   └──────────────────┘   │   │
│                                               └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘`,
      },
      {
        type: "table",
        titleKo: "🔄 Token v2 Recovery Protocol",
        titleEn: "🔄 Token v2 Recovery Protocol",
        headers: ["기능", "구현", "설정값"],
        rows: [
          { cells: ["Stale Detection", "3초 타임아웃 시 자동 재연결", "3s threshold"] },
          { cells: ["Max Reconnections", "지수 간격으로 최대 3회 시도", "3 attempts"] },
          { cells: ["Fallback Polling", "SSE 실패 시 폴링 전환", "3s interval, 120s max"] },
          { cells: ["Seq Encoding", "Stage: STAGE_ORDER×10, Token: 1000+", "Last-Event-ID"] },
          { cells: ["Catch-up", "XREVRANGE로 누락 이벤트 복구", "State KV + Streams"] },
        ],
      },
      {
        type: "twoColumn",
        left: {
          title: "🚀 eventrouter",
          color: "#10b981",
          items: ["목적: 실시간 SSE 브로드캐스트", "지연: ~10ms", "동작: PUBLISH → Pub/Sub"],
        },
        right: {
          title: "💾 chat-persistence",
          color: "#3b82f6",
          items: ["목적: PostgreSQL 영구 저장", "지연: ~200ms", "동작: XACK → INSERT"],
        },
      },
      {
        type: "link",
        labelKo: "📚 SSE Token v2 프로토콜 →",
        labelEn: "📚 SSE Token v2 Protocol →",
        href: "https://rooftopsnow.tistory.com/240",
      },
    ],
  },
  {
    id: "modal-chat-aggregator",
    category: "chat",
    titleKo: "Aggregator Node - Result Collection & Validation",
    titleEn: "Aggregator Node - Result Collection & Validation",
    icon: "📦",
    maxWidth: 900,
    content: [
      {
        type: "diagram",
        titleKo: "Aggregator Architecture",
        titleEn: "Aggregator Architecture",
        content: `┌──────────────────────────────────────────────────────────────────────────┐
│                          Aggregator Node                                  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│   │waste_rag│ │character│ │location │ │bulk_... │ │ weather │  ...      │
│   └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘           │
│        │           │           │           │           │                 │
│        ▼           ▼           ▼           ▼           ▼                 │
│   ┌─────────────────────────────────────────────────────────────┐       │
│   │              LangGraph State Auto-Merge                       │       │
│   │   disposal_rules | character_ctx | location_ctx | ...        │       │
│   └─────────────────────────────────────────────────────────────┘       │
│                                    │                                     │
│                                    ▼                                     │
│   ┌─────────────────────────────────────────────────────────────┐       │
│   │                   Aggregator Node                             │       │
│   │   1. 수집된 context 필드 확인 (9개)                            │       │
│   │   2. Required vs Optional 검증 (contracts.py SSOT)            │       │
│   │   3. 필수 누락 시 needs_fallback=True                          │       │
│   │   4. Progress: 60% → 65%                                      │       │
│   └─────────────────────────────────────────────────────────────┘       │
│                                    │                                     │
│                                    ▼                                     │
│                           [summarize?] → answer                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘`,
      },
      {
        type: "contextFields",
        titleKo: "9 Context Fields",
        titleEn: "9 Context Fields",
        fields: [
          { name: "disposal_rules", descKo: "RAG 검색 결과", descEn: "RAG search results" },
          { name: "character_context", descKo: "캐릭터 정보", descEn: "Character info" },
          { name: "location_context", descKo: "위치 정보", descEn: "Location info" },
          { name: "bulk_waste_context", descKo: "대형폐기물 정보", descEn: "Bulk waste info" },
          { name: "recyclable_price_context", descKo: "재활용품 시세", descEn: "Recyclable prices" },
          { name: "weather_context", descKo: "날씨 정보", descEn: "Weather info" },
          { name: "collection_point_context", descKo: "수거함 위치", descEn: "Collection points" },
          { name: "web_search_results", descKo: "웹 검색 결과", descEn: "Web search results" },
          { name: "image_generation_context", descKo: "이미지 생성 결과", descEn: "Image generation" },
        ],
      },
      {
        type: "details",
        items: [
          { label: "Required Fields", value: "disposal_rules (waste intent 시 필수)" },
          { label: "Optional Fields", value: "나머지 8개 context 필드" },
          { label: "Fallback Trigger", value: "Required 누락 시 needs_fallback=True → fallback 노드 실행" },
          { label: "Progress", value: "Aggregator 완료 시 60% → 65%" },
        ],
      },
    ],
  },
  {
    id: "modal-chat-summarize",
    category: "chat",
    titleKo: "Summarize Node - Context Compression",
    titleEn: "Summarize Node - Context Compression",
    icon: "📝",
    maxWidth: 900,
    content: [
      {
        type: "explanation",
        titleKo: "OpenCode 스타일 Context Compression",
        titleEn: "OpenCode-style Context Compression",
        contentKo: "context_window - max_output을 초과하면 요약 트리거. GPT-5.2 (400K context) 기준 272K 초과 시 60K로 요약.",
        contentEn: "Summarization triggers when exceeding context_window - max_output. For GPT-5.2 (400K context), summarizes to 60K when exceeding 272K.",
        highlight: true,
        borderColor: "#f59e0b",
      },
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "📊 Threshold",
            color: "#3b82f6",
            items: [
              "GPT-5.2: 400K context window",
              "트리거: 272K 토큰 초과",
              "요약 후: 60K 토큰",
              "PRUNE_PROTECT: 40K 보호",
            ],
          },
          {
            title: "📋 5-Section Structure",
            color: "#22c55e",
            items: [
              "1. 사용자 요청 (원문)",
              "2. 목표 및 기대 결과",
              "3. 완료된 작업",
              "4. 진행 중/남은 작업",
              "5. 중요 컨텍스트",
            ],
          },
        ],
      },
      {
        type: "details",
        items: [
          { label: "Trigger Condition", value: "len(messages) > context_window - max_output_tokens" },
          { label: "Summary Target", value: "oldest messages first, protect recent context" },
          { label: "PRUNE_PROTECT", value: "40K 토큰 - 최근 컨텍스트 보호 영역" },
        ],
      },
    ],
  },
];

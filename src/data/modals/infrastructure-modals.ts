import { Modal } from "../modal-types";

export const infrastructureModals: Modal[] = [
  {
    id: "modal-infra-extauthz",
    category: "infrastructure",
    titleKo: "ext-authz (External Authorization)",
    titleEn: "ext-authz (External Authorization)",
    icon: "🛡️",
    maxWidth: 950,
    content: [
      {
        type: "metrics",
        cards: [
          { value: "87%", label: "P50 지연시간 감소", color: "#10b981" },
          { value: "72%", label: "P99 지연시간 감소", color: "#3b82f6" },
          { value: "28x", label: "RPS 처리량 향상", color: "#a855f7" },
          { value: ">99%", label: "Cache Hit Rate", color: "#f59e0b" },
        ],
      },
      {
        type: "diagram",
        titleKo: "🔀 Global Choke Point — 왜 ext-authz가 병목인가?",
        titleEn: "🔀 Global Choke Point — Why ext-authz is the bottleneck?",
        content: `┌──────────────────────────────────────────────────────────────────────────────┐
│                     ext-authz Global Choke Point                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   [Client]                                                                    │
│      │                                                                        │
│      │ 1. HTTPS Request (Cookie: s_access=JWT)                               │
│      ▼                                                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐    │
│   │                     Istio Ingress Gateway                            │    │
│   │  EnvoyFilter: Cookie → Header 변환                                   │    │
│   │  Authorization: Bearer {JWT}                                         │    │
│   └────────────────────────────┬────────────────────────────────────────┘    │
│                                │                                              │
│                                │ 2. gRPC Check (every request)               │
│                                ▼                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐    │
│   │                    ext-authz (Go gRPC Server)                        │    │
│   │  JWT Parse (HS256) → JTI Extract → Blacklist Check (Local/Redis)    │    │
│   │  IsBlacklisted(jti) → O(1)                                           │    │
│   └────────────────────────────┬────────────────────────────────────────┘    │
│                                │                                              │
│              ┌─────────────────┴─────────────────┐                            │
│              │                                   │                            │
│              ▼                                   ▼                            │
│   ┌──────────────────┐                ┌──────────────────┐                   │
│   │  3a. OK (200)    │                │  3b. DENY (401)  │                   │
│   │  + x-user-id     │                │  Unauthorized    │                   │
│   │  + x-auth-provider│               └──────────────────┘                   │
│   └────────┬─────────┘                                                        │
│            │                                                                  │
│            │ 4. Forward to Backend (with injected headers)                   │
│            ▼                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐    │
│   │  Backend Services (scan-api, chat-api, character-api, ...)          │    │
│   │  • JWT 파싱 불필요 — 헤더에서 user_id 추출만                         │    │
│   │  • 도메인 독립성 확보 — 인증 로직 분리                               │    │
│   └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
│   ⚠️ 모든 인증 요청이 ext-authz 통과 필수 → 시스템 처리량 = ext-authz 용량   │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘`,
      },
      {
        type: "explanation",
        contentKo: "모든 인증 트래픽이 ext-authz를 경유하므로, 시스템 전체 처리량이 ext-authz 성능에 종속됩니다. 이를 해결하기 위해 Local Cache + Fanout Broadcast 패턴으로 Redis 의존성을 제거했습니다.",
        contentEn: "All authenticated traffic goes through ext-authz, making system throughput dependent on ext-authz performance. We resolved this with Local Cache + Fanout Broadcast pattern to eliminate Redis dependency.",
        highlight: true,
        borderColor: "#f59e0b",
      },
      {
        type: "grid",
        columns: 4,
        cards: [
          {
            title: "💀 Phase 0",
            color: "#6b7280",
            items: ["Shared Module", "각 도메인 JWT 파싱", "독립 배포 불가", "분산 모놀리스"],
          },
          {
            title: "❌ Phase 1",
            color: "#ef4444",
            items: ["Redis Every Req", "P50: 57ms, P99: 80ms", "RPS: ~42", "Redis 병목"],
          },
          {
            title: "⚠️ Phase 2",
            color: "#f59e0b",
            items: ["Pool + HPA", "Pool 20→100, HPA 2-5", "RPS: ~1,200 (28×)", "P99 Redis 250-350ms"],
          },
          {
            title: "✅ Phase 3",
            color: "#22c55e",
            items: ["Local Cache", "sync.Map + MQ Fanout", "RPS: ~1,500, Lookup 2.3µs", "Redis 호출 0 (870×)"],
          },
        ],
      },
      {
        type: "diagram",
        titleKo: "Local Cache Broadcast Pattern",
        titleEn: "Local Cache Broadcast Pattern",
        content: `┌─────────────────────────────────────────────────────────────────────────────┐
│                     ext-authz Local Cache Broadcast                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                   │
│   │   Pod A     │     │   Pod B     │     │   Pod C     │                   │
│   │ ┌─────────┐ │     │ ┌─────────┐ │     │ ┌─────────┐ │                   │
│   │ │sync.Map │ │     │ │sync.Map │ │     │ │sync.Map │ │  ~100ns lookup    │
│   │ │(Local)  │ │     │ │(Local)  │ │     │ │(Local)  │ │                   │
│   │ └────┬────┘ │     │ └────┬────┘ │     │ └────┬────┘ │                   │
│   └──────┼──────┘     └──────┼──────┘     └──────┼──────┘                   │
│          │                   │                   │                          │
│          └───────────────────┼───────────────────┘                          │
│                              │                                              │
│                       ┌──────▼──────┐                                       │
│                       │  RabbitMQ   │  Fanout Exchange                      │
│                       │ (blacklist  │  (blacklist.events)                   │
│                       │  .events)   │                                       │
│                       └──────┬──────┘                                       │
│                              │                                              │
│                       ┌──────▼──────┐                                       │
│                       │ Auth Relay  │  Redis Fallback Outbox → Fanout      │
│                       └─────────────┘                                       │
│                                                                              │
│  Flow: Logout → Auth Relay → RabbitMQ Fanout → All Pods → sync.Map Update  │
│        → Next Request: ~100ns (No Redis!)                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘`,
      },
      {
        type: "twoColumn",
        left: {
          title: "Before (v1) - Every Request → Redis",
          color: "#ef4444",
          items: ["P50 Latency: 57ms", "P99 Latency: 80ms", "Max RPS: ~1,200", "모든 요청이 Redis 조회 필요"],
        },
        right: {
          title: "After (v2) - Local Cache First",
          color: "#10b981",
          items: ["P50 Latency: 7.5ms", "P99 Latency: 30ms", "Max RPS: ~1,500", "Cache Hit 시 Redis 조회 불필요"],
        },
      },
      {
        type: "details",
        items: [
          { label: "Go Implementation", value: "Envoy ext_authz gRPC, sync.Map (lock-free), goroutine consumer" },
          { label: "JWT Validation", value: "HS256 서명 검증 → JTI Blacklist 체크 (Local → Redis fallback)" },
          { label: "Istio Integration", value: "AuthorizationPolicy CUSTOM provider, EnvoyFilter ext-authz-grpc" },
          { label: "Fanout Broadcast", value: "RabbitMQ Fanout Exchange, 각 Pod 고유 큐 자동 생성" },
        ],
      },
      {
        type: "link",
        labelKo: "📚 Auth Offloading 설계 | 성능 최적화 | Local Cache Broadcast",
        labelEn: "📚 Auth Offloading Design | Performance Optimization | Local Cache Broadcast",
        href: "https://rooftopsnow.tistory.com/22",
      },
    ],
  },
  {
    id: "modal-infra-sse",
    category: "infrastructure",
    titleKo: "SSE Gateway - Token v2 Recoverable Streaming",
    titleEn: "SSE Gateway - Token v2 Recoverable Streaming",
    icon: "📡",
    maxWidth: 950,
    content: [
      {
        type: "diagram",
        titleKo: "Token v2 Recovery Architecture",
        titleEn: "Token v2 Recovery Architecture",
        content: `┌─────────────────────────────────────────────────────────────────────────────┐
│                   SSE Gateway - Token v2 Recoverable Streaming               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Client                                                                     │
│     │                                                                        │
│     │ GET /sse/stream/{job_id}                                              │
│     │ Last-Event-ID: {seq}                                                  │
│     ▼                                                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                        SSE Gateway (FastAPI)                         │   │
│   │                                                                      │   │
│   │   1. Last-Event-ID 확인                                              │   │
│   │   2. State KV에서 현재 상태 조회                                      │   │
│   │   3. Streams에서 누락 이벤트 catch-up (XRANGE)                        │   │
│   │   4. Pub/Sub 구독으로 실시간 스트림 전환                              │   │
│   │                                                                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                      │
│   │  State KV    │  │   Streams    │  │   Pub/Sub   │                      │
│   │chat:state:   │  │chat:events:  │  │sse:events:  │                      │
│   │  {job_id}    │  │  {job_id}    │  │  {job_id}   │                      │
│   │              │  │              │  │              │                      │
│   │ Fallback     │  │ Catch-up     │  │ Real-time   │                      │
│   └──────────────┘  └──────────────┘  └──────────────┘                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘`,
      },
      {
        type: "grid",
        columns: 3,
        cards: [
          {
            title: "🔄 Recovery Protocol",
            color: "#3b82f6",
            items: [
              "Stale Detection: 3초 타임아웃",
              "Max Reconnections: 3회",
              "Fallback: 3s polling, 120s max",
              "Catch-up: XREVRANGE",
            ],
          },
          {
            title: "📊 Seq Encoding",
            color: "#22c55e",
            items: [
              "Stage: STAGE_ORDER × 10",
              "Token: 1000+",
              "Last-Event-ID header",
              "Auto-increment within stage",
            ],
          },
          {
            title: "⚡ KEDA Autoscaling",
            color: "#8b5cf6",
            items: [
              "Trigger: Prometheus",
              "Metric: sse_active_connections",
              "Threshold: 100/pod",
              "Scale: 1 → 3 replicas",
            ],
          },
        ],
      },
      {
        type: "details",
        items: [
          { label: "State Storage", value: "Redis KV: chat:state:{job_id} - 10토큰마다 스냅샷" },
          { label: "Event Streams", value: "Redis Streams: chat:events:{job_id} - TTL 3600s, Max 10,000" },
          { label: "Real-time", value: "Redis Pub/Sub: sse:events:{job_id} - Event Router가 PUBLISH" },
          { label: "Consumer Groups", value: "eventrouter (실시간), chat-persistence (PostgreSQL 저장)" },
        ],
      },
      {
        type: "link",
        labelKo: "📚 SSE Token v2 프로토콜 | XRANGE Recovery",
        labelEn: "📚 SSE Token v2 Protocol | XRANGE Recovery",
        href: "https://rooftopsnow.tistory.com/240",
      },
    ],
  },
  {
    id: "modal-infra-eventrouter",
    category: "infrastructure",
    titleKo: "Event Router - Streams Consumer Group",
    titleEn: "Event Router - Streams Consumer Group",
    icon: "🔀",
    maxWidth: 950,
    content: [
      {
        type: "diagram",
        titleKo: "Event Router Architecture",
        titleEn: "Event Router Architecture",
        content: `┌─────────────────────────────────────────────────────────────────────────────┐
│                        Event Router Architecture                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────┐                                                        │
│   │   Chat Worker   │                                                        │
│   │   (LangGraph)   │                                                        │
│   └────────┬────────┘                                                        │
│            │ XADD                                                            │
│            ▼                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     Redis Streams                                    │   │
│   │               chat:events:{shard} (4 shards)                        │   │
│   └────────────────────────────┬────────────────────────────────────────┘   │
│                                │                                             │
│                                │ XREADGROUP                                  │
│                                ▼                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    Event Router (Consumer Group)                     │   │
│   │                                                                      │   │
│   │   1. XREADGROUP BLOCK 1000 COUNT 100                                │   │
│   │   2. Lua Script: State KV Update + PUBLISH                          │   │
│   │   3. XACK after processing                                          │   │
│   │                                                                      │   │
│   └────────────────────────────┬────────────────────────────────────────┘   │
│                                │                                             │
│              ┌─────────────────┼─────────────────┐                          │
│              │                 │                 │                          │
│              ▼                 ▼                 ▼                          │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                     │
│   │  State KV    │  │   Pub/Sub    │  │  PostgreSQL  │                     │
│   │ chat:state:  │  │ sse:events:  │  │  (Async)     │                     │
│   │  {job_id}    │  │  {job_id}    │  │  chat-persist│                     │
│   └──────────────┘  └──────────────┘  └──────────────┘                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘`,
      },
      {
        type: "twoColumn",
        left: {
          title: "🚀 eventrouter (Real-time)",
          color: "#10b981",
          items: [
            "목적: SSE 실시간 브로드캐스트",
            "지연: ~10ms",
            "동작: Lua Script → PUBLISH",
            "XACK 즉시 처리",
          ],
        },
        right: {
          title: "💾 chat-persistence (Durable)",
          color: "#3b82f6",
          items: [
            "목적: PostgreSQL 영구 저장",
            "지연: ~200ms (배치)",
            "동작: Bulk INSERT",
            "별도 Consumer Group",
          ],
        },
      },
      {
        type: "details",
        items: [
          { label: "Lua Script", value: "State KV 업데이트 + PUBLISH 원자적 실행" },
          { label: "Sharding", value: "4 shards: job_id % 4 → chat:events:{shard}" },
          { label: "Backpressure", value: "XREADGROUP COUNT 100, BLOCK 1000ms" },
          { label: "KEDA", value: "Prometheus pending_events > 100 → scale 1→2" },
        ],
      },
    ],
  },
  {
    id: "modal-3tier-memory",
    category: "infrastructure",
    titleKo: "3-Tier Memory (ReadThroughCheckpointer)",
    titleEn: "3-Tier Memory (ReadThroughCheckpointer)",
    icon: "💾",
    maxWidth: 950,
    content: [
      {
        type: "diagram",
        titleKo: "3-Tier Memory Architecture",
        titleEn: "3-Tier Memory Architecture",
        content: `┌─────────────────────────────────────────────────────────────────────────────┐
│                    3-Tier Memory Architecture                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     Chat Worker (LangGraph)                          │   │
│   │                                                                      │   │
│   │   Node 실행마다 Checkpoint 저장 → 8개 서브에이전트 병렬 시 동시 write │   │
│   └────────────────────────────┬────────────────────────────────────────┘   │
│                                │                                             │
│                                │ ~1ms                                        │
│                                ▼                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    Tier 1: Redis Primary                             │   │
│   │                                                                      │   │
│   │   SyncableRedisSaver                                                 │   │
│   │   Key: chat:checkpoint:cache:{thread_id}                            │   │
│   │   TTL: 24h                                                           │   │
│   │                                                                      │   │
│   │   + Sync Queue 적재 (RPUSH checkpoint:sync:queue)                    │   │
│   └────────────────────────────┬────────────────────────────────────────┘   │
│                                │                                             │
│                                │ 5초 주기 배치                               │
│                                ▼                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                  CheckpointSyncService (Tier 2)                      │   │
│   │                                                                      │   │
│   │   별도 Deployment, replicas=1                                        │   │
│   │   BRPOP → Bulk Upsert PostgreSQL                                    │   │
│   │   pool_max_size=5 (단일 인스턴스)                                    │   │
│   └────────────────────────────┬────────────────────────────────────────┘   │
│                                │                                             │
│                                ▼                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    Tier 3: PostgreSQL (Durable)                      │   │
│   │                                                                      │   │
│   │   checkpoints 테이블                                                 │   │
│   │   Source of Truth, 영구 저장                                         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   Read Miss (Cold Start): PostgreSQL → Redis promote (LRU)                  │
│   Temporal Locality: 연속 요청 hit rate ≈ 99%+                              │
│                                                                              │
│   Connection Pool: 212 → 33 (84% 감소), psycopg_pool.PoolTimeout 해결       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘`,
      },
      {
        type: "grid",
        columns: 3,
        cards: [
          {
            title: "Tier 1: Redis",
            color: "#ef4444",
            items: [
              "Primary Cache",
              "TTL: 24h",
              "Latency: ~1ms",
              "Pool 불필요 (single connection)",
            ],
          },
          {
            title: "Tier 2: Sync Queue",
            color: "#f59e0b",
            items: [
              "RPUSH queue",
              "5초 배치",
              "Bulk Upsert",
              "replicas=1",
            ],
          },
          {
            title: "Tier 3: PostgreSQL",
            color: "#3b82f6",
            items: [
              "Durable Store",
              "Source of Truth",
              "Cold Start fallback",
              "pool_max_size=5",
            ],
          },
        ],
      },
      {
        type: "metrics",
        cards: [
          { value: "84%", label: "Connection Pool 감소", color: "#10b981" },
          { value: "99%+", label: "Cache Hit Rate", color: "#3b82f6" },
          { value: "~1ms", label: "Redis Write Latency", color: "#f59e0b" },
          { value: "5s", label: "Sync Batch Interval", color: "#8b5cf6" },
        ],
      },
      {
        type: "explanation",
        contentKo: "LangGraph의 체크포인트를 Redis Primary에 먼저 저장하고, 별도 서비스가 5초 배치로 PostgreSQL에 동기화합니다. 이로써 Connection Pool 문제를 해결하고 높은 처리량을 달성했습니다.",
        contentEn: "LangGraph checkpoints are first saved to Redis Primary, then a separate service syncs to PostgreSQL in 5-second batches. This solves connection pool issues and achieves high throughput.",
        highlight: true,
        borderColor: "#8b5cf6",
      },
    ],
  },
];

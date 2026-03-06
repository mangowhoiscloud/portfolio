import { Modal } from "../modal-types";

export const featureModals: Modal[] = [
  // Intent Classification
  {
    id: "modal-intent-classification",
    category: "chat",
    titleKo: "9-Class Intent Classification",
    titleEn: "9-Class Intent Classification",
    icon: "🎯",
    maxWidth: 900,
    content: [
      {
        type: "grid",
        columns: 3,
        cards: [
          { title: "🗑️ waste", color: "#8b5cf6", items: ["폐기물 분리배출 (RAG)"] },
          { title: "🌍 character", color: "#f59e0b", items: ["캐릭터 질문 (gRPC)"] },
          { title: "📍 location", color: "#ef4444", items: ["위치 기반 검색 (KakaoAPI)"] },
          { title: "🛋️ bulk_waste", color: "#ec4899", items: ["대형폐기물 (MOIS API)"] },
          { title: "💰 recyclable_price", color: "#22c55e", items: ["재활용 시세 (KECO API)"] },
          { title: "📦 collection_point", color: "#0ea5e9", items: ["수거함 위치 (KECO API)"] },
          { title: "🔍 web_search", color: "#a855f7", items: ["웹 검색 (Native Tool Calling)"] },
          { title: "🎨 image_generation", color: "#fb923c", items: ["이미지 생성 (Gemini Native API)"] },
          { title: "💬 general", color: "#6b7280", items: ["일반 대화 (Fallback)"] },
        ],
      },
      {
        type: "diagram",
        titleKo: "Confidence Scoring Formula",
        titleEn: "Confidence Scoring Formula",
        content: `final_confidence = llm_confidence + keyword_boost + transition_boost + length_penalty

┌─────────────────────────────────────────────────────────────┐
│  Component           │  Range       │  Description          │
├─────────────────────────────────────────────────────────────┤
│  llm_confidence      │  0.0 ~ 1.0   │  LLM 분류 결과 신뢰도   │
│  keyword_boost       │  0.0 ~ 0.2   │  키워드 맵 매칭 보정    │
│  transition_boost    │  0.0 ~ 0.15  │  Chain-of-Intent 전이  │
│  length_penalty      │ -0.1 ~ 0.0   │  짧은 질문 페널티       │
└─────────────────────────────────────────────────────────────┘

CONFIDENCE_THRESHOLD = 0.6 (미만 시 → general Intent로 분류)`,
      },
      {
        type: "twoColumn",
        left: {
          title: "🔗 Chain-of-Intent Transitions",
          color: "#8b5cf6",
          items: [
            "waste → location: +0.15",
            "waste → collection_point: +0.10",
            "location → waste: +0.10",
            "bulk_waste → location: +0.10",
            "※ last_confidence ≥ 0.7일 때만 적용",
          ],
        },
        right: {
          title: "🧠 Multi-Intent Detection",
          color: "#3b82f6",
          items: [
            "Keywords: 그리고, 또, 같이, 함께",
            "LLM이 복합 질문을 개별 Intent로 분해",
            "Send API로 병렬 라우팅",
          ],
        },
      },
    ],
  },

  // Send API
  {
    id: "modal-send-api",
    category: "chat",
    titleKo: "Send API Dynamic Router",
    titleEn: "Send API Dynamic Router",
    icon: "⚡",
    maxWidth: 900,
    content: [
      {
        type: "diagram",
        titleKo: "Send API 라우팅 흐름",
        titleEn: "Send API Routing Flow",
        content: `┌──────────────────────────────────────────────────────────────┐
│                     Dynamic Router                            │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│   IntentResult ──▶ Enrichment Rules ──▶ Send API             │
│                                                               │
│   ┌─────────────────────────────────────────────────────────┐│
│   │  primary_intent: waste                                   ││
│   │  additional_intents: [location, weather]                ││
│   │  needs_enrichment: true                                  ││
│   └─────────────────────────────────────────────────────────┘│
│                          │                                    │
│                          ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐│
│   │  Send(waste_rag_node, intent="waste")                   ││
│   │  Send(location_node, intent="location")                 ││
│   │  Send(weather_node, intent="weather")  ← Auto-enriched  ││
│   └─────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘`,
      },
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "🔄 Enrichment Rules",
            color: "#22c55e",
            items: [
              "waste/bulk_waste → weather 자동 추가",
              "user_location 있으면 → weather 조건부",
              "contracts.py에 정의된 규칙",
            ],
          },
          {
            title: "⚡ Parallel Execution",
            color: "#3b82f6",
            items: [
              "Multi-intent fanout으로 병렬 Send",
              "각 노드 독립 실행",
              "Aggregator에서 결과 수집",
            ],
          },
        ],
      },
    ],
  },

  // ext-authz
  {
    id: "modal-extauthz",
    category: "infrastructure",
    titleKo: "ext-authz (External Authorization)",
    titleEn: "ext-authz (External Authorization)",
    icon: "🛡️",
    maxWidth: 900,
    content: [
      {
        type: "diagram",
        titleKo: "ext-authz 아키텍처",
        titleEn: "ext-authz Architecture",
        content: `┌─────────────────────────────────────────────────────────────┐
│                    Istio Service Mesh                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Client ──▶ Envoy Sidecar ──▶ ext-authz Server             │
│                    │                   │                     │
│                    │                   ▼                     │
│                    │          ┌──────────────────┐           │
│                    │          │  Auth Service    │           │
│                    │          │  (gRPC Server)   │           │
│                    │          │  - JWT Verify    │           │
│                    │          │  - RBAC Check    │           │
│                    │          │  - Session Valid │           │
│                    │          └──────────────────┘           │
│                    │                   │                     │
│                    │◀── OK / DENY ─────┘                     │
│                    ▼                                         │
│              Target Service                                  │
└─────────────────────────────────────────────────────────────┘`,
      },
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "✅ 인증 체크",
            color: "#22c55e",
            items: ["JWT Access Token 검증", "Refresh Token 자동 갱신", "Redis 세션 상태 확인"],
          },
          {
            title: "🔒 인가 체크",
            color: "#3b82f6",
            items: ["RBAC (Role-Based Access Control)", "Path 기반 권한 매핑", "AuthorizationPolicy 연동"],
          },
        ],
      },
    ],
  },

  // SSE
  {
    id: "modal-sse",
    category: "stream",
    titleKo: "SSE Gateway: Token v2 Streaming",
    titleEn: "SSE Gateway: Token v2 Streaming",
    icon: "📺",
    maxWidth: 900,
    content: [
      {
        type: "diagram",
        titleKo: "SSE 스트리밍 아키텍처",
        titleEn: "SSE Streaming Architecture",
        content: `┌───────────────────────────────────────────────────────────────┐
│                   Token v2 SSE Streaming                       │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  Client ◀──SSE── SSE Gateway ◀──XREAD── Redis Streams         │
│                       │                                        │
│                       │  Connection State                      │
│                       │  - session_id                          │
│                       │  - last_event_id                       │
│                       │  - reconnect_count                     │
│                       │                                        │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Catch-up on Reconnect:                                  │  │
│  │  XRANGE chat:stream:{thread_id} {last_id} +              │  │
│  │  → 누락된 토큰들 순차 전송                                │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘`,
      },
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "🔄 Connection Management",
            color: "#8b5cf6",
            items: ["Heartbeat: 15초 간격", "Timeout: 30초", "Auto-reconnect with backoff"],
          },
          {
            title: "📦 Event Format",
            color: "#22c55e",
            items: ["event: token", "id: {stream_id}", "data: {token_chunk}"],
          },
        ],
      },
    ],
  },

  // Platform
  {
    id: "modal-platform",
    category: "infrastructure",
    titleKo: "24-Nodes Platform Architecture",
    titleEn: "24-Nodes Platform Architecture",
    icon: "🏗️",
    maxWidth: 1000,
    content: [
      {
        type: "explanation",
        titleKo: "클러스터 구성 목적",
        titleEn: "Cluster Configuration Purpose",
        contentKo: "8개 도메인(Auth, Character, Chat, Scan, Location, Users, Image, Info)별 장애 격리와 독립적 스케일링을 위해 24-node 클러스터를 구성했습니다.",
        contentEn: "24-node cluster configured for fault isolation and independent scaling across 8 domains.",
        highlight: true,
        borderColor: "#8b5cf6",
      },
      {
        type: "grid",
        columns: 4,
        cards: [
          { title: "System", color: "#ef4444", items: ["kube-system", "istio-system", "argocd", "monitoring"] },
          { title: "API Domains", color: "#3b82f6", items: ["auth-api", "chat-api", "scan-api", "location-api"] },
          { title: "Workers", color: "#22c55e", items: ["chat-worker", "scan-worker", "image-worker"] },
          { title: "Data", color: "#f59e0b", items: ["PostgreSQL", "Redis Cluster", "RabbitMQ"] },
        ],
      },
    ],
  },

  // GitOps
  {
    id: "modal-gitops",
    category: "infrastructure",
    titleKo: "GitOps (ArgoCD + Sync-Wave)",
    titleEn: "GitOps (ArgoCD + Sync-Wave)",
    icon: "🔄",
    maxWidth: 900,
    content: [
      {
        type: "diagram",
        titleKo: "Sync-Wave 배포 순서",
        titleEn: "Sync-Wave Deployment Order",
        content: `Sync-Wave Deployment Order (00 → 63)

Wave 00-09: Namespaces, RBAC, ConfigMaps
Wave 10-19: CRDs, Operators
Wave 20-29: Databases (PostgreSQL, Redis)
Wave 30-39: Message Queue (RabbitMQ)
Wave 40-49: Core Services (Auth, API Gateway)
Wave 50-59: Application Services
Wave 60-63: Ingress, VirtualServices`,
      },
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "📦 App-of-Apps Pattern",
            color: "#8b5cf6",
            items: ["Root Application이 하위 Apps 관리", "환경별 분리 (dev/staging/prod)", "Helm values override"],
          },
          {
            title: "🔄 Sync Policy",
            color: "#22c55e",
            items: ["automated.prune: true", "automated.selfHeal: true", "retry.limit: 5"],
          },
        ],
      },
    ],
  },

  // Istio
  {
    id: "modal-istio",
    category: "infrastructure",
    titleKo: "Istio Service Mesh Architecture",
    titleEn: "Istio Service Mesh Architecture",
    icon: "🕸️",
    maxWidth: 900,
    content: [
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "🔒 mTLS",
            color: "#3b82f6",
            items: ["STRICT mode 적용", "서비스 간 암호화 통신", "인증서 자동 로테이션"],
          },
          {
            title: "🛡️ Authorization",
            color: "#ef4444",
            items: ["AuthorizationPolicy", "ext-authz 연동", "Path/Method 기반 RBAC"],
          },
          {
            title: "📊 Observability",
            color: "#22c55e",
            items: ["Kiali 토폴로지", "Jaeger 트레이싱", "Prometheus 메트릭"],
          },
          {
            title: "🌐 Traffic Management",
            color: "#f59e0b",
            items: ["VirtualService", "DestinationRule", "Canary/Blue-Green"],
          },
        ],
      },
    ],
  },

  // Terraform
  {
    id: "modal-terraform",
    category: "infrastructure",
    titleKo: "Terraform IaC",
    titleEn: "Terraform IaC",
    icon: "🔧",
    maxWidth: 900,
    content: [
      {
        type: "grid",
        columns: 3,
        cards: [
          {
            title: "🌐 VPC Stage",
            color: "#3b82f6",
            items: ["3-AZ 구성", "Public/Private Subnets", "NAT Gateway"],
          },
          {
            title: "☸️ EKS Stage",
            color: "#22c55e",
            items: ["Managed Node Groups", "Cluster Autoscaler", "OIDC Provider"],
          },
          {
            title: "🔐 IRSA Stage",
            color: "#f59e0b",
            items: ["IAM Roles for SA", "Fine-grained permissions", "S3, SES, Secrets Manager"],
          },
        ],
      },
    ],
  },

  // Ingress
  {
    id: "modal-ingress",
    category: "infrastructure",
    titleKo: "Bridge Ingress 단일 진입점",
    titleEn: "Bridge Ingress Single Entry Point",
    icon: "🛡️",
    maxWidth: 900,
    content: [
      {
        type: "diagram",
        titleKo: "Ingress 아키텍처",
        titleEn: "Ingress Architecture",
        content: `Client → ALB → Istio Gateway → VirtualService → Services

┌─────────────────────────────────────────────────────────────┐
│  ALB (AWS Load Balancer)                                     │
│  - SSL Termination                                           │
│  - WAF Integration                                           │
│  - Health Checks                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Istio Ingress Gateway                                       │
│  - TLS Passthrough or Termination                           │
│  - Rate Limiting                                             │
│  - ext-authz Integration                                     │
└─────────────────────────────────────────────────────────────┘`,
      },
    ],
  },

  // JWT
  {
    id: "modal-jwt",
    category: "infrastructure",
    titleKo: "JWT Management",
    titleEn: "JWT Management",
    icon: "🎫",
    maxWidth: 900,
    content: [
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "🔑 Access Token",
            color: "#3b82f6",
            items: ["TTL: 15분", "Claims: user_id, roles", "RS256 서명"],
          },
          {
            title: "🔄 Refresh Token",
            color: "#22c55e",
            items: ["TTL: 7일", "Redis 세션 저장", "Rotation on use"],
          },
        ],
      },
      {
        type: "explanation",
        titleKo: "토큰 갱신 플로우",
        titleEn: "Token Refresh Flow",
        contentKo: "Access Token 만료 시 Refresh Token으로 자동 갱신. ext-authz에서 처리되어 서비스는 인증 로직 불필요.",
        contentEn: "Automatic refresh with Refresh Token on Access Token expiry. Handled by ext-authz.",
        highlight: true,
        borderColor: "#8b5cf6",
      },
    ],
  },

  // OAuth
  {
    id: "modal-oauth",
    category: "infrastructure",
    titleKo: "OAuth 2.0 + Kakao 소셜 로그인",
    titleEn: "OAuth 2.0 + Kakao Social Login",
    icon: "👥",
    maxWidth: 900,
    content: [
      {
        type: "diagram",
        titleKo: "OAuth 플로우",
        titleEn: "OAuth Flow",
        content: `1. Client → /auth/kakao/login (redirect)
2. Kakao OAuth → Authorization Code
3. Backend → Kakao Token Exchange
4. Backend → Kakao User Info API
5. Backend → JWT 발급 + Redis Session
6. Client ← Access Token + Refresh Token`,
      },
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "🔐 PKCE",
            color: "#f59e0b",
            items: ["code_verifier 생성", "code_challenge (S256)", "CSRF 방지"],
          },
          {
            title: "👤 User Sync",
            color: "#3b82f6",
            items: ["GetOrCreateFromOAuth()", "Kakao ID 매핑", "프로필 동기화"],
          },
        ],
      },
    ],
  },

  // Fallback Chain
  {
    id: "modal-fallback-chain",
    category: "chat",
    titleKo: "Feedback + Fallback Chain",
    titleEn: "Feedback + Fallback Chain",
    icon: "📊",
    maxWidth: 900,
    content: [
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "📊 4-Dim RAG 평가",
            color: "#8b5cf6",
            items: ["Relevance (관련성)", "Faithfulness (충실도)", "Coherence (일관성)", "Completeness (완전성)"],
          },
          {
            title: "🔄 Fallback 전략",
            color: "#ef4444",
            items: ["Score < 0.6 → Retry with refined query", "3회 실패 → general Intent 전환", "LLM Evaluator 기반 판단"],
          },
        ],
      },
    ],
  },

  // Token Streaming
  {
    id: "modal-token-streaming",
    category: "stream",
    titleKo: "Token v2 + Context 압축",
    titleEn: "Token v2 + Context Compression",
    icon: "🔄",
    maxWidth: 900,
    content: [
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "📦 Token v2 Format",
            color: "#3b82f6",
            items: ["stream_id: 순차 증가", "token: 실제 토큰 청크", "metadata: node, timestamp"],
          },
          {
            title: "🗜️ Context Compression",
            color: "#22c55e",
            items: ["OpenCodeInterpreter 스타일", "context_window - max_output 초과 시", "PRUNE_PROTECT: 40K 토큰 보호"],
          },
        ],
      },
      {
        type: "explanation",
        titleKo: "XRANGE 복구",
        titleEn: "XRANGE Recovery",
        contentKo: "연결 끊김 후 재접속 시 last_event_id 기준으로 XRANGE 쿼리하여 누락 토큰 catch-up",
        contentEn: "On reconnect, XRANGE query from last_event_id to catch up missed tokens",
        highlight: true,
        borderColor: "#8b5cf6",
      },
    ],
  },

  // Node Resilience
  {
    id: "modal-node-resilience",
    category: "chat",
    titleKo: "Production Resilience",
    titleEn: "Production Resilience",
    icon: "🛡️",
    maxWidth: 900,
    content: [
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "🔌 Circuit Breaker",
            color: "#ef4444",
            items: ["5회 연속 실패 → Open", "60초 후 Half-Open", "성공 시 Close 복귀"],
          },
          {
            title: "📋 NodePolicy",
            color: "#3b82f6",
            items: ["retry_count: 3", "timeout_seconds: 30", "fallback_node 지정"],
          },
        ],
      },
    ],
  },

  // EFK
  {
    id: "modal-efk",
    category: "observability",
    titleKo: "EFK Stack",
    titleEn: "EFK Stack",
    icon: "📝",
    maxWidth: 900,
    content: [
      {
        type: "grid",
        columns: 3,
        cards: [
          {
            title: "📦 Elasticsearch",
            color: "#f59e0b",
            items: ["ECK Operator 관리", "3-node 클러스터", "ILM 정책"],
          },
          {
            title: "🔄 Fluent Bit",
            color: "#22c55e",
            items: ["DaemonSet 배포", "Kubernetes 메타데이터", "Multi-line 파싱"],
          },
          {
            title: "📊 Kibana",
            color: "#3b82f6",
            items: ["대시보드 시각화", "Log 검색/분석", "Alerting 연동"],
          },
        ],
      },
    ],
  },

  // Tracing
  {
    id: "modal-tracing",
    category: "observability",
    titleKo: "분산 트레이싱 OTEL + Jaeger",
    titleEn: "Distributed Tracing OTEL + Jaeger",
    icon: "🔍",
    maxWidth: 900,
    content: [
      {
        type: "diagram",
        titleKo: "트레이싱 파이프라인",
        titleEn: "Tracing Pipeline",
        content: `Application → OTEL SDK → OTEL Collector → Jaeger

Trace Context Propagation:
- W3C Trace Context (traceparent header)
- B3 Propagation (Istio compatibility)
- Custom baggage for business context`,
      },
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "📊 Sampling",
            color: "#8b5cf6",
            items: ["Head-based: 10%", "Tail-based for errors", "Rate limiting: 100 spans/s"],
          },
          {
            title: "🔗 Integration",
            color: "#22c55e",
            items: ["LangSmith for LLM traces", "Istio sidecar injection", "Redis/DB instrumentation"],
          },
        ],
      },
    ],
  },

  // Metrics
  {
    id: "modal-metrics",
    category: "observability",
    titleKo: "메트릭 시각화 Prometheus + Grafana",
    titleEn: "Metrics Visualization Prometheus + Grafana",
    icon: "📈",
    maxWidth: 900,
    content: [
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "📊 Prometheus",
            color: "#ef4444",
            items: ["ServiceMonitor CRD", "15초 scrape interval", "AlertManager 연동"],
          },
          {
            title: "📈 Grafana",
            color: "#f59e0b",
            items: ["도메인별 대시보드", "SLA/SLO 모니터링", "On-call 알람 연동"],
          },
        ],
      },
      {
        type: "explanation",
        titleKo: "핵심 메트릭",
        titleEn: "Key Metrics",
        contentKo: "RED 메트릭 (Rate, Errors, Duration) + USE 메트릭 (Utilization, Saturation, Errors)",
        contentEn: "RED metrics (Rate, Errors, Duration) + USE metrics (Utilization, Saturation, Errors)",
        highlight: true,
        borderColor: "#22c55e",
      },
    ],
  },

  // Celery Chain
  {
    id: "modal-celery-chain",
    category: "mq",
    titleKo: "4단계 Celery Chain",
    titleEn: "4-Stage Celery Chain",
    icon: "🔗",
    maxWidth: 900,
    content: [
      {
        type: "diagram",
        titleKo: "Celery Chain 파이프라인",
        titleEn: "Celery Chain Pipeline",
        content: `OCR Task → AI Analysis → DB Save → Notification

chain(
    ocr_task.s(image_url),
    ai_analysis.s(),
    save_to_db.s(),
    send_notification.s()
).apply_async()`,
      },
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "🔗 Chain 장점",
            color: "#22c55e",
            items: ["순차 실행 보장", "중간 결과 자동 전달", "실패 시 전체 롤백"],
          },
          {
            title: "⚠️ Error Handling",
            color: "#ef4444",
            items: ["on_error callback", "DLQ로 실패 격리", "Retry with backoff"],
          },
        ],
      },
    ],
  },

  // Gevent
  {
    id: "modal-gevent",
    category: "mq",
    titleKo: "Gevent Pool 협력적 스케줄링",
    titleEn: "Gevent Pool Cooperative Scheduling",
    icon: "🌿",
    maxWidth: 900,
    content: [
      {
        type: "explanation",
        titleKo: "Gevent 선택 이유",
        titleEn: "Why Gevent",
        contentKo: "I/O-bound 작업(외부 API 호출, DB 쿼리)이 많은 Scan 워커에서 협력적 멀티태스킹으로 높은 동시성 확보",
        contentEn: "Cooperative multitasking for high concurrency in I/O-bound Scan workers",
        highlight: true,
        borderColor: "#22c55e",
      },
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "⚙️ Pool 설정",
            color: "#22c55e",
            items: ["concurrency: 100", "pool: gevent", "prefetch_multiplier: 4"],
          },
          {
            title: "🔄 Monkey Patching",
            color: "#3b82f6",
            items: ["socket, ssl, time", "requests 자동 비동기화", "DB 드라이버 호환"],
          },
        ],
      },
    ],
  },

  // DLQ
  {
    id: "modal-dlq",
    category: "mq",
    titleKo: "DLQ 전략",
    titleEn: "DLQ Strategy",
    icon: "💀",
    maxWidth: 900,
    content: [
      {
        type: "diagram",
        titleKo: "DLQ 흐름",
        titleEn: "DLQ Flow",
        content: `Main Queue → Worker (fail) → Retry Queue → Worker (fail x3) → DLQ

DLQ 처리:
1. 수동 검토 후 재처리
2. 알림 발송 (Slack/Email)
3. 주기적 정리 (30일 보관)`,
      },
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "🔄 Retry Policy",
            color: "#f59e0b",
            items: ["max_retries: 3", "retry_backoff: exponential", "retry_jitter: true"],
          },
          {
            title: "📊 Monitoring",
            color: "#ef4444",
            items: ["DLQ depth 알람", "실패율 메트릭", "처리 지연 추적"],
          },
        ],
      },
    ],
  },

  // Backpressure
  {
    id: "modal-backpressure",
    category: "stream",
    titleKo: "Backpressure 제어",
    titleEn: "Backpressure Control",
    icon: "⚖️",
    maxWidth: 900,
    content: [
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "📦 Consumer Group",
            color: "#3b82f6",
            items: ["XREADGROUP으로 분산 처리", "Consumer별 pending 관리", "XCLAIM으로 장애 복구"],
          },
          {
            title: "🔀 Sharding",
            color: "#22c55e",
            items: ["thread_id 기반 파티셔닝", "일관된 해시 분배", "Hot spot 방지"],
          },
        ],
      },
    ],
  },

  // Token v2
  {
    id: "modal-token-v2",
    category: "stream",
    titleKo: "Token v2 XRANGE 기반 토큰 복구",
    titleEn: "Token v2 XRANGE-based Token Recovery",
    icon: "🔄",
    maxWidth: 900,
    content: [
      {
        type: "code",
        titleKo: "XRANGE 복구 로직",
        titleEn: "XRANGE Recovery Logic",
        content: `# 재접속 시 누락 토큰 복구
last_id = session.get("last_event_id", "0-0")
missed = redis.xrange(
    f"chat:stream:{thread_id}",
    min=last_id,
    max="+",
    count=1000
)
for entry_id, data in missed:
    yield format_sse_event(entry_id, data)`,
      },
    ],
  },

  // Saga
  {
    id: "modal-saga",
    category: "cleanarch",
    titleKo: "Saga 패턴 보상 트랜잭션",
    titleEn: "Saga Pattern Compensating Transactions",
    icon: "🎭",
    maxWidth: 900,
    content: [
      {
        type: "diagram",
        titleKo: "Saga 흐름",
        titleEn: "Saga Flow",
        content: `T1 → T2 → T3 (실패) → C2 → C1

T: Transaction (정방향)
C: Compensation (역방향 보상)

실패 시 역순으로 보상 트랜잭션 실행하여 일관성 복구`,
      },
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "📋 Orchestration",
            color: "#8b5cf6",
            items: ["중앙 코디네이터 관리", "상태 머신 기반", "명확한 흐름 제어"],
          },
          {
            title: "🔄 Choreography",
            color: "#22c55e",
            items: ["이벤트 기반 연계", "느슨한 결합", "각 서비스 자율성"],
          },
        ],
      },
    ],
  },

  // Outbox
  {
    id: "modal-outbox",
    category: "cleanarch",
    titleKo: "Outbox + CDC",
    titleEn: "Outbox + CDC",
    icon: "📤",
    maxWidth: 900,
    content: [
      {
        type: "diagram",
        titleKo: "Outbox 패턴",
        titleEn: "Outbox Pattern",
        content: `DB Transaction:
1. Business Data INSERT
2. Outbox Event INSERT
(single atomic commit)

CDC (Change Data Capture):
Outbox Table → Debezium → Kafka → Consumer`,
      },
      {
        type: "explanation",
        titleKo: "At-Least-Once 보장",
        titleEn: "At-Least-Once Guarantee",
        contentKo: "DB 트랜잭션과 이벤트 발행을 원자적으로 묶어 메시지 유실 방지",
        contentEn: "Atomic commit of DB transaction and event publishing prevents message loss",
        highlight: true,
        borderColor: "#22c55e",
      },
    ],
  },

  // Idempotency
  {
    id: "modal-idempotency",
    category: "cleanarch",
    titleKo: "멱등성 키",
    titleEn: "Idempotency Key",
    icon: "🔑",
    maxWidth: 900,
    content: [
      {
        type: "code",
        titleKo: "멱등성 처리",
        titleEn: "Idempotency Handling",
        content: `# Redis 기반 멱등성 체크
idempotency_key = request.headers.get("X-Idempotency-Key")
if redis.exists(f"idemp:{idempotency_key}"):
    return cached_response(idempotency_key)

result = process_request()
redis.setex(f"idemp:{idempotency_key}", 86400, result)
return result`,
      },
    ],
  },

  // Ports
  {
    id: "modal-ports",
    category: "cleanarch",
    titleKo: "Port & Adapter",
    titleEn: "Port & Adapter",
    icon: "🔌",
    maxWidth: 900,
    content: [
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "📥 Inbound Ports",
            color: "#3b82f6",
            items: ["UseCase interfaces", "Service boundaries", "Application entry points"],
          },
          {
            title: "📤 Outbound Ports",
            color: "#22c55e",
            items: ["Repository interfaces", "External service ports", "Infrastructure abstractions"],
          },
        ],
      },
      {
        type: "explanation",
        titleKo: "인프라 교체 용이성",
        titleEn: "Infrastructure Swappability",
        contentKo: "Port 인터페이스 덕분에 PostgreSQL → MySQL, Redis → Memcached 등 구현체 교체가 도메인 로직 변경 없이 가능",
        contentEn: "Port interfaces enable swapping PostgreSQL → MySQL, Redis → Memcached without domain logic changes",
        highlight: true,
        borderColor: "#8b5cf6",
      },
    ],
  },

  // CQRS
  {
    id: "modal-cqrs",
    category: "cleanarch",
    titleKo: "CQRS 읽기/쓰기 분리",
    titleEn: "CQRS Read/Write Separation",
    icon: "📚",
    maxWidth: 900,
    content: [
      {
        type: "diagram",
        titleKo: "CQRS 아키텍처",
        titleEn: "CQRS Architecture",
        content: `Command Side (Write)     Query Side (Read)
      │                          │
      ▼                          ▼
┌──────────┐              ┌──────────┐
│ Command  │              │  Query   │
│ Handler  │              │ Handler  │
└────┬─────┘              └────┬─────┘
     │                         │
     ▼                         ▼
┌──────────┐              ┌──────────┐
│ Write DB │  ──sync──▶   │ Read DB  │
│ (Primary)│              │(Replica) │
└──────────┘              └──────────┘`,
      },
    ],
  },

  // Domain
  {
    id: "modal-domain",
    category: "cleanarch",
    titleKo: "Domain Layer 비즈니스 로직 격리",
    titleEn: "Domain Layer Business Logic Isolation",
    icon: "🎯",
    maxWidth: 900,
    content: [
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "📦 Domain Entities",
            color: "#8b5cf6",
            items: ["Business rules 캡슐화", "불변 Value Objects", "Aggregate Root 패턴"],
          },
          {
            title: "🔄 Domain Services",
            color: "#22c55e",
            items: ["Cross-entity 로직", "Stateless operations", "Domain events 발행"],
          },
        ],
      },
    ],
  },

  // Chat Toolcalling
  {
    id: "modal-chat-toolcalling",
    category: "chat",
    titleKo: "Tool Calling GPT-5.2 Strict Mode + Gemini 3",
    titleEn: "Tool Calling GPT-5.2 Strict Mode + Gemini 3",
    icon: "🔧",
    maxWidth: 900,
    content: [
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "🤖 GPT-5.2 Strict Mode",
            color: "#10b981",
            items: ["JSON Schema 강제 준수", "tool_choice: required", "function_call 구조 검증"],
          },
          {
            title: "💎 Gemini 3 Function Calling",
            color: "#3b82f6",
            items: ["Native image generation", "Multi-modal 지원", "Grounding with Search"],
          },
        ],
      },
    ],
  },

  // Chat Multimodel
  {
    id: "modal-chat-multimodel",
    category: "chat",
    titleKo: "Multi-Model Orchestration",
    titleEn: "Multi-Model Orchestration",
    icon: "🧠",
    maxWidth: 900,
    content: [
      {
        type: "explanation",
        titleKo: "LLMClientPort 추상화",
        titleEn: "LLMClientPort Abstraction",
        contentKo: "Port 인터페이스로 OpenAI, Gemini, Claude 등 다양한 LLM 제공자를 동적으로 교체 가능",
        contentEn: "Port interface enables dynamic swapping of OpenAI, Gemini, Claude providers",
        highlight: true,
        borderColor: "#8b5cf6",
      },
      {
        type: "grid",
        columns: 3,
        cards: [
          { title: "🟢 OpenAI", color: "#10b981", items: ["GPT-4o, GPT-5.2", "Tool Calling", "JSON Mode"] },
          { title: "🔵 Gemini", color: "#3b82f6", items: ["Gemini 3 Flash", "Image Gen", "Grounding"] },
          { title: "🟣 Claude", color: "#8b5cf6", items: ["Claude 3.5 Sonnet", "Long context", "Analysis"] },
        ],
      },
    ],
  },

  // Chat Observability
  {
    id: "modal-chat-observability",
    category: "chat",
    titleKo: "LangSmith + OTEL",
    titleEn: "LangSmith + OTEL",
    icon: "🔭",
    maxWidth: 900,
    content: [
      {
        type: "grid",
        columns: 2,
        cards: [
          {
            title: "🔍 LangSmith",
            color: "#22c55e",
            items: ["LLM call 트레이싱", "Prompt 버전 관리", "A/B 테스트"],
          },
          {
            title: "📊 OTEL Integration",
            color: "#3b82f6",
            items: ["TelemetryConfigPort 추상화", "Span context 전파", "Custom metrics export"],
          },
        ],
      },
    ],
  },

  // Chat Consistency
  {
    id: "modal-chat-consistency",
    category: "chat",
    titleKo: "Data Consistency Lamport Clock",
    titleEn: "Data Consistency Lamport Clock",
    icon: "🔒",
    maxWidth: 900,
    content: [
      {
        type: "explanation",
        titleKo: "Lamport Clock 순서 보장",
        titleEn: "Lamport Clock Ordering",
        contentKo: "분산 환경에서 이벤트 순서를 보장하기 위해 Lamport 논리 시계 사용. 각 노드가 독립적으로 카운터 증가 후 max(local, received) + 1로 동기화",
        contentEn: "Lamport logical clock for event ordering in distributed systems",
        highlight: true,
        borderColor: "#8b5cf6",
      },
      {
        type: "code",
        titleKo: "Lamport Clock 구현",
        titleEn: "Lamport Clock Implementation",
        content: `class LamportClock:
    def __init__(self):
        self.counter = 0

    def tick(self):
        self.counter += 1
        return self.counter

    def receive(self, received_time):
        self.counter = max(self.counter, received_time) + 1`,
      },
    ],
  },
];

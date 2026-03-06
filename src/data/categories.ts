export interface Achievement {
  icon: string;
  titleKo: string;
  titleEn: string;
  modalId?: string;
}

export interface CategoryData {
  id: string;
  icon: string;
  title: string;
  postsCount: number;
  statusKo?: string;
  statusEn?: string;
  techBadges: string[];
  descriptionKo: string;
  descriptionEn: string;
  achievements: Achievement[];
  blogLink: string;
  color: string;
}

export const categories: CategoryData[] = [
  {
    id: "multi-agent-chat",
    icon: "🤖",
    title: "Multi-Agent Chat",
    postsCount: 11,
    statusKo: "개발 및 E2E 검증 완료, 실시간 배포 중",
    statusEn: "Dev & E2E Verified, Live Deployed",
    techBadges: ["LangGraph", "Send API", "Token v2", "Function Calling", "Multi-Model"],
    descriptionKo:
      "LangGraph Send API로 11종 서브에이전트를 동적 병렬 라우팅하는 멀티에이전트 시스템입니다. 9분류 Intent 분석 후 Multi-Intent Fanout을 통해 \"이 페트병 어떻게 분리해? 근처 수거함도 알려줘\" 같은 복합 질의를 단일 요청으로 병렬 처리합니다. Eco² 캐릭터 13종과 대한민국 폐기물 분류체계를 도메인 지식으로 주입하고, Nano Banana Pro 기반 이미지 생성, 사용자 위치 연동 실시간 날씨·수거함·재활용센터 검색, 네이티브 웹 검색까지 지원합니다. 3-Tier Memory(Redis hot + PostgreSQL persistent) 위에 Token v2 스트리밍을 구현하여 연결 단절 후 재접속 시에도 토큰 catch-up이 가능합니다.",
    descriptionEn:
      "A multi-agent system that dynamically routes across 11 sub-agents in parallel via LangGraph Send API. After 9-class intent classification, Multi-Intent Fanout decomposes compound queries like 'How do I recycle this bottle? Also show nearby collection points' into parallel branches within a single request. Injects Eco² 13 characters and Korean waste classification regulations as domain knowledge, supports Nano Banana Pro image generation, real-time weather/collection point/recycling center search with user location, and native web search. Built on 3-Tier Memory (Redis hot + PostgreSQL persistent) with Token v2 streaming, enabling token catch-up even after connection drops.",
    achievements: [
      { icon: "🔀", titleKo: "LangGraph Workflow 11개 서브에이전트 StateGraph, Send API 병렬 실행", titleEn: "LangGraph Workflow 11 subagent StateGraph, Send API parallel execution", modalId: "modal-chat-langgraph" },
      { icon: "🎯", titleKo: "9분류 Intent + Multi-Intent 키워드 맵 신뢰도 보정", titleEn: "9-class Intent + Multi-Intent Keyword map confidence calibration", modalId: "modal-intent-classification" },
      { icon: "⚡", titleKo: "Send API 병렬 라우팅 Dynamic Router + Enrichment Rules", titleEn: "Send API Parallel Routing Dynamic Router + Enrichment Rules", modalId: "modal-send-api" },
      { icon: "🔧", titleKo: "Tool Calling GPT-5.2 Strict Mode + Gemini 3 Function Calling", titleEn: "Tool Calling GPT-5.2 Strict Mode + Gemini 3 Function Calling", modalId: "modal-chat-toolcalling" },
      { icon: "🧠", titleKo: "Multi-Model Orchestration LLMClientPort 추상화", titleEn: "Multi-Model Orchestration LLMClientPort abstraction", modalId: "modal-chat-multimodel" },
      { icon: "🚌", titleKo: "Event Bus Redis Streams + Pub/Sub + State KV 3-Tier", titleEn: "Event Bus Redis Streams + Pub/Sub + State KV 3-Tier", modalId: "modal-chat-eventbus" },
      { icon: "💾", titleKo: "3-Tier Memory Redis Primary + PostgreSQL Async Sync", titleEn: "3-Tier Memory Redis Primary + PostgreSQL Async Sync", modalId: "modal-3tier-memory" },
      { icon: "🔄", titleKo: "Token v2 + Context 압축 XRANGE 복구, 동적 Summarization", titleEn: "Token v2 + Context Compression XRANGE recovery, dynamic Summarization", modalId: "modal-token-streaming" },
      { icon: "🛡️", titleKo: "Production Resilience NodePolicy, Circuit Breaker 5회 → 60s", titleEn: "Production Resilience NodePolicy, Circuit Breaker 5 fails → 60s", modalId: "modal-node-resilience" },
      { icon: "📊", titleKo: "Feedback + Fallback Chain 4-dim RAG 평가", titleEn: "Feedback + Fallback Chain 4-dim RAG eval", modalId: "modal-fallback-chain" },
      { icon: "🧀", titleKo: "LLM Evaluation Pipeline Swiss Cheese 3-Tier, 5-Axis BARS, 99.8/100 Expert Review", titleEn: "LLM Evaluation Pipeline Swiss Cheese 3-Tier, 5-Axis BARS, 99.8/100 Expert Review", modalId: "modal-chat-evaluation" },
      { icon: "🔭", titleKo: "LangSmith + OTEL TelemetryConfigPort 추상화", titleEn: "LangSmith + OTEL TelemetryConfigPort abstraction", modalId: "modal-chat-observability" },
      { icon: "🔒", titleKo: "Data Consistency Lamport Clock 순서 보장", titleEn: "Data Consistency Lamport Clock ordering", modalId: "modal-chat-consistency" },
    ],
    blogLink: "https://rooftopsnow.tistory.com/category/%EC%9D%B4%EC%BD%94%EC%97%90%EC%BD%94%28Eco%C2%B2%29/Agent",
    color: "#10b981",
  },
  {
    id: "kubernetes-gitops",
    icon: "☸️",
    title: "Kubernetes Cluster + GitOps + Service Mesh",
    postsCount: 8,
    techBadges: ["AWS", "Terraform", "ArgoCD", "Istio", "DOMA"],
    descriptionKo:
      "8개 도메인 API(Auth, Character, Chat, Scan, Location, Users, Image, Info)를 개발하고, DOMA 원칙 기반 노드 분리를 설계했습니다. Bridge Ingress 단일 진입점으로 ALB → Istio Gateway → VirtualService 토폴로지를 구성하고, ArgoCD App-of-Apps + Sync Wave로 선언적 배포를 자동화합니다.",
    descriptionEn:
      "Developed 8 domain APIs and designed DOMA-based node separation for fault isolation. Configured Bridge Ingress single entry point with ALB → Istio Gateway → VirtualService topology, automated declarative deployment with ArgoCD App-of-Apps + Sync Wave.",
    achievements: [
      { icon: "🏗️", titleKo: "24-nodes 클러스터 도메인별 장애 격리 + 스케일 실험 목적", titleEn: "24-node cluster domain fault isolation + scaling experiments", modalId: "modal-platform" },
      { icon: "📦", titleKo: "ArgoCD GitOps App-of-Apps + Sync Wave 00~63 순서 배포", titleEn: "ArgoCD GitOps App-of-Apps + Sync Wave 00~63 ordered deployment", modalId: "modal-gitops" },
      { icon: "🌐", titleKo: "Istio Service Mesh ext-authz offloading, mTLS", titleEn: "Istio Service Mesh ext-authz offloading, mTLS", modalId: "modal-istio" },
      { icon: "🛡️", titleKo: "Ingress 아키텍처 Bridge Ingress 단일 진입점", titleEn: "Ingress Architecture Bridge Ingress single entry point", modalId: "modal-ingress" },
      { icon: "🔧", titleKo: "Terraform IaC 3-Stage VPC, EKS Managed, IRSA", titleEn: "Terraform IaC 3-Stage VPC, EKS Managed, IRSA", modalId: "modal-terraform" },
    ],
    blogLink: "https://rooftopsnow.tistory.com/category/%EC%9D%B4%EC%BD%94%EC%97%90%EC%BD%94%28Eco%C2%B2%29/Kubernetes",
    color: "#3D9A9A",
  },
  {
    id: "auth",
    icon: "🔐",
    title: "Auth Offloading (ext-authz)",
    postsCount: 6,
    techBadges: ["JWT", "gRPC", "ext-authz", "Istio", "RBAC"],
    descriptionKo:
      "Istio ext-authz + gRPC 기반 중앙집중형 인증 서버로, 서비스 메시 레벨에서 인증/인가를 오프로딩합니다. JWT 검증, 역할 기반 접근 제어, 세션 관리를 마이크로서비스에서 분리하여 일관된 보안 정책을 적용합니다.",
    descriptionEn:
      "Central authentication server based on Istio ext-authz + gRPC, offloading auth at the service mesh level. Separates JWT verification, RBAC, and session management from microservices for consistent security policies.",
    achievements: [
      { icon: "🔑", titleKo: "ext-authz 오프로딩 Istio AuthorizationPolicy 연동", titleEn: "ext-authz offloading Istio AuthorizationPolicy integration", modalId: "modal-extauthz" },
      { icon: "🎫", titleKo: "JWT 관리 Access/Refresh 토큰 + Redis 세션", titleEn: "JWT Management Access/Refresh tokens + Redis session", modalId: "modal-jwt" },
      { icon: "👥", titleKo: "OAuth 2.0 + Kakao 소셜 로그인", titleEn: "OAuth 2.0 + Kakao Social Login", modalId: "modal-oauth" },
    ],
    blogLink: "https://rooftopsnow.tistory.com/category/%EC%9D%B4%EC%BD%94%EC%97%90%EC%BD%94%28Eco%C2%B2%29/Auth",
    color: "#E5A83B",
  },
  {
    id: "observability",
    icon: "📊",
    title: "Observability",
    postsCount: 5,
    techBadges: ["OpenTelemetry", "Jaeger", "Elasticsearch", "Grafana", "Kiali"],
    descriptionKo:
      "ECK 기반 EFK 로깅, OpenTelemetry 분산 트레이싱, Prometheus + Grafana 메트릭 시각화, Kiali 서비스 메시 토폴로지까지 통합된 관측 스택입니다.",
    descriptionEn:
      "Integrated observability stack with ECK-based EFK logging, OpenTelemetry distributed tracing, Prometheus + Grafana metrics visualization, and Kiali service mesh topology.",
    achievements: [
      { icon: "📝", titleKo: "EFK 스택 ECK Operator, Fluent Bit DaemonSet", titleEn: "EFK Stack ECK Operator, Fluent Bit DaemonSet", modalId: "modal-efk" },
      { icon: "🔍", titleKo: "분산 트레이싱 OTEL Collector + Jaeger", titleEn: "Distributed Tracing OTEL Collector + Jaeger", modalId: "modal-tracing" },
      { icon: "📈", titleKo: "메트릭 시각화 Prometheus + Grafana", titleEn: "Metrics Visualization Prometheus + Grafana", modalId: "modal-metrics" },
    ],
    blogLink: "https://rooftopsnow.tistory.com/category/%EC%9D%B4%EC%BD%94%EC%97%90%EC%BD%94%28Eco%C2%B2%29/Observability",
    color: "#4DAA8D",
  },
  {
    id: "message-queue",
    icon: "📨",
    title: "Message Queue",
    postsCount: 7,
    techBadges: ["RabbitMQ", "Celery", "Gevent", "Chain", "DLQ"],
    descriptionKo:
      "RabbitMQ + Celery 기반 비동기 파이프라인으로, AI 추론 워크로드를 메시지 큐에 분산 처리합니다. 4단계 Celery Chain, Gevent Pool 협력적 스케줄링, DLQ 재처리 전략을 적용했습니다.",
    descriptionEn:
      "RabbitMQ + Celery based async pipeline distributing AI inference workloads via message queue. Applied 4-stage Celery Chain, Gevent Pool cooperative scheduling, and DLQ retry strategy.",
    achievements: [
      { icon: "🔗", titleKo: "4단계 Celery Chain OCR → AI → DB → Notify", titleEn: "4-stage Celery Chain OCR → AI → DB → Notify", modalId: "modal-celery-chain" },
      { icon: "🌿", titleKo: "Gevent Pool 협력적 스케줄링, I/O 멀티플렉싱", titleEn: "Gevent Pool cooperative scheduling, I/O multiplexing", modalId: "modal-gevent" },
      { icon: "💀", titleKo: "DLQ 전략 실패 메시지 격리 + 재처리", titleEn: "DLQ Strategy failed message isolation + retry", modalId: "modal-dlq" },
    ],
    blogLink: "https://rooftopsnow.tistory.com/category/%EC%9D%B4%EC%BD%94%EC%97%90%EC%BD%94%28Eco%C2%B2%29/MessageQueue",
    color: "#F4C56A",
  },
  {
    id: "streaming",
    icon: "🌊",
    title: "Event Streams & Scaling",
    postsCount: 6,
    techBadges: ["Redis Streams", "Pub/Sub", "SSE", "Backpressure"],
    descriptionKo:
      "Redis Streams + Pub/Sub + State KV 3-Tier 이벤트 릴레이 레이어로, LLM 토큰 스트리밍을 실시간 전달합니다. SSE 게이트웨이에서 연결 상태 관리와 catch-up 메커니즘을 구현했습니다.",
    descriptionEn:
      "3-Tier event relay layer (Redis Streams + Pub/Sub + State KV) for real-time LLM token streaming. Implemented connection state management and catch-up mechanism at SSE gateway.",
    achievements: [
      { icon: "📡", titleKo: "SSE 게이트웨이 연결 상태 관리 + catch-up", titleEn: "SSE Gateway connection state management + catch-up", modalId: "modal-sse" },
      { icon: "🔄", titleKo: "Token v2 XRANGE 기반 토큰 복구", titleEn: "Token v2 XRANGE-based token recovery", modalId: "modal-token-v2" },
      { icon: "⚖️", titleKo: "Backpressure 제어 Consumer Group + 샤딩", titleEn: "Backpressure Control Consumer Group + sharding", modalId: "modal-backpressure" },
    ],
    blogLink: "https://rooftopsnow.tistory.com/category/%EC%9D%B4%EC%BD%94%EC%97%90%EC%BD%94%28Eco%C2%B2%29/Streaming",
    color: "#C98A1F",
  },
  {
    id: "eventual-consistency",
    icon: "🔄",
    title: "Eventual Consistency",
    postsCount: 4,
    techBadges: ["Saga", "Outbox", "CDC", "Idempotency"],
    descriptionKo:
      "분산 시스템에서 최종 일관성을 보장하기 위한 패턴들을 적용했습니다. Saga 패턴, Outbox + CDC, 멱등성 키 기반 중복 방지 전략을 구현했습니다.",
    descriptionEn:
      "Applied patterns for eventual consistency in distributed systems. Implemented Saga pattern, Outbox + CDC, and idempotency key-based deduplication.",
    achievements: [
      { icon: "🎭", titleKo: "Saga 패턴 보상 트랜잭션 + 롤백", titleEn: "Saga Pattern compensating transactions + rollback", modalId: "modal-saga" },
      { icon: "📤", titleKo: "Outbox + CDC 이벤트 발행 보장", titleEn: "Outbox + CDC guaranteed event publishing", modalId: "modal-outbox" },
      { icon: "🔑", titleKo: "멱등성 키 중복 요청 방지", titleEn: "Idempotency Key duplicate request prevention", modalId: "modal-idempotency" },
    ],
    blogLink: "https://rooftopsnow.tistory.com/category/%EC%9D%B4%EC%BD%94%EC%97%90%EC%BD%94%28Eco%C2%B2%29/Consistency",
    color: "#5BA3A3",
  },
  {
    id: "clean-architecture",
    icon: "🏛️",
    title: "Clean Architecture Migration",
    postsCount: 5,
    techBadges: ["DIP", "Port & Adapter", "CQRS", "Domain Layer"],
    descriptionKo:
      "7개 도메인을 점진적으로 Clean Architecture로 마이그레이션했습니다. DIP 기반 의존성 역전, Port & Adapter 패턴, CQRS 읽기/쓰기 분리를 적용했습니다.",
    descriptionEn:
      "Incrementally migrated 7 domains to Clean Architecture. Applied DIP-based dependency inversion, Port & Adapter pattern, and CQRS read/write separation.",
    achievements: [
      { icon: "🔌", titleKo: "Port & Adapter 인프라 교체 용이성", titleEn: "Port & Adapter infrastructure swappability", modalId: "modal-ports" },
      { icon: "📚", titleKo: "CQRS 읽기/쓰기 최적화 분리", titleEn: "CQRS read/write optimization separation", modalId: "modal-cqrs" },
      { icon: "🎯", titleKo: "Domain Layer 비즈니스 로직 격리", titleEn: "Domain Layer business logic isolation", modalId: "modal-domain" },
    ],
    blogLink: "https://rooftopsnow.tistory.com/category/%EC%9D%B4%EC%BD%94%EC%97%90%EC%BD%94%28Eco%C2%B2%29/Architecture",
    color: "#2D7A7A",
  },
];

import { Modal } from "../modal-types";

export const domainModals: Modal[] = [
  {
    id: "modal-domain-auth",
    category: "domain",
    titleKo: "Auth Domain - OAuth 2.0 + PKCE",
    titleEn: "Auth Domain - OAuth 2.0 + PKCE",
    icon: "🔐",
    maxWidth: 900,
    content: [
      {
        type: "demo",
        gif: "assets/gifs/auth-api.gif",
        link: "https://frontend.dev.growbin.app",
      },
      {
        type: "diagram",
        titleKo: "Auth Relay Fallback Outbox",
        titleEn: "Auth Relay Fallback Outbox",
        content: `┌──────────────────────────────────────────────────────────────────────────┐
│                      Auth Domain Architecture                             │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   ┌──────────┐   ┌─────────────┐   ┌─────────────┐   ┌───────────────┐   │
│   │  Client  │──▶│  Auth API   │──▶│   OAuth     │   │  Users gRPC   │   │
│   └──────────┘   └──────┬──────┘   │ Google/Kakao│   │GetOrCreateUser│   │
│                         │          └─────────────┘   └───────────────┘   │
│                         │                                                 │
│                  ┌──────▼──────┐                                         │
│                  │ JWT 발급    │  Access 3h / Refresh 30d                │
│                  │ (HS256)     │  JTI 기반 무효화, Token Rotation        │
│                  └──────┬──────┘                                         │
│                         │                                                 │
│   ┌─────────────────────┼─────────────────────────────────────────────┐  │
│   │                     ▼                     Async Layer              │  │
│   │  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────────┐  │  │
│   │  │ Auth Relay  │──▶│  RabbitMQ   │──▶│ ext-authz (All Pods)    │  │  │
│   │  │ (Redis Out- │   │  Fanout     │   │ Local Cache Update      │  │  │
│   │  │  box Pattern)│   │ (blacklist) │   └─────────────────────────┘  │  │
│   │  └─────────────┘   └─────────────┘                                │  │
│   └───────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘`,
      },
      {
        type: "grid",
        columns: 3,
        cards: [
          {
            title: "Google OAuth",
            color: "#ea4335",
            items: ["PKCE (S256)", "openid, email, profile", "access_type=offline"],
          },
          {
            title: "Kakao OAuth",
            color: "#fee500",
            items: ["PKCE (S256)", "Developer Console 기반", "kakao_account.profile"],
          },
          {
            title: "Naver OAuth",
            color: "#1ec800",
            items: ["PKCE 미지원", "profile, email", "response 필드 매핑"],
          },
        ],
      },
      {
        type: "details",
        items: [
          {
            label: "PKCE Flow",
            value: "code_verifier (64byte urlsafe) → SHA256 → base64url = code_challenge (S256)",
          },
          {
            label: "Cookie",
            value: "s_access / s_refresh, HttpOnly + Secure + SameSite=Lax, domain: .dev.growbin.app",
          },
          {
            label: "Token Rotation",
            value: "Refresh 시 old JTI → Blacklist 발행, new pair 발급 + 세션 등록",
          },
          {
            label: "Session Store",
            value: "Redis: user:tokens:{uid} (Set), token:meta:{jti} (JSON), TTL = token exp",
          },
          {
            label: "Auth Relay",
            value: "Redis Fallback Outbox → RabbitMQ Fanout → ext-authz Local Cache 동기화",
          },
          {
            label: "gRPC",
            value: "Users.GetOrCreateUser() → 신규 시 기본 캐릭터(이코) 자동 부여",
          },
        ],
      },
    ],
  },
  {
    id: "modal-domain-character",
    category: "domain",
    titleKo: "Character Domain - Dual Interface + Local Cache",
    titleEn: "Character Domain - Dual Interface + Local Cache",
    icon: "🌍",
    maxWidth: 900,
    content: [
      {
        type: "demo",
        gif: "assets/gifs/character-api.gif",
        link: "https://frontend.dev.growbin.app",
      },
      {
        type: "twoColumn",
        left: {
          title: "HTTP REST",
          color: "#3b82f6",
          items: [
            "GET /catalog — 캐릭터 카탈로그",
            "POST /internal/rewards — 보상 평가",
            "Internal: Istio AuthorizationPolicy",
          ],
        },
        right: {
          title: "gRPC (CharacterService)",
          color: "#10b981",
          items: [
            "GetCharacterReward() — 보상 판정",
            "GetDefaultCharacter() — 기본 캐릭터",
            "GetCharacterByMatch() — 분류 매칭",
            "Chat Worker, Scan Worker에서 호출",
          ],
        },
      },
      {
        type: "diagram",
        titleKo: "🗄️ 2-Tier Cache Architecture",
        titleEn: "🗄️ 2-Tier Cache Architecture",
        content: `┌──────────────────────────────────────────────────────────────────────────────┐
│                      2-Tier Cache Architecture                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   ┌─────────────────────────────────────────────────────────────────────┐    │
│   │  [Request] ──▶ Local Cache (Dict)     TTL 5min                      │    │
│   │                     │                                                │    │
│   │                     │ MISS                                           │    │
│   │                     ▼                                                │    │
│   │              ┌─────────────┐                                         │    │
│   │              │    Redis    │   TTL 1h, JSON                          │    │
│   │              │  (Primary)  │   character:catalog:{version}           │    │
│   │              └──────┬──────┘                                         │    │
│   │                     │ MISS                                           │    │
│   │                     ▼                                                │    │
│   │              ┌─────────────┐                                         │    │
│   │              │ PostgreSQL  │   Source of Truth                       │    │
│   │              └─────────────┘                                         │    │
│   └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
│   Cache Broadcast: RabbitMQ Fanout → 전체 Pod Local Cache 동기화              │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘`,
      },
      {
        type: "details",
        items: [
          {
            label: "Local Cache",
            value: "threading.Lock + Dict, TTL 5min, version 키 비교로 갱신",
          },
          {
            label: "Redis Cache",
            value: "character:catalog:{version}, JSON serialize, TTL 1h",
          },
          {
            label: "Fanout Sync",
            value: "RabbitMQ Fanout → 모든 character-match Pod Local Cache 동기화",
          },
          {
            label: "gRPC Streaming",
            value: "GetCharacterByMatch() 스트리밍으로 대량 캐릭터 매칭",
          },
        ],
      },
    ],
  },
  {
    id: "modal-domain-chat",
    category: "domain",
    titleKo: "Chat Domain - LangGraph Multi-Agent",
    titleEn: "Chat Domain - LangGraph Multi-Agent",
    icon: "💬",
    maxWidth: 1000,
    content: [
      {
        type: "demo",
        gif: "assets/gifs/chat-api.gif",
        link: "https://frontend.dev.growbin.app",
      },
      {
        type: "diagram",
        titleKo: "Chat Domain Architecture",
        titleEn: "Chat Domain Architecture",
        content: `┌──────────────────────────────────────────────────────────────────────────────┐
│                      Chat Domain - LangGraph Multi-Agent                      │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   ┌──────────┐   ┌─────────────┐   ┌─────────────────────────────────────┐   │
│   │  Client  │──▶│  Chat API   │──▶│      RabbitMQ (chat.process)        │   │
│   │  (SSE)   │   │  (FastAPI)  │   └─────────────────┬───────────────────┘   │
│   └────▲─────┘   └─────────────┘                     │                       │
│        │                                             ▼                       │
│        │         ┌───────────────────────────────────────────────────────┐   │
│        │         │                chat_worker (Taskiq)                   │   │
│        │         │  ┌─────────────────────────────────────────────────┐  │   │
│        │         │  │            LangGraph StateGraph                  │  │   │
│        │         │  │  intent → router → [subagents] → aggregator →   │  │   │
│        │         │  │           summarize → answer                     │  │   │
│        │         │  └─────────────────────────────────────────────────┘  │   │
│        │         └───────────────────────────────────────────────────────┘   │
│        │                                             │                       │
│        │         ┌─────────────┐                     │                       │
│        └─────────│   SSE GW    │◀────────────────────┘                       │
│                  │ (Pub/Sub)   │     Redis Streams                           │
│                  └─────────────┘                                             │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘`,
      },
      {
        type: "grid",
        columns: 4,
        cards: [
          {
            title: "Intent Node",
            color: "#8b5cf6",
            items: ["Multi-Intent ICL", "Chain-of-Intent", "신뢰도 < 0.6 → fallback"],
          },
          {
            title: "Dynamic Router",
            color: "#3b82f6",
            items: ["Send API fanout", "Enrichment Rules", "Conditional edges"],
          },
          {
            title: "11 Subagents",
            color: "#22c55e",
            items: ["waste_rag, character", "location, bulk_waste", "weather, web_search"],
          },
          {
            title: "Aggregator",
            color: "#f59e0b",
            items: ["9개 context 병합", "Required/Optional", "needs_fallback 트리거"],
          },
        ],
      },
      {
        type: "details",
        items: [
          {
            label: "Task Queue",
            value: "Taskiq + RabbitMQ, chat.process 단일 큐",
          },
          {
            label: "State",
            value: "ChatState TypedDict, 모든 노드 공유",
          },
          {
            label: "Memory",
            value: "3-Tier: Redis Primary → Async Queue → PostgreSQL",
          },
          {
            label: "SSE",
            value: "Redis Streams → Event Router → Pub/Sub → Client",
          },
        ],
      },
      {
        type: "link",
        labelKo: "→ LangGraph 상세 보기",
        labelEn: "→ View LangGraph Details",
        href: "#",
        isModal: true,
        modalId: "modal-chat-langgraph",
      },
    ],
  },
  {
    id: "modal-domain-scan",
    category: "domain",
    titleKo: "Scan Domain - Vision AI Pipeline",
    titleEn: "Scan Domain - Vision AI Pipeline",
    icon: "📸",
    maxWidth: 1000,
    content: [
      {
        type: "demo",
        gif: "assets/gifs/scan-api.gif",
        link: "https://frontend.dev.growbin.app",
      },
      {
        type: "diagram",
        titleKo: "Scan Pipeline Architecture",
        titleEn: "Scan Pipeline Architecture",
        content: `┌──────────────────────────────────────────────────────────────────────────────┐
│                      Scan Domain - Vision AI Pipeline                         │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   ┌──────────┐   ┌─────────────┐   ┌─────────────────────────────────────┐   │
│   │  Client  │──▶│  Scan API   │──▶│      RabbitMQ (scan.analyze)        │   │
│   │ (Image)  │   │ (Presigned) │   └─────────────────┬───────────────────┘   │
│   └────▲─────┘   └─────────────┘                     │                       │
│        │                                             ▼                       │
│        │         ┌───────────────────────────────────────────────────────┐   │
│        │         │              scan_worker (Celery Chain)               │   │
│        │         │                                                       │   │
│        │         │   vision_task → rule_task → answer_task → reward_task │   │
│        │         │                                                       │   │
│        │         │   ┌─────────┐   ┌─────────┐   ┌─────────┐            │   │
│        │         │   │ GPT-4.1 │   │  Rules  │   │Character│            │   │
│        │         │   │ Vision  │   │  JSON   │   │ gRPC    │            │   │
│        │         │   └─────────┘   └─────────┘   └─────────┘            │   │
│        │         └───────────────────────────────────────────────────────┘   │
│        │                                             │                       │
│        └─────────────────────────────────────────────┘                       │
│                          Redis Streams (SSE)                                  │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘`,
      },
      {
        type: "grid",
        columns: 4,
        cards: [
          {
            title: "Vision",
            color: "#8b5cf6",
            items: ["GPT-4.1-vision", "품목 + 상태 분석", "confidence score"],
          },
          {
            title: "Rule",
            color: "#3b82f6",
            items: ["JSON 규정 매칭", "분리배출 방법", "지역별 예외"],
          },
          {
            title: "Answer",
            color: "#22c55e",
            items: ["GPT-4.1", "자연어 응답 생성", "캐릭터 페르소나"],
          },
          {
            title: "Reward",
            color: "#f59e0b",
            items: ["Character gRPC", "보상 판정", "캐릭터 부여"],
          },
        ],
      },
      {
        type: "details",
        items: [
          {
            label: "Pipeline",
            value: "Celery Chain: vision → rule → answer → reward (순차 실행)",
          },
          {
            label: "Image Upload",
            value: "S3 Presigned URL, 15분 만료, scan/{uuid}.{ext}",
          },
          {
            label: "Character Match",
            value: "vision 결과로 character-match gRPC 호출, 매칭 캐릭터 반환",
          },
          {
            label: "SSE Progress",
            value: "각 단계별 progress 이벤트 발행 (0% → 25% → 50% → 75% → 100%)",
          },
        ],
      },
    ],
  },
  {
    id: "modal-domain-location",
    category: "domain",
    titleKo: "Location Domain - PostGIS + Zoom Policy",
    titleEn: "Location Domain - PostGIS + Zoom Policy",
    icon: "📍",
    maxWidth: 900,
    content: [
      {
        type: "demo",
        gif: "assets/gifs/location-api.gif",
        link: "https://frontend.dev.growbin.app",
      },
      {
        type: "diagram",
        titleKo: "Location Query Architecture",
        titleEn: "Location Query Architecture",
        content: `┌──────────────────────────────────────────────────────────────────────────────┐
│                    Location Domain - PostGIS + Zoom Policy                    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   ┌──────────┐   ┌─────────────┐   ┌─────────────────────────────────────┐   │
│   │  Client  │──▶│Location API │──▶│     GET /locations/centers          │   │
│   │  (Map)   │   │  (FastAPI)  │   │     ?lat=&lng=&zoom=                │   │
│   └──────────┘   └──────┬──────┘   └─────────────────────────────────────┘   │
│                         │                                                     │
│                         ▼                                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐    │
│   │                      PostgreSQL + earthdistance                      │    │
│   │                                                                      │    │
│   │   earth_distance(ll_to_earth(lat, lng), ll_to_earth(c.lat, c.lng))  │    │
│   │   + cube/earthdistance extension                                     │    │
│   │   + Haversine fallback for edge cases                                │    │
│   └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
│   Zoom Policy (Continuous 1-20):                                             │
│   zoom 1 → radius 50000m, limit 10                                           │
│   zoom 10 → radius 5000m, limit 50                                           │
│   zoom 15 → radius 1000m, limit 100                                          │
│   zoom 20 → radius 200m, limit 200                                           │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘`,
      },
      {
        type: "table",
        titleKo: "Zoom-Radius-Limit Mapping",
        titleEn: "Zoom-Radius-Limit Mapping",
        headers: ["Zoom", "Radius (m)", "Limit", "Use Case"],
        rows: [
          { cells: ["1-5", "50000", "10", "국가/대륙 뷰"] },
          { cells: ["6-10", "5000", "50", "도시 뷰"] },
          { cells: ["11-15", "1000", "100", "동네 뷰"] },
          { cells: ["16-20", "200", "200", "상세 뷰"] },
        ],
      },
      {
        type: "details",
        items: [
          {
            label: "HTTP",
            value: "GET /locations/centers?lat={lat}&lng={lng}&zoom={zoom}",
          },
          {
            label: "gRPC",
            value: "SearchNearby(lat, lng, zoom) - Chat Worker location_node 호출",
          },
          {
            label: "PostGIS",
            value: "earth_distance() + ll_to_earth(), cube/earthdistance extension",
          },
          {
            label: "Chat Integration",
            value: "location_node HTTP 호출, 반경 5km 내 5개",
          },
        ],
      },
    ],
  },
  {
    id: "modal-domain-users",
    category: "domain",
    titleKo: "Users Domain - gRPC + Character Ownership",
    titleEn: "Users Domain - gRPC + Character Ownership",
    icon: "👤",
    maxWidth: 900,
    content: [
      {
        type: "demo",
        gif: "assets/gifs/users-api.gif",
        link: "https://frontend.dev.growbin.app",
      },
      {
        type: "diagram",
        titleKo: "Users Domain Architecture",
        titleEn: "Users Domain Architecture",
        content: `┌──────────────────────────────────────────────────────────────────────────────┐
│                    Users Domain - gRPC + Character Ownership                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   ┌─────────────┐         ┌─────────────┐         ┌─────────────┐            │
│   │  Auth API   │────────▶│  Users gRPC │◀────────│ Scan Worker │            │
│   │             │         │             │         │             │            │
│   │GetOrCreate  │         │ GetUser()   │         │ AddCharacter│            │
│   │FromOAuth()  │         │UpdateLogin  │         │Ownership()  │            │
│   └─────────────┘         │Time()       │         └─────────────┘            │
│                           └──────┬──────┘                                    │
│                                  │                                            │
│                                  ▼                                            │
│   ┌─────────────────────────────────────────────────────────────────────┐    │
│   │                         PostgreSQL                                   │    │
│   │   users (id, email, nickname, profile_image, created_at)            │    │
│   │   user_characters (user_id, character_id, status, acquired_at)      │    │
│   └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘`,
      },
      {
        type: "twoColumn",
        left: {
          title: "gRPC Methods (UsersService)",
          color: "#3b82f6",
          items: [
            "GetOrCreateFromOAuth() - OAuth 로그인",
            "GetUser() - 사용자 조회",
            "UpdateLoginTime() - 로그인 시간 갱신",
            "AddCharacterOwnership() - 캐릭터 부여",
          ],
        },
        right: {
          title: "HTTP Endpoints",
          color: "#10b981",
          items: [
            "GET /me - 내 정보",
            "GET /me/characters - 보유 캐릭터",
            "GET /me/characters/{name}/ownership - 소유권 확인",
            "PATCH /me/profile - 프로필 수정",
          ],
        },
      },
      {
        type: "details",
        items: [
          {
            label: "Character Ownership",
            value: "status: owned | burned | traded, acquired_at timestamp",
          },
          {
            label: "Default Character",
            value: "신규 가입 시 기본 캐릭터 '이코' 자동 부여",
          },
          {
            label: "gRPC Callers",
            value: "Auth API, Scan Worker, Chat Worker",
          },
        ],
      },
    ],
  },
  {
    id: "modal-domain-image",
    category: "domain",
    titleKo: "Images Domain - S3 Presigned + 3 Channels",
    titleEn: "Images Domain - S3 Presigned + 3 Channels",
    icon: "🖼️",
    maxWidth: 900,
    content: [
      {
        type: "demo",
        gif: "assets/gifs/image-api.gif",
        link: "https://frontend.dev.growbin.app",
      },
      {
        type: "diagram",
        titleKo: "Image Upload Flow",
        titleEn: "Image Upload Flow",
        content: `┌──────────────────────────────────────────────────────────────────────────────┐
│                    Images Domain - S3 Presigned URL                           │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   ┌──────────┐   ┌─────────────┐   ┌─────────────────────────────────────┐   │
│   │  Client  │──▶│ Images API  │──▶│  POST /images/presigned             │   │
│   └────┬─────┘   │ (gRPC/HTTP) │   │  channel: scan | chat | my          │   │
│        │         └──────┬──────┘   └─────────────────────────────────────┘   │
│        │                │                                                     │
│        │                ▼  Presigned URL (15분 만료)                          │
│        │         ┌─────────────┐                                             │
│        └────────▶│     S3      │   Path: {channel}/{uuid}.{ext}              │
│          PUT     │  (MinIO)    │                                             │
│                  └─────────────┘                                             │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘`,
      },
      {
        type: "grid",
        columns: 3,
        cards: [
          {
            title: "scan",
            color: "#8b5cf6",
            items: ["스캔 이미지", "scan/{uuid}.{ext}", "Vision AI 분석용"],
          },
          {
            title: "chat",
            color: "#3b82f6",
            items: ["채팅 이미지", "chat/{uuid}.{ext}", "이미지 생성 결과"],
          },
          {
            title: "my",
            color: "#22c55e",
            items: ["프로필 이미지", "my/{uuid}.{ext}", "사용자 프로필"],
          },
        ],
      },
      {
        type: "details",
        items: [
          {
            label: "Presigned TTL",
            value: "15분 만료 (presign_expires_seconds=900)",
          },
          {
            label: "Path Pattern",
            value: "{channel}/{uuid}.{ext} - 채널별 경로 분리",
          },
          {
            label: "gRPC",
            value: "GetPresignedUrl() - scan-worker, chat-worker 호출",
          },
          {
            label: "Storage",
            value: "MinIO (S3 호환), 클러스터 내부 배포",
          },
        ],
      },
    ],
  },
  {
    id: "modal-domain-info",
    category: "domain",
    titleKo: "Info Domain - CQRS + Cache Aside Pattern",
    titleEn: "Info Domain - CQRS + Cache Aside Pattern",
    icon: "📰",
    maxWidth: 1000,
    content: [
      {
        type: "demo",
        gif: "assets/gifs/info-api.gif",
        link: "https://frontend.dev.growbin.app",
      },
      {
        type: "diagram",
        titleKo: "CQRS + Cache Aside Architecture",
        titleEn: "CQRS + Cache Aside Architecture",
        content: `┌──────────────────────────────────────────────────────────────────────────────────────┐
│                           Info Domain - CQRS + Cache Aside                            │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ╔═══════════════════════════════════════════════════════════════════════════════╗   │
│  ║                        WRITE PATH (info_worker Pod)                            ║   │
│  ╠═══════════════════════════════════════════════════════════════════════════════╣   │
│  ║  ┌─────────────┐    ┌─────────────────────────────────────────────────────┐   ║   │
│  ║  │Beat Sidecar │    │              Celery Worker (gevent -c 100)          │   ║   │
│  ║  │ • 5min Naver│───▶│  CollectNewsCommand → PostgreSQL UPSERT             │   ║   │
│  ║  │ • 30min News│    │                    → Redis Write-Through            │   ║   │
│  ║  │   Data.io   │    │  ThreadedConnectionPool(min=2, max=10)              │   ║   │
│  ║  └─────────────┘    │  TTL: 3600s (news_cache_ttl, 모든 캐시 동일)         │   ║   │
│  ║                     └─────────────────────────────────────────────────────┘   ║   │
│  ╚═══════════════════════════════════════════════════════════════════════════════╝   │
│                                                                                       │
│  ╔═══════════════════════════════════════════════════════════════════════════════╗   │
│  ║                        READ PATH (info API - Cache Aside)                      ║   │
│  ╠═══════════════════════════════════════════════════════════════════════════════╣   │
│  ║  Client ──▶ Info API ──▶ Redis (Primary) ── HIT ──▶ Response                  ║   │
│  ║                              │ MISS                                            ║   │
│  ║                              ▼                                                 ║   │
│  ║                         PostgreSQL ── Fallback ──▶ Response                    ║   │
│  ╚═══════════════════════════════════════════════════════════════════════════════╝   │
│                                                                                       │
└──────────────────────────────────────────────────────────────────────────────────────┘`,
      },
      {
        type: "metrics",
        cards: [
          { value: "110", label: "Articles/Task", color: "#10b981" },
          { value: "86.4%", label: "OG Success", color: "#3b82f6" },
          { value: "16.95s", label: "Task Duration", color: "#a855f7" },
          { value: "14.53s", label: "OG Bottleneck", color: "#ef4444" },
        ],
      },
      {
        type: "twoColumn",
        left: {
          title: "✏️ Worker (Sync)",
          color: "#ef4444",
          items: [
            "psycopg2 - ThreadedConnectionPool",
            "redis-py - 단순 연산, 비동기 불필요",
            "httpx.Client - OG 추출 connection pool",
            "Beat Sidecar - 스케줄링 분리",
          ],
        },
        right: {
          title: "📖 API (Async)",
          color: "#10b981",
          items: [
            "redis.asyncio - 비동기 캐시 조회",
            "Cache-Aside - Redis miss → PostgreSQL fallback",
            "source 메타데이터 - \"redis\"/\"postgres\"",
            "useInfiniteQuery - 무한스크롤",
          ],
        },
      },
      {
        type: "details",
        items: [
          {
            label: "Beat Schedule",
            value: "5min Naver API, 30min NewsData.io",
          },
          {
            label: "Redis TTL",
            value: "3600s (모든 캐시 동일)",
          },
          {
            label: "Connection Pool",
            value: "ThreadedConnectionPool(minconn=2, maxconn=10)",
          },
          {
            label: "Zero-downtime",
            value: "Redis 장애 시에도 PostgreSQL Fallback으로 서비스 유지",
          },
        ],
      },
      {
        type: "link",
        labelKo: "📊 상세 구현: Info 서비스 CQRS + Cache Aside 패턴",
        labelEn: "📊 Implementation Details: Info Service CQRS + Cache Aside Pattern",
        href: "https://rooftopsnow.tistory.com/208",
      },
    ],
  },
];

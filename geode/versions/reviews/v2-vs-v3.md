# V2 → V3 비교 리포트

## 수치 비교
| 항목 | V1 | V2 | V3 |
|------|-----|-----|-----|
| 슬라이드 | 26 | 31 | **33** |
| 빌드 에러 | 0 | 0 | **0** |
| 숫자 SOT | 불일치 7+ | 통일 | **v0.31.0 SOT** |
| 어필 포인트 | 도메인 분석 | 자율 에이전트 | **장기 자율 실행 하네스** |
| 장기 운용 | 없음 | 없음 | **S07-S09 신규 3장** |
| Frontier 출처 | 혼재 | Devin/OpenHands | **Claude Code/OpenClaw/autoresearch/Codex** |
| HE-1 순서 | 임의 | 임의 | **실행 흐름 순서** |

## V3 신규 슬라이드
| # | 제목 | 어필 포인트 |
|---|------|-----------|
| S07 | Long-Running Safety | 비용 상한 + 수렴 감지 + 다양성 강제 — 장기 자율 실행의 3대 위험 대응 |
| S08 | Plan-first + Compaction | 복잡 요청 자동 계획 + Provider별 컨텍스트 관리 |
| S09 | Scheduler + Gateway | 크론 격리 + 채널 라우팅 + headless daemon |
| S26 | CHANGELOG Evolution | v0.6→v0.31 아키텍처 결정 타임라인 |
| S32 | Harness = Discipline | 4축 장기 운용 진화 방향 |

## V2 대비 발전 ✅
1. **장기 자율 실행 어필** — Autonomous Safety 3조건, Plan-first, Provider-aware Compaction
2. **HE-1 실행 흐름 순서 정렬** — Tool Dispatch(10)→Hook(11)→SubAgent(12)→Failover(13)→Compression(14)→Memory(15)→Prompt(16)→MCP(17)
3. **Frontier 소스 정정** — Claude Code, OpenClaw, autoresearch, Codex CLI (원래 GEODE의 참조 소스)
4. **Unreleased 반영** — v0.31.0 + Unreleased (context_action, plan-first, autonomous safety)
5. **33장** — 정보 밀도와 가독성 균형

## 주의 ⚠️
1. S22 CANNOT/CAN이 23규칙 전부를 나열하려다 과밀 — 규칙 전문은 별도 참조로 빼고 핵심 5-6개만 강조하는 것이 나을 수 있음
2. S24 Frontier+Persona 합본 — V1 리뷰에서 분리 권장했으나 V3에서 다시 합침
3. 33장은 발표 시간 40-60분 필요

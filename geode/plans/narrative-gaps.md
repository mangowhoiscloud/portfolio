# Narrative Gaps — 포트폴리오 사이트 vs PPTX

## 현재 PPTX에 부족한 내러티브 (포트폴리오 사이트 기준)

### 1. Timeline Story (없음)
- Phase 1: 과제 합격 (Game IP DAG)
- Phase 2: 면접 탈락 → Autonomous Pivot
- Phase 3: Harness 완성 (45 Hooks, 21 Skills)
- Fork: REODE — DomainPort 실증
→ **S25 Timeline 슬라이드 추가 필요**

### 2. Dual Trust Model (없음)
- Agentic Safety = Input Gating (PolicyChain, Bash 3-Layer)
- Pipeline Verification = Output Validation (5-Layer)
- 두 축이 독립적으로 동작
→ **S20 Security에 병합 가능하지만 별도가 더 명확**

### 3. Hook Coverage Matrix (부분적)
- 45 Events × 4 Maturity Level 매트릭스
- 빈 칸 = 확장 가능 영역
→ **S12에 이미 Maturity Model 있지만 Coverage Matrix가 없음**

### 4. Automation 상세 (약함)
- Scheduler AT/EVERY/CRON + NL Parser
- TriggerManager F1-F4 피드백 루프
- SCHEDULER → QUEUE → LOOP → HOOK → TRIGGER 순환
→ **기존 슬라이드에 없음, 추가 필요**

### 5. CANNOT 23 / CAN 6 (숫자 차이)
- 포트폴리오: CANNOT 23 / CAN 6
- 이력서: 17 CANNOT
- SOT: 17 CANNOT
→ **포트폴리오 사이트가 최신? 확인 필요**

## 보강 방향
- S25 Timeline 추가 (Phase 1→2→3→Fork)
- S12 Hook에 Coverage Matrix hint 추가
- S17 MCP+Cost에 Automation 간략 추가
- S20 Security에 Dual Trust Model 반영

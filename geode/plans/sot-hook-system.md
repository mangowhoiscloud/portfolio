# Hook System SOT v0.32.1 (46 Events)

## 개요

8카테고리 46이벤트. 모든 계층(L0-L5)을 횡단하는 cross-cutting concern.
17 registered handlers, Priority P30-P90.
core/hooks/ 7 모듈.

## 46 Events by Category

### 1. Pipeline (6)
| Event | 발화 시점 | 핵심 데이터 |
|-------|----------|-----------|
| PIPELINE_START | 파이프라인 시작 | pipeline_id, config |
| PIPELINE_END | 파이프라인 종료 | pipeline_id, status, duration |
| PIPELINE_ERROR | 파이프라인 에러 | error_type, traceback |
| PIPELINE_RETRY | 파이프라인 재시도 | retry_count, reason |
| PIPELINE_CANCEL | 파이프라인 취소 | cancel_reason |
| PIPELINE_RESUME | 파이프라인 재개 | checkpoint_id |

### 2. Node (6)
| Event | 발화 시점 | 핵심 데이터 |
|-------|----------|-----------|
| NODE_ENTER | 노드 진입 | node_name, input_data |
| NODE_EXIT | 노드 퇴장 | node_name, output_data, duration |
| NODE_ERROR | 노드 에러 | node_name, error |
| NODE_RETRY | 노드 재시도 | node_name, retry_count |
| NODE_SKIP | 노드 스킵 | node_name, skip_reason |
| NODE_TIMEOUT | 노드 타임아웃 | node_name, elapsed |

### 3. Analysis (6)
| Event | 발화 시점 | 핵심 데이터 |
|-------|----------|-----------|
| ANALYSIS_START | 분석 시작 | ip_name, analyst_type |
| ANALYSIS_COMPLETE | 분석 완료 | ip_name, scores, confidence |
| ANALYSIS_MERGE | 분석 병합 | ip_name, merged_result |
| SCORING_START | 스코어링 시작 | ip_name, evaluator_type |
| SCORING_COMPLETE | 스코어링 완료 | composite_score, tier |
| VERIFICATION_COMPLETE | 검증 완료 | layer, result, passed |

### 4. Automation (6)
| Event | 발화 시점 | 핵심 데이터 |
|-------|----------|-----------|
| SCHEDULE_FIRE | 스케줄 발화 | job_id, action |
| TRIGGER_FIRE | 트리거 발화 | trigger_type, event_data |
| DRIFT_DETECTED | 드리프트 감지 | metric, cusum_value, zone |
| DRIFT_RESOLVED | 드리프트 해소 | metric, new_baseline |
| CONFIG_RELOAD | 설정 재로드 | changed_keys |
| WEBHOOK_RECEIVED | 웹훅 수신 | endpoint, payload_size |

### 5. Memory (5)
| Event | 발화 시점 | 핵심 데이터 |
|-------|----------|-----------|
| MEMORY_READ | 메모리 읽기 | tier, key |
| MEMORY_WRITE | 메모리 쓰기 | tier, key, size |
| MEMORY_EVICT | 메모리 퇴거 | tier, key, reason |
| TURN_COMPLETE | 턴 완료 | user_input, tool_calls, result |
| LEARNING_ACCUMULATED | 학습 축적 | insight_count, source |

### 6. SubAgent (5)
| Event | 발화 시점 | 핵심 데이터 |
|-------|----------|-----------|
| SUBAGENT_SPAWN | 서브에이전트 스폰 | agent_id, task, parent_id |
| SUBAGENT_COMPLETE | 서브에이전트 완료 | agent_id, result_size, rounds |
| SUBAGENT_ERROR | 서브에이전트 에러 | agent_id, error |
| SUBAGENT_TIMEOUT | 서브에이전트 타임아웃 | agent_id, elapsed |
| SUBAGENT_ANNOUNCE | 서브에이전트 알림 | agent_id, summary (v0.32.1: 동기 시 비활성) |

### 7. Context (6)
| Event | 발화 시점 | 핵심 데이터 |
|-------|----------|-----------|
| CONTEXT_WARNING | 컨텍스트 80% | usage_pct, token_count |
| CONTEXT_CRITICAL | 컨텍스트 95% | usage_pct, token_count |
| CONTEXT_COMPACTED | 컨텍스트 압축 완료 | strategy, saved_tokens |
| LLM_CALL_START | LLM 호출 시작 | model, prompt_tokens |
| LLM_CALL_END | LLM 호출 종료 | model, total_tokens, latency |
| BUDGET_EXCEEDED | 예산 초과 | spent, budget_limit |

### 8. Tool Recovery + Gateway (6)
| Event | 발화 시점 | 핵심 데이터 |
|-------|----------|-----------|
| TOOL_ERROR | 도구 에러 | tool_name, error_type |
| TOOL_RETRY | 도구 재시도 | tool_name, retry_count |
| TOOL_APPROVAL | 도구 승인 | tool_name, tier, approved |
| GATEWAY_MESSAGE | 게이트웨이 메시지 수신 | channel, sender, content_size |
| GATEWAY_RESPONSE | 게이트웨이 응답 전송 | channel, response_size |
| GATEWAY_ERROR | 게이트웨이 에러 | channel, error |

**Total: 6+6+6+6+5+5+6+6 = 46 Events**

## 17 Registered Handlers

| Handler | Priority | 구독 이벤트 | 역할 |
|---------|----------|-----------|------|
| RunLogHandler | P50 | PIPELINE_END | runs.jsonl 기록 |
| MetricsHandler | P50 | NODE_EXIT, ANALYSIS_COMPLETE | 성능 메트릭 수집 |
| ErrorHandler | P40 | *_ERROR | 에러 분류(retryable/fatal) |
| RetryHandler | P40 | *_RETRY | 재시도 로직 |
| SnapshotHandler | P80 | PIPELINE_END | 상태 스냅샷 저장 |
| MemoryWritebackHandler | P85 | TURN_COMPLETE | PROJECT.md 자동 기록 |
| DriftTriggerHandler | P70 | DRIFT_DETECTED | 자동 재분석 트리거 |
| DriftSnapshotHandler | P80 | DRIFT_DETECTED | 상태 캡처 |
| DriftLoggerHandler | P90 | DRIFT_DETECTED | 구조화 로깅 |
| ContextWatcherHandler | P60 | CONTEXT_WARNING, CONTEXT_CRITICAL | 압축 발동 |
| BudgetHandler | P30 | LLM_CALL_END | 비용 누적, budget_stop 판단 |
| StuckDetectorHandler | P60 | NODE_EXIT | 수렴 감지(동일 에러 3회) |
| ToolRepeatHandler | P60 | TOOL_ERROR | 반복 5회 감지, hint 주입 |
| ScheduleHandler | P50 | SCHEDULE_FIRE | 스케줄 작업 실행 |
| ConfigWatcherHandler | P50 | CONFIG_RELOAD | hot-reload 적용 |
| GatewayHandler | P50 | GATEWAY_MESSAGE | 메시지 라우팅 |
| TokenTrackerHandler | P30 | LLM_CALL_START, LLM_CALL_END | 모델별 토큰/비용 추적 |

## Registration Layers

1. **Core**: system.py에서 HookEvent enum 정의
2. **Plugin (YAML)**: plugins/*.yaml로 외부 핸들러 등록
3. **Plugin (Class)**: BasePlugin 상속으로 코드 기반 등록

## 4-Tier Maturity Model

| Level | 이름 | 커버리지 | 설명 |
|-------|------|---------|------|
| L1 | Observe | 46/46 | 모든 이벤트 로깅 |
| L2 | React | 28/46 | 자동 대응 (재시도, 압축, 알림) |
| L3 | Decide | 1/46 | 의사결정 (비용 최적화). 차기 확장 대상 |
| L4 | Autonomy | 0/46 | 자율 학습. 미구현. 장기 목표 |

## v0.32.1 변경사항

- SUBAGENT_ANNOUNCE: 동기 호출(delegate_task) 시 발화하지 않음. announce=False 파라미터로 제어.
- 기존 비동기 경로(systemEvent)에서는 정상 발화.

## 리플 패턴 예시

```
PIPELINE_END 발화
  → RunLogHandler (P50): runs.jsonl에 실행 기록
  → SnapshotHandler (P80): 상태 스냅샷 파일 저장
  → MemoryWritebackHandler (P85): PROJECT.md에 학습 기록
  (Priority 오름차순 순차 실행)
```

```
DRIFT_DETECTED 발화
  → DriftTriggerHandler (P70): EVENT 트리거로 재분석 실행
  → DriftSnapshotHandler (P80): 드리프트 시점 상태 캡처
  → DriftLoggerHandler (P90): 구조화 로그 기록
```

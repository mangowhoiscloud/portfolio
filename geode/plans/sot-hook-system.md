# Hook System SOT v0.35.1 (40 Events)

## 개요

v0.35.1에서 6개 orphan event를 정리하여 **40 events**로 확정.
모든 계층(L0-L5)을 횡단하는 cross-cutting concern.
core/hooks/ 7 모듈.

## 40 Events by Category

### 1. Pipeline (3)
| Event | 발화 시점 |
|-------|----------|
| PIPELINE_START | 파이프라인 시작 |
| PIPELINE_END | 파이프라인 종료 |
| PIPELINE_ERROR | 파이프라인 에러 |

### 2. Node (4)
| Event | 발화 시점 |
|-------|----------|
| NODE_BOOTSTRAP | 노드 초기화 |
| NODE_ENTER | 노드 진입 |
| NODE_EXIT | 노드 퇴장 |
| NODE_ERROR | 노드 에러 |

### 3. Analysis (3)
| Event | 발화 시점 |
|-------|----------|
| ANALYST_COMPLETE | 분석가 완료 |
| EVALUATOR_COMPLETE | 평가자 완료 |
| SCORING_COMPLETE | 스코어링 완료 |

### 4. Verification (2)
| Event | 발화 시점 |
|-------|----------|
| VERIFICATION_PASS | 검증 통과 |
| VERIFICATION_FAIL | 검증 실패 |

### 5. L4.5 Automation (6)
| Event | 발화 시점 |
|-------|----------|
| DRIFT_DETECTED | CUSUM 드리프트 감지 |
| OUTCOME_COLLECTED | 결과 수집 완료 |
| MODEL_PROMOTED | 모델 프로모션 |
| SNAPSHOT_CAPTURED | 상태 스냅샷 캡처 |
| TRIGGER_FIRED | 트리거 발화 |
| POST_ANALYSIS | 후처리 분석 |

### 6. Memory (4)
| Event | 발화 시점 |
|-------|----------|
| MEMORY_SAVED | 메모리 저장 |
| RULE_CREATED | 규칙 생성 |
| RULE_UPDATED | 규칙 수정 |
| RULE_DELETED | 규칙 삭제 |

### 7. Prompt (2)
| Event | 발화 시점 |
|-------|----------|
| PROMPT_ASSEMBLED | 프롬프트 조립 완료 |
| PROMPT_DRIFT_DETECTED | 프롬프트 드리프트 감지 |

### 8. SubAgent (3)
| Event | 발화 시점 |
|-------|----------|
| SUBAGENT_STARTED | 서브에이전트 스폰 |
| SUBAGENT_COMPLETED | 서브에이전트 완료 |
| SUBAGENT_FAILED | 서브에이전트 실패 |

### 9. Tool Recovery (3)
| Event | 발화 시점 |
|-------|----------|
| TOOL_RECOVERY_ATTEMPTED | 도구 복구 시도 |
| TOOL_RECOVERY_SUCCEEDED | 도구 복구 성공 |
| TOOL_RECOVERY_FAILED | 도구 복구 실패 |

### 10. Gateway (2)
| Event | 발화 시점 |
|-------|----------|
| GATEWAY_MESSAGE_RECEIVED | 게이트웨이 메시지 수신 |
| GATEWAY_RESPONSE_SENT | 게이트웨이 응답 전송 |

### 11. Agentic Turn (1)
| Event | 발화 시점 |
|-------|----------|
| TURN_COMPLETE | 턴 완료 (auto-learning 트리거) |

### 12. Context (3)
| Event | 발화 시점 |
|-------|----------|
| CONTEXT_WARNING | 80% 도달 |
| CONTEXT_CRITICAL | 95% 도달 |
| CONTEXT_OVERFLOW_ACTION | 압축 실행 |

### 13. Session (2)
| Event | 발화 시점 |
|-------|----------|
| SESSION_START | 세션 시작 |
| SESSION_END | 세션 종료 |

### 14. Model (1)
| Event | 발화 시점 |
|-------|----------|
| MODEL_SWITCHED | 모델 전환 (v0.35.1: 중복 등록 수정) |

### 15. LLM Call (2)
| Event | 발화 시점 |
|-------|----------|
| LLM_CALL_START | LLM 호출 시작 |
| LLM_CALL_END | LLM 호출 종료 |

**합계: 3+4+3+2+6+4+2+3+3+2+1+3+2+1+2 = 40**

## v0.35.1 변경 사항

### 제거된 6개 orphan events
v0.35.1 H6에서 핸들러가 없는 6개 이벤트를 정리.
등록된 핸들러가 0개인 이벤트는 코드 복잡성만 증가시키므로 제거.

### SubAgent 안전 강화
- SUBAGENT_COMPLETED: zombie cleanup 로직 추가
- announce race condition: atomic flag로 수정
- env whitelist: 10개 안전 변수만 subprocess에 전달

### Thread Safety
- HookSystem이 REPL/DAEMON/SCHEDULER 전 모드에 wiring
- v0.35.0 이전에는 serve/scheduler에서 HookSystem 미연결

## 리플 패턴 예시

```
PIPELINE_END 발화
  → RunLogHandler (P50): runs.jsonl 기록
  → SnapshotHandler (P80): 상태 스냅샷 저장
  → MemoryWritebackHandler (P85): PROJECT.md 학습 기록
```

```
DRIFT_DETECTED 발화
  → DriftTriggerHandler (P70): 재분석 트리거
  → DriftSnapshotHandler (P80): 상태 캡처
  → DriftLoggerHandler (P90): 구조화 로그
```

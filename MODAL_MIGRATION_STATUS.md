# Modal Migration Status

## Summary
- **Date**: 2025-01-25
- **Status**: In Progress - Content consistency issues found

## Modal Count
| Category | Count | Status |
|----------|-------|--------|
| HTML exists + React exists | 14 | Content mismatch (simplified) |
| HTML missing + React exists | 21 | Fabricated content |
| **Total in React** | 35 | |

## Modals with Content Mismatch (14)
These exist in both HTML and React but content is simplified/different:
- modal-3tier-memory
- modal-chat-consistency
- modal-chat-eventbus
- modal-chat-langgraph
- modal-chat-multimodel
- modal-chat-observability
- modal-chat-toolcalling
- modal-fallback-chain
- modal-intent-classification
- modal-node-resilience
- modal-platform
- modal-send-api
- modal-token-streaming

### Examples of Missing Content:
**modal-intent-classification:**
- Missing: Intent Cache section (Key, TTL)
- Missing: Classification Example section
- Missing: Keywords "도", "추가로" in Multi-Intent

**modal-fallback-chain:**
- Missing: FALLBACK_CHAIN code configuration
- Missing: Specific scoring weights (0.3, 0.2, 0.2, 0.3)
- Missing: FeedbackQuality enum thresholds
- Missing: Clarification messages per intent
- Missing: FallbackReason enum

## Fabricated Modals (21)
These modal IDs are referenced in categories.ts but don't exist in original HTML:
- modal-backpressure
- modal-celery-chain
- modal-cqrs
- modal-dlq
- modal-domain
- modal-efk
- modal-extauthz
- modal-gevent
- modal-gitops
- modal-idempotency
- modal-ingress
- modal-istio
- modal-jwt
- modal-metrics
- modal-oauth
- modal-outbox
- modal-ports
- modal-saga
- modal-sse
- modal-terraform
- modal-token-v2
- modal-tracing

## Next Steps
1. [ ] Migrate 14 existing modals with full HTML content
2. [ ] Decide on 21 fabricated modals (delete from categories.ts or keep)

## Files Involved
- `/src/data/modals/feature-modals.ts` - Contains 32 modals (needs update)
- `/src/data/modals/index.ts` - Exports all modals
- `/src/data/categories.ts` - References modalIds
- Original HTML: `/Users/mango/workspace/resume/eco2-portfolio.html`

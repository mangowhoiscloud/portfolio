# V2 SOT — Verified Numbers (2026-03-28)

> 이 파일이 모든 슬라이드의 숫자 SOT. 불일치 시 이 파일이 우선.

| 항목 | 값 | 검증 명령/소스 |
|------|-----|--------------|
| Version | **v0.31.0** | pyproject.toml |
| Commits | **1,160** | git log --oneline \| wc -l |
| PRs | **#500+** | progress.md 세션 45 |
| Releases | **39** | grep '^## \[' CHANGELOG.md |
| Python Modules | **187** | find core/ -name '*.py' |
| Tests (함수) | **3,201** | grep -r 'def test_' tests/ |
| Hook Events | **46** | HookEvent enum members |
| Tools (Native) | **52** | definitions.json |
| MCP Catalog | **45** | MCPCatalogEntry count |
| Scaffold Skills | **21** | ls .claude/skills/ |
| CLAUDE.md | **425줄** | wc -l |
| CANNOT 규칙 | **23** | grep count |
| Project Duration | **36일** | Feb 21 → Mar 28 |
| LLM Providers | **3** | Anthropic, OpenAI, ZhipuAI |
| DomainPort Methods | 확인 필요 | core/domains/ |
| REODE Modules | **209** | REODE README |
| REODE Tests | **3,274** | REODE README |
| REODE Validation | **83/83** | 241소스, 103K LoC |

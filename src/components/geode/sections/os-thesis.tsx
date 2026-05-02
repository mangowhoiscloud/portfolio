"use client";

import { useLocale, t } from "../locale-context";

const values = [
  {
    id: "V0",
    title: "Agentic OS",
    titleKo: "에이전틱 OS",
    body: "LLM = compute. Agent = its OS. GEODE implements that diagram.",
    bodyKo: "LLM은 compute. 에이전트는 그것의 OS. GEODE는 그 도식의 구현.",
  },
  {
    id: "V1",
    title: "Domain Portability",
    titleKo: "도메인 이식성",
    body: "Two apps. One harness. Zero rewrite.",
    bodyKo: "두 앱. 한 하네스. 재작성 없음.",
  },
  {
    id: "V2",
    title: "Verification Layer",
    titleKo: "검증 계층",
    body: "G1-G4 + BiasBuster + Cross-LLM + Karpathy P4 hash ratchet.",
    bodyKo: "G1-G4 + BiasBuster + Cross-LLM + Karpathy P4 해시 래칫.",
  },
  {
    id: "V3",
    title: "Compute ABI",
    titleKo: "컴퓨트 ABI",
    body: "4 providers × R1-R9 reasoning wire audit. GLM thinking is GEODE-only.",
    bodyKo: "4 프로바이더 × R1-R9 리즈닝 와이어 감사. GLM thinking 활성화는 GEODE 단독.",
  },
  {
    id: "V4",
    title: "Routing IQ",
    titleKo: "라우팅 IQ",
    body: "Plan-aware quota panel. Equivalence-class routing. Credential breadcrumb.",
    bodyKo: "플랜 인식 쿼터 패널. 동등성 클래스 라우팅. 자격증명 breadcrumb.",
  },
  {
    id: "V5",
    title: "Operator Discipline",
    titleKo: "운영자 디시플린",
    body: "Solo. 64+ releases. Zero regression. Built by its own scaffold.",
    bodyKo: "솔로. 64+ 릴리스. 무회귀. 자기 자신의 스캐폴드로 구축.",
  },
];

export function OsThesisSection() {
  const locale = useLocale();
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--ink-3)] mb-3">
            {t(locale, "§ 1. THESIS", "§ 1. THESIS")}
          </div>
          <h2 className="font-display font-bold tracking-tight text-3xl md:text-4xl text-[var(--ink-1)] leading-tight">
            {t(locale, "에이전틱 OS, 자기 자신의 스캐폴드로 만들어진.", "An agentic OS, built by its own scaffold.")}
          </h2>
          <p className="mt-4 text-[var(--ink-2)] max-w-2xl leading-relaxed text-[15px]">
            {t(
              locale,
              "2023년 11월, 안드레이 카르파시가 ‘Intro to Large Language Models’에서 LLM OS의 윤곽을 그렸다. LLM이 가운데 있고 그 주위로 도구와 파일시스템과 다른 LLM과 임베딩 공간이 둘러싼 그림이었다. GEODE는 그 그림을 실제 코드로 옮긴 하나의 결과물이다. LLM이 커널 자리에 들어가고, 런타임이 시스템콜과 드라이버를, 하네스가 셸과 init을, 에이전트가 항상 도는 루프를 맡는다.",
              "In November 2023, Andrej Karpathy sketched the outline of an LLM-OS — the model in the middle, with tools, a filesystem, other LLMs, and embedding spaces gathered around it. GEODE is one attempt to render that sketch as code. The model takes the kernel slot, the runtime takes syscalls and drivers, the harness takes the shell and init, and the agent takes the always-running loop."
            )}
          </p>
          <p className="mt-3 text-[var(--ink-2)] max-w-2xl leading-relaxed text-[15px]">
            {t(
              locale,
              "이 운영체제는 자기 자신의 스캐폴드로 만들어졌다. 카르파시의 P4 ratchet이 한쪽에서는 프롬프트 해시 20개를 잠그고, 다른 쪽에서는 CI 5단계를 잠근다. 같은 패턴이 두 스코프에서 나란히 작동한다.",
              "The system was built by its own scaffold. The P4 ratchet locks twenty prompt hashes on one side and the five CI jobs on the other — the same pattern at work in two scopes."
            )}
          </p>
          <p className="mt-3 text-[var(--ink-3)] max-w-2xl leading-relaxed text-[13px] font-mono">
            GEODE v0.65.0 · 236 모듈 · 4380 테스트 · 64회 릴리스 · 핀 고정 프롬프트 20개 · 단독 운영
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {values.map((v) => (
            <div
              key={v.id}
              className="rounded-lg border border-[var(--rule)] hover:border-[var(--ink-3)] p-4 transition-colors"
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--acc-artifact)]">
                  {v.id}
                </span>
                <span className="font-display font-semibold text-[var(--ink-1)] text-base">
                  {locale === "ko" ? v.titleKo : v.title}
                </span>
              </div>
              <p className="text-[13px] text-[var(--ink-2)] leading-relaxed">
                {locale === "ko" ? v.bodyKo : v.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

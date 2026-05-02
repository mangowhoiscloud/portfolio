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
              "Andrej Karpathy가 2023-11 'Intro to Large Language Models' 강연에서 LLM OS 다이어그램을 그렸다. GEODE 는 그 다이어그램을 프로덕션 코드로 만든 한 가지 구현이다. 4-Layer agentic OS — LLM 이 커널, 런타임이 syscall + driver 계층, 하네스가 shell + init, 에이전트가 항상 도는 루프.",
              "In November 2023, Andrej Karpathy sketched the LLM OS in his 'Intro to Large Language Models' talk. GEODE is one implementation of that diagram in production code. A 4-Layer agentic OS — LLM as kernel, runtime as syscall + driver layer, harness as shell + init, agent as the always-on loop."
            )}
          </p>
          <p className="mt-3 text-[var(--ink-2)] max-w-2xl leading-relaxed text-[15px]">
            {t(
              locale,
              "그 OS 는 자기 자신의 스캐폴드로 만들어졌다. 동일한 Karpathy 래칫 디시플린이 두 스케일에 적용됐다. GEODE 의 프롬프트에는 P4 해시 래칫이, 스캐폴드에는 P4 CI 래칫이. 같은 패턴, 다른 스코프.",
              "The OS was built by its own scaffold — the same Karpathy ratchet discipline applied at two scales. GEODE's prompts have a P4 hash ratchet; the scaffold has a P4 CI ratchet. Same pattern, different scope."
            )}
          </p>
          <p className="mt-3 text-[var(--ink-3)] max-w-2xl leading-relaxed text-[13px] font-mono">
            GEODE v0.65.0 · 236 modules · 4380+ tests · 64+ releases · 20 pinned prompts · solo
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

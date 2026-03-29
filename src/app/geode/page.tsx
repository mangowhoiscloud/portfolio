"use client";

import { LocaleProvider } from "@/components/geode/locale-context";
import { GeodeNav } from "@/components/geode/sections/nav";
import { HeroSection } from "@/components/geode/sections/hero";
import { KanbanSection } from "@/components/geode/sections/kanban";
import { ScaffoldSection } from "@/components/geode/sections/scaffold";
import { LoopSection } from "@/components/geode/sections/loop";
import { ReasoningSection } from "@/components/geode/sections/reasoning";
import { ArchitectureSection } from "@/components/geode/sections/architecture";
import { GatewaySection } from "@/components/geode/sections/gateway";
import { ConcurrencySection } from "@/components/geode/sections/concurrency";
import { HeadlessSection } from "@/components/geode/sections/headless";
import { SchedulerSection } from "@/components/geode/sections/scheduler";
import { HooksSection } from "@/components/geode/sections/hooks";
import { AgentsTasksSection } from "@/components/geode/sections/agents-tasks";
import { ToolUseSection } from "@/components/geode/sections/tool-use";
import { ContextTiersSection } from "@/components/geode/sections/context-tiers";
import { MultiLlmSection } from "@/components/geode/sections/multi-llm";
import { DomainDagSection } from "@/components/geode/sections/domain-dag";
import { ScoringSection } from "@/components/geode/sections/scoring";
import { FeedbackSection } from "@/components/geode/sections/feedback";
import { VerificationSection } from "@/components/geode/sections/verification";
import { TimelineSection } from "@/components/geode/sections/timeline";
import { GeodeFooter } from "@/components/geode/sections/footer";

const Divider = () => <div className="max-w-3xl mx-auto border-t border-white/[0.03]" />;

export default function GeodePage() {
  return (
    <LocaleProvider>
    <main className="min-h-screen bg-[linear-gradient(180deg,var(--sea-abyss)_0%,var(--sea-deep)_15%,var(--sea-mid)_35%,var(--sea-upper)_60%,var(--sea-surface)_85%,#0F2240_100%)] text-[#F0F0FF] overflow-x-hidden">
      <GeodeNav />
      <div id="hero"><HeroSection /></div>
      <div id="scaffold"><ScaffoldSection /></div>
      <div id="kanban"><KanbanSection /></div>
      <Divider />
      <div id="loop"><LoopSection /></div>
      <div id="reasoning"><ReasoningSection /></div>
      <Divider />
      <div id="architecture"><ArchitectureSection /></div>
      <div id="gateway"><GatewaySection /></div>
      <div id="concurrency"><ConcurrencySection /></div>
      <div id="headless"><HeadlessSection /></div>
      <div id="scheduler"><SchedulerSection /></div>
      <Divider />
      <div id="hooks"><HooksSection /></div>
      <div id="agents"><AgentsTasksSection /></div>
      <div id="tools"><ToolUseSection /></div>
      <Divider />
      <div id="context"><ContextTiersSection /></div>
      <div id="llm"><MultiLlmSection /></div>
      <Divider />
      <div id="domain"><DomainDagSection /></div>
      <div id="scoring"><ScoringSection /></div>
      <div id="feedback"><FeedbackSection /></div>
      <Divider />
      <div id="verify"><VerificationSection /></div>
      <div id="timeline"><TimelineSection /></div>
      <GeodeFooter />
    </main>
    </LocaleProvider>
  );
}

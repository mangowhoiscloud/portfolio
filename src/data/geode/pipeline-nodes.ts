import { Node, Edge } from "@xyflow/react";

// Pipeline node definitions for GEODE's LangGraph StateGraph
// Topology: START → router → cortex → signals → analyst×4 (fan-out) → evaluators → scoring → verification → synthesizer → END

export const pipelineNodes: Node[] = [
  // START
  {
    id: "start",
    type: "geodeStart",
    position: { x: 0, y: 180 },
    data: { label: "START", delay: 0 },
  },

  // Router
  {
    id: "router",
    type: "geodeStage",
    position: { x: 120, y: 168 },
    data: {
      icon: "🗺️",
      label: "Router",
      description: "6-mode routing",
      color: "indigo",
      delay: 0.05,
    },
  },

  // Cortex (MonoLake)
  {
    id: "cortex",
    type: "geodeStage",
    position: { x: 260, y: 168 },
    data: {
      icon: "🧬",
      label: "Cortex",
      description: "MonoLake loader",
      color: "blue",
      delay: 0.1,
    },
  },

  // Signals
  {
    id: "signals",
    type: "geodeStage",
    position: { x: 400, y: 168 },
    data: {
      icon: "📡",
      label: "Signals",
      description: "External signals",
      color: "cyan",
      delay: 0.15,
    },
  },

  // 4 Analysts (fan-out via Send API)
  {
    id: "analyst-market",
    type: "geodeAnalyst",
    position: { x: 560, y: 30 },
    data: {
      icon: "📊",
      label: "Market",
      description: "시장 규모·성장률",
      axis: "A-C",
      delay: 0.2,
    },
  },
  {
    id: "analyst-creative",
    type: "geodeAnalyst",
    position: { x: 560, y: 120 },
    data: {
      icon: "🎨",
      label: "Creative",
      description: "IP 창작 잠재력",
      axis: "D-F",
      delay: 0.25,
    },
  },
  {
    id: "analyst-audience",
    type: "geodeAnalyst",
    position: { x: 560, y: 210 },
    data: {
      icon: "👥",
      label: "Audience",
      description: "팬덤·커뮤니티",
      axis: "G-I",
      delay: 0.3,
    },
  },
  {
    id: "analyst-risk",
    type: "geodeAnalyst",
    position: { x: 560, y: 300 },
    data: {
      icon: "⚠️",
      label: "Risk",
      description: "리스크 평가",
      axis: "J-L",
      delay: 0.35,
    },
  },

  // Evaluators
  {
    id: "evaluators",
    type: "geodeStage",
    position: { x: 720, y: 168 },
    data: {
      icon: "⚖️",
      label: "Evaluators",
      description: "3 evaluators",
      color: "amber",
      delay: 0.4,
    },
  },

  // Scoring
  {
    id: "scoring",
    type: "geodeStage",
    position: { x: 860, y: 168 },
    data: {
      icon: "🎯",
      label: "Scoring",
      description: "PSM + Final",
      color: "emerald",
      delay: 0.45,
    },
  },

  // Verification
  {
    id: "verification",
    type: "geodeStage",
    position: { x: 1000, y: 168 },
    data: {
      icon: "🛡️",
      label: "Verification",
      description: "G1-G4 checks",
      color: "yellow",
      delay: 0.5,
    },
  },

  // Synthesizer
  {
    id: "synthesizer",
    type: "geodeStage",
    position: { x: 1140, y: 168 },
    data: {
      icon: "📝",
      label: "Synthesizer",
      description: "Decision + Narrative",
      color: "purple",
      delay: 0.55,
    },
  },

  // END
  {
    id: "end",
    type: "geodeEnd",
    position: { x: 1280, y: 180 },
    data: { label: "END", delay: 0.6 },
  },
];

export const pipelineEdges: Edge[] = [
  // Main flow
  { id: "e-start-router", source: "start", target: "router", animated: true, style: { stroke: "#818CF8", strokeWidth: 2 } },
  { id: "e-router-cortex", source: "router", target: "cortex", animated: true, style: { stroke: "#818CF8", strokeWidth: 2 } },
  { id: "e-cortex-signals", source: "cortex", target: "signals", animated: true, style: { stroke: "#60A5FA", strokeWidth: 2 } },

  // Fan-out: signals → analysts (Send API)
  { id: "e-signals-market", source: "signals", target: "analyst-market", animated: true, style: { stroke: "#818CF8", strokeWidth: 2 }, label: "Send" },
  { id: "e-signals-creative", source: "signals", target: "analyst-creative", animated: true, style: { stroke: "#818CF8", strokeWidth: 2 } },
  { id: "e-signals-audience", source: "signals", target: "analyst-audience", animated: true, style: { stroke: "#818CF8", strokeWidth: 2 } },
  { id: "e-signals-risk", source: "signals", target: "analyst-risk", animated: true, style: { stroke: "#818CF8", strokeWidth: 2 } },

  // Fan-in: analysts → evaluators
  { id: "e-market-eval", source: "analyst-market", target: "evaluators", animated: true, style: { stroke: "#FBBF24", strokeWidth: 2 } },
  { id: "e-creative-eval", source: "analyst-creative", target: "evaluators", animated: true, style: { stroke: "#FBBF24", strokeWidth: 2 } },
  { id: "e-audience-eval", source: "analyst-audience", target: "evaluators", animated: true, style: { stroke: "#FBBF24", strokeWidth: 2 } },
  { id: "e-risk-eval", source: "analyst-risk", target: "evaluators", animated: true, style: { stroke: "#FBBF24", strokeWidth: 2 } },

  // Post-eval flow
  { id: "e-eval-scoring", source: "evaluators", target: "scoring", animated: true, style: { stroke: "#34D399", strokeWidth: 2 } },
  { id: "e-scoring-verif", source: "scoring", target: "verification", animated: true, style: { stroke: "#FBBF24", strokeWidth: 2 } },
  { id: "e-verif-synth", source: "verification", target: "synthesizer", animated: true, style: { stroke: "#A78BFA", strokeWidth: 2 } },
  { id: "e-synth-end", source: "synthesizer", target: "end", animated: true, style: { stroke: "#818CF8", strokeWidth: 2 } },

  // Feedback loop (dashed)
  {
    id: "e-feedback",
    source: "verification",
    target: "evaluators",
    style: { stroke: "#F472B6", strokeWidth: 1.5, strokeDasharray: "5,5" },
    label: "feedback",
    animated: false,
  },
];

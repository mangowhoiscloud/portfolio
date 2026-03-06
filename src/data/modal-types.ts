// Modal data type definitions for portfolio modals

export type ModalCategory =
  | "domain"
  | "chat"
  | "infrastructure"
  | "mq"
  | "stream"
  | "eventchain"
  | "cleanarch"
  | "observability"
  | "geode";

// Content block types that can appear in modals
export interface DemoSection {
  type: "demo";
  gif: string;
  link?: string;
}

export interface ImageSection {
  type: "image";
  src: string;
  alt: string;
}

export interface DiagramSection {
  type: "diagram";
  titleKo?: string;
  titleEn?: string;
  content: string; // ASCII art
}

export interface GridCard {
  title: string;
  color: string; // hex color like #3b82f6
  items: string[];
  footer?: string;
}

export interface GridSection {
  type: "grid";
  columns: 2 | 3 | 4;
  cards: GridCard[];
}

export interface TableRow {
  cells: string[];
}

export interface TableSection {
  type: "table";
  titleKo?: string;
  titleEn?: string;
  headers: string[];
  rows: TableRow[];
}

export interface DetailItem {
  label: string;
  value: string;
}

export interface DetailsSection {
  type: "details";
  items: DetailItem[];
}

export interface CodeSection {
  type: "code";
  titleKo?: string;
  titleEn?: string;
  language?: string;
  content: string;
}

export interface MetricCard {
  value: string;
  label: string;
  color: string; // hex color
}

export interface MetricsSection {
  type: "metrics";
  cards: MetricCard[];
}

export interface ExplanationSection {
  type: "explanation";
  titleKo?: string;
  titleEn?: string;
  contentKo: string;
  contentEn: string;
  highlight?: boolean;
  borderColor?: string;
}

export interface LinkSection {
  type: "link";
  labelKo: string;
  labelEn: string;
  href: string;
  isModal?: boolean; // true if links to another modal
  modalId?: string;
}

export interface TwoColumnSection {
  type: "twoColumn";
  left: {
    title: string;
    color: string;
    items: string[];
  };
  right: {
    title: string;
    color: string;
    items: string[];
  };
}

export interface SubagentTableSection {
  type: "subagentTable";
  titleKo?: string;
  titleEn?: string;
  headers: string[];
  rows: {
    node: string;
    intent: string;
    dataSource: string;
    protocol: string;
  }[];
}

export interface ContextFieldsSection {
  type: "contextFields";
  titleKo?: string;
  titleEn?: string;
  fields: {
    name: string;
    descKo: string;
    descEn: string;
  }[];
}

export type ModalContent =
  | DemoSection
  | ImageSection
  | DiagramSection
  | GridSection
  | TableSection
  | DetailsSection
  | CodeSection
  | MetricsSection
  | ExplanationSection
  | LinkSection
  | TwoColumnSection
  | SubagentTableSection
  | ContextFieldsSection;

export interface Modal {
  id: string;
  category: ModalCategory;
  titleKo: string;
  titleEn: string;
  icon: string;
  maxWidth?: number; // default 900
  content: ModalContent[];
}

// Helper type for modal map
export type ModalMap = Record<string, Modal>;

"use client";

import { T, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type {
  ModalContent,
  DemoSection,
  ImageSection,
  DiagramSection,
  GridSection,
  TableSection,
  DetailsSection,
  CodeSection,
  MetricsSection,
  ExplanationSection,
  LinkSection,
  TwoColumnSection,
  SubagentTableSection,
  ContextFieldsSection,
} from "@/data/modal-types";

interface ContentRendererProps {
  content: ModalContent;
  onModalOpen?: (modalId: string) => void;
}

function DemoRenderer({ section }: { section: DemoSection }) {
  return (
    <div className="mb-6">
      <div className="text-sm font-medium text-accent mb-2">
        <T ko="📹 API 동작" en="📹 API Action" />
      </div>
      <a
        href={section.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="rounded-xl overflow-hidden border border-border/50 hover:border-accent/50 transition-all">
          <img
            src={section.gif}
            alt="API Demo"
            className="w-full h-auto"
          />
        </div>
      </a>
    </div>
  );
}

function ImageRenderer({ section }: { section: ImageSection }) {
  return (
    <div className="mb-6 text-center">
      <img
        src={section.src}
        alt={section.alt}
        className="max-w-full rounded-xl border border-border/50"
      />
    </div>
  );
}

function DiagramRenderer({ section }: { section: DiagramSection }) {
  const { language } = useI18n();
  const title = language === "ko" ? section.titleKo : section.titleEn;

  return (
    <div className="mb-6">
      {title && (
        <h4 className="text-accent font-semibold mb-3 text-base">{title}</h4>
      )}
      <pre className="bg-black/30 rounded-xl p-4 overflow-x-auto text-[0.65rem] leading-tight font-mono text-muted-foreground">
        {section.content}
      </pre>
    </div>
  );
}

function GridRenderer({ section }: { section: GridSection }) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-3 mb-6", gridCols[section.columns])}>
      {section.cards.map((card, idx) => (
        <div
          key={idx}
          className="p-4 rounded-xl border"
          style={{
            background: `${card.color}15`,
            borderColor: `${card.color}40`,
          }}
        >
          <h5
            className="font-semibold mb-2 text-sm"
            style={{ color: card.color }}
          >
            {card.title}
          </h5>
          <div className="text-xs text-muted-foreground space-y-1">
            {card.items.map((item, i) => (
              <div key={i}>• {item}</div>
            ))}
          </div>
          {card.footer && (
            <div className="mt-2 text-xs text-muted-foreground/70">
              {card.footer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TableRenderer({ section }: { section: TableSection }) {
  const { language } = useI18n();
  const title = language === "ko" ? section.titleKo : section.titleEn;

  return (
    <div className="mb-6">
      {title && (
        <h4 className="text-accent font-semibold mb-3 text-base">{title}</h4>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              {section.headers.map((header, idx) => (
                <th
                  key={idx}
                  className="text-left py-2 px-3 font-medium text-muted-foreground"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="border-b border-border/30 hover:bg-white/5"
              >
                {row.cells.map((cell, cellIdx) => (
                  <td key={cellIdx} className="py-2 px-3 text-xs">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DetailsRenderer({ section }: { section: DetailsSection }) {
  return (
    <div className="mb-6 bg-black/20 rounded-xl p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {section.items.map((item, idx) => (
          <div key={idx} className="text-sm">
            <div className="text-accent font-medium text-xs mb-1">
              {item.label}
            </div>
            <div className="text-muted-foreground text-xs">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CodeRenderer({ section }: { section: CodeSection }) {
  const { language } = useI18n();
  const title = language === "ko" ? section.titleKo : section.titleEn;

  return (
    <div className="mb-6">
      {title && (
        <h4 className="text-accent font-semibold mb-3 text-base">{title}</h4>
      )}
      <pre className="bg-card border border-border/50 rounded-xl p-4 overflow-x-auto text-xs font-mono text-muted-foreground leading-relaxed">
        {section.content}
      </pre>
    </div>
  );
}

function MetricsRenderer({ section }: { section: MetricsSection }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {section.cards.map((card, idx) => (
        <div
          key={idx}
          className="p-4 rounded-xl text-center border"
          style={{
            background: `linear-gradient(135deg, ${card.color}20, ${card.color}05)`,
            borderColor: `${card.color}40`,
          }}
        >
          <div
            className="text-2xl font-bold"
            style={{ color: card.color }}
          >
            {card.value}
          </div>
          <div className="text-xs text-muted-foreground">{card.label}</div>
        </div>
      ))}
    </div>
  );
}

function ExplanationRenderer({ section }: { section: ExplanationSection }) {
  const { language } = useI18n();
  const title = language === "ko" ? section.titleKo : section.titleEn;
  const content = language === "ko" ? section.contentKo : section.contentEn;

  return (
    <div
      className={cn(
        "mb-6 p-4 rounded-xl",
        section.highlight ? "border-l-4" : "border border-border/50"
      )}
      style={{
        background: section.highlight
          ? `${section.borderColor || "#8b5cf6"}15`
          : undefined,
        borderLeftColor: section.highlight ? section.borderColor : undefined,
      }}
    >
      {title && (
        <strong
          className="block mb-2"
          style={{ color: section.borderColor || "#8b5cf6" }}
        >
          {title}
        </strong>
      )}
      <div className="text-sm text-muted-foreground leading-relaxed">
        {content}
      </div>
    </div>
  );
}

function LinkRenderer({
  section,
  onModalOpen,
}: {
  section: LinkSection;
  onModalOpen?: (modalId: string) => void;
}) {
  const { language } = useI18n();
  const label = language === "ko" ? section.labelKo : section.labelEn;

  if (section.isModal && section.modalId && onModalOpen) {
    return (
      <div className="mb-4">
        <button
          onClick={() => onModalOpen(section.modalId!)}
          className="text-sm text-accent hover:underline"
        >
          {label}
        </button>
      </div>
    );
  }

  return (
    <div className="mb-4 p-3 bg-accent/10 rounded-lg border-l-3 border-accent">
      <a
        href={section.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-accent hover:underline"
      >
        {label}
      </a>
    </div>
  );
}

function TwoColumnRenderer({ section }: { section: TwoColumnSection }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div
        className="p-4 rounded-xl border"
        style={{
          background: `${section.left.color}15`,
          borderColor: `${section.left.color}40`,
        }}
      >
        <h5
          className="font-semibold mb-3 text-sm"
          style={{ color: section.left.color }}
        >
          {section.left.title}
        </h5>
        <div className="text-xs text-muted-foreground space-y-1">
          {section.left.items.map((item, i) => (
            <div key={i}>• {item}</div>
          ))}
        </div>
      </div>
      <div
        className="p-4 rounded-xl border"
        style={{
          background: `${section.right.color}15`,
          borderColor: `${section.right.color}40`,
        }}
      >
        <h5
          className="font-semibold mb-3 text-sm"
          style={{ color: section.right.color }}
        >
          {section.right.title}
        </h5>
        <div className="text-xs text-muted-foreground space-y-1">
          {section.right.items.map((item, i) => (
            <div key={i}>• {item}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SubagentTableRenderer({ section }: { section: SubagentTableSection }) {
  const { language } = useI18n();
  const title = language === "ko" ? section.titleKo : section.titleEn;

  return (
    <div className="mb-6">
      {title && (
        <h4 className="text-accent font-semibold mb-3 text-base">{title}</h4>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              {section.headers.map((header, idx) => (
                <th
                  key={idx}
                  className="text-left py-2 px-3 font-medium text-muted-foreground"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="border-b border-border/30 hover:bg-white/5"
              >
                <td className="py-2 px-3 text-xs font-mono">{row.node}</td>
                <td className="py-2 px-3 text-xs">{row.intent}</td>
                <td className="py-2 px-3 text-xs text-muted-foreground">
                  {row.dataSource}
                </td>
                <td className="py-2 px-3 text-xs">
                  <span className="px-2 py-0.5 bg-secondary rounded">
                    {row.protocol}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContextFieldsRenderer({ section }: { section: ContextFieldsSection }) {
  const { language } = useI18n();
  const title = language === "ko" ? section.titleKo : section.titleEn;

  return (
    <div className="mb-6">
      {title && (
        <h4 className="text-accent font-semibold mb-3 text-base">{title}</h4>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {section.fields.map((field, idx) => (
          <div
            key={idx}
            className="p-3 bg-accent/10 rounded-lg"
          >
            <strong className="text-xs font-mono text-accent">
              {field.name}
            </strong>
            <div className="text-xs text-muted-foreground mt-1">
              <T ko={field.descKo} en={field.descEn} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ModalContentRenderer({
  content,
  onModalOpen,
}: ContentRendererProps) {
  switch (content.type) {
    case "demo":
      return <DemoRenderer section={content} />;
    case "image":
      return <ImageRenderer section={content} />;
    case "diagram":
      return <DiagramRenderer section={content} />;
    case "grid":
      return <GridRenderer section={content} />;
    case "table":
      return <TableRenderer section={content} />;
    case "details":
      return <DetailsRenderer section={content} />;
    case "code":
      return <CodeRenderer section={content} />;
    case "metrics":
      return <MetricsRenderer section={content} />;
    case "explanation":
      return <ExplanationRenderer section={content} />;
    case "link":
      return <LinkRenderer section={content} onModalOpen={onModalOpen} />;
    case "twoColumn":
      return <TwoColumnRenderer section={content} />;
    case "subagentTable":
      return <SubagentTableRenderer section={content} />;
    case "contextFields":
      return <ContextFieldsRenderer section={content} />;
    default:
      return null;
  }
}

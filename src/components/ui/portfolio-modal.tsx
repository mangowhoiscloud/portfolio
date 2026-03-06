"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./dialog";
import { T } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface PortfolioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titleKo: string;
  titleEn: string;
  icon?: string;
  categoryColor?: string;
  children: ReactNode;
  className?: string;
  size?: "default" | "large" | "full";
}

export function PortfolioModal({
  open,
  onOpenChange,
  titleKo,
  titleEn,
  icon,
  categoryColor = "#00ff88",
  children,
  className,
  size = "default",
}: PortfolioModalProps) {
  const sizeClasses = {
    default: "sm:max-w-lg",
    large: "sm:max-w-3xl max-h-[85vh] overflow-y-auto",
    full: "sm:max-w-5xl max-h-[90vh] overflow-y-auto",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          sizeClasses[size],
          "bg-card border-border/50",
          className
        )}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {icon && <span className="text-2xl">{icon}</span>}
            <span style={{ color: categoryColor }}>
              <T ko={titleKo} en={titleEn} />
            </span>
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

// Section component for modal content
interface ModalSectionProps {
  titleKo?: string;
  titleEn?: string;
  children: ReactNode;
  className?: string;
}

export function ModalSection({
  titleKo,
  titleEn,
  children,
  className,
}: ModalSectionProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {titleKo && titleEn && (
        <h4 className="text-sm font-semibold text-foreground">
          <T ko={titleKo} en={titleEn} />
        </h4>
      )}
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

// Code block component for modal content
interface CodeBlockProps {
  children: ReactNode;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  return (
    <pre
      className={cn(
        "bg-secondary/50 rounded-lg p-4 overflow-x-auto text-xs font-mono",
        className
      )}
    >
      {children}
    </pre>
  );
}

// Diagram placeholder component
interface DiagramPlaceholderProps {
  height?: string;
  children?: ReactNode;
  className?: string;
}

export function DiagramPlaceholder({
  height = "300px",
  children,
  className,
}: DiagramPlaceholderProps) {
  return (
    <div
      className={cn(
        "bg-secondary/30 rounded-lg border border-border/50 flex items-center justify-center",
        className
      )}
      style={{ height }}
    >
      {children || (
        <span className="text-muted-foreground text-sm">Diagram</span>
      )}
    </div>
  );
}

"use client";

import { useEffect, useCallback } from "react";
import { T, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Modal } from "@/data/modal-types";
import { ModalContentRenderer } from "./modal-content-renderer";

interface PortfolioModalProps {
  modal: Modal | null;
  isOpen: boolean;
  onClose: () => void;
  onModalOpen?: (modalId: string) => void;
}

export function PortfolioModal({
  modal,
  isOpen,
  onClose,
  onModalOpen,
}: PortfolioModalProps) {
  const { language } = useI18n();

  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  // Add/remove escape key listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen || !modal) return null;

  const title = language === "ko" ? modal.titleKo : modal.titleEn;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className={cn(
          "relative bg-card border border-border/50 rounded-2xl w-full max-h-[90vh] overflow-y-auto",
          "animate-in fade-in-0 zoom-in-95 duration-200"
        )}
        style={{ maxWidth: modal.maxWidth || 900 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border/50 p-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-xl">{modal.icon}</span>
            <span>{title}</span>
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {modal.content.map((content, idx) => (
            <ModalContentRenderer
              key={idx}
              content={content}
              onModalOpen={onModalOpen}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

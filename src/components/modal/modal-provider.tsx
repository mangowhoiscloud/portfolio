"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { getModal } from "@/data/modals";
import type { Modal } from "@/data/modal-types";
import { PortfolioModal } from "./portfolio-modal";

interface ModalContextType {
  openModal: (modalId: string) => void;
  closeModal: () => void;
  currentModal: Modal | null;
  isOpen: boolean;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [currentModal, setCurrentModal] = useState<Modal | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback((modalId: string) => {
    const modal = getModal(modalId);
    if (modal) {
      setCurrentModal(modal);
      setIsOpen(true);
    } else {
      console.warn(`Modal with id "${modalId}" not found`);
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Delay clearing the modal to allow exit animation
    setTimeout(() => setCurrentModal(null), 200);
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, currentModal, isOpen }}>
      {children}
      <PortfolioModal
        modal={currentModal}
        isOpen={isOpen}
        onClose={closeModal}
        onModalOpen={(modalId) => {
          closeModal();
          setTimeout(() => openModal(modalId), 300);
        }}
      />
    </ModalContext.Provider>
  );
}

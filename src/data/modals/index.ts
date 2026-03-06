import { Modal, ModalMap } from "../modal-types";
import { domainModals } from "./domain-modals";
import { chatModals } from "./chat-modals";
import { infrastructureModals } from "./infrastructure-modals";
import { featureModals } from "./feature-modals";
import { geodeModals } from "./geode-modals";

// Combine all modals
export const allModals: Modal[] = [
  ...domainModals,
  ...chatModals,
  ...infrastructureModals,
  ...featureModals,
  ...geodeModals,
];

// Create a map for quick lookup by ID
export const modalMap: ModalMap = allModals.reduce((acc, modal) => {
  acc[modal.id] = modal;
  return acc;
}, {} as ModalMap);

// Get modal by ID
export function getModal(id: string): Modal | undefined {
  return modalMap[id];
}

// Get modals by category
export function getModalsByCategory(category: string): Modal[] {
  return allModals.filter((modal) => modal.category === category);
}

// Export individual modal arrays
export { domainModals, chatModals, infrastructureModals, featureModals, geodeModals };

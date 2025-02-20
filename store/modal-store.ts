import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  onConfirm: (() => void) | null;
  openModal: (options: {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  }) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  title: "Are you sure?",
  description: "This action cannot be undone.",
  confirmText: "Confirm",
  cancelText: "Cancel",
  onConfirm: null,
  openModal: ({ title, description, confirmText, cancelText, onConfirm }) =>
    set({
      isOpen: true,
      title: title || "Are you sure?",
      description: description || "This action cannot be undone.",
      confirmText: confirmText || "Confirm",
      cancelText: cancelText || "Cancel",
      onConfirm,
    }),
  closeModal: () => set({ isOpen: false, onConfirm: null }),
}));

"use client";

import { useModalStore } from "@/store/modal-store"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ConfirmModal() {
  const { isOpen, title, description, confirmText, cancelText, onConfirm, closeModal } = useModalStore();

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p>{description}</p>
        <DialogFooter className="flex gap-2">
          <Button variant="secondary" onClick={closeModal}>
            {cancelText}
          </Button>
          <Button variant="destructive" onClick={() => {
            if (onConfirm) onConfirm();
            closeModal();
          }}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

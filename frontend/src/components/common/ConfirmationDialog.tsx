// components/common/ConfirmationDialog.tsx
"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React, { useState } from "react";

interface ConfirmationDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => Promise<void> | void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationDialog = ({
  children,
  title,
  description,
  onConfirm,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
}: ConfirmationDialogProps) => {
  const [open, setOpen] = useState(false);
  const handleConfirm = async () => {
    await onConfirm?.();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* 'children' is the trigger element for the dialog */}
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl text-slate-800">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-600">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-lg bg-red-600 text-white hover:bg-red-600/80 hover:text-white">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            className="rounded-lg bg-blue-600 hover:bg-blue-700/80"
            onClick={() => void handleConfirm()}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;

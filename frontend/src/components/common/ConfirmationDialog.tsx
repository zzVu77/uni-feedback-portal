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
  children?: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => Promise<void> | void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  customContent?: React.ReactNode;
  isConfirmDisabled?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ConfirmationDialog = ({
  children,
  title,
  description,
  onConfirm,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  isDestructive = false,
  customContent,
  isConfirmDisabled = false,
  isOpen,
  onOpenChange,
}: ConfirmationDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

  const handleConfirm = async () => {
    await onConfirm?.();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* 'children' is the trigger element for the dialog */}
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      <AlertDialogContent className="rounded-[24px] border border-white/60 bg-white/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-slate-800">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed text-slate-600">
            {description}
          </AlertDialogDescription>
          {customContent && <div className="mt-4">{customContent}</div>}
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 gap-3">
          <AlertDialogCancel className="h-11 rounded-full border-slate-200 px-6 font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            className={`h-11 rounded-full px-6 font-semibold text-white shadow-md transition-all hover:shadow-lg ${
              isDestructive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-primary-400 hover:bg-blue-primary-600"
            }`}
            disabled={isConfirmDisabled}
            onClick={(e) => {
              e.preventDefault();
              void handleConfirm();
            }}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;

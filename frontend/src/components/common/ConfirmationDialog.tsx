// components/common/ConfirmationDialog.tsx
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
import React from "react";

interface ConfirmationDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
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
  return (
    <AlertDialog>
      {/* 'children' is the trigger element for the dialog */}
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-red-600 text-white hover:bg-red-500 hover:text-white">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-blue-600 hover:bg-blue-500"
            onClick={onConfirm}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;

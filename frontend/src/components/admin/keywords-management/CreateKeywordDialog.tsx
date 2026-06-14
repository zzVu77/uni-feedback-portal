import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateToxicKeyword } from "@/hooks/queries/useToxicKeywordsQueries";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface CreateKeywordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateKeywordDialog: React.FC<CreateKeywordDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { mutate: createKeyword, isPending } = useCreateToxicKeyword();
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (isOpen) {
      setKeyword("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    createKeyword(
      { keyword: keyword.trim() },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm từ khóa cấm</DialogTitle>
          <DialogDescription>
            Nhập từ khóa hoặc cụm từ bạn muốn chặn trên hệ thống.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="keyword">Từ khóa *</Label>
            <Input
              id="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Ví dụ: lừa đảo..."
              required
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isPending || !keyword.trim()}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Thêm mới
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

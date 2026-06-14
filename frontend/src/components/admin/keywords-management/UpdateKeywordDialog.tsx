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
import { useUpdateToxicKeyword } from "@/hooks/queries/useToxicKeywordsQueries";
import { ToxicKeywordResponse } from "@/types/toxic-keywords";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface UpdateKeywordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  keywordData: ToxicKeywordResponse;
}

export const UpdateKeywordDialog: React.FC<UpdateKeywordDialogProps> = ({
  isOpen,
  onClose,
  keywordData,
}) => {
  const { mutate: updateKeyword, isPending } = useUpdateToxicKeyword();
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (isOpen && keywordData) {
      setKeyword(keywordData.keyword);
    }
  }, [isOpen, keywordData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    updateKeyword(
      { id: keywordData.id, payload: { keyword: keyword.trim() } },
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
          <DialogTitle>Chỉnh sửa từ khóa</DialogTitle>
          <DialogDescription>
            Cập nhật nội dung của từ khóa cấm này.
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
              disabled={
                isPending ||
                !keyword.trim() ||
                keyword.trim() === keywordData.keyword
              }
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

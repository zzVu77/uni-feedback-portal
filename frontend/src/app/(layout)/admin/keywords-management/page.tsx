/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  ShieldBan,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  ToxicKeyword,
  toxicKeywordsService,
} from "@/services/toxic-keywords.service";
import useSWR from "swr";
import { useDebounce } from "@/hooks/useDebounce";

export default function KeywordsManagementPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderBy, setOrderBy] = useState<"keyword" | "date">("date");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const {
    data: getKeywordsRes,
    error,
    isLoading,
    mutate,
  } = useSWR(
    [
      "toxic-keywords",
      debouncedSearch,
      page,
      pageSize,
      orderBy,
      orderDirection,
    ],
    () =>
      toxicKeywordsService.getKeywords({
        search: debouncedSearch,
        page,
        pageSize,
        orderBy,
        orderDirection,
      }),
    {
      revalidateOnFocus: false,
    },
  );

  const keywords = (getKeywordsRes as any)?.results || [];
  const total = (getKeywordsRes as any)?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  const handleSort = (field: "keyword" | "date") => {
    if (orderBy === field) {
      setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(field);
      setOrderDirection("desc");
    }
  };

  const renderSortIcon = (field: "keyword" | "date") => {
    if (orderBy !== field)
      return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />;
    return orderDirection === "asc" ? (
      <ArrowUp className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4" />
    );
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [currentKeyword, setCurrentKeyword] = useState<ToxicKeyword | null>(
    null,
  );
  const [keywordInput, setKeywordInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async () => {
    if (!keywordInput.trim()) {
      toast.error("Vui lòng nhập từ khóa");
      return;
    }
    try {
      setIsSubmitting(true);
      await toxicKeywordsService.createKeyword(keywordInput.trim());
      toast.success("Thêm từ khóa thành công");
      setIsAddModalOpen(false);
      setKeywordInput("");
      mutate();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Có lỗi xảy ra khi thêm từ khóa",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!currentKeyword || !keywordInput.trim()) {
      toast.error("Vui lòng nhập từ khóa");
      return;
    }
    try {
      setIsSubmitting(true);
      await toxicKeywordsService.updateKeyword(
        currentKeyword.id,
        keywordInput.trim(),
      );
      toast.success("Cập nhật từ khóa thành công");
      setIsEditModalOpen(false);
      setKeywordInput("");
      setCurrentKeyword(null);
      mutate();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentKeyword) return;
    try {
      setIsSubmitting(true);
      await toxicKeywordsService.deleteKeyword(currentKeyword.id);
      toast.success("Xóa từ khóa thành công");
      setIsDeleteModalOpen(false);
      setCurrentKeyword(null);
      mutate();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra khi xóa");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (keyword: ToxicKeyword) => {
    setCurrentKeyword(keyword);
    setKeywordInput(keyword.keyword);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (keyword: ToxicKeyword) => {
    setCurrentKeyword(keyword);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Quản lý từ khóa cấm
          </h1>
          <p className="text-muted-foreground">
            Thêm, sửa, xóa các từ khóa vi phạm (toxic keywords) trên hệ thống.
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 md:mt-0">
          <div className="relative w-full md:w-72">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              type="search"
              placeholder="Tìm kiếm từ khóa..."
              className="w-full pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setKeywordInput("")}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm từ khóa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm từ khóa cấm</DialogTitle>
                <DialogDescription>
                  Nhập từ khóa hoặc cụm từ bạn muốn chặn trên hệ thống.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input
                  placeholder="Ví dụ: lừa đảo..."
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button onClick={handleAdd} disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Thêm mới
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-background flex flex-1 flex-col overflow-hidden rounded-md border">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-background sticky top-0 z-10 shadow-sm">
              <TableRow>
                <TableHead className="w-[100px]">STT</TableHead>
                <TableHead
                  className="hover:bg-muted/50 cursor-pointer select-none"
                  onClick={() => handleSort("keyword")}
                >
                  <div className="flex items-center">
                    Từ khóa
                    {renderSortIcon("keyword")}
                  </div>
                </TableHead>
                <TableHead
                  className="hover:bg-muted/50 cursor-pointer select-none"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Ngày tạo
                    {renderSortIcon("date")}
                  </div>
                </TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <Loader2 className="text-muted-foreground mx-auto h-6 w-6 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-red-500"
                  >
                    Lỗi tải dữ liệu. Vui lòng thử lại.
                  </TableCell>
                </TableRow>
              ) : keywords?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="text-muted-foreground flex flex-col items-center justify-center">
                      <ShieldBan className="mb-2 h-8 w-8 opacity-50" />
                      <p>Không tìm thấy từ khóa nào.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                keywords?.map((keyword: any, index: any) => (
                  <TableRow key={keyword.id}>
                    <TableCell className="font-medium">
                      {(page - 1) * pageSize + index + 1}
                    </TableCell>
                    <TableCell>{keyword.keyword}</TableCell>
                    <TableCell>
                      {format(new Date(keyword.createdAt), "dd/MM/yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(keyword)}
                        >
                          <Edit2 className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteModal(keyword)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t p-4">
            <p className="text-muted-foreground text-sm">
              Hiển thị {(page - 1) * pageSize + 1} -{" "}
              {Math.min(page * pageSize, total)} trong {total} từ khóa
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Trước
              </Button>
              <div className="text-sm font-medium">
                Trang {page} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Sau
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa từ khóa</DialogTitle>
            <DialogDescription>
              Cập nhật nội dung từ khóa cấm.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEdit()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEdit} disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa từ khóa "
              <span className="text-foreground font-bold">
                {currentKeyword?.keyword}
              </span>
              " không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Xác nhận xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

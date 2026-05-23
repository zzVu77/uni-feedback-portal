"use client";

import StatusBadge, { StatusBadgeProps } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Inbox } from "lucide-react";
import { useState } from "react";

// Mock Data Types
interface RelatedFeedback {
  id: string;
  subject: string;
  senderName: string;
  createdAt: string;
  status: StatusBadgeProps["type"];
}

// Mock Data
const MOCK_RELATED_FEEDBACKS: RelatedFeedback[] = [
  {
    id: "FB-1001",
    subject: "Wi-Fi is extremely slow in the central library on the 3rd floor.",
    senderName: "Nguyen Van A",
    createdAt: "2023-10-15T08:30:00Z",
    status: "PENDING",
  },
  {
    id: "FB-1002",
    subject: "Unable to connect to eduroam in building C.",
    senderName: "Tran Thi B",
    createdAt: "2023-10-14T14:20:00Z",
    status: "IN_PROGRESS",
  },
  {
    id: "FB-1005",
    subject: "Internet connection drops every 10 minutes in the study hall.",
    senderName: "Le Van C",
    createdAt: "2023-10-12T09:15:00Z",
    status: "RESOLVED",
  },
  {
    id: "FB-1008",
    subject: "Network issue during online exam in lab room 4.",
    senderName: "Pham Thi D",
    createdAt: "2023-10-10T16:45:00Z",
    status: "REJECTED",
  },
];

// interface RelatedFeedbackTableProps {
//   feedbackId: string;
// }

export function RelatedFeedbackTable() {
  // {
  //   // feedbackId,
  // }: RelatedFeedbackTableProps,
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<string>("");

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(MOCK_RELATED_FEEDBACKS.map((fb) => fb.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkUpdate = () => {
    if (!bulkStatus) return;
    // Add toast or actual mutation logic here
    setSelectedIds(new Set());
    setBulkStatus("");
  };

  const isAllSelected =
    MOCK_RELATED_FEEDBACKS.length > 0 &&
    selectedIds.size === MOCK_RELATED_FEEDBACKS.length;
  const isIndeterminate =
    selectedIds.size > 0 && selectedIds.size < MOCK_RELATED_FEEDBACKS.length;

  if (MOCK_RELATED_FEEDBACKS.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 rounded-full bg-slate-50 p-4">
          <Inbox className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="mb-1 font-medium text-slate-900">
          No related feedbacks found
        </h3>
        <p className="max-w-sm text-sm text-slate-500">
          We couldn't find any feedbacks with similar context or semantic
          meaning to this one.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Bulk Action Toolbar */}
      {selectedIds.size > 0 && (
        <div className="animate-in slide-in-from-top-2 fade-in flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 duration-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">
              Đã chọn {selectedIds.size} góp ý
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Select value={bulkStatus} onValueChange={setBulkStatus}>
              <SelectTrigger className="h-9 w-40 border-slate-200 bg-white">
                <SelectValue placeholder="Update status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleBulkUpdate}
              disabled={!bulkStatus}
              size="sm"
              className="h-9 shadow-none"
            >
              Update Status
            </Button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="w-full overflow-auto">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow className="border-b border-slate-200 hover:bg-transparent">
              <TableHead className="w-[50px] px-4 py-4">
                <Checkbox
                  checked={
                    isAllSelected || (isIndeterminate ? "indeterminate" : false)
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="px-4 py-4 font-medium text-slate-900">
                Tiêu đề
              </TableHead>
              <TableHead className="px-4 py-4 font-medium text-slate-900">
                Người gửi
              </TableHead>
              <TableHead className="px-4 py-4 font-medium text-slate-900">
                Ngày gửi
              </TableHead>
              <TableHead className="px-4 py-4 text-right font-medium text-slate-900">
                Trạng thái
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_RELATED_FEEDBACKS.map((feedback) => (
              <TableRow
                key={feedback.id}
                className="group border-b border-slate-100 transition-colors hover:bg-slate-50/50"
                data-state={selectedIds.has(feedback.id) && "selected"}
              >
                <TableCell className="px-4 py-4">
                  <Checkbox
                    checked={selectedIds.has(feedback.id)}
                    onCheckedChange={(checked) =>
                      handleSelectOne(feedback.id, checked as boolean)
                    }
                    aria-label={`Select feedback ${feedback.id}`}
                  />
                </TableCell>
                <TableCell className="px-4 py-4">
                  <div className="flex items-start gap-2">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span
                      className="line-clamp-2 cursor-pointer font-medium text-slate-900 transition-colors hover:text-blue-600"
                      title={feedback.subject}
                    >
                      {feedback.subject}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4 whitespace-nowrap text-slate-600">
                  {feedback.senderName}
                </TableCell>
                <TableCell className="px-4 py-4 whitespace-nowrap text-slate-600">
                  {new Date(feedback.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="px-4 py-4 text-right">
                  <div className="flex justify-end">
                    <StatusBadge type={feedback.status} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

"use client";
import { Trash2, Upload } from "lucide-react";
import React, { useRef, useState } from "react";

interface FileInputProps {
  value?: File[];
  onChange: (files: File[]) => void;
}

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const FileTypeIcon = ({ fileName }: { fileName: string }) => {
  const getExtension = (name: string) => {
    return name.split(".").pop()?.toLowerCase() || "";
  };

  const extension = getExtension(fileName);

  const colorMap: { [key: string]: string } = {
    pdf: "bg-red-500/80",
    docx: "bg-blue-500/80",
    txt: "bg-gray-400/80",
    png: "bg-green-500/80",
    jpg: "bg-green-500/80",
    jpeg: "bg-green-500/80",
  };

  const bgColor = colorMap[extension] || "bg-gray-500";

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white ${bgColor}`}
    >
      <span className="text-xs font-semibold">
        {extension.toUpperCase().slice(0, 4)}
      </span>
    </div>
  );
};

export const FileInput = ({ value = [], onChange }: FileInputProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      onChange([...value, ...newFiles]);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      onChange([...value, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const triggerFileSelect = () => inputRef.current?.click();

  return (
    <div>
      <div
        className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"}`}
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
      >
        <Upload className="mb-3 h-10 w-10 text-gray-400" />
        <p className="mb-2 text-sm text-gray-500">
          <span className="font-semibold">Chọn tệp </span> hoặc{" "}
          <span className="font-semibold">kéo thả </span> vào đây để tải lên
        </p>
        <p className="text-xs text-gray-500">Kích thước tối đa: 100 MB</p>
        <button
          type="button"
          className="bg-neutral-light-primary-300 hover:bg-neutral-light-primary-400 mt-4 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-black/40"
        >
          Chọn tệp
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {value.length > 0 && (
        <div className="mt-4 space-y-2">
          {value.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border bg-white p-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <FileTypeIcon fileName={file.name} />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="cursor-pointer rounded-full p-1 text-red-500 hover:bg-red-100 hover:text-red-600"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

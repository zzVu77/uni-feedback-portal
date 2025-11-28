// src/components/department/DepartmentSkeleton.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export const DepartmentSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-10">
      <div className="px-4">
        <div className="flex w-full flex-col gap-4">
          {/* 1. Header Card Skeleton */}
          <Card className="border-none shadow-sm">
            <CardContent className="px-0 pt-0">
              {/* Top Section: Avatar & Title & Buttons */}
              <div className="flex flex-col items-end justify-between gap-4 bg-white px-6 pt-6 pb-6 lg:flex-row">
                <div className="flex w-full flex-col items-center gap-4 lg:flex-row lg:gap-8">
                  {/* Avatar Skeleton */}
                  <Skeleton className="h-24 w-24 shrink-0 rounded-2xl border-4 border-white sm:h-32 sm:w-32" />

                  {/* Title & Badge Skeleton */}
                  <div className="w-full space-y-3 text-center sm:mt-0 sm:text-left">
                    <Skeleton className="mx-auto h-8 w-3/4 sm:mx-0 sm:w-1/2" />{" "}
                    {/* Name */}
                    <div className="flex items-center justify-center gap-2 sm:justify-start">
                      <Skeleton className="h-5 w-24 rounded-full" />{" "}
                      {/* Status Badge */}
                      <Skeleton className="h-5 w-4 bg-gray-200" />{" "}
                      {/* Divider */}
                      <Skeleton className="h-5 w-20" /> {/* Count */}
                    </div>
                  </div>
                </div>

                {/* Actions Buttons Skeleton */}
                <div className="flex w-full flex-row items-center justify-center gap-2 lg:justify-end">
                  <Skeleton className="h-9 w-24 rounded-md" />{" "}
                  {/* Share Button */}
                  <Skeleton className="h-9 w-28 rounded-md" />{" "}
                  {/* Feedback Button */}
                </div>
              </div>

              <Separator className="my-2" />

              {/* Description Section Skeleton */}
              <div className="flex flex-col gap-4 px-6 py-2">
                <Skeleton className="h-7 w-48" />{" "}
                {/* Heading: Thông tin giới thiệu */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>

              <Separator className="my-2" />

              {/* Contact Information Skeleton */}
              <div className="flex flex-col gap-5 px-6 pt-2 pb-6">
                <Skeleton className="h-7 w-40" />{" "}
                {/* Heading: Thông tin liên hệ */}
                {/* Contact Items Loop */}
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />{" "}
                    {/* Icon Box */}
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-16" /> {/* Label */}
                      <Skeleton className="h-4 w-48 sm:w-64" /> {/* Content */}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 2. Announcement List Placeholder (Phần bên dưới) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {/* Title Section */}
              <div className="border-l-4 border-gray-200 pl-3">
                <Skeleton className="h-7 w-64" />
              </div>
            </div>

            {/* Fake Announcement Items */}
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex h-32 w-full flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-auto h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

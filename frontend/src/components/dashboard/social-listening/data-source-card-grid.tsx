import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { useDeleteSocialDataSource } from "@/hooks/queries/useSocialDataSourceQueries";
import { DataSourceStatus, SocialDataSource } from "@/types/social-data-source";
import { AlertCircle, ArrowRight, Ban, Trash2, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { EditDataSourceDialog } from "./edit-data-source-dialog";

export function DataSourceCardGrid({
  dataSources,
  isAdmin = false,
}: {
  dataSources: SocialDataSource[];
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { mutate: deleteDataSource, isPending: isDeleting } =
    useDeleteSocialDataSource();

  return (
    <div className="mt-8 grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {dataSources?.map((group) => {
        const isInactive = group.status === DataSourceStatus.INACTIVE;
        const isError = group.status === DataSourceStatus.ERROR;

        const cardBgClass = isInactive
          ? "border-amber-200 bg-amber-50 hover:shadow-amber-100"
          : isError
            ? "border-red-100 bg-red-50 hover:shadow-red-100"
            : "border-slate-100 bg-white hover:shadow-indigo-100";

        const iconBgClass = isInactive
          ? "bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white"
          : isError
            ? "bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white"
            : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white";

        const iconColorClass = isInactive
          ? "text-amber-300"
          : isError
            ? "text-red-400"
            : "text-indigo-600";

        return (
          <div
            key={group.id}
            onClick={() => {
              // Redirect to detail page
              router.push(`${pathname}/${group.id}`);
            }}
            className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${cardBgClass}`}
          >
            {isAdmin && (
              <div
                className="absolute top-4 right-4 z-20 flex gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <EditDataSourceDialog dataSource={group} />
                <ConfirmationDialog
                  title="Xóa nguồn dữ liệu?"
                  description={`Bạn có chắc chắn muốn xóa nhóm "${group.groupName}" không? Hành động này không thể hoàn tác.`}
                  onConfirm={() => deleteDataSource(group.id)}
                  isDestructive={true}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-red-100 bg-white/80 text-red-500 shadow-sm hover:bg-red-50 hover:text-red-600"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </ConfirmationDialog>
              </div>
            )}
            <div
              className={`absolute top-0 right-0 p-6 opacity-5 transition-opacity group-hover:opacity-10 ${iconColorClass}`}
            >
              <Users className="h-24 w-24" />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`inline-flex items-center justify-center rounded-2xl p-4 transition-colors ${iconBgClass}`}
                >
                  <Users className="h-6 w-6" />
                </div>
                {isInactive && (
                  <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                    <Ban className="mr-1 h-3 w-3" /> Tạm dừng
                  </span>
                )}
                {isError && (
                  <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                    <AlertCircle className="mr-1 h-3 w-3" /> Lỗi
                  </span>
                )}
                {!isInactive && !isError && (
                  <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    </span>
                    <span>Hoạt động</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="line-clamp-2 text-xl font-bold text-slate-900">
                  {group.groupName}
                </h3>
                <p className="line-clamp-2 text-sm text-slate-500">
                  {group.description}
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-6 flex items-center justify-between border-t border-slate-100/60 pt-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <Users className="h-3 w-3" />
                <span>Nền tảng: {group.platform}</span>
              </div>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors ${!isInactive && !isError ? "group-hover:bg-indigo-50 group-hover:text-indigo-600" : ""}`}
              >
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

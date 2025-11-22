export function TableSkeleton() {
  return (
    <div className="flex h-screen w-full flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
      <div className="h-10 w-full rounded-md border bg-gray-100/50" />
      <div className="h-full w-full rounded-md border bg-gray-100/50" />
    </div>
  );
}

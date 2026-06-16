export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] animate-pulse flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="h-[560px] rounded-[14px] border border-border bg-muted/40" />
        <div className="h-[560px] rounded-[14px] border border-border bg-muted/40" />
      </div>
      <div className="mt-6 h-[360px] rounded-[14px] border border-border bg-muted/40" />
    </div>
  );
}

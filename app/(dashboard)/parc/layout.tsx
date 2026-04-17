import { ParcSidebar } from "@/features/parc";

export default function ParcLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="-m-6 flex h-[calc(100%+48px)]">
      <ParcSidebar />
      <div className="flex-1 overflow-auto p-6">{children}</div>
    </div>
  );
}

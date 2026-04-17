import { Suspense } from "react";
import { getBornesWithLatestState } from "@/features/bornes";
import { BornesGrid } from "@/features/parc/components/bornes-grid";

export const revalidate = 30;

export default async function BornesPage() {
  const bornes = await getBornesWithLatestState();

  return (
    <Suspense fallback={null}>
      <BornesGrid bornes={bornes} />
    </Suspense>
  );
}

import { getKapsules, KapsulesList } from "@/features/kapsules";

export const revalidate = 0;

export default async function BornesPostalesPage() {
  const bornes = await getKapsules();
  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-6">
      <KapsulesList bornes={bornes} />
    </div>
  );
}

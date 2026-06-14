import { CommandesList, getAllCommandes } from "@/features/commandes";
import { getKapsules } from "@/features/kapsules";

export const revalidate = 0;

export default async function CommandesPage() {
  const [commandes, bornes] = await Promise.all([getAllCommandes(), getKapsules()]);
  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-6">
      <CommandesList rows={commandes} bornes={bornes} />
    </div>
  );
}

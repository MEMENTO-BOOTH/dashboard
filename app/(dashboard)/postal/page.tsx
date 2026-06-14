import { Card } from "@/components/ui/card";
import {
  CommandesATraiter,
  CommandesTable,
  getAllCommandes,
  getCommandesATraiter,
} from "@/features/commandes";
import { getKapsules, KapsulesList } from "@/features/kapsules";
import { getOrderCards } from "@/lib/stripe";

export const revalidate = 0;

const TABLE_ANCHOR = "commandes";

export default async function PostalDashboardPage() {
  const [bornes, aTraiter, commandes, cards] = await Promise.all([
    getKapsules(),
    getCommandesATraiter(),
    getAllCommandes(),
    getOrderCards(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:[&>*]:min-h-[560px]">
        <CommandesATraiter
          rows={aTraiter}
          total={aTraiter.length}
          bornes={bornes}
          seeAllHref={`#${TABLE_ANCHOR}`}
        />
        <KapsulesList bornes={bornes} />
      </div>

      <Card id={TABLE_ANCHOR} className="mt-6 w-full scroll-mt-6 py-0">
        <CommandesTable rows={commandes} cards={cards} />
      </Card>
    </div>
  );
}

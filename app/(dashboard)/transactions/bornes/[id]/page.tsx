import { Inbox } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { InitialsAvatar } from "@/components/ui/initials-avatar";
import { BorneTransactionsChart } from "@/features/transactions/_parts/borne-transactions-chart";
import { BorneVisitorsBreakdown } from "@/features/transactions/_parts/borne-visitors-breakdown";
import { getBorneTransactionsDetail } from "@/features/transactions/api";

export const revalidate = 60;

function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    timeZone: "Europe/Paris",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function BorneHeader({
  nom,
  logo,
  firstTransactionAt,
  daysSinceInstall,
  hasData,
}: {
  nom: string;
  logo: string | null;
  firstTransactionAt: string | null;
  daysSinceInstall: number;
  hasData: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      <InitialsAvatar name={nom} logoUrl={logo} className="size-12 rounded-full text-[16px]" />
      <div className="flex flex-col gap-0.5">
        <h1 className="text-[28px] font-semibold leading-9 text-foreground">{nom}</h1>
        <p className="text-[14px] font-normal leading-5 text-muted-foreground">
          {hasData && firstTransactionAt
            ? `1ʳᵉ transaction le ${formatFullDate(firstTransactionAt)} · ${daysSinceInstall} jour${daysSinceInstall > 1 ? "s" : ""} d'activité`
            : "Aucune transaction enregistrée pour cette borne."}
        </p>
      </div>
    </div>
  );
}

function EmptyTransactionsState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[14px] border border-border bg-card px-6 py-16 text-center shadow-sm">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Inbox className="size-5 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[16px] font-semibold leading-6 text-card-foreground">
          Pas encore de transaction
        </p>
        <p className="text-[14px] font-normal leading-5 text-muted-foreground">
          Cette borne n'a pas encore enregistré de paiement. Les chiffres apparaîtront ici dès le
          premier passage.
        </p>
      </div>
    </div>
  );
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getBorneTransactionsDetail(id);

  const months = data.byMonth.slice(-8);
  const weeks = data.byWeek.slice(-8);
  const hasData = data.countTotal > 0;

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-6 pt-4">
      <Breadcrumb items={[{ label: "finance", href: "/transactions" }, { label: data.nom_lieu }]} />

      <BorneHeader
        nom={data.nom_lieu}
        logo={data.logo_url}
        firstTransactionAt={data.firstTransactionAt}
        daysSinceInstall={data.daysSinceInstall}
        hasData={hasData}
      />

      {hasData ? (
        <>
          <BorneTransactionsChart
            months={months}
            weeks={weeks}
            trendWeek={data.trendWeek}
            trendMonth={data.trendMonth}
            lastWeekCa={data.lastWeekCa}
            lastMonthCa={data.lastMonthCa}
          />
          <BorneVisitorsBreakdown caTotal={data.caTotal} buckets={data.avgCaByPeriod} />
        </>
      ) : (
        <EmptyTransactionsState />
      )}
    </div>
  );
}

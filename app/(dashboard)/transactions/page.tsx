import { notFound } from "next/navigation";
import { getSessionUser } from "@/features/auth/session";
import {
  getBorneCARanking,
  getBornesForTransactions,
  getGlobalTransactionStats,
} from "@/features/transactions/api";
import { TransactionsPage } from "@/features/transactions/components/transactions-page";

export default async function Page() {
  const session = await getSessionUser();
  if (!session?.voirCa) notFound();

  const [bornes, ranking, stats] = await Promise.all([
    getBornesForTransactions(),
    getBorneCARanking(30),
    getGlobalTransactionStats(),
  ]);
  return <TransactionsPage bornes={bornes} ranking={ranking} stats={stats} />;
}

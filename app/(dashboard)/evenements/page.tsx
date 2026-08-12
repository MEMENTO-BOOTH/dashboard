import { notFound } from "next/navigation";
import { getSessionUser } from "@/features/auth/session";
import { getEvenements } from "@/features/evenements/api";
import { EvenementsPage } from "@/features/evenements/components/evenements-page";

export default async function Page() {
  const session = await getSessionUser();
  if (!session) notFound();

  const evenements = await getEvenements();
  return <EvenementsPage evenements={evenements} />;
}

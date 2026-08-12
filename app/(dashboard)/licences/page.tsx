import { notFound } from "next/navigation";
import { getSessionUser } from "@/features/auth/session";
import { listOverview } from "@/features/licences/api";
import { LicencesPage } from "@/features/licences/components/licences-page";

export default async function Page() {
  const session = await getSessionUser();
  if (!session) notFound();

  const overview = await listOverview();
  return <LicencesPage overview={overview} />;
}

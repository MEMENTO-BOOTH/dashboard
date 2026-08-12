import { notFound } from "next/navigation";
import { getSessionUser } from "@/features/auth/session";
import { listLicences } from "@/features/licences/api";
import { LicencesPage } from "@/features/licences/components/licences-page";

export default async function Page() {
  const session = await getSessionUser();
  if (!session) notFound();

  const licences = await listLicences();
  return <LicencesPage licences={licences} />;
}

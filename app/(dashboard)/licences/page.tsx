import { notFound } from "next/navigation";
import { getSessionUser } from "@/features/auth/session";
import { LicencesPage } from "@/features/licences/components/licences-page";

export default async function Page() {
  const session = await getSessionUser();
  if (!session) notFound();
  return <LicencesPage />;
}

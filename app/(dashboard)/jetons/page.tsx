import { notFound } from "next/navigation";
import { can } from "@/features/auth/permissions";
import { getSessionUser } from "@/features/auth/session";
import { getJetonsForUser, JetonsList } from "@/features/jetons";

export const revalidate = 30;

export default async function JetonsPage() {
  const session = await getSessionUser();
  if (!(session && can(session.permissions, "jetons.view"))) notFound();

  const jetons = await getJetonsForUser(session.id);
  return <JetonsList jetons={jetons} />;
}

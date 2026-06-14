import { notFound } from "next/navigation";
import { GalerieView, getGalerieByToken } from "@/features/galerie";

export const revalidate = 0;

export default async function GaleriePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const galerie = await getGalerieByToken(token);
  if (!galerie) notFound();
  return <GalerieView galerie={galerie} />;
}

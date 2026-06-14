import { getActiviteRecente } from "@/features/activite";
import { getCommandesATraiter } from "@/features/commandes";
import { getKapsules } from "@/features/kapsules";
import { PostalApercu } from "./_apercu";

export const revalidate = 0;

export default async function PostalApercuPage() {
  const [commandes, bornes, activite] = await Promise.all([
    getCommandesATraiter(),
    getKapsules(),
    getActiviteRecente(),
  ]);
  return <PostalApercu commandes={commandes} bornes={bornes} activite={activite} />;
}

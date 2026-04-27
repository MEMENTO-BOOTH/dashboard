import { GoogleCalendarConnectCard } from "@/features/google-calendar";
import { ConnectionsTable } from "../_parts/connections-table";
import { UserDangerZone } from "../_parts/user-danger-zone";
import { UserHeader } from "../_parts/user-header";
import type { Connection, UserDetail } from "../schemas";

export function UtilisateurDetailView({
  user,
  connections,
  googleConnected,
}: {
  user: UserDetail;
  connections: Connection[];
  googleConnected: boolean;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto w-full max-w-[900px]">
        <UserHeader user={user} />
      </div>
      <div className="mx-auto w-full max-w-[900px]">
        <ConnectionsTable connections={connections} />
      </div>
      <div className="mx-auto w-full max-w-[900px]">
        <GoogleCalendarConnectCard userId={user.id} connected={googleConnected} />
      </div>
      <UserDangerZone userId={user.id} userNom={user.nom} />
    </div>
  );
}

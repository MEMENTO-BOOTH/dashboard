import { notFound } from "next/navigation";
import { can } from "@/features/auth/permissions";
import { getSessionUser } from "@/features/auth/session";
import { getAssignees } from "@/features/dashboard/alerts/intervention-api";
import { IncidentsBoard } from "@/features/incidents";
import {
  getAllIncidents,
  getBornesForIncidents,
  getColumns,
  getIgnoredSignals,
  getNoteCounts,
  getSettings,
  getSignalRules,
} from "@/features/incidents/api";

export const revalidate = 30;

export default async function IncidentsPage() {
  const session = await getSessionUser();
  if (!(session && can(session.permissions, "incidents.view"))) notFound();

  const [incidents, columns, signalRules, settings, bornes, assignees, ignoredSignals, noteCounts] =
    await Promise.all([
      getAllIncidents(),
      getColumns(),
      getSignalRules(),
      getSettings(),
      getBornesForIncidents(),
      getAssignees(),
      getIgnoredSignals(),
      getNoteCounts(),
    ]);

  return (
    <IncidentsBoard
      incidents={incidents}
      columns={columns}
      signalRules={signalRules}
      settings={settings}
      bornes={bornes}
      assignees={assignees}
      ignoredSignals={[...ignoredSignals]}
      noteCounts={Object.fromEntries(noteCounts)}
      canManage={can(session.permissions, "incidents.manage")}
      canSettings={can(session.permissions, "incidents.settings")}
      currentUserId={session.id}
    />
  );
}

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EvenementSource, EvenementView } from "../schemas";

function typeLabel(type: "bar" | "event"): string {
  return type === "event" ? "Événement" : "Bar";
}

function sourceLabel(source: EvenementSource): string {
  return source === "client" ? "Client" : "Ta borne";
}

function formatDate(iso: string): string {
  return format(new Date(iso), "d MMM yyyy", { locale: fr });
}

export function EvenementsPage({ evenements }: { evenements: EvenementView[] }) {
  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-6 pt-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-semibold leading-8 text-foreground">Événements</h1>
        <p className="text-[14px] font-normal leading-5 text-muted-foreground">
          Tes bars et les événements de tes clients ({evenements.length}).
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Créé le</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {evenements.map((evenement) => (
            <TableRow key={`${evenement.source}-${evenement.id}`}>
              <TableCell className="font-medium">{evenement.name}</TableCell>
              <TableCell>{typeLabel(evenement.type)}</TableCell>
              <TableCell>{sourceLabel(evenement.source)}</TableCell>
              <TableCell>{evenement.client ?? "—"}</TableCell>
              <TableCell>{formatDate(evenement.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

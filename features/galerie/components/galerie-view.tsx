import { DownloadIcon, ImageOffIcon } from "lucide-react";
import Image from "next/image";
import type { Galerie } from "../schemas";

const EVENT_LABELS: Record<string, string> = {
  mariage: "Mariage",
  anniversaire: "Anniversaire",
  bapteme: "Baptême",
  soiree: "Soirée",
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function GalerieView({ galerie }: { galerie: Galerie }) {
  const label = EVENT_LABELS[galerie.eventType] ?? galerie.eventType;
  const count = galerie.photos.length;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:py-16">
      <header className="flex flex-col gap-2">
        <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Kapsule
        </span>
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">Vos photos</h1>
        <p className="text-muted-foreground">
          {label} · {formatDate(galerie.eventDate)} · {count} photo{count > 1 ? "s" : ""}
        </p>
      </header>

      {count === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[14px] border border-dashed border-border py-20 text-center">
          <ImageOffIcon className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Vos photos ne sont pas encore disponibles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {galerie.photos.map((photo) => (
            <figure
              key={photo.fileName}
              className="group relative overflow-hidden rounded-[14px] border border-border bg-muted"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={photo.downloadUrl}
                  alt={photo.fileName}
                  fill
                  unoptimized
                  sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>
              <a
                href={photo.downloadUrl}
                download={photo.fileName}
                className="absolute inset-x-2 bottom-2 flex items-center justify-center gap-2 rounded-[10px] bg-background/90 py-2 text-sm font-medium text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
              >
                <DownloadIcon className="size-4" />
                Télécharger
              </a>
            </figure>
          ))}
        </div>
      )}
    </main>
  );
}

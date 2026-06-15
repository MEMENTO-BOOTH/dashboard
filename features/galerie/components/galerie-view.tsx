import { DownloadIcon } from "lucide-react";
import Image from "next/image";
import type { Galerie } from "../schemas";
import { DownloadAllButton } from "./download-all-button";

const EVENT_LABELS: Record<string, string> = {
  mariage: "Mariage",
  anniversaire: "Anniversaire",
  bapteme: "Baptême",
  soiree: "Soirée",
};

const ROTATIONS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function GalerieView({ galerie }: { galerie: Galerie }) {
  const label = EVENT_LABELS[galerie.eventType] ?? galerie.eventType;
  const count = galerie.photos.length;

  return (
    <main className="relative mx-auto w-full max-w-6xl px-5 pt-7 pb-24">
      <Image
        src="/stickers/portrait.svg"
        alt=""
        aria-hidden
        width={176}
        height={176}
        unoptimized
        className="pointer-events-none absolute top-2 right-3 z-20 h-auto w-20 rotate-12 sm:w-28"
      />
      <Image
        src="/brand/kapsule-logo-blue.svg"
        alt="Kapsule"
        width={300}
        height={88}
        className="h-20 w-auto"
      />

      <header className="mx-auto flex max-w-2xl flex-col items-center gap-4 py-10 text-center">
        <h1
          className="text-5xl font-black tracking-tight uppercase sm:text-7xl"
          style={{ fontFamily: "var(--font-loos-wide), sans-serif" }}
        >
          Vos photos
        </h1>
        <p className="text-base font-medium sm:text-lg">
          {label} · {formatDate(galerie.eventDate)} ·{" "}
          <span className="text-[#ff5400]">
            {count} photo{count > 1 ? "s" : ""}
          </span>
        </p>
        {count > 0 ? <DownloadAllButton photos={galerie.photos} /> : null}
      </header>

      {count === 0 ? (
        <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-4 rounded-[14px] border-[3px] border-dashed border-[#00109f]/40 bg-white/60 px-6 py-16 text-center">
          <p className="font-medium">Tes photos arrivent bientôt — reviens juste après l'événement !</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 md:gap-7">
          {galerie.photos.map((photo, i) => (
            <a
              key={photo.fileName}
              href={photo.downloadUrl}
              download={photo.fileName}
              className={`group block rounded-[8px] border-[3px] border-[#00109f] bg-white p-3 shadow-[6px_6px_0_0_#00109f] transition-all duration-200 hover:-translate-y-1 hover:rotate-0 hover:shadow-[9px_9px_0_0_#ff5400] ${ROTATIONS[i % ROTATIONS.length]}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-[#fdf2da]">
                <Image
                  src={photo.downloadUrl}
                  alt={`Souvenir ${i + 1}`}
                  fill
                  unoptimized
                  sizes="(min-width:768px) 25vw, (min-width:640px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-center gap-2 pt-3 pb-1 text-sm font-bold tracking-wide uppercase group-hover:text-[#ff5400]">
                <DownloadIcon className="size-4" />
                Télécharger
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}

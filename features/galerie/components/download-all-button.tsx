"use client";

import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import type { GaleriePhoto } from "../schemas";

type DirectoryPicker = () => Promise<FileSystemDirectoryHandle>;

function getDirectoryPicker(): DirectoryPicker | null {
  const picker = (window as unknown as { showDirectoryPicker?: DirectoryPicker })
    .showDirectoryPicker;
  return typeof picker === "function" ? picker : null;
}

async function blobOf(photo: GaleriePhoto): Promise<Blob> {
  const res = await fetch(photo.downloadUrl);
  return res.blob();
}

async function saveToFolder(photos: GaleriePhoto[], picker: DirectoryPicker): Promise<void> {
  const dir = await picker();
  for (const photo of photos) {
    const blob = await blobOf(photo);
    const handle = await dir.getFileHandle(photo.fileName, { create: true });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
  }
}

async function downloadEach(photos: GaleriePhoto[]): Promise<void> {
  for (const photo of photos) {
    try {
      const blob = await blobOf(photo);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = photo.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(photo.downloadUrl, "_blank", "noopener");
    }
  }
}

export function DownloadAllButton({ photos }: { photos: GaleriePhoto[] }) {
  const [busy, setBusy] = useState(false);

  function handleClick() {
    setBusy(true);
    (async () => {
      const picker = getDirectoryPicker();
      try {
        if (picker) {
          await saveToFolder(photos, picker);
        } else {
          await downloadEach(photos);
        }
      } catch {
        await downloadEach(photos);
      }
      setBusy(false);
    })();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className="inline-flex items-center gap-2 rounded-full bg-[#00109f] px-7 py-3 text-sm font-bold tracking-wide text-[#fdf2da] uppercase transition-colors hover:bg-[#ff5400] disabled:opacity-60"
      style={{ fontFamily: "var(--font-loos-wide), sans-serif" }}
    >
      <DownloadIcon className="size-4" />
      {busy ? "Téléchargement…" : `Tout télécharger (${photos.length})`}
    </button>
  );
}

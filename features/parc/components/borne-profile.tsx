"use client";

import { Camera, Check, Loader2, Store } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { updateBorneProfile, uploadBorneLogo } from "@/features/bornes/actions";
import type { BorneDetail } from "@/features/bornes/schemas";

function FormRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 py-5 md:flex-row md:items-start md:gap-8">
      <div className="flex shrink-0 flex-col gap-1 md:w-[200px]">
        <p className="text-[14px] font-normal leading-5 text-foreground">{label}</p>
        {description ? (
          <p className="text-[13px] font-normal leading-5 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="w-full max-w-[400px]">{children}</div>
    </div>
  );
}

export function BorneProfile({
  borne,
  canEdit = false,
}: {
  borne: BorneDetail;
  canEdit?: boolean;
}) {
  const [nom, setNom] = useState(borne.nom_lieu);
  const [ville, setVille] = useState(borne.ville);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(borne.logo_url);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);

  const isDirty = nom !== borne.nom_lieu || ville !== borne.ville;

  function onCancel() {
    setNom(borne.nom_lieu);
    setVille(borne.ville);
  }

  function onSave() {
    startTransition(async () => {
      await updateBorneProfile(borne.id, { nom_lieu: nom, ville, adresse: borne.adresse ?? "" });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setIsUploading(true);

    const fd = new FormData();
    fd.append("file", file);

    startTransition(async () => {
      try {
        const url = await uploadBorneLogo(borne.id, fd);
        setAvatarPreview(url);
      } catch {
        setAvatarPreview(borne.logo_url);
      } finally {
        setIsUploading(false);
      }
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8 pt-12">
      <h2 className="text-[24px] font-semibold leading-8 text-foreground">Profil</h2>

      <FormRow label="Photo" description="Logo ou photo du bar.">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={!canEdit || isUploading}
            className="group relative flex size-16 shrink-0 items-center justify-center overflow-clip rounded-full bg-muted"
          >
            {avatarPreview ? (
              // biome-ignore lint/performance/noImgElement: avatar preview
              <img
                src={avatarPreview}
                alt=""
                className="absolute inset-0 size-full object-cover transition-opacity group-hover:opacity-30"
              />
            ) : (
              <Store className="size-7 text-muted-foreground transition-opacity group-hover:opacity-30" />
            )}
            {isUploading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
                <Loader2 className="size-5 animate-spin text-foreground" />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="size-5 text-foreground" />
              </div>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
          {canEdit ? (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={isUploading}
              className="text-[14px] font-medium leading-5 text-foreground underline underline-offset-4 hover:text-primary"
            >
              Changer la photo
            </button>
          ) : null}
        </div>
      </FormRow>

      <FormRow label="Nom du bar" description="Affiché sur le dashboard.">
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          readOnly={!canEdit}
          disabled={!canEdit}
          className="h-9 w-full rounded-[8px] border border-input bg-background px-3 text-[14px] font-normal leading-5 text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
      </FormRow>

      <FormRow label="Ville">
        <input
          type="text"
          value={ville}
          onChange={(e) => setVille(e.target.value)}
          readOnly={!canEdit}
          disabled={!canEdit}
          className="h-9 w-full rounded-[8px] border border-input bg-background px-3 text-[14px] font-normal leading-5 text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
      </FormRow>

      {canEdit ? (
      <div className="flex justify-end gap-3">
        {isDirty ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="h-9 rounded-[8px] border border-border bg-background px-4 text-[14px] font-medium leading-5 text-foreground shadow-xs transition-colors hover:bg-accent"
          >
            Annuler
          </button>
        ) : null}
        <button
          type="button"
          onClick={onSave}
          disabled={!isDirty || isPending}
          className={`flex h-9 items-center gap-2 rounded-[8px] px-4 text-[14px] font-medium leading-5 transition-colors ${
            isDirty
              ? "bg-foreground text-background hover:bg-foreground/90"
              : "cursor-not-allowed bg-muted text-muted-foreground"
          }`}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : saved ? (
            <Check className="size-4" />
          ) : null}
          {saved ? "Enregistré" : "Enregistrer"}
        </button>
      </div>
      ) : null}

      <div className="h-px bg-border" />
    </div>
  );
}

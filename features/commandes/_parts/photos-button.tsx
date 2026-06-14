"use client";

import { Copy, Send, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogRoot, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function PhotosButton({ token }: { token: string | null }) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState(process.env.NEXT_PUBLIC_SITE_URL ?? "");
  useEffect(() => {
    if (!origin) setOrigin(window.location.origin);
  }, [origin]);
  const link = token && origin ? `${origin}/photos/${token}` : null;

  async function copy() {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
  }

  async function share() {
    if (!link) return;
    if (navigator.share) {
      await navigator.share({ title: "Galerie photos Kapsule", url: link }).catch(() => undefined);
    } else {
      await copy();
    }
  }

  return (
    <DialogRoot onOpenChange={() => setCopied(false)}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-auto py-2 shadow-none"
          iconStart={<Send />}
        >
          Envoyer
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[520px] rounded-[10px] p-6">
        <div className="flex flex-col gap-6">
          <DialogTitle className="text-lg font-semibold leading-7 text-card-foreground">
            Lien galerie client
          </DialogTitle>

          {link ? (
            <>
              <div className="flex items-center gap-2">
                <Input readOnly value={link} wrapperClassName="min-w-0 flex-1" />
                <Button
                  variant="outline"
                  size="md"
                  className="shrink-0 rounded-[10px] shadow-none"
                  iconStart={<Copy />}
                  onClick={copy}
                >
                  {copied ? "Copié" : "Copier"}
                </Button>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  className="rounded-[10px]"
                  iconStart={<Share2 />}
                  onClick={share}
                >
                  Partager
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Pas encore de lien — les photos ne sont pas encore remontées.
            </p>
          )}
        </div>
      </DialogContent>
    </DialogRoot>
  );
}

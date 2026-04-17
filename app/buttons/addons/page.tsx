import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  ActivateButton,
  CancelButton,
  CopyButton,
  ExploreButton,
  FacebookButton,
  GithubButton,
  GoogleButton,
  LikeButton,
  LivePreviewButton,
  MergePullRequestButton,
  MessagesButton,
  PinnedButton,
  ProBadgeButton,
  ShareButton,
  SignInButton,
  SpinButton,
  TrashButton,
  TwitterButton,
  UpDownButton,
  UploadImageButton,
  VolumeButton,
} from "@/components/ui/buttons";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-wrap items-center gap-[30px] rounded-[12px] border border-dashed border-[rgba(23,23,23,0.2)] p-[30px]">
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="w-full text-[15px] font-medium leading-5 text-muted-foreground">{children}</p>
  );
}

function AddonCard({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex min-h-[48px] items-center">{children}</div>
      <code className="font-mono text-[11px] text-muted-foreground">{name}</code>
    </div>
  );
}

export default function AddonsPage() {
  return (
    <main className="mx-auto max-w-[1240px] space-y-[60px] px-10 py-12">
      <header className="space-y-2">
        <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
          shadcn studio · Figma Pro v5
        </p>
        <h1 className="font-heading text-4xl font-bold tracking-tight">Button addons</h1>
        <p className="text-muted-foreground max-w-2xl text-sm">
          Les 23 addons spéciaux du kit Figma — Loading, Up/Down, Volume, Sign in, Pinned, Merge,
          Upload, Like, Google, X, Facebook, GitHub, Messages, Live preview, Copy, Trash, Cancel,
          Gradient Explore, Pro badge, Share, Spin, Activate.
        </p>
        <nav className="flex gap-3 pt-4">
          <a href="/buttons" className={buttonVariants({ variant: "outline", size: "sm" })}>
            ← Buttons
          </a>
          <a href="/" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Tokens
          </a>
        </nav>
      </header>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Utility</h2>
        <Frame>
          <Label>Loading, counters, split actions</Label>
          <AddonCard name="Loading">
            <Button loading iconStart={<Plus />}>
              Button
            </Button>
          </AddonCard>
          <AddonCard name="Up Down (square)">
            <UpDownButton shape="square" />
          </AddonCard>
          <AddonCard name="Up Down (round)">
            <UpDownButton shape="round" />
          </AddonCard>
          <AddonCard name="Volume">
            <VolumeButton />
          </AddonCard>
          <AddonCard name="Sign In">
            <SignInButton />
          </AddonCard>
          <AddonCard name="Pinned">
            <PinnedButton />
          </AddonCard>
          <AddonCard name="Merge PR">
            <MergePullRequestButton />
          </AddonCard>
          <AddonCard name="Upload Image">
            <UploadImageButton />
          </AddonCard>
          <AddonCard name="Like">
            <LikeButton count={5} />
          </AddonCard>
        </Frame>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Social auth</h2>
        <Frame>
          <Label>Logos brand + border exact</Label>
          <AddonCard name="Google">
            <GoogleButton />
          </AddonCard>
          <AddonCard name="X (Twitter)">
            <TwitterButton />
          </AddonCard>
          <AddonCard name="Facebook">
            <FacebookButton />
          </AddonCard>
          <AddonCard name="GitHub">
            <GithubButton />
          </AddonCard>
        </Frame>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Feature</h2>
        <Frame>
          <Label>States &amp; call-to-action</Label>
          <AddonCard name="Messages">
            <MessagesButton />
          </AddonCard>
          <AddonCard name="Live preview">
            <LivePreviewButton />
          </AddonCard>
          <AddonCard name="Copy">
            <CopyButton />
          </AddonCard>
          <AddonCard name="Trash">
            <TrashButton />
          </AddonCard>
          <AddonCard name="Cancel">
            <CancelButton />
          </AddonCard>
          <AddonCard name="Gradient Explore">
            <ExploreButton />
          </AddonCard>
          <AddonCard name="Pro badge">
            <ProBadgeButton />
          </AddonCard>
          <AddonCard name="Share">
            <ShareButton />
          </AddonCard>
          <AddonCard name="Spin">
            <SpinButton />
          </AddonCard>
          <AddonCard name="Activate">
            <ActivateButton />
          </AddonCard>
        </Frame>
      </section>
    </main>
  );
}

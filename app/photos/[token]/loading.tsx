import Image from "next/image";

export default function Loading() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col items-center justify-center gap-5 px-5 text-center">
      <Image
        src="/brand/kapsule-logo-blue.svg"
        alt="Kapsule"
        width={240}
        height={70}
        className="h-16 w-auto animate-pulse"
      />
      <p
        className="text-lg font-medium tracking-wide uppercase"
        style={{ fontFamily: "var(--font-loos-wide), sans-serif" }}
      >
        Chargement de vos photos…
      </p>
    </main>
  );
}

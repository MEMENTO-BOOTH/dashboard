import Link from "next/link";

// Figma 10365:74026 — 404 page pixel-perfect
// Layout: 2 columns, left white + right black (rounded-[14px])
// Left: "Whoops!" 48px Bold + "Something went wrong" 24px SemiBold + description 16px Regular muted + button
// Right: black bg, "404" huge white text + astronaut illustration

export default function NotFound() {
  return (
    <div className="flex h-screen w-full items-stretch bg-background">
      <div className="flex flex-1 flex-col items-center justify-center px-8">
        <div className="flex max-w-[656px] flex-col items-center gap-6 text-center">
          <h1 className="text-[48px] font-bold leading-none text-foreground">Whoops!</h1>
          <div className="flex flex-col gap-3">
            <p className="text-[24px] font-semibold leading-8 text-foreground">
              Something went wrong
            </p>
            <p className="text-[16px] font-normal leading-6 text-muted-foreground">
              The page you're looking for isn't found,
              <br />
              we suggest you back to home.
            </p>
          </div>
          <Link
            href="/"
            className="flex h-10 items-center justify-center rounded-[10px] bg-foreground px-6 text-[14px] font-medium leading-5 text-background transition-colors hover:bg-foreground/90"
          >
            Back to home page
          </Link>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-clip rounded-[14px] bg-foreground m-2">
        {/* biome-ignore lint/performance/noImgElement: static asset */}
        <img
          src="/404-astronaut.svg"
          alt="404"
          className="pointer-events-none max-h-[80%] max-w-[80%] object-contain"
        />
      </div>
    </div>
  );
}

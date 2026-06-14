import { PhotoStrip } from "@/components/shared/photo-strip";

export default function TemplatesPage() {
  return (
    <div className="flex min-h-full items-center justify-center py-16">
      <div className="relative flex items-start" style={{ width: 420, height: 640 }}>
        {/* Strip gauche — droit */}
        <div className="absolute left-0 top-10 z-10 drop-shadow-xl">
          <PhotoStrip scale={1} />
        </div>

        {/* Strip droite — incliné ~20° sens horaire */}
        <div
          className="absolute right-0 top-0 z-0 drop-shadow-xl"
          style={{ transform: "rotate(20deg)", transformOrigin: "top center" }}
        >
          <PhotoStrip scale={1} logoSrc="/kapsule-logo-sm.svg" />
        </div>
      </div>
    </div>
  );
}

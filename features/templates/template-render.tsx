import Image from "next/image";
import type { CSSProperties } from "react";
import type { TemplateElement, TemplateFull } from "./schemas";

const ALIGN: Record<string, string> = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
};

function box(el: TemplateElement, w: number, h: number): CSSProperties {
  return {
    position: "absolute",
    left: `${(el.x / w) * 100}%`,
    top: `${(el.y / h) * 100}%`,
    width: `${(el.width / w) * 100}%`,
    height: `${(el.height / h) * 100}%`,
    transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
    zIndex: el.zIndex ?? 0,
  };
}

function Background({ el }: { el: TemplateElement }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: el.zIndex ?? 0, background: el.color }}>
      {el.imageUrl ? (
        <Image src={el.imageUrl} alt="" fill unoptimized sizes="340px" className="object-cover" />
      ) : null}
    </div>
  );
}

function ImageEl({ el, style }: { el: TemplateElement; style: CSSProperties }) {
  if (!el.imageUrl) return <div style={style} className="bg-muted" />;
  return (
    <div style={style}>
      <Image src={el.imageUrl} alt="" fill unoptimized sizes="340px" className="object-contain" />
    </div>
  );
}

function Shape({ el, style }: { el: TemplateElement; style: CSSProperties }) {
  return (
    <div
      style={{
        ...style,
        background: el.fill,
        border: el.stroke ? `1px solid ${el.stroke}` : undefined,
        borderRadius: el.shape === "circle" ? "9999px" : el.cornerRadius,
      }}
    />
  );
}

function TextEl({ el, style, w }: { el: TemplateElement; style: CSSProperties; w: number }) {
  const text =
    el.type === "text" ? (el.content ?? "") : el.type === "code-slot" ? "ABCD" : "12/06/26";
  return (
    <div
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: ALIGN[el.textAlign ?? "left"] ?? "flex-start",
        color: el.color,
        fontFamily: el.fontFamily,
        fontWeight: el.fontWeight === "bold" ? 700 : 400,
        fontStyle: el.fontStyle === "italic" ? "italic" : "normal",
        fontSize: el.fontSize ? `${(el.fontSize / w) * 100}cqw` : undefined,
        lineHeight: 1.1,
        overflow: "hidden",
      }}
    >
      {text}
    </div>
  );
}

function PhotoSlot({ el, style }: { el: TemplateElement; style: CSSProperties }) {
  if (!el.imageUrl) return <div style={style} className="bg-white" />;
  return (
    <div style={style} className="overflow-hidden bg-white">
      <Image src={el.imageUrl} alt="" fill unoptimized sizes="340px" className="object-cover" />
    </div>
  );
}

function ElementView({ el, w, h }: { el: TemplateElement; w: number; h: number }) {
  if (el.visible === false) return null;
  const style = box(el, w, h);
  if (el.type === "background") return <Background el={el} />;
  if (el.type === "image") return <ImageEl el={el} style={style} />;
  if (el.type === "shape") return <Shape el={el} style={style} />;
  if (el.type === "photo-slot") return <PhotoSlot el={el} style={style} />;
  return <TextEl el={el} style={style} w={w} />;
}

export function TemplateRender({
  template,
  className,
}: {
  template: TemplateFull;
  className?: string;
}) {
  const elements = [...template.elements].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));
  return (
    <div
      className={`relative overflow-hidden border border-border ${className ?? "h-64"}`}
      style={{ aspectRatio: `${template.width} / ${template.height}`, containerType: "size" }}
    >
      {elements.map((el) => (
        <ElementView
          key={el.id ?? `${el.type}-${el.x}-${el.y}`}
          el={el}
          w={template.width}
          h={template.height}
        />
      ))}
    </div>
  );
}

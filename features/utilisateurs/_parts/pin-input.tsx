"use client";

import { useRef } from "react";

const DIGITS = 6;

export function PinInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const chars = Array.from({ length: DIGITS }, (_, i) => value[i] ?? "");

  function setDigit(i: number, digit: string) {
    const cleaned = digit.replace(/\D/g, "").slice(0, 1);
    const next = chars.map((c, idx) => (idx === i ? cleaned : c));
    const joined = next.join("").replace(/\s+$/, "");
    onChange(joined);
    if (cleaned && i < DIGITS - 1) refs.current[i + 1]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>, i: number) {
    if (e.key === "Backspace" && !chars[i] && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowLeft" && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < DIGITS - 1) {
      refs.current[i + 1]?.focus();
    }
  }

  function onPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, DIGITS);
    if (!pasted) return;
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, DIGITS - 1);
    refs.current[focusIdx]?.focus();
  }

  return (
    <div className="flex items-start gap-2">
      {chars.map((c, i) => (
        <input
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length OTP
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={c}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(e, i)}
          onPaste={onPaste}
          style={{ width: 44, height: 44 }}
          className="rounded-[8px] border border-input bg-background text-center text-[16px] font-medium leading-5 text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
          aria-label={`Chiffre ${i + 1}`}
        />
      ))}
    </div>
  );
}

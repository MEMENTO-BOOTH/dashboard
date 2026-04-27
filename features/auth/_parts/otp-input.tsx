"use client";

import { useRef, useState } from "react";

export function OtpInput({
  length = 6,
  name,
  value,
  onChange,
}: {
  length?: number;
  name: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const digits = value.padEnd(length, " ").slice(0, length).split("");

  const focus = (idx: number) => {
    const el = inputsRef.current[idx];
    if (el) el.focus();
  };

  const handleChange = (idx: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = value.split("");
    while (next.length < length) next.push("");
    next[idx] = digit;
    const joined = next.join("").slice(0, length).replace(/\s/g, "");
    onChange(joined);
    if (digit && idx < length - 1) focus(idx + 1);
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[idx]?.trim() && idx > 0) {
      e.preventDefault();
      const next = value.split("");
      next[idx - 1] = "";
      onChange(next.join(""));
      focus(idx - 1);
    }
    if (e.key === "ArrowLeft" && idx > 0) focus(idx - 1);
    if (e.key === "ArrowRight" && idx < length - 1) focus(idx + 1);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (paste) {
      e.preventDefault();
      onChange(paste);
      focus(Math.min(paste.length, length - 1));
    }
  };

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <input type="hidden" name={name} value={value} />
      {Array.from({ length }).map((_, idx) => {
        const digit = digits[idx]?.trim() ?? "";
        const isFocused = focusedIndex === idx;
        return (
          <input
            key={`otp-${idx.toString()}`}
            ref={(el) => {
              inputsRef.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            aria-label={`Chiffre ${idx + 1}`}
            onFocus={() => setFocusedIndex(idx)}
            onBlur={() => setFocusedIndex(null)}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            className={`h-12 w-full min-w-0 flex-1 rounded-[8px] border bg-background text-center text-xl font-semibold leading-7 text-foreground shadow-xs outline-none transition-colors ${
              isFocused ? "border-ring shadow-[0_0_0_3px_rgb(161_161_170/0.5)]" : "border-input"
            }`}
          />
        );
      })}
    </div>
  );
}

"use client";

import { Calculator, Calendar, CreditCard, Settings, Smile, User, X } from "lucide-react";
import { useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { DialogClose, DialogContent, DialogRoot, DialogTitle } from "@/components/ui/dialog";

// Figma 39555:118990 — Command palette (verbatim):
// Suggestions: Calendar, Search Emoji, Calculator
// Setting:     Profile, Billing, Setting

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <Command>
          <CommandInput
            placeholder="Type a command  or search..."
            trailing={
              <DialogClose
                aria-label="Close"
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </DialogClose>
            }
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <Calendar className="size-4 shrink-0" aria-hidden />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <Smile className="size-4 shrink-0" aria-hidden />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem>
                <Calculator className="size-4 shrink-0" aria-hidden />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Setting">
              <CommandItem>
                <User className="size-4 shrink-0" aria-hidden />
                <span>Profile</span>
              </CommandItem>
              <CommandItem>
                <CreditCard className="size-4 shrink-0" aria-hidden />
                <span>Billing</span>
              </CommandItem>
              <CommandItem>
                <Settings className="size-4 shrink-0" aria-hidden />
                <span>Setting</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </DialogRoot>
  );
}

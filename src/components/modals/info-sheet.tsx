"use client";

import type { ReactNode } from "react";
import { SheetShell } from "./sheet-shell";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function InfoSheet({ open, title, onClose, children }: Props) {
  return (
    <SheetShell open={open} title={title} onClose={onClose}>
      {children}
    </SheetShell>
  );
}

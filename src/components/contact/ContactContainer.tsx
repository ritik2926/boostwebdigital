import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * This page's own container width (1200px), per its explicit spec — narrower
 * than the sitewide `--container-page` token (1400-1800px), so it gets its
 * own small wrapper here rather than a new Container `size` variant used
 * nowhere else.
 */
export function ContactContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-300 px-6 md:px-10 lg:px-16", className)}>{children}</div>;
}

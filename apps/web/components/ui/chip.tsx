import { cn } from "@/lib/utils";

export const Chip = ({ label, className }: { label: string; className?: string }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-md border border-line bg-chip px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted",
      className
    )}
  >
    {label}
  </span>
);

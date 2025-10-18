import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date?: string | null) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "long",
  }).format(new Date(date));
};

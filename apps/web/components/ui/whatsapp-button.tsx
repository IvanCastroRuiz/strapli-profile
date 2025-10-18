import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const WhatsappButton = ({ title, url, className }: { title: string; url: string; className?: string }) => {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "";
  const message = encodeURIComponent(`Hola, quiero cotizar: ${title} — ${url}`);
  const href = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Solicitar cotización por WhatsApp"
      className={cn(
        "inline-flex items-center gap-3 rounded-md bg-accent px-6 py-3 text-lg font-semibold text-bg transition duration-200 ease-in-out hover:bg-accent-2",
        className
      )}
    >
      <MessageCircle className="h-5 w-5" />
      Consultar por WhatsApp
    </a>
  );
};

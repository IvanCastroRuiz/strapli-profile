import Link from "next/link";
import { getAjustes } from "@/lib/api";
import { playfair } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export const Footer = async () => {
  const ajustes = await getAjustes();

  return (
    <footer className="border-t border-line/60 bg-surface/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className={cn("text-lg font-semibold text-text", playfair.className)}>Editorial Modern</p>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Escenografías contemporáneas con alma editorial. Diseños curados para eventos memorables y experiencias inmersivas.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted">
          <Link href="/categorias" className="hover:text-text">
            Explorar categorías
          </Link>
          <Link href="/buscar" className="hover:text-text">
            Buscar diseños
          </Link>
          {ajustes?.cta_whatsapp ? (
            <a
              href={`https://wa.me/${ajustes.cta_whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent hover:text-accent-2"
            >
              Agenda una asesoría
            </a>
          ) : null}
        </div>
        <div className="flex gap-4 text-sm text-muted">
          {ajustes?.redes?.instagram && (
            <a href={ajustes.redes.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-text">
              Instagram
            </a>
          )}
          {ajustes?.redes?.pinterest && (
            <a href={ajustes.redes.pinterest} target="_blank" rel="noopener noreferrer" className="hover:text-text">
              Pinterest
            </a>
          )}
        </div>
      </div>
      <p className="border-t border-line/50 py-4 text-center text-xs uppercase tracking-[0.3em] text-muted">
        © {new Date().getFullYear()} Editorial Modern · Todos los derechos reservados
      </p>
    </footer>
  );
};

import Link from "next/link";
import { Menu } from "lucide-react";
import { getCategorias } from "@/lib/api";
import { playfair } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export const Navbar = async () => {
  const categorias = await getCategorias();

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className={cn("text-2xl font-semibold text-text", playfair.className)}>
          Editorial Modern
        </Link>
        <nav className="hidden gap-6 text-sm uppercase tracking-[0.2em] text-muted md:flex">
          <Link href="/categorias" className="hover:text-text">
            Categorías
          </Link>
          <Link href="/buscar" className="hover:text-text">
            Buscar
          </Link>
          {categorias
            .filter((categoria) => categoria.destacada)
            .slice(0, 3)
            .map((categoria) => (
              <Link key={categoria.id} href={`/categorias/${categoria.slug}`} className="hover:text-text">
                {categoria.nombre}
              </Link>
            ))}
        </nav>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-line text-muted transition hover:border-accent hover:text-text md:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

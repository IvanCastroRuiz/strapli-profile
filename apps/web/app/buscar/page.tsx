import type { Metadata } from "next";
import { SearchInput } from "@/components/ui/search-input";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Encuentra diseños editoriales por título, descripción o tags."
};

export default function BuscarPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-muted">Explorar</p>
        <h1 className="text-4xl font-semibold tracking-tight">Buscar diseños</h1>
        <p className="max-w-2xl text-lg text-muted">
          Escribe palabras clave para descubrir conceptos editoriales, categorías y tags dorados.
        </p>
      </header>
      <SearchInput className="max-w-2xl" />
    </div>
  );
}

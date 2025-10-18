import type { Metadata } from "next";
import { getCategorias } from "@/lib/api";
import { CategoryCard } from "@/components/cards/category-card";

export const metadata: Metadata = {
  title: "Categorías",
  description: "Explora todas las categorías editoriales del portafolio."
};

export default async function CategoriasPage() {
  const categorias = await getCategorias();

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-muted">Explorar</p>
        <h1 className="text-4xl font-semibold tracking-tight">Categorías editoriales</h1>
        <p className="max-w-2xl text-lg text-muted">
          Navega por universos visuales: bodas contemporáneas, quinceañeros luminosos, montajes infantiles y escenografías conceptuales.
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2">
        {categorias.map((categoria) => (
          <CategoryCard key={categoria.id} categoria={categoria} />
        ))}
      </div>
    </div>
  );
}

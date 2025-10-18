import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategorias, getDisenos } from "@/lib/api";
import { CategoryDesigns } from "@/components/sections/category-designs";

interface CategoryPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categorias = await getCategorias();
  const categoria = categorias.find((item) => item.slug === params.slug);
  if (!categoria) {
    return { title: "Categoría no encontrada" };
  }

  return {
    title: categoria.nombre,
    description: categoria.descripcion ?? `Diseños editoriales en ${categoria.nombre}`,
    openGraph: {
      title: categoria.nombre,
      description: categoria.descripcion ?? `Diseños editoriales en ${categoria.nombre}`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/categorias/${categoria.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categorias = await getCategorias();
  const categoria = categorias.find((item) => item.slug === params.slug);

  if (!categoria) {
    notFound();
  }

  const disenos = await getDisenos({ categoria: { slug: { $eq: params.slug } } });

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-muted">Categoría</p>
        <h1 className="text-4xl font-semibold tracking-tight">{categoria?.nombre}</h1>
        {categoria?.descripcion ? (
          <p className="max-w-2xl text-lg text-muted">{categoria.descripcion}</p>
        ) : null}
      </header>
      <CategoryDesigns designs={disenos} />
    </div>
  );
}

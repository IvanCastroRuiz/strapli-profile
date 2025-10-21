import Image from "next/image";
import Link from "next/link";
import { Seo } from "@/components/seo/seo";
import { getAjustes, getCategorias, getDisenos, getHome } from "@/lib/api";
import { MasonryGrid } from "@/components/sections/masonry-grid";
import { DesignCard } from "@/components/cards/design-card";
import { CategoryCard } from "@/components/cards/category-card";
import { WhatsappButton } from "@/components/ui/whatsapp-button";

export default async function HomePage() {
  const [home, categorias, destacados, ajustes] = await Promise.all([
    getHome(),
    getCategorias(),
    getDisenos({ destacado: { $eq: true } }),
    getAjustes(),
  ]);

  const canonical = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  console.log("home: ",home);

  return (
    <div className="space-y-16">
      <Seo
        title="Editorial Modern Portfolio"
        description="Portafolio editorial contemporáneo con diseños escenográficos de alto impacto visual."
        canonical={canonical}
        openGraph={{
          url: canonical,
          title: "Editorial Modern Portfolio",
          description:
            "Portafolio editorial contemporáneo con diseños escenográficos de alto impacto visual.",
          images:
            home?.hero?.url
              ? [
                  {
                    url: home.hero.url,
                    width: 1200,
                    height: 630,
                    alt: "Editorial Modern",
                  },
                ]
              : undefined,
        }}
      />
      <section className="relative grid gap-8 overflow-hidden rounded-2xl border border-line bg-surface/70 p-8 md:grid-cols-[1.2fr_1fr] md:p-12">
        {home?.hero ? (
          <div className="relative h-[420px] overflow-hidden rounded-xl border border-line">
            <Image
              src={home.hero.url}
              alt={home.hero.alternativeText ?? "Galería principal"}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg/90" />
          </div>
        ) : (
          <div className="flex h-[420px] items-center justify-center rounded-xl border border-dashed border-line text-muted">
            Añade una imagen destacada en el CMS
          </div>
        )}
        <div className="flex flex-col justify-between gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted">Portafolio editorial</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight">Diseño escenográfico con mirada editorial</h1>
            <p className="mt-4 max-w-xl text-lg text-muted">
              Curaduría de experiencias visuales para bodas, quinceañeros y eventos inmersivos. Descubre conceptos de alto contraste,
              acentos dorados y estilismo contemporáneo.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <WhatsappButton title="Portafolio" url={canonical} />
            {ajustes?.cta_whatsapp ? (
              <span className="text-sm text-muted">
                Respuesta en menos de 24 horas · {ajustes.cta_whatsapp}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold tracking-tight">Categorías destacadas</h2>
          <Link href="/categorias" className="text-sm text-accent hover:text-accent-2">
            Ver todas
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {categorias
            .filter((categoria) => categoria.destacada)
            .slice(0, 4)
            .map((categoria) => (
              <CategoryCard key={categoria.id} categoria={categoria} />
            ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold tracking-tight">Diseños destacados</h2>
          <Link href="/buscar" className="text-sm text-accent hover:text-accent-2">
            Buscar más
          </Link>
        </div>
        <MasonryGrid>
          {destacados.map((design) => (
            <DesignCard key={design.id} design={design} />
          ))}
        </MasonryGrid>
      </section>
    </div>
  );
}

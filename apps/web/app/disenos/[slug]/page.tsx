import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Seo } from "@/components/seo/seo";
import { getAjustes, getDiseno } from "@/lib/api";
import { Gallery } from "@/components/sections/gallery";
import { WhatsappButton } from "@/components/ui/whatsapp-button";
import { formatDate } from "@/lib/utils";

interface DesignPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: DesignPageProps): Promise<Metadata> {
  const design = await getDiseno(params.slug);
  if (!design) {
    return { title: "Diseño no encontrado" };
  }

  const ogImage = design.galeria?.[0]?.url;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/disenos/${design.slug}`;

  return {
    title: design.titulo,
    description: design.descripcion ?? undefined,
    openGraph: {
      title: design.titulo,
      description: design.descripcion ?? undefined,
      url,
      type: "article",
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: design.titulo,
            },
          ]
        : undefined,
    },
  };
}

export default async function DesignPage({ params }: DesignPageProps) {
  const design = await getDiseno(params.slug);
  const ajustes = await getAjustes();

  if (!design) {
    notFound();
  }

  const cover = design.galeria?.[0];
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/disenos/${design.slug}`;

  return (
    <article className="space-y-12">
      <Seo
        title={design.titulo}
        description={design.descripcion ?? undefined}
        canonical={canonicalUrl}
        openGraph={{
          url: canonicalUrl,
          title: design.titulo,
          description: design.descripcion ?? undefined,
          images:
            cover?.url
              ? [
                  {
                    url: cover.url,
                    width: 1200,
                    height: 630,
                    alt: design.titulo,
                  },
                ]
              : undefined,
        }}
      />
      <header className="space-y-6">
        <p className="text-xs uppercase tracking-[0.4em] text-muted">{design.categoria?.nombre}</p>
        <h1 className="text-4xl font-semibold tracking-tight">{design.titulo}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
          {design.autor?.nombre ? <span>Por {design.autor.nombre}</span> : null}
          {design.fecha_publicacion ? <span>{formatDate(design.fecha_publicacion)}</span> : null}
        </div>
        {cover ? (
          <div className="relative h-[520px] overflow-hidden rounded-xl border border-line">
            <Image
              src={cover.url}
              alt={cover.alternativeText ?? design.titulo}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg/80" />
          </div>
        ) : null}
      </header>

      {design.descripcion ? (
        <section className="max-w-3xl space-y-4 text-lg text-muted">
          <p>{design.descripcion}</p>
        </section>
      ) : null}

      {design.galeria?.length ? <Gallery images={design.galeria} /> : null}

      <footer className="flex flex-col gap-6 rounded-xl border border-line bg-surface/80 p-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">¿Quieres este concepto para tu evento?</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Agenda una llamada y personalizamos la escenografía a tu medida. Acentos dorados, iluminación envolvente y styling editorial.
          </p>
        </div>
        <WhatsappButton title={design.titulo} url={canonicalUrl} className="w-full justify-center md:w-auto" />
      </footer>

      {ajustes?.redes?.instagram ? (
        <p className="text-sm text-muted">
          Sigue nuestro proceso creativo en {" "}
          <a href={ajustes.redes.instagram} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-2">
            Instagram
          </a>
          .
        </p>
      ) : null}
    </article>
  );
}

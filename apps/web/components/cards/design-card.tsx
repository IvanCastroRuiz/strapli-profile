import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Design } from "@/types/strapi";
import { Chip } from "@/components/ui/chip";
import { formatDate } from "@/lib/utils";

interface DesignCardProps {
  design: Design;
}

export const DesignCard = ({ design }: DesignCardProps) => {
  const cover = design.galeria?.[0];

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="group overflow-hidden rounded-lg border border-line bg-surface/90 shadow-glow"
    >
      <Link href={`/disenos/${design.slug}`} className="flex h-full flex-col">
        {cover ? (
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={cover.url}
              alt={cover.alternativeText ?? design.titulo}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              priority={design.destacado}
            />
            {design.destacado ? (
              <div className="absolute left-4 top-4">
                <Chip label="Destacado" />
              </div>
            ) : null}
          </div>
        ) : null}
        <div className="flex flex-1 flex-col gap-3 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              {design.categoria?.nombre ?? "Colección"} · {formatDate(design.fecha_publicacion)}
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-text">
              {design.titulo}
            </h3>
          </div>
          <p className="text-sm text-muted line-clamp-3">{design.descripcion}</p>
          <div className="mt-auto flex flex-wrap gap-2">
            {design.tags?.map((tag) => (
              <span key={tag.id} className="rounded-full border border-line bg-chip px-3 py-1 text-xs text-muted">
                #{tag.slug}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

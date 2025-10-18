import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/strapi";
import { motion } from "framer-motion";

export const CategoryCard = ({ categoria }: { categoria: Category }) => (
  <motion.article
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.18, ease: "easeInOut" }}
    className="group overflow-hidden rounded-lg border border-line bg-surface"
  >
    <Link href={`/categorias/${categoria.slug}`} className="grid h-full min-h-[200px] grid-cols-1">
      {categoria.portada ? (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={categoria.portada.url}
            alt={categoria.portada.alternativeText ?? categoria.nombre}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
          />
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center bg-chip text-muted">
          Sin imagen
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-6">
        <h3 className="text-2xl font-semibold tracking-tight text-text">{categoria.nombre}</h3>
        <p className="text-sm text-muted line-clamp-3">{categoria.descripcion}</p>
      </div>
    </Link>
  </motion.article>
);

"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Media } from "@/types/strapi";

interface GalleryProps {
  images: Media[];
}

export const Gallery = ({ images }: GalleryProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const previous = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return (current - 1 + images.length) % images.length;
    });
  }, [images.length]);
  const next = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return (current + 1) % images.length;
    });
  }, [images.length]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (event.key === "Escape") {
        close();
      }
      if (event.key === "ArrowRight") {
        next();
      }
      if (event.key === "ArrowLeft") {
        previous();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIndex, close, next, previous]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={image.id ?? index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative overflow-hidden rounded-lg border border-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <Image
              src={image.url}
              alt={image.alternativeText ?? `Imagen ${index + 1}`}
              width={800}
              height={1000}
              className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {activeIndex !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/95 p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-6 top-6 rounded-full border border-line bg-chip p-2 text-muted hover:text-text"
            aria-label="Cerrar galería"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={previous}
            className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full border border-line bg-chip p-3 text-muted hover:text-text"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="relative h-[80vh] w-full max-w-5xl overflow-hidden rounded-lg border border-line">
            <Image
              src={images[activeIndex].url}
              alt={images[activeIndex].alternativeText ?? `Imagen ${activeIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>
          <button
            type="button"
            onClick={next}
            className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full border border-line bg-chip p-3 text-muted hover:text-text"
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      ) : null}
    </div>
  );
};

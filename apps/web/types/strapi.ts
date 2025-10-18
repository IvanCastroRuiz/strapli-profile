export interface Media {
  id: number;
  url: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
  formats?: Record<string, { url: string }> | null;
}

export interface Category {
  id: number;
  nombre: string;
  slug: string;
  descripcion?: string | null;
  destacada?: boolean;
  portada?: Media | null;
}

export interface Tag {
  id: number;
  nombre: string;
  slug: string;
}

export interface Author {
  id: number;
  nombre: string;
  slug: string;
  bio?: string | null;
  avatar?: Media | null;
}

export interface Design {
  id: number;
  titulo: string;
  slug: string;
  descripcion?: string | null;
  categoria?: Category | null;
  galeria?: Media[];
  tags?: Tag[];
  autor?: Author | null;
  fecha_publicacion?: string | null;
  destacado?: boolean;
  metadata?: Record<string, any> | null;
}

export interface HomePage {
  id: number;
  hero?: Media | null;
  destacados: Design[];
}

export interface Ajustes {
  id: number;
  logo?: Media | null;
  redes?: Record<string, string> | null;
  colores?: Record<string, string> | null;
  cta_whatsapp?: string | null;
}

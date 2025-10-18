import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createStrapi } = require("@strapi/strapi");

const categories = [
  { nombre: "Bodas", slug: "bodas", descripcion: "Celebraciones nupciales con una estética moderna y elegante." },
  { nombre: "Quinceañeros", slug: "quinceaneros", descripcion: "Diseños vibrantes para celebraciones inolvidables de quince años." },
  { nombre: "Infantiles", slug: "infantiles", descripcion: "Escenarios creativos y llenos de fantasía para los más pequeños." },
  { nombre: "Escenografías", slug: "escenografias", descripcion: "Montajes inmersivos y de alto impacto visual." }
];

const tags = [
  { nombre: "Minimalista", slug: "minimalista" },
  { nombre: "Dorado", slug: "dorado" },
  { nombre: "Romántico", slug: "romantico" },
  { nombre: "Nocturno", slug: "nocturno" },
  { nombre: "Floral", slug: "floral" }
];

const authors = [
  { nombre: "Lucía Fernández", slug: "lucia-fernandez", bio: "Directora creativa especializada en estilismo editorial y ambientación de eventos." },
  { nombre: "Mateo Ríos", slug: "mateo-rios", bio: "Productor visual enfocado en iluminación teatral y puestas en escena modernas." }
];

const galleries = {
  "bodas-alba-luz": [
    "portfolio/bodas_alba_luz_1",
    "portfolio/bodas_alba_luz_2",
    "portfolio/bodas_alba_luz_3",
    "portfolio/bodas_alba_luz_4"
  ],
  "quince-sophia": [
    "portfolio/quince_sophia_1",
    "portfolio/quince_sophia_2",
    "portfolio/quince_sophia_3",
    "portfolio/quince_sophia_4"
  ],
  "infantil-galaxia": [
    "portfolio/infantil_galaxia_1",
    "portfolio/infantil_galaxia_2",
    "portfolio/infantil_galaxia_3",
    "portfolio/infantil_galaxia_4"
  ],
  "escena-aurum": [
    "portfolio/escena_aurum_1",
    "portfolio/escena_aurum_2",
    "portfolio/escena_aurum_3",
    "portfolio/escena_aurum_4"
  ]
};

const designs = [
  {
    titulo: "Bodas Alba & Luz",
    slug: "bodas-alba-luz",
    descripcion: "Una experiencia ceremonial íntima con acentos dorados y texturas táctiles.",
    categoria: "bodas",
    tags: ["minimalista", "dorado", "romantico"],
    autor: "lucia-fernandez",
    fecha_publicacion: "2023-05-12",
    destacado: true,
    heroPublicId: "portfolio/bodas_alba_luz_1"
  },
  {
    titulo: "Quince Sofía Aurea",
    slug: "quince-sophia",
    descripcion: "Una fiesta vibrante en tonos ámbar con iluminación dramática.",
    categoria: "quinceaneros",
    tags: ["dorado", "nocturno"],
    autor: "mateo-rios",
    fecha_publicacion: "2023-08-02",
    destacado: true,
    heroPublicId: "portfolio/quince_sophia_1"
  },
  {
    titulo: "Infantil Galaxia Lúcida",
    slug: "infantil-galaxia",
    descripcion: "Escenografía espacial con elementos interactivos y neones sutiles.",
    categoria: "infantiles",
    tags: ["floral", "nocturno"],
    autor: "lucia-fernandez",
    fecha_publicacion: "2024-01-18",
    destacado: false,
    heroPublicId: "portfolio/infantil_galaxia_1"
  },
  {
    titulo: "Escena Aurum",
    slug: "escena-aurum",
    descripcion: "Montaje conceptual para editorial de moda con contrastes de luz y sombra.",
    categoria: "escenografias",
    tags: ["minimalista", "dorado"],
    autor: "mateo-rios",
    fecha_publicacion: "2024-03-21",
    destacado: true,
    heroPublicId: "portfolio/escena_aurum_1"
  }
];

const cloudinaryBase = (publicId) =>
  `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/upload/q_80,w_1600/${publicId}.jpg`;

const uploadFromCloudinary = async (strapi, publicId) => {
  const url = cloudinaryBase(publicId);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`No se pudo descargar la imagen ${url}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filename = `${publicId.split("/").pop()}.jpg`;

  const uploadService = strapi.plugin("upload").service("upload");
  const [file] = await uploadService.upload({
    data: { folder: "portfolio" },
    files: {
      path: filename,
      name: filename,
      type: "image/jpeg",
      size: buffer.byteLength,
      buffer,
    },
  });

  return file.id;
};

const upsertCollectionEntry = async (strapi, uid, slug, data) => {
  const existing = await strapi.entityService.findMany(uid, {
    filters: { slug },
    limit: 1,
  });

  if (existing && existing.length > 0) {
    return existing[0].id;
  }

  const entry = await strapi.entityService.create(uid, { data });
  return entry.id;
};

const upsertSingle = async (strapi, uid, data) => {
  const existing = await strapi.db.query(uid).findMany({
    select: ["id"],
    limit: 1,
  });

  if (existing && existing.length > 0) {
    return strapi.entityService.update(uid, existing[0].id, { data });
  }

  return strapi.entityService.create(uid, { data });
};

const seed = async () => {
  const strapi = await createStrapi();
  await strapi.start();

  try {
    const categoryMap = new Map();
    for (const category of categories) {
      const id = await upsertCollectionEntry(strapi, "api::categoria.categoria", category.slug, category);
      categoryMap.set(category.slug, id);
    }

    const tagMap = new Map();
    for (const tag of tags) {
      const id = await upsertCollectionEntry(strapi, "api::tag.tag", tag.slug, tag);
      tagMap.set(tag.slug, id);
    }

    const authorMap = new Map();
    for (const author of authors) {
      const id = await upsertCollectionEntry(strapi, "api::autor.autor", author.slug, {
        nombre: author.nombre,
        slug: author.slug,
        bio: author.bio,
      });
      authorMap.set(author.slug, id);
    }

    const designMap = new Map();
    for (const design of designs) {
      const existing = await strapi.entityService.findMany("api::diseno.diseno", {
        filters: { slug: design.slug },
        limit: 1,
      });

      if (existing && existing.length > 0) {
        designMap.set(design.slug, existing[0].id);
        continue;
      }

      const galleryIds = [];
      for (const publicId of galleries[design.slug]) {
        const mediaId = await uploadFromCloudinary(strapi, publicId);
        galleryIds.push(mediaId);
      }

      const entity = await strapi.entityService.create("api::diseno.diseno", {
        data: {
          titulo: design.titulo,
          slug: design.slug,
          descripcion: design.descripcion,
          fecha_publicacion: design.fecha_publicacion,
          destacado: design.destacado,
          categoria: categoryMap.get(design.categoria),
          autor: authorMap.get(design.autor),
          tags: design.tags.map((tagSlug) => tagMap.get(tagSlug)),
          galeria: galleryIds,
          metadata: {
            hero: design.heroPublicId,
          },
        },
      });

      designMap.set(design.slug, entity.id);
    }

    await upsertSingle(strapi, "api::home.home", {
      destacados: Array.from(designMap.values()),
    });

    await upsertSingle(strapi, "api::ajustes.ajustes", {
      cta_whatsapp: "573001234567",
      colores: { fondo: "#0B0B0C", acento: "#C9A25E" },
      redes: {
        instagram: "https://instagram.com/estudioeditorial",
        pinterest: "https://pinterest.com/estudioeditorial",
      },
    });

    console.log("Seeds ejecutados correctamente");
  } catch (error) {
    console.error(error);
  }

  await strapi.destroy();
};

seed();


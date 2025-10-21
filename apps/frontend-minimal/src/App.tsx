import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:1337/api";
const STRAPI_BASE_URL = API_BASE_URL.replace(/\/?api\/?$/, "");

type StatusResponse = {
  ok: boolean;
  service: string;
  timestamp: string;
  databaseUrlDefined: boolean;
  cloudinaryConfigured: boolean;
};

type Media = {
  url: string;
  alternativeText?: string | null;
};

type Highlight = {
  id: number;
  titulo: string;
  slug: string;
  categoria?: string;
  descripcion?: string;
  portada?: Media | null;
  tags: string[];
};

type HomePayload = {
  hero?: Media | null;
  destacados: Highlight[];
  isMock: boolean;
  note?: string;
};

type StatusState =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "error"; message: string }
  | { type: "success"; payload: StatusResponse };

type HomeState =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "error"; message: string }
  | { type: "success"; payload: HomePayload };

const FALLBACK_HOME: HomePayload = {
  isMock: true,
  note:
    "Mostrando datos simulados. Inicia Strapi para ver el contenido real del single type Home.",
  hero: {
    url: "https://images.unsplash.com/photo-1526481280695-3c46917e42c1?auto=format&fit=crop&w=1080&q=80",
    alternativeText: "Collage editorial minimalista en blanco y negro",
  },
  destacados: [
    {
      id: 1,
      titulo: "Editorial Black & Gold",
      slug: "editorial-black-gold",
      categoria: "Editorial",
      descripcion:
        "Serie tipográfica con acentos dorados y composición asimétrica inspirada en revistas de alta gama.",
      portada: {
        url: "https://images.unsplash.com/photo-1526481280695-3c46917e42c1?auto=format&fit=crop&w=640&q=80",
        alternativeText: "Portada editorial con tipografía serif y acentos dorados",
      },
      tags: ["Editorial", "Tipografía", "Dorado"],
    },
    {
      id: 2,
      titulo: "Monocromo Cinemático",
      slug: "monocromo-cinematico",
      categoria: "Branding",
      descripcion:
        "Exploración visual en escala de grises con enfoque en contraste extremo y jerarquía tipográfica.",
      portada: {
        url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=640&q=80",
        alternativeText: "Presentación monocromática con tipografía sans",
      },
      tags: ["Branding", "Minimalismo"],
    },
    {
      id: 3,
      titulo: "Galería Modular 03",
      slug: "galeria-modular-03",
      categoria: "Portfolio",
      descripcion:
        "Grid editorial con módulos dinámicos para destacar proyectos fotográficos y editoriales.",
      portada: {
        url: "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=640&q=80",
        alternativeText: "Mockup de revista con diseño modular",
      },
      tags: ["Layout", "Fotografía"],
    },
  ],
};

const fetchStatus = async (): Promise<StatusResponse> => {
  const response = await fetch(`${API_BASE_URL}/status`);

  if (!response.ok) {
    throw new Error(`Error ${response.status}`);
  }

  return (await response.json()) as StatusResponse;
};

const ensureArray = <T,>(value: unknown): T[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value as T[];
  return [value as T];
};

const ensureObject = (value: unknown): Record<string, any> | null => {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, any>;
};

const unwrapData = (entry: unknown): any => {
  if (!entry) return null;
  if (Array.isArray(entry)) {
    return entry.map(unwrapData).filter(Boolean);
  }
  const object = ensureObject(entry);
  if (!object) return entry;
  if (Object.prototype.hasOwnProperty.call(object, "data")) {
    return unwrapData(object.data);
  }
  return object;
};

const absoluteUrl = (url?: string | null) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${STRAPI_BASE_URL}${url}`;
};

const toMedia = (input: unknown): Media | null => {
  const media = unwrapData(input);
  if (!media || Array.isArray(media)) return null;
  const attrs = media.attributes ? media.attributes : media;
  const url = typeof attrs.url === "string" ? attrs.url : undefined;
  if (!url) return null;
  return {
    url: absoluteUrl(url) ?? url,
    alternativeText: attrs.alternativeText ?? attrs.name ?? null,
  };
};

const stripHtml = (value: unknown): string => {
  if (typeof value !== "string") return "";
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
};

const toHighlight = (entry: unknown): Highlight | null => {
  const normalized = unwrapData(entry);
  if (!normalized || Array.isArray(normalized)) return null;
  const attributes = normalized.attributes ?? normalized;

  const categoriaEntry = unwrapData(attributes.categoria);
  const categoriaAttrs =
    categoriaEntry && !Array.isArray(categoriaEntry)
      ? categoriaEntry.attributes ?? categoriaEntry
      : null;

  const galleryEntries = ensureArray(unwrapData(attributes.galeria));
  const portadaMedia = galleryEntries
    .map((item) => toMedia(item))
    .find((item): item is Media => Boolean(item));

  const tagsEntries = ensureArray(unwrapData(attributes.tags));
  const tags = tagsEntries
    .map((tag) => {
      if (!tag) return null;
      if (Array.isArray(tag)) return null;
      const attrs = tag.attributes ?? tag;
      return typeof attrs.nombre === "string" ? attrs.nombre : null;
    })
    .filter((tag): tag is string => Boolean(tag));

  return {
    id: Number(normalized.id ?? attributes.id ?? Date.now()),
    titulo: typeof attributes.titulo === "string" ? attributes.titulo : "Sin título",
    slug: typeof attributes.slug === "string" ? attributes.slug : "",
    categoria:
      categoriaAttrs && typeof categoriaAttrs.nombre === "string"
        ? categoriaAttrs.nombre
        : undefined,
    descripcion: stripHtml(attributes.descripcion),
    portada: portadaMedia ?? null,
    tags,
  };
};

const normalizeHome = (payload: unknown): Omit<HomePayload, "isMock" | "note"> => {
  const data = unwrapData(ensureObject(payload)?.data) ?? ensureObject(payload) ?? {};
  const attributes = data.attributes ?? data;
  const hero = toMedia(attributes.hero);
  const destacadosEntries = ensureArray(unwrapData(attributes.destacados));
  const destacados = destacadosEntries
    .map((item) => toHighlight(item))
    .filter((item): item is Highlight => Boolean(item));

  return {
    hero,
    destacados,
  };
};

const fetchHome = async (): Promise<HomePayload> => {
  const url = `${API_BASE_URL}/home?populate[hero]=*&populate[destacados][populate]=categoria&populate[destacados][populate]=tags&populate[destacados][populate]=galeria`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error ${response.status}`);
  }

  const json = await response.json();
  return { ...normalizeHome(json), isMock: false };
};

function App() {
  const [statusState, setStatusState] = useState<StatusState>({ type: "idle" });
  const [homeState, setHomeState] = useState<HomeState>({ type: "idle" });

  const loadStatus = async () => {
    setStatusState({ type: "loading" });

    try {
      const payload = await fetchStatus();
      setStatusState({ type: "success", payload });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo conectar con el backend";
      setStatusState({ type: "error", message });
    }
  };

  const loadHome = async () => {
    setHomeState({ type: "loading" });

    try {
      const payload = await fetchHome();
      setHomeState({ type: "success", payload });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo recuperar el contenido";
      console.warn("No se pudo obtener Home desde Strapi, usando simulación.", error);
      setHomeState({
        type: "success",
        payload: {
          ...FALLBACK_HOME,
          note: `${FALLBACK_HOME.note} Detalle técnico: ${message}.`,
        },
      });
    }
  };

  useEffect(() => {
    void loadStatus();
  }, []);

  return (
    <main>
      <section className="card">
        <header>
          <h1>Frontend minimal</h1>
          <p>
            Esta interfaz consulta <code>{API_BASE_URL}/status</code> para validar la
            conexión con el backend de Strapi.
          </p>
        </header>

        <section className="panel" aria-live="polite">
          <header>
            <h2>1. Probar conexión</h2>
            <p>
              Comprueba la disponibilidad del servicio <code>/status</code> en Strapi.
            </p>
          </header>

          <button
            type="button"
            onClick={loadStatus}
            disabled={statusState.type === "loading"}
          >
            {statusState.type === "loading" ? "Consultando..." : "Probar conexión"}
          </button>

          {statusState.type === "success" && (
            <div className="status-block">
              <div className="status ok">Conexión establecida</div>
              <small>
                Última respuesta: {" "}
                {new Date(statusState.payload.timestamp).toLocaleString()}
              </small>
              <pre>{JSON.stringify(statusState.payload, null, 2)}</pre>
            </div>
          )}

          {statusState.type === "error" && (
            <div className="status-block">
              <div className="status">Sin conexión</div>
              <small>Error: {statusState.message}</small>
            </div>
          )}

          {statusState.type === "idle" && (
            <div className="status-block">
              <div className="status">Listo para probar</div>
              <small>Haz clic en el botón para consultar el backend.</small>
            </div>
          )}
        </section>

        <section className="panel" aria-live="polite">
          <header>
            <h2>2. Home del portafolio</h2>
            <p>
              Simulación del contenido del single type <code>home</code> de Strapi con sus
              destacados.
            </p>
          </header>

          <button type="button" onClick={loadHome} disabled={homeState.type === "loading"}>
            {homeState.type === "loading" ? "Cargando Home..." : "Cargar contenido"}
          </button>

          {homeState.type === "success" && (
            <div className="home-block">
              {homeState.payload.note && <small className="note">{homeState.payload.note}</small>}
              {homeState.payload.hero && (
                <figure className="hero">
                  <img
                    src={homeState.payload.hero.url}
                    alt={homeState.payload.hero.alternativeText ?? "Imagen destacada"}
                  />
                  {homeState.payload.hero.alternativeText && (
                    <figcaption>{homeState.payload.hero.alternativeText}</figcaption>
                  )}
                </figure>
              )}

              {homeState.payload.destacados.length > 0 ? (
                <div className="highlights">
                  {homeState.payload.destacados.map((item) => (
                    <article className="highlight-card" key={item.id}>
                      {item.portada && (
                        <img
                          src={item.portada.url}
                          alt={item.portada.alternativeText ?? item.titulo}
                          loading="lazy"
                        />
                      )}
                      <div className="highlight-content">
                        <header>
                          {item.categoria && <span className="chip">{item.categoria}</span>}
                          <h3>{item.titulo}</h3>
                        </header>
                        {item.descripcion && <p>{item.descripcion}</p>}
                        {item.tags.length > 0 && (
                          <ul className="tags" aria-label="Etiquetas del proyecto">
                            {item.tags.map((tag) => (
                              <li key={tag}>{tag}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p>No hay proyectos destacados configurados todavía.</p>
              )}
            </div>
          )}

          {homeState.type === "error" && (
            <div className="status-block">
              <div className="status">Sin contenido</div>
              <small>Error: {homeState.message}</small>
            </div>
          )}

          {homeState.type === "idle" && (
            <div className="status-block">
              <div className="status">Listo para cargar</div>
              <small>Haz clic en el botón para simular la tabla Home.</small>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;

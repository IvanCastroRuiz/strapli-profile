const endpoints = [
  {
    key: "home",
    label: "Home",
    path: "/api/home?populate=%2A",
  },
  {
    key: "categories",
    label: "Categorías",
    path: "/api/categorias?populate=%2A&pagination[pageSize]=50&sort=nombre%3Aasc",
  },
  {
    key: "designs",
    label: "Diseños Destacados",
    path: "/api/disenos?populate=%2A&pagination[pageSize]=50&sort=fecha_publicacion%3Adesc&filters[destacado][$eq]=true",
  },
  {
    key: "settings",
    label: "Ajuste",
    path: "/api/ajuste?populate=%2A",
  },
];

type EndpointResult = {
  url: string;
  status: number | null;
  ok: boolean;
  body: unknown;
  error?: string;
};

async function fetchEndpoint(path: string): Promise<EndpointResult> {
  const base =
    process.env.NEXT_PUBLIC_STRAPI_URL ??
    process.env.STRAPI_URL ??
    "http://localhost:1337";

  const url = new URL(path, base).toString();

  try {
    const response = await fetch(url, {
      cache: "no-store",
    });

    const text = await response.text();
    let body: unknown = text;

    try {
      body = JSON.parse(text);
    } catch {
      // ignore, we already defaulted body to text
    }

    return {
      url,
      status: response.status,
      ok: response.ok,
      body,
    };
  } catch (error) {
    return {
      url,
      status: null,
      ok: false,
      body: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export default async function Page() {
  const results = await Promise.all(
    endpoints.map(async (endpoint) => ({
      ...endpoint,
      result: await fetchEndpoint(endpoint.path),
    }))
  );

  const baseUrl =
    process.env.NEXT_PUBLIC_STRAPI_URL ??
    process.env.STRAPI_URL ??
    "http://localhost:1337";

  return (
    <main>
      <h1>Strapi Endpoint Debugger</h1>
      <section>
        <p>
          Consultando API en <code>{baseUrl}</code> y mostrando la respuesta de
          cada endpoint utilizado por la aplicación original.
        </p>
        <small>
          Define <code>NEXT_PUBLIC_STRAPI_URL</code> en tu entorno para cambiar la
          URL base.
        </small>
        {results.map(({ key, label, result }) => {
          const statusClass = result.ok ? "status ok" : "status error";
          return (
            <article key={key} className="endpoint">
              <h2>{label}</h2>
              <p>
                <span className={statusClass}>
                  {result.status !== null ? `HTTP ${result.status}` : "Sin respuesta"}
                </span>{" "}
                — <code>{result.url}</code>
              </p>
              {result.error ? (
                <p className="status error">Error: {result.error}</p>
              ) : null}
              <pre>{JSON.stringify(result.body, null, 2)}</pre>
            </article>
          );
        })}
      </section>
    </main>
  );
}

import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:1337/api";

type StatusResponse = {
  ok: boolean;
  service: string;
  timestamp: string;
  databaseUrlDefined: boolean;
  cloudinaryConfigured: boolean;
};

type RequestState =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "error"; message: string }
  | { type: "success"; payload: StatusResponse };

const fetchStatus = async (): Promise<StatusResponse> => {
  const response = await fetch(`${API_BASE_URL}/status`);

  if (!response.ok) {
    throw new Error(`Error ${response.status}`);
  }

  return (await response.json()) as StatusResponse;
};

function App() {
  const [state, setState] = useState<RequestState>({ type: "idle" });

  const loadStatus = async () => {
    setState({ type: "loading" });

    try {
      const payload = await fetchStatus();
      setState({ type: "success", payload });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo conectar con el backend";
      setState({ type: "error", message });
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

        <button type="button" onClick={loadStatus} disabled={state.type === "loading"}>
          {state.type === "loading" ? "Consultando..." : "Probar conexión"}
        </button>

        {state.type === "success" && (
          <div>
            <div className="status ok">Conexión establecida</div>
            <small>
              Última respuesta: {new Date(state.payload.timestamp).toLocaleString()}
            </small>
            <pre>{JSON.stringify(state.payload, null, 2)}</pre>
          </div>
        )}

        {state.type === "error" && (
          <div>
            <div className="status">Sin conexión</div>
            <small>Error: {state.message}</small>
          </div>
        )}

        {state.type === "idle" && (
          <div>
            <div className="status">Listo para probar</div>
            <small>Haz clic en el botón para consultar el backend.</small>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;

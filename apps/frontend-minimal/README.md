# Frontend Minimal

Aplicación React creada con Vite para verificar la comunicación con el backend
Strapi mínimo. Consume el endpoint `GET /api/status` y muestra la respuesta en
pantalla.

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con la URL base del backend:

```
VITE_API_BASE_URL=http://localhost:1337/api
```

## Comandos

- `pnpm install` — instala dependencias.
- `pnpm dev` — inicia el servidor de desarrollo en `http://localhost:5173`.
- `pnpm build` — construye la aplicación para producción.
- `pnpm preview` — previsualiza la compilación.

## Flujo de prueba

1. Arranca el backend mínimo (`pnpm --filter strapli-minimal develop`).
2. Inicia este frontend (`pnpm --filter frontend-minimal dev`).
3. Abre el navegador y verifica que la tarjeta muestre la respuesta del backend.

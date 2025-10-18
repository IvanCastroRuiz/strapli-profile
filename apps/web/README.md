# Frontend — Next.js 14

Aplicación web para mostrar el portafolio editorial con estética moderna.

## Configuración

1. Copia `.env.example` a `.env.local` y ajusta las variables.
2. Instala dependencias desde la raíz con `pnpm install`.
3. Inicia el entorno de desarrollo:
   ```bash
   pnpm -C apps/web dev
   ```

### Variables de entorno

```
NEXT_PUBLIC_CMS_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_PHONE=57300XXXXXXX
NEXT_PUBLIC_CLOUDINARY_CLOUD=tu_cloud_name
```

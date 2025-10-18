# CMS — Strapi v5

Este proyecto implementa el backend CMS para el portafolio editorial.

## Configuración

1. Copia `.env.example` a `.env` y actualiza las variables.
2. Instala dependencias desde la raíz del monorepo con `pnpm install`.
3. Ejecuta la base de datos PostgreSQL y asegúrate de que `DATABASE_URL` sea accesible.
4. Inicia Strapi en modo desarrollo:
   ```bash
   pnpm -C apps/cms develop
   ```

### Variables de entorno

```
HOST=0.0.0.0
PORT=1337
APP_KEYS=key1,key2
ADMIN_JWT_SECRET=change-me
DATABASE_URL=postgres://user:pass@localhost:5432/portafolio
CLOUDINARY_NAME=your_cloud
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

### Seeds

Ejecuta `pnpm -C apps/cms seed` para insertar contenido editorial de ejemplo. El script crea categorías, tags, autores y diseños con galerías en Cloudinary.

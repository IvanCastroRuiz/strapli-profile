# Strapli Minimal Backend

Este proyecto ofrece una instalación mínima de Strapi pensada para validar la
conexión con un frontend independiente. Todas las dependencias se gestionan
mediante `pnpm` y se apoya en variables de entorno para la configuración.

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido como
referencia:

```
HOST=0.0.0.0
PORT=1337
APP_KEYS=key1,key2
ADMIN_JWT_SECRET=change-me
API_TOKEN_SALT=change-me
TRANSFER_TOKEN_SALT=change-me
DATABASE_URL=postgres://postgres:root@localhost:5432/portafolio
CLOUDINARY_NAME=drfppwpaq
CLOUDINARY_API_KEY=452753935826129
CLOUDINARY_API_SECRET=lv4u1QsAPcCqn1VbeXuSoA34Z2Y
```

> **Nota:** No se incluyen valores por defecto para la base de datos ni para las
> credenciales de Cloudinary en modo producción. Ajusta estas variables según tu
> infraestructura.

## Comandos

- `pnpm install` — instala dependencias.
- `pnpm develop` — levanta Strapi en modo desarrollo.
- `pnpm build` — compila la aplicación.
- `pnpm start` — arranca la aplicación en modo producción (requiere `build`).

## Endpoint de prueba

Una vez iniciado el backend podrás consultar `GET /api/status` para verificar
el estado de la aplicación. El endpoint responde un JSON con el nombre del
proyecto y un indicador de conexión a la base de datos.

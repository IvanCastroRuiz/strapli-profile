# Portafolio Editorial Modern

Monorepo full-stack para un portafolio de diseño con estética **Editorial Modern**, compuesto por un CMS Strapi v5 y un frontend Next.js 14. Se utilizan PostgreSQL 16, Cloudinary y pnpm como gestor de paquetes.

## Requisitos

- Node.js 20+
- pnpm 8+
- PostgreSQL 14+
- Cuenta de Cloudinary

## Scripts principales

Desde la raíz del repositorio:

```bash
pnpm -C apps/cms develop   # Inicia Strapi en modo desarrollo
pnpm -C apps/web dev       # Inicia el frontend Next.js
```

Consulta los README internos de cada aplicación para instrucciones específicas de configuración, despliegue y seed de datos.

## Entorno mínimo de prueba

Para depurar problemas de conectividad puedes utilizar el backend `apps/strapli-minimal`
y el frontend `apps/frontend-minimal`. Ambos están pensados para validar las
variables de entorno y la comunicación básica Strapi ↔︎ React.

```bash
pnpm --filter strapli-minimal develop  # Backend Strapi mínimo
pnpm --filter frontend-minimal dev     # Frontend React con Vite
```

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

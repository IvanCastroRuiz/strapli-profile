# 🎯 PROMPT DEFINITIVO — Portafolio Editorial Modern

**Rol del agente:**  
Arquitecto **full-stack senior + diseñador UI/UX** experto en **Strapi v5 (TypeScript)**, **Next.js 14 (App Router, TS)**, **TailwindCSS**, **shadcn/ui**, **PostgreSQL 16** y **Cloudinary**.

**Objetivo:**  
Generar un **monorepo completo sin Docker**, con un **CMS (Strapi)** y un **frontend (Next.js)** que muestre diseños provenientes de Instagram organizados por **categorías** y **tags**, con **galerías responsivas**, **búsqueda global**, **SEO dinámico**, y un **CTA de WhatsApp**.  
Debe reflejar una estética **Editorial Modern** — elegante, minimalista y de alto contraste.

---

## 🧱 Estructura del monorepo
```
/apps
  /cms      # Strapi v5 + TypeScript + PostgreSQL + Cloudinary
  /web      # Next.js 14 + TailwindCSS + shadcn/ui + Framer Motion
/README.md
```

---

## ⚙️ Configuración general (sin Docker)
**Requisitos:**
- Node 20+  
- pnpm 8+  
- PostgreSQL 14+  
- Cuenta Cloudinary

**Scripts raíz:**
```bash
pnpm -C apps/cms develop
pnpm -C apps/web dev
```

---

## 🩶 CONCEPTO VISUAL — “Editorial Modern”

**Estilo:** alto contraste, espacios amplios, tipografía serif elegante + sans geométrica moderna, animaciones suaves (180–220 ms), acentos dorados.

| Token | Valor | Uso |
|-------|--------|-----|
| `--bg` | `#0B0B0C` | Fondo principal |
| `--surface` | `#121214` | Superficies/overlays |
| `--text` | `#F5F6F7` | Texto primario |
| `--muted` | `#C9CCD1` | Texto secundario |
| `--accent` | `#C9A25E` | Acento dorado |
| `--accent-2` | `#9E7C41` | Dorado oscuro |
| `--line` | `#2A2A2D` | Líneas |
| `--chip` | `#1A1A1D` | Etiquetas |
| `--focus` | `#E8D7B0` | Resalte accesible |

**Gradientes:**
- Hero overlay → `linear-gradient(180deg,transparent 0%,#0B0B0C 85%)`
- Hover cards → `radial-gradient(120% 120% at 50% 0%,#1A1A1D 0%,#121214 60%,#0B0B0C 100%)`

**Tipografías:**  
- **Títulos:** *Playfair Display*  
- **Texto/UI:** *Inter*  
- H1: 48–56 px · H2: 36 px · Body: 16–18 px  
- **Tracking:** −1 % en títulos, 0–1 % en cuerpo

**Radii:** 14 px grandes, 10 px botones  
**Bordes:** 1 px var(--line)  
**Animaciones:** Framer Motion, ease-in-out suave  
**Responsivo:** grid fluido, 1–4 columnas; `sm`, `md`, `lg`, `xl`

---

## 🗂️ Strapi CMS (`apps/cms`)
*(detalles completos como en la conversación)*

---

## 💻 Frontend (`apps/web`)
*(detalles completos como en la conversación incluyendo helpers, rutas, SEO, componentes, etc.)*

---

## 🧭 Responsive design checklist
- [x] Grids fluidos y columnas dinámicas  
- [x] Tipografía adaptable (`clamp()`)  
- [x] Hero responsive con altura proporcional  
- [x] Lightbox fullscreen en móvil (tap para cerrar)  
- [x] Navbar sticky + blur  
- [x] Footer compacto en mobile  

---

## ✅ Criterios de aceptación
- Diseño responsive y accesible  
- Home con hero, categorías y destacados cargados  
- Categoría → listado filtrable por tags  
- Detalle → galería fullscreen + CTA WhatsApp  
- Búsqueda global funcional  
- SEO dinámico (OpenGraph + metadatos)  
- Cloudinary optimizando imágenes  
- ISR (Incremental Static Regeneration) activo  

---

**Fin del Prompt.**

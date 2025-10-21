import type { Core } from "@strapi/strapi";

const REQUIRED_ENV_VARS = [
  "HOST",
  "PORT",
  "APP_KEYS",
  "ADMIN_JWT_SECRET",
  "DATABASE_URL",
];

const logMissingEnv = () => {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.warn(
      `[strapli-minimal] Variables de entorno faltantes: ${missing.join(", ")}`,
    );
  }
};

export default {
  register() {
    logMissingEnv();
  },
  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const info = {
      name: strapi.config.get("info.name", "strapli-minimal"),
      environment: strapi.config.get("environment", "development"),
    };

    strapi.log.info(
      `[strapli-minimal] Iniciado en modo ${info.environment} — ${info.name}`,
    );
  },
};

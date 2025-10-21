import type { Context } from "@strapi/strapi";

export default {
  async index(ctx: Context) {
    ctx.body = {
      ok: true,
      service: "strapli-minimal",
      timestamp: new Date().toISOString(),
      databaseUrlDefined: Boolean(process.env.DATABASE_URL),
      cloudinaryConfigured:
        Boolean(process.env.CLOUDINARY_NAME) &&
        Boolean(process.env.CLOUDINARY_API_KEY) &&
        Boolean(process.env.CLOUDINARY_API_SECRET),
    };
  },
};

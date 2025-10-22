import type { Core } from "@strapi/strapi";

const PUBLIC_ROLE_ID = 1;

const publicPermissions: Record<string, string[]> = {
  "api::categoria.categoria": ["find", "findOne"],
  "api::diseno.diseno": ["find", "findOne"],
  "api::home.home": ["find", "findOne"],
  "api::ajuste.ajuste": ["find", "findOne"],
  "api::tag.tag": ["find", "findOne"],
  "api::autor.autor": ["find", "findOne"],
};

const buildPermissionPayload = (uid: string, actions: string[]) => {
  const parts = uid.split(".");
  const name = parts[parts.length - 1];
  return {
    [uid]: {
      controllers: {
        [name]: actions.reduce<Record<string, boolean>>((acc, action) => {
          acc[action] = true;
          return acc;
        }, {}),
      },
    },
  };
};

const ensurePublicPermissions = async (strapi: Core.Strapi) => {
  const roleService = strapi.service("plugin::users-permissions.role");
  const role = await roleService.findOne(PUBLIC_ROLE_ID);
  if (!role) {
    return;
  }

  const permissions = Object.entries(publicPermissions).reduce(
    (acc, [uid, actions]) => ({
      ...acc,
      ...buildPermissionPayload(uid, actions),
    }),
    {}
  );

  await roleService.updateRole(PUBLIC_ROLE_ID, {
    permissions,
  });
};

const ensureSingleTypeEntries = async (
  strapi: Core.Strapi,
  singleTypeUids: string[],
) => {
  await Promise.all(
    singleTypeUids.map(async (uid) => {
      
      const contentType = strapi.contentType(uid);
      if (!contentType) {
        return;
      }
      const hasDraftAndPublish = contentType.options?.draftAndPublish === true;

      const existingEntry = await strapi.db
        .query(uid)
        .findOne({ select: ["id", "documentId", "publishedAt"] });

      if (!existingEntry) {
        let created: any | undefined;
        if (hasDraftAndPublish) {
          created = await strapi.documents(contentType).create({ data: {} });
        } else {
          await strapi.db.query(uid).create({ data: {} });
        }

        if (hasDraftAndPublish) {
          const documentId =
            created?.documentId ??
            (await strapi.db
              .query(uid)
              .findOne({
                select: ["documentId"],
                where: { id: created.id },
              }))?.documentId;

          if (documentId) {
            await strapi.documents(contentType).publish({ documentId });
          }
        }

        return;
      }

      if (hasDraftAndPublish && !existingEntry.publishedAt) {
        await strapi.documents(contentType).publish({
          documentId: existingEntry.documentId,
        });
      }
    }),
  );
};

export default {
  register() {},
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensurePublicPermissions(strapi);
    await ensureSingleTypeEntries(strapi, [
      "api::home.home",
      "api::ajuste.ajuste",
    ]);
  },
};

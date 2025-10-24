import type { Core } from "@strapi/strapi";

const PUBLIC_ROLE_TYPE = "public";

const publicPermissions: Record<string, string[]> = {
  "api::categoria.categoria": ["find", "findOne"],
  "api::diseno.diseno": ["find", "findOne"],
  "api::home.home": ["find", "findOne"],
  "api::ajuste.ajuste": ["find", "findOne"],
  "api::tag.tag": ["find", "findOne"],
  "api::autor.autor": ["find", "findOne"],
};

const ensurePublicPermissions = async (strapi: Core.Strapi) => {
  const usersPermissionsPlugin = (strapi as any).plugin?.("users-permissions");
  if (!usersPermissionsPlugin) {
    (strapi as any).log?.warn?.(
      "users-permissions plugin not available, skipping public permissions setup.",
    );
    return;
  }

  const role = await strapi.db
    .query("plugin::users-permissions.role")
    .findOne({
      select: ["id"],
      where: { type: PUBLIC_ROLE_TYPE },
    });

  if (!role) {
    (strapi as any).log?.warn?.(
      `Unable to locate \"${PUBLIC_ROLE_TYPE}\" role; skipping public permissions setup.`,
    );
    return;
  }

  await Promise.all(
    Object.entries(publicPermissions).map(async ([uid, actions]) => {
      await Promise.all(
        actions.map(async (action) => {
          const permissionAction = `${uid}.${action}`;

          const existingPermission = await strapi.db
            .query("plugin::users-permissions.permission")
            .findOne({
              select: ["id", "enabled"],
              where: {
                action: permissionAction,
                role: role.id,
              },
            });

          if (existingPermission) {
            if (!existingPermission.enabled) {
              await strapi.db
                .query("plugin::users-permissions.permission")
                .update({
                  where: { id: existingPermission.id },
                  data: { enabled: true },
                });
            }
            return;
          }

          await strapi.db
            .query("plugin::users-permissions.permission")
            .create({
              data: {
                action: permissionAction,
                role: role.id,
                enabled: true,
              },
            });
        })
      );
    })
  );
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

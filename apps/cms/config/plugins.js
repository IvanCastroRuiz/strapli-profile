// Validación de variables de entorno requeridas para Cloudinary
(() => {
  const required = [
    "CLOUDINARY_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];
  for (const v of required) {
    if (!process.env[v]) {
      console.warn(`[Cloudinary] Falta la variable ${v}`);
    }
  }
})();

export default ({ env }) => {
  const cloud = env("CLOUDINARY_NAME");
  const key = env("CLOUDINARY_API_KEY");
  // ¡no loguees el secret!
  console.log("[Cloudinary cfg] cloud:", cloud, " key-last4:", key?.slice(-4));

  return {
    upload: {
      config: {
        provider: "cloudinary",
        providerOptions: {
          cloud_name: cloud,
          api_key: key,
          api_secret: env("CLOUDINARY_API_SECRET"),
        },
      },
    },
  };
};

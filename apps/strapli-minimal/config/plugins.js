(() => {
  const required = ["CLOUDINARY_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];
  for (const name of required) {
    if (!process.env[name]) {
      console.warn(`[cloudinary] Falta la variable ${name}`);
    }
  }
})();

export default ({ env }) => ({
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_API_KEY"),
        api_secret: env("CLOUDINARY_API_SECRET"),
      },
    },
  },
});

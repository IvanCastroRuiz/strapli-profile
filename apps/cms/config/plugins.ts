export default ({ env }) => ({
  upload: {
    config: {
      provider: "@strapi/provider-upload-cloudinary",
      providerOptions: {
        cloudName: env("CLOUDINARY_NAME"),
        apiKey: env("CLOUDINARY_API_KEY"),
        apiSecret: env("CLOUDINARY_API_SECRET"),
      },
      actionOptions: {
        upload: {
          folder: "portfolio",
        },
      },
    },
  },
});

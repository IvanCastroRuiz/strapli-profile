const { join } = require('node:path');

const configDirectory = __dirname;
const cloudinaryProviderPath = join(configDirectory, 'providers', 'cloudinary');

module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: cloudinaryProviderPath,
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_API_KEY'),
        api_secret: env('CLOUDINARY_API_SECRET'),
        default_transformations: env.json
          ? env.json('CLOUDINARY_DEFAULT_TRANSFORMATIONS', [])
          : [],
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  'users-permissions': {
    enabled: true,
    config: {
      jwtManagement: env('USERS_PERMISSIONS_JWT_MANAGEMENT', 'legacy-support'),
    },
  },
});

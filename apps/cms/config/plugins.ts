import { join } from 'node:path';

const configDirectory = __dirname;
const cloudinaryProviderPath = join(configDirectory, 'providers', 'cloudinary');

export default ({ env }) => ({
  upload: {
    config: {
      provider: cloudinaryProviderPath,
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_API_KEY'),
        api_secret: env('CLOUDINARY_API_SECRET'),
        default_transformations: env.json('CLOUDINARY_DEFAULT_TRANSFORMATIONS', []),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});

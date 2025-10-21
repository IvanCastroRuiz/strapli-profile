import cloudinary from 'cloudinary';

// Si usas CLOUDINARY_URL no necesitas config extra.
// Si prefieres individuales, descomenta y pasa tus envs:
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

try {
  console.log("URL present?", !!process.env.CLOUDINARY_URL);
  const res = await cloudinary.v2.uploader.upload(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB...", // pixel 1x1 válido
    { folder: "strapi-test" }
  );
  console.log("OK upload => public_id:", res.public_id);
} catch (e) {
  console.error("Cloudinary error:", e?.message || e);
}
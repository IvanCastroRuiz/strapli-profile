export const cld = (
  publicId: string,
  opts?: { w?: number; h?: number; q?: number; fit?: "fill" | "cover" }
) => {
  const base = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload/`;
  const params: string[] = [];
  if (opts?.w) params.push(`w_${opts.w}`);
  if (opts?.h) params.push(`h_${opts.h}`);
  if (opts?.q) params.push(`q_${opts.q}`);
  if (opts?.fit) params.push(`c_${opts.fit}`);
  const prefix = params.length > 0 ? `${params.join(",")}/` : "";
  return `${base}${prefix}${publicId}.jpg`;
};

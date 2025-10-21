import { NextResponse } from "next/server";
import qs from "qs";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") ?? "";

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const strapiQuery = qs.stringify(
    {
      populate: ["categoria"],
      filters: {
        $or: [
          { titulo: { $containsi: query } },
          { descripcion: { $containsi: query } },
          { tags: { nombre: { $containsi: query } } },
        ],
      },
      pagination: { pageSize: 10 },
    },
    { encodeValuesOnly: true }
  );

  const url = `${STRAPI_URL}/api/disenos?${strapiQuery}`;
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    return NextResponse.json({ results: [] }, { status: 500 });
  }

  const json = await response.json();
  const results = (json.data ?? []).map((design: any) => ({
    titulo: design.attributes?.titulo ?? design.titulo,
    slug: design.attributes?.slug ?? design.slug,
    categoria:
      design.attributes?.categoria?.data?.attributes?.nombre ??
      design.categoria?.nombre ??
      null,
  }));

  return NextResponse.json({ results });
}

import "server-only";
import qs from "qs";
import type { Ajustes, Category, Design, HomePage } from "@/types/strapi";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:1337";

const defaultOptions: RequestInit = {
  next: { revalidate: 120 },
  headers: {
    "Content-Type": "application/json",
  },
};

interface StrapiEntry<T> {
  id: number;
  attributes: T;
}

const absoluteUrl = (url?: string | null) => {
  if (!url) return url ?? "";
  if (url.startsWith("http")) return url;
  return `${CMS_URL}${url}`;
};

const normalize = <T>(entry: any): T | null => {
  if (!entry) return null;
  if (Array.isArray(entry)) {
    return entry.map((item) => normalize(item)).filter(Boolean) as unknown as T;
  }
  if (entry?.data !== undefined) {
    if (Array.isArray(entry.data)) {
      return entry.data.map((item) => normalize(item)).filter(Boolean) as unknown as T;
    }
    return normalize(entry.data);
  }
  if (entry?.attributes) {
    const attrs = entry.attributes as Record<string, any>;
    const result: Record<string, any> = { id: entry.id };
    Object.entries(attrs).forEach(([key, value]) => {
      if (value && typeof value === "object" && (value.data !== undefined || value.id)) {
        result[key] = normalize(value);
      } else if (key === "url" && typeof value === "string") {
        result[key] = absoluteUrl(value);
      } else {
        result[key] = value;
      }
    });
    if (typeof result.url === "string") {
      result.url = absoluteUrl(result.url);
    }
    return result as T;
  }
  if (entry && typeof entry === "object" && "url" in entry) {
    return {
      ...entry,
      url: absoluteUrl(entry.url),
    } as T;
  }
  return entry as T;
};

const buildUrl = (path: string, params?: Record<string, any>) => {
  const query = params
    ? qs.stringify(params, { encodeValuesOnly: true })
    : "";
  const url = new URL(`/api${path}${query ? `?${query}` : ""}`, CMS_URL);
  return url.toString();
};

const fetchAPI = async <T>(path: string, params?: Record<string, any>) => {
  const url = buildUrl(path, params);
  const res = await fetch(url, defaultOptions);
  if (!res.ok) {
    console.error(await res.text());
    throw new Error(`Error al consultar ${url}`);
  }
  const json = await res.json();
  return json as { data: StrapiEntry<T>[] | StrapiEntry<T> };
};

export const getHome = async () => {
  const response = await fetchAPI<HomePage>("/home", { populate: "*" });
  return normalize<HomePage>(response.data) as HomePage;
};

export const getCategorias = async () => {
  const response = await fetchAPI<Category[]>("/categorias", {
    populate: "*",
    pagination: { pageSize: 50 },
    sort: "nombre:asc",
  });
  return (normalize<Category[]>(response.data) ?? []) as Category[];
};

export const getDisenos = async (filters?: Record<string, any>) => {
  const response = await fetchAPI<Design[]>("/disenos", {
    populate: "*",
    pagination: { pageSize: 50 },
    sort: "fecha_publicacion:desc",
    filters,
  });
  return (normalize<Design[]>(response.data) ?? []) as Design[];
};

export const getDiseno = async (slug: string) => {
  const response = await fetchAPI<Design[]>("/disenos", {
    populate: "*",
    filters: { slug: { $eq: slug } },
    pagination: { pageSize: 1 },
  });
  const designs = (normalize<Design[]>(response.data) ?? []) as Design[];
  return designs[0] ?? null;
};

export const getAjustes = async () => {
  const response = await fetchAPI<Ajustes>("/ajustes", { populate: "*" });
  return normalize<Ajustes>(response.data) as Ajustes;
};

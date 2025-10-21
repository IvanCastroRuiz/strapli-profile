// Quick Strapi endpoint checker
// Usage: NEXT_PUBLIC_STRAPI_URL=http://localhost:1337 node strapli-profile/scripts/check-cms.mjs

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

const build = (path, params) => {
  const url = new URL(`/api${path}`, STRAPI_URL);
  if (params) {
    for (const [k, v] of new URLSearchParams(params)) url.searchParams.append(k, v);
  }
  return url.toString();
};

const endpoints = [
  { name: "home", url: build("/home", { populate: "*" }) },
  { name: "ajuste", url: build("/ajuste", { populate: "*" }) },
  { name: "categorias", url: build("/categorias", { populate: "*", "pagination[pageSize]": "1" }) },
  { name: "disenos", url: build("/disenos", { populate: "*", "pagination[pageSize]": "1" }) },
  { name: "disenos_destacados", url: build("/disenos", { populate: "*", "pagination[pageSize]": "1", "filters[destacado][$eq]": "true" }) },
];

async function check(url) {
  try {
    const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
    const status = `${res.status} ${res.statusText}`;
    let bodyText = "";
    let json = null;
    try { json = await res.clone().json(); } catch { bodyText = await res.text().catch(() => ""); }
    return { status, json, bodyText };
  } catch (e) {
    return { status: "ERR", json: null, bodyText: String(e) };
  }
}

(async () => {
  console.log(`STRAPI_URL: ${STRAPI_URL}`);
  for (const e of endpoints) {
    console.log("\n==>", e.name, e.url);
    const { status, json, bodyText } = await check(e.url);
    console.log("status:", status);
    if (json) {
      const keys = Object.keys(json || {});
      const dataPreview = json && json.data;
      const preview = Array.isArray(dataPreview)
        ? `array[len=${dataPreview.length}]`
        : dataPreview === null || dataPreview === undefined
        ? String(dataPreview)
        : typeof dataPreview;
      console.log("json keys:", keys.join(", "));
      console.log("data:", preview);
    } else if (bodyText) {
      console.log("body:", bodyText.slice(0, 200));
    }
  }
})();


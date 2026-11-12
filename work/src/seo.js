import { translate } from "./i18n.js";

export const publicSiteUrl = "https://hiotera.com";

export const seoPages = {
  home: {
    path: "/",
    title: "Sensores para invernaderos en Almería | Hiotera",
    description:
      "Sensores de suelo y clima y una aplicación sencilla para conocer tu cultivo. Instalación, formación y 1 año de mantenimiento gratis. Oficina en El Ejido.",
  },
  meteo: {
    path: "/meteo.html",
    title: "Estación meteorológica para invernaderos | Hiotera",
    description:
      "Conoce la estación meteorológica de Hiotera: mide la temperatura, la humedad, la lluvia y el viento en tu finca y descubre cada pieza con un modelo 3D interactivo.",
  },
  legal: { path: "/legal.html" },
};

const languageTags = {
  es: "es-ES",
  en: "en",
  fr: "fr",
  de: "de",
};

export function localizedPageUrl(path, language) {
  const url = new URL(path, publicSiteUrl);
  if (language !== "es") url.searchParams.set("lang", language);
  return url.href;
}

function setMeta(selector, attributeName, attributeValue, value) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attributeName, attributeValue);
    document.head.append(element);
  }
  element.content = value;
}

function setLink(rel, href, hreflang) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    if (hreflang) element.hreflang = hreflang;
    document.head.append(element);
  }
  element.href = href;
}

export function updatePageSeo({ pageKey = "home", language, pageTitle }) {
  const page = seoPages[pageKey] ?? seoPages.home;
  const title = pageKey === "legal"
    ? `${translate(pageTitle ?? "Información legal", language)} | Hiotera`
    : translate(page.title, language);
  const description = translate(
    page.description ??
      "Consulta el aviso legal, la política de privacidad y la política de cookies de Hiotera.",
    language,
  );
  const canonicalUrl = localizedPageUrl(page.path, language);

  document.documentElement.lang = language;
  document.title = title;
  setMeta('meta[name="description"]', "name", "description", description);
  setMeta('meta[property="og:title"]', "property", "og:title", title);
  setMeta(
    'meta[property="og:description"]',
    "property",
    "og:description",
    description,
  );
  setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
  setMeta(
    'meta[property="og:locale"]',
    "property",
    "og:locale",
    { es: "es_ES", en: "en_US", fr: "fr_FR", de: "de_DE" }[language],
  );
  setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
  setMeta(
    'meta[name="twitter:description"]',
    "name",
    "twitter:description",
    description,
  );
  setLink("canonical", canonicalUrl);

  if (pageKey !== "legal") {
    for (const [code, tag] of Object.entries(languageTags))
      setLink("alternate", localizedPageUrl(page.path, code), tag);
    setLink("alternate", localizedPageUrl(page.path, "es"), "x-default");
  }
}

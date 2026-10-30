import { translations } from "./translations.js";

export const languageStorageKey = "hiotera-language";
export const languages = [
  { code: "es", name: "Español" },
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
];
export const isLanguage = (value) =>
  languages.some((item) => item.code === value);
export const normalizeText = (value) => value.replace(/\s+/g, " ").trim();
export function translate(value, language = "es") {
  if (typeof value !== "string" || language === "es") return value;
  const key = normalizeText(value);
  const direct = translations[key]?.[language];
  if (direct)
    return `${value.match(/^\s*/)[0]}${direct}${value.match(/\s*$/)[0]}`;
  if (key.startsWith("Ver ")) {
    const [, name, connector] =
      key.match(/^Ver (.*?)(?:, conector (\d+))?$/) ?? [];
    if (name)
      return (
        translations.viewItem[language].replace(
          "{name}",
          translate(name, language),
        ) +
        (connector
          ? translations.connectorLabel[language].replace("{number}", connector)
          : "")
      );
  }
  // Accessible descriptions contain the translated name of the selected item.
  const patterns = [
    ["Ampliar modelo 3D de ", "expandModel"],
    ["Restablecer vista de ", "resetModel"],
    ["Controles 3D de ", "modelControls"],
    ["Acercar ", "zoomIn"],
    ["Alejar ", "zoomOut"],
    ["Ampliar demostración: ", "expandDemo"],
    ["Consultar ", "askAbout"],
    ["Modelo 3D de ", "modelDescription"],
  ];
  for (const [prefix, id] of patterns)
    if (key.startsWith(prefix)) {
      const name = key.slice(prefix.length).split(". Arrastra")[0];
      return translations[id][language].replace(
        "{name}",
        translate(name, language),
      );
    }
  return value;
}
export function legalUrl(document, language = "es") {
  return `./legal.html?document=${encodeURIComponent(document)}&lang=${isLanguage(language) ? language : "es"}`;
}

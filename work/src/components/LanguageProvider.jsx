import {
  Children,
  cloneElement,
  createContext,
  Fragment,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { isLanguage, languageStorageKey, translate } from "../i18n.js";
import { updatePageSeo } from "../seo.js";

const translatedAttributes = [
  "aria-label",
  "aria-description",
  "alt",
  "title",
  "placeholder",
];
export function translateTree(node, language) {
  if (typeof node === "string") return translate(node, language);
  if (Array.isArray(node))
    return node.map((child) => translateTree(child, language));
  if (!isValidElement(node)) return node;
  // Opaque React components own their translations. In particular, the app
  // demonstration is intentionally not translated or altered by this layer.
  if (typeof node.type !== "string" && node.type !== Fragment) return node;
  if (node.props.translate === "no") return node;
  const props = {};
  for (const key of translatedAttributes)
    if (typeof node.props[key] === "string")
      props[key] = translate(node.props[key], language);
  if (node.props.children !== undefined)
    props.children = Children.map(node.props.children, (child) =>
      translateTree(child, language),
    );
  return cloneElement(node, props);
}
const LanguageContext = createContext({
  language: "es",
  setLanguage: () => {},
  resetLanguage: () => {},
  t: (text) => text,
  localize: (tree) => tree,
});
function initialValue() {
  if (typeof window === "undefined") return "es";
  const query = new URLSearchParams(window.location.search).get("lang");
  if (isLanguage(query)) return query;
  try {
    const saved = window.localStorage.getItem(languageStorageKey);
    return isLanguage(saved) ? saved : "es";
  } catch {
    return "es";
  }
}
export function LanguageProvider({
  children,
  initialLanguage,
  pageTitle,
  pageKey = "home",
}) {
  const [language, update] = useState(() =>
    isLanguage(initialLanguage) ? initialLanguage : initialValue(),
  );
  const setLanguage = (code) => {
    if (!isLanguage(code)) return;
    update(code);
    try {
      window.localStorage.setItem(languageStorageKey, code);
    } catch {
      /* Storage may be blocked; switching still works. */
    }
    const url = new URL(window.location.href);
    url.searchParams.set("lang", code);
    window.history.replaceState(null, "", url);
  };
  const resetLanguage = () => {
    update("es");
    try {
      window.localStorage.removeItem(languageStorageKey);
    } catch {
      /* Keep the site usable without browser storage. */
    }
    const url = new URL(window.location.href);
    url.searchParams.delete("lang");
    window.history.replaceState(null, "", url);
  };
  useEffect(() => {
    updatePageSeo({ pageKey, language, pageTitle });
  }, [language, pageKey, pageTitle]);
  const value = useMemo(
    () => ({
      language,
      setLanguage,
      resetLanguage,
      t: (text) => translate(text, language),
      localize: (tree) => translateTree(tree, language),
    }),
    [language],
  );
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
export const useLanguage = () => useContext(LanguageContext);

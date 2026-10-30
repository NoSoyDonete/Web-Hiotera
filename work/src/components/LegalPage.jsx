import { legalDocuments, legalIdentity } from "../legalContent.js";
import { legalUrl } from "../i18n.js";
import { site } from "../config.js";
import { useLanguage } from "./LanguageProvider.jsx";
import LanguageSelector from "./LanguageSelector.jsx";
import { Footer } from "./HeaderFooter.jsx";

export default function LegalPage({ documentKey = "aviso-legal" }) {
  const { language, localize, resetLanguage, t } = useLanguage();
  const entry = legalDocuments[documentKey] ?? legalDocuments["aviso-legal"];
  return localize(
    <>
      <header className="legal-header">
        <a href={`./?lang=${language}#inicio`}>← Volver a Hiotera</a>
        <LanguageSelector />
      </header>
      <main className="legal-page">
        <p className="legal-eyebrow">HIOTERA · INFORMACIÓN LEGAL</p>
        <h1>{entry.title}</h1>
        <nav className="legal-tabs" aria-label="Documentos legales">
          {Object.entries(legalDocuments).map(([key, item]) => (
            <a
              href={legalUrl(key, language)}
              key={key}
              aria-current={key === documentKey ? "page" : undefined}
            >
              {item.title}
            </a>
          ))}
        </nav>
        <p className="legal-updated">Actualizado: 26 de octubre de 2026</p>
        {entry.sections.map(([heading, paragraphs], index) => (
          <section key={heading}>
            <h2>{heading}</h2>
            {paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
            {index === 0 && documentKey !== "cookies" && (
              <dl className="legal-identity">
                {legalIdentity.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        ))}
        {documentKey === "cookies" && (
          <button className="button legal-reset" onClick={resetLanguage}>
            {t("Borrar mi preferencia de idioma")}
          </button>
        )}
        <aside className="legal-links">
          <a
            href="https://www.aepd.es/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Agencia Española de Protección de Datos ↗
          </a>
          <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>
        </aside>
      </main>
      <Footer />
    </>,
  );
}

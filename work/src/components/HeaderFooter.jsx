import { assetUrl, site } from "../config.js";
import { legalUrl } from "../i18n.js";
import { useLanguage } from "./LanguageProvider.jsx";
import LanguageSelector from "./LanguageSelector.jsx";

function Brand({ footer = false }) {
  const { localize, language } = useLanguage();
  return localize(
    <a
      className={footer ? "footer-brand" : "brand"}
      href={footer ? `./?lang=${language}#inicio` : "#inicio"}
      aria-label="Hiotera, inicio"
    >
      <img
        className="brand-icon"
        src={assetUrl("brand/icon-128.png")}
        alt=""
        width="44"
        height="44"
      />
      <span>Hiotera</span>
    </a>,
  );
}

export function Header() {
  const { localize } = useLanguage();
  return localize(
    <header className="topbar" aria-label="Navegación principal">
      <Brand />
      <nav className="nav-links">
        <a href="#nodo">El LIBOx</a>
        <a href="#meteo">La meteo</a>
        <a href="#senal">La aplicación</a>
        <a href="#catalogo">Catálogo</a>
      </nav>
      <div className="topbar-actions">
        <a className="nav-meteo-link" href="#catalogo">
          Catálogo <span aria-hidden="true">↓</span>
        </a>
        <LanguageSelector />
        <a
          className="nav-cta"
          href="https://demo.hiotera.com/"
          aria-label="Acceso a la aplicación"
        >
          <span className="nav-cta-label">Acceso a la aplicación</span>
          <span className="nav-cta-short" aria-hidden="true">
            Acceder
          </span>
          <span className="arrow" aria-hidden="true">
            ↗
          </span>
        </a>
      </div>
    </header>,
  );
}

export function Footer({ onContact }) {
  const { language, localize } = useLanguage();
  const home = `./?lang=${language}`;
  return localize(
    <footer className="site-footer" id="oficina">
      <div className="site-footer-grid">
        <div className="footer-intro">
          <Brand footer />
          <p>Sensores y una aplicación para conocer mejor tu cultivo.</p>
        </div>
        <nav aria-label="Menú del pie de página">
          <h3>Menú</h3>
          <a href={`${home}#inicio`}>Inicio</a>
          <a href={`${home}#nodo`}>El LIBOx</a>
          <a href={`${home}#senal`}>La aplicación</a>
          <a href={`${home}#catalogo`}>Catálogo</a>
          <a href={`${home}#preguntas`}>Preguntas frecuentes</a>
          <a
            href="https://docs.hiotera.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Manual
          </a>
        </nav>
        <nav aria-label="Información legal">
          <h3>Legal</h3>
          <a href={legalUrl("aviso-legal", language)}>Aviso legal</a>
          <a href={legalUrl("privacidad", language)}>Privacidad</a>
          <a href={legalUrl("cookies", language)}>Política de cookies</a>
        </nav>
        <div className="footer-office">
          <h3>Oficina y contacto</h3>
          <address>
            <a href={site.officeMap} target="_blank" rel="noopener noreferrer">
              {site.officeAddress}
            </a>
          </address>
          <a
            className="footer-directions"
            href={site.officeMap}
            target="_blank"
            rel="noopener noreferrer"
          >
            Cómo llegar ↗
          </a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a className="footer-phone" href={site.phoneHref}>
            {site.phone}
          </a>
          <p>Lunes a viernes, de 8:00 a 16:00</p>
          {onContact && (
            <button className="footer-contact" onClick={onContact}>
              Hablar con la oficina ↗
            </button>
          )}
        </div>
      </div>
      <div className="site-footer-bottom">
        <span>{site.copyright}</span>
        <span>
          {site.company} · CIF {site.taxId}
        </span>
      </div>
    </footer>,
  );
}

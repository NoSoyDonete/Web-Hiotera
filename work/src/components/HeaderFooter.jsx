import { assetUrl, site } from "../config.js";

function Brand({ footer = false }) {
  return (
    <a
      className={footer ? "footer-brand" : "brand"}
      href="#inicio"
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
    </a>
  );
}

export function Header({ onContact }) {
  return (
    <header className="topbar" aria-label="Navegación principal">
      <Brand />
      <nav className="nav-links">
        <a href="#nodo">El LIBOx</a>
        <a href="#meteo">La meteo</a>
        <a href="#senal">La aplicación</a>
        <a href="#catalogo">Catálogo</a>
      </nav>
      <a className="nav-meteo-link" href="#catalogo">
        Catálogo <span aria-hidden="true">↓</span>
      </a>
      <button
        className="nav-cta"
        onClick={onContact}
        aria-label="Habla con un experto"
      >
        <span className="nav-cta-label">Habla con un experto</span>
        <span className="nav-cta-short" aria-hidden="true">
          Hablemos
        </span>
        <span className="arrow" aria-hidden="true">
          ↗
        </span>
      </button>
    </header>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <Brand footer />
        <div className="footer-meta">
          <span>{site.location}</span>
          <a href={site.phoneHref}>{site.phone}</a>
          <span>{site.copyright}</span>
        </div>
      </div>
    </footer>
  );
}

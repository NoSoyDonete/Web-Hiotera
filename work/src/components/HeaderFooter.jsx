import { site } from "../config.js";

function Brand({ footer = false }) {
  return (
    <a
      className={footer ? "footer-brand" : "brand"}
      href="#inicio"
      aria-label="Hiotera, inicio"
    >
      <span className="brand-dot">h</span>
      <span>hiotera</span>
    </a>
  );
}

export function Header({ onContact }) {
  return (
    <header className="topbar" aria-label="Navegación principal">
      <Brand />
      <nav className="nav-links">
        <a href="#nodo">El nodo</a>
        <a href="#senal">La señal</a>
        <a href="#impacto">Impacto</a>
      </nav>
      <button className="nav-cta" onClick={onContact}>
        Habla con un experto <span className="arrow">↗</span>
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

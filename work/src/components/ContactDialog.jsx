import { useLanguage } from "./LanguageProvider.jsx";
import { useEffect, useRef, useState } from "react";
import { legalUrl } from "../i18n.js";
import { site } from "../config.js";

// Netlify Forms recoge el envío en producción; en local no hay servidor de
// formularios, así que se simula sin enviar nada.
const isLocal = () =>
  ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);

export default function ContactDialog({ open, onClose, onPrepared }) {
  const { localize, language } = useLanguage();
  const dialogRef = useRef(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    if (sending) return;
    setError("");
    if (isLocal()) {
      onPrepared("demo");
      return;
    }
    setSending(true);
    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(event.currentTarget)).toString(),
      });
      if (!response.ok) throw new Error(String(response.status));
      onPrepared("sent");
    } catch {
      setError(
        "No se ha podido enviar la consulta. Revisa tu conexión y vuelve a intentarlo, o escríbenos por WhatsApp.",
      );
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement;
    document.body.classList.add("locked");
    const frame = requestAnimationFrame(() =>
      dialogRef.current?.querySelector("input")?.focus(),
    );
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const controls = [
        ...dialogRef.current.querySelectorAll(
          "button, input, textarea, a[href]",
        ),
      ];
      const first = controls[0],
        last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.body.classList.remove("locked");
      document.removeEventListener("keydown", onKeyDown);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  return localize(
    <div
      ref={dialogRef}
      className="modal open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-title"
      aria-describedby="contact-description"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-card">
        <button className="close-modal" aria-label="Cerrar" onClick={onClose}>
          ×
        </button>
        <h2 id="contact-title">
          Cuéntanos
          <br />
          qué necesitas.
        </h2>
        <p id="contact-description">
          Lo más rápido es escribirnos por WhatsApp o llamarnos. Si prefieres,
          deja tus datos y te respondemos en horario de oficina.
        </p>
        <div className="contact-quick">
          {site.whatsapp && (
            <a
              className="button acid"
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Escribir por WhatsApp <span className="arrow">↗</span>
            </a>
          )}
          <a className="button contact-call" href={site.phoneHref}>
            Llamar al {site.phone}
          </a>
        </div>
        <form
          className="form-grid"
          name="contacto"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={submit}
        >
          <input type="hidden" name="form-name" value="contacto" />
          <p className="form-honeypot" aria-hidden="true">
            <label>
              No rellenar <input name="bot-field" tabIndex={-1} />
            </label>
          </p>
          <label className="form-field">
            <span>
              Nombre
            </span>
            <input type="text" name="name" autoComplete="name" required />
          </label>
          <label className="form-field">
            <span>
              Correo electrónico
            </span>
            <input type="email" name="email" autoComplete="email" required />
          </label>
          <label className="form-field">
            <span>
              Teléfono <small>(opcional)</small>
            </span>
            <input type="tel" name="phone" autoComplete="tel" />
          </label>
          <label className="form-field">
            <span>
              Municipio <small>(opcional)</small>
            </span>
            <input
              type="text"
              name="town"
              autoComplete="address-level2"
            />
          </label>
          <label className="form-field form-field-wide">
            <span>
              ¿Qué cultivas?
            </span>
            <input
              type="text"
              name="crop"
              placeholder="Por ejemplo: pimiento en invernadero"
              required
            />
          </label>
          <label className="form-field form-field-wide">
            <span>
              ¿Qué te gustaría controlar? <small>(opcional)</small>
            </span>
            <textarea name="message" />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <p className="form-privacy">
            <a
              href={legalUrl("privacidad", language)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Política de privacidad
            </a>
          </p>
          <button className="button" type="submit" disabled={sending}>
            {sending ? "Enviando…" : "Enviar consulta"}{" "}
            <span className="arrow">↗</span>
          </button>
        </form>
      </div>
    </div>,
  );
}

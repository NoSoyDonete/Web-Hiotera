import { useEffect, useRef } from "react";
import { site } from "../config.js";

export default function ContactDialog({ open, onClose, onPrepared }) {
  const dialogRef = useRef(null);

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
  return (
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
        <div className="section-label">Hablemos de tu finca</div>
        <h2 id="contact-title">
          Hagamos que
          <br />
          crezca mejor.
        </h2>
        <p id="contact-description">
          Cuéntanos cómo es tu cultivo. También puedes llamarnos al{" "}
          <a href={site.phoneHref}>{site.phone}</a>.
        </p>
        <form
          className="form-grid"
          onSubmit={(event) => {
            event.preventDefault();
            onPrepared();
          }}
        >
          <input
            type="text"
            name="name"
            aria-label="Nombre"
            autoComplete="name"
            placeholder="Nombre"
            required
          />
          <input
            type="email"
            name="email"
            aria-label="Email"
            autoComplete="email"
            placeholder="Email"
            required
          />
          <input
            type="text"
            name="crop"
            aria-label="¿Qué cultivas?"
            placeholder="¿Qué cultivas?"
            required
          />
          <textarea
            name="message"
            aria-label="Cuéntanos qué te gustaría mejorar"
            placeholder="Cuéntanos qué te gustaría mejorar"
          />
          <p className="form-note">
            Formulario de demostración. Los datos todavía no se envían.
          </p>
          <button className="button" type="submit">
            Preparar consulta <span className="arrow">↗</span>
          </button>
        </form>
      </div>
    </div>
  );
}

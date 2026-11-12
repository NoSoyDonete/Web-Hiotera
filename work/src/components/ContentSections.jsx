import { useLanguage } from "./LanguageProvider.jsx";
import { Fragment, useState } from "react";
import { assetUrl, site } from "../config.js";
import {
  faqItems,
  impactCards,
  includedItems,
  journeySteps,
  nodeSteps,
} from "../content.js";

const indexLabel = (index) => String(index + 1).padStart(2, "0");
function Lines({ items }) {
  const { t } = useLanguage();
  return items.map((line, index) => (
    <Fragment key={t(line)}>
      {index > 0 && <br />}
      {t(line)}
    </Fragment>
  ));
}

export function Marquee() {
  const { localize } = useLanguage();
  return localize(
    <div className="marquee" aria-label="Mide, consulta y decide">
      <div className="marquee-track">
        <b>MIDE</b>
        <i aria-hidden="true">✳</i>
        <b>CONSULTA</b>
        <i aria-hidden="true">✳</i>
        <b>DECIDE</b>
      </div>
    </div>,
  );
}

export function StatementSection() {
  const { localize } = useLanguage();
  return localize(
    <section className="section statement">
      <div className="section-inner">
        <div className="statement-grid">
          <div>
            <h2>
              El cultivo
              <br />
              ya está
              <br />
              <span>hablando.</span>
            </h2>
          </div>
          <div className="statement-copy">
            <p>
              No siempre se ve a simple vista si el suelo necesita agua o si
              cambia el ambiente del invernadero. Hiotera reúne las lecturas de
              los sensores para que puedas comprobarlo en la aplicación.
            </p>
            <a className="micro-link" href="#senal">
              <b>↘</b> ver la aplicación
            </a>
          </div>
        </div>
      </div>
    </section>,
  );
}

export function NodeSection() {
  const { localize } = useLanguage();
  const [inspecting, setInspecting] = useState(false);
  return localize(
    <section className="section node-lab" id="nodo">
      <div className="section-inner">
        <div className="lab-top">
          <div>
            <div className="section-label subdued-label">02 / el nodo</div>
            <h2>
              Una pieza
              <br />
              pequeña.
              <br />
              <span>
                Una visión
                <br />
                enorme.
              </span>
            </h2>
          </div>
          <p>
            El hardware de Hiotera vive dentro del invernadero, cerca de la
            planta y lejos del ruido. Desde ahí recopila la información que la
            plataforma necesita para cuidar mejor cada campaña.
          </p>
        </div>
        <div className="lab-layout">
          <div className={`lab-visual${inspecting ? " is-inspecting" : ""}`}>
            <div className="lab-photo">
              <img
                src={assetUrl(site.installationPhoto)}
                alt="LIBOx instalado en un invernadero entre el cultivo"
                loading="lazy"
              />
              <span className="lab-mark m1">01</span>
              <span className="lab-mark m2">02</span>
              <span className="lab-mark m3">03</span>
            </div>
            <div className="lab-meta">
              <span>PHOTO / REAL INSTALLATION</span>
              <span>HIOTERA LIBOx</span>
            </div>
            <button
              className="inspect-button"
              type="button"
              aria-pressed={inspecting}
              onClick={() => setInspecting((value) => !value)}
            >
              {inspecting ? "Desactivar" : "Activar"} modo escáner{" "}
              <span>↗</span>
            </button>
          </div>
          <div className="lab-steps">
            {nodeSteps.map((item, index) => (
              <article className="lab-step" key={item.title}>
                <span className="lab-no">{indexLabel(index)}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>
                    {item.description}
                    {item.emphasis && (
                      <>
                        {" "}
                        <em>{item.emphasis}</em>
                      </>
                    )}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>,
  );
}

export function ImpactSection() {
  const { localize } = useLanguage();
  return localize(
    <section className="section impact" id="impacto">
      <div className="section-inner">
        <div className="impact-top">
          <h2>
            Conoce tu finca.
            <br />
            Decide <span className="green-text">mejor.</span>
          </h2>
          <p>
            Saber cómo están el suelo y el ambiente te ayuda a decidir qué
            necesita atención en tu finca.
          </p>
        </div>
        <div className="impact-grid">
          {impactCards.map((item, index) => (
            <article className="impact-card" key={item.category}>
              <span className="impact-index">
                {indexLabel(index)} / {item.category}
              </span>
              <h3>
                <Lines items={item.title} />
              </h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>,
  );
}

export function JourneySection() {
  const { localize } = useLanguage();
  return localize(
    <section className="section steps">
      <div className="section-inner">
        <div className="steps-layout">
          <div className="steps-intro">
            <h2>
              Empieza
              <br />
              simple.
            </h2>
            <p>
              Elige qué quieres medir y nosotros nos encargamos del resto.
            </p>
          </div>
          <div className="step-list">
            {journeySteps.map((item, index) => (
              <div className="step" key={item.title}>
                <span className="step-no">{indexLabel(index)}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>,
  );
}

export function IncludedSection() {
  const { localize } = useLanguage();
  return localize(
    <section
      className="section included"
      id="incluye"
      aria-labelledby="included-title"
    >
      <div className="section-inner">
        <div className="included-heading">
          <h2 id="included-title">
            Todo incluido
            <br />
            <span>desde el primer día.</span>
          </h2>
          <p>
            No tienes que preocuparte de montar nada. Nos encargamos de la
            instalación y te acompañamos después.
          </p>
        </div>
        <div className="included-grid">
          {includedItems.map((item, index) => (
            <article className="included-card" key={item.title}>
              <span className="included-no" aria-hidden="true">
                {indexLabel(index)}
              </span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>,
  );
}

export function FaqSection({ onContact }) {
  const { localize } = useLanguage();
  return localize(
    <section
      className="section faq"
      id="preguntas"
      aria-labelledby="faq-title"
    >
      <div className="section-inner faq-layout">
        <div className="faq-intro">
          <h2 id="faq-title">
            Preguntas
            <br />
            <span>frecuentes.</span>
          </h2>
          <aside className="faq-office" aria-label="Oficina de Hiotera">
            <h3>¿Prefieres hablar con alguien?</h3>
            <a className="faq-phone" href={site.phoneHref}>
              {site.phone}
            </a>
            <p>Lunes a viernes, de 8:00 a 16:00</p>
            <p>{site.officeAddress}</p>
            <div className="faq-office-actions">
              <button className="button dark-button" onClick={onContact}>
                Escríbenos <span className="arrow">↗</span>
              </button>
              <a
                className="faq-map"
                href={site.officeMap}
                target="_blank"
                rel="noopener noreferrer"
              >
                Cómo llegar ↗
              </a>
            </div>
          </aside>
        </div>
        <div className="faq-list">
          {faqItems.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>
                {item.question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>,
  );
}

export function WhatsAppButton() {
  const { localize } = useLanguage();
  if (!site.whatsapp) return null;
  return localize(
    <a
      className="whatsapp-button"
      href={`https://wa.me/${site.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"
        />
      </svg>
      <span>WhatsApp</span>
    </a>,
  );
}

export function ClosingSection({ onContact }) {
  const { localize } = useLanguage();
  return localize(
    <section className="closing">
      <div className="closing-inner">
        <h2>
          Tu mejor
          <br />
          cultivo <span>empieza aquí.</span>
        </h2>
        <div className="closing-row">
          <p>
            Cuéntanos qué cultivas, cómo trabajas hoy y qué quieres mejorar. Te
            enseñamos qué puedes medir y cómo verlo en la aplicación.
          </p>
          <button className="button dark-button" onClick={onContact}>
            Habla con un experto <span className="arrow">↗</span>
          </button>
        </div>
      </div>
    </section>,
  );
}

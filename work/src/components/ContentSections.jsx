import { useLanguage } from "./LanguageProvider.jsx";
import { Fragment, useState } from "react";
import { assetUrl, site } from "../config.js";
import { impactCards, journeySteps, nodeSteps } from "../content.js";

const indexLabel = (index) => String(index + 1).padStart(2, "0");
function Lines({ items }) {
  const { t } = useLanguage();
  return items.map((line, index) => (
    <Fragment key={t(line)}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));
}

export function Marquee() {
  const { localize } = useLanguage();
  return localize(
    <div className="marquee" aria-label="Mide, interpreta y recomienda">
      <div className="marquee-track">
        <b>MIDE</b>
        <i aria-hidden="true">✳</i>
        <b>INTERPRETA</b>
        <i aria-hidden="true">✳</i>
        <b>RECOMIENDA</b>
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
            <div className="section-label">01 / la idea</div>
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
              <span className="impact-stamp">
                <Lines items={item.stamp} />
              </span>
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
            <div className="section-label">04 / el camino</div>
            <h2>
              Empieza
              <br />
              simple.
            </h2>
            <p>
              Empieza por lo que necesitas medir. Podemos ayudarte a elegir los
              sensores para tu finca.
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

export function ClosingSection({ onContact }) {
  const { localize } = useLanguage();
  return localize(
    <section className="closing">
      <div className="closing-inner">
        <div className="section-label">05 / siguiente paso</div>
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

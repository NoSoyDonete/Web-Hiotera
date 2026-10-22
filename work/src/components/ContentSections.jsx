import { Fragment, useState } from "react";
import { assetUrl, site } from "../config.js";
import { impactCards, journeySteps, nodeSteps } from "../content.js";

const indexLabel = (index) => String(index + 1).padStart(2, "0");
function Lines({ items }) {
  return items.map((line, index) => (
    <Fragment key={line}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));
}

export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {Array.from({ length: 2 }, (_, index) => (
          <Fragment key={index}>
            <b>MIDE</b>
            <i>✳</i>
            <b>INTERPRETA</b>
            <i>✳</i>
            <b>RECOMIENDA</b>
            <i>✳</i>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export function StatementSection() {
  return (
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
              La humedad, la temperatura, la luz y el CO₂ cambian antes de que
              el ojo lo vea. Hiotera convierte esas señales en una lectura
              sencilla para que el siguiente movimiento llegue a tiempo.
            </p>
            <a className="micro-link" href="#senal">
              <b>↘</b> ver la señal en acción
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function NodeSection() {
  const [inspecting, setInspecting] = useState(false);
  return (
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
    </section>
  );
}

export function ImpactSection() {
  return (
    <section className="section impact" id="impacto">
      <div className="section-inner">
        <div className="impact-top">
          <h2>
            Menos ruido.
            <br />
            Más <span className="green-text">rendimiento.</span>
          </h2>
          <p>
            La tecnología hace su trabajo en segundo plano. Tú tomas mejores
            decisiones sobre lo que más importa.
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
    </section>
  );
}

export function JourneySection() {
  return (
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
              Una tecnología abierta y modular que se adapta a la finca que
              tienes hoy y a la que quieres construir mañana.
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
    </section>
  );
}

export function ClosingSection({ onContact }) {
  return (
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
            enseñamos cómo el nodo puede empezar a leer tu finca.
          </p>
          <button className="button dark-button" onClick={onContact}>
            Habla con un experto <span className="arrow">↗</span>
          </button>
        </div>
      </div>
    </section>
  );
}

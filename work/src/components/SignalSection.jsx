import { useId, useRef, useState } from "react";
import { signalPanels } from "../content.js";

const curve =
  "M0,195 C44,175 57,192 100,160 S166,130 206,157 S268,198 311,147 S369,95 408,132 S477,194 523,112 S567,80 600,96";
const readingLabels = ["Temperatura", "Conductividad", "CO₂", "Iluminancia"];

export default function SignalSection() {
  const [activePanel, setActivePanel] = useState("measure");
  const keys = Object.keys(signalPanels);
  const data = signalPanels[activePanel];
  const gradientId = useId();
  const tabsRef = useRef([]);
  const changeTabWithKeyboard = (event, index) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % keys.length;
    else if (event.key === "ArrowLeft")
      next = (index + keys.length - 1) % keys.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = keys.length - 1;
    else return;
    event.preventDefault();
    setActivePanel(keys[next]);
    tabsRef.current[next]?.focus();
  };

  return (
    <section className="section signal-section" id="senal">
      <div className="section-inner">
        <div className="signal-head">
          <div>
            <div className="section-label">03 / la señal</div>
            <h2>
              Del ruido
              <br />a la <span>señal.</span>
            </h2>
          </div>
          <p>
            Una demo de cómo se ordena la información dentro de Hiotera. Cambia
            de capa y mira cómo el dato se convierte en decisión.
          </p>
        </div>
        <div className="signal-card">
          <div className="signal-tabs">
            <div className="tabs" role="tablist" aria-label="Capas de la señal">
              {keys.map((key, index) => (
                <button
                  ref={(element) => {
                    tabsRef.current[index] = element;
                  }}
                  className={`tab${key === activePanel ? " active" : ""}`}
                  role="tab"
                  id={`tab-${key}`}
                  aria-selected={activePanel === key}
                  aria-controls="signal-panel"
                  tabIndex={activePanel === key ? 0 : -1}
                  key={key}
                  onClick={() => setActivePanel(key)}
                  onKeyDown={(event) => changeTabWithKeyboard(event, index)}
                >
                  {signalPanels[key].tab}
                </button>
              ))}
            </div>
            <span className="signal-time">
              finca 01 · datos de demostración
            </span>
          </div>
          <div
            className="signal-main"
            role="tabpanel"
            id="signal-panel"
            aria-labelledby={`tab-${activePanel}`}
            tabIndex={0}
          >
            <aside className="signal-readout">
              <p className="readout-label">{data.label}</p>
              <div className="readout-number">
                {data.number}
                <small>{data.unit}</small>
              </div>
              <div className="readout-delta">{data.delta}</div>
              <div className="mini-readings">
                {readingLabels.map((label, index) => (
                  <div className="mini-reading" key={label}>
                    <small>{label}</small>
                    <b>{data.values[index]}</b>
                  </div>
                ))}
              </div>
            </aside>
            <div className="signal-chart">
              <div className="chart-caption">
                <strong>{data.caption}</strong>
                <span>{data.time}</span>
              </div>
              <div className="chart">
                <svg
                  viewBox="0 0 600 250"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label={`Gráfico de demostración: ${data.caption}`}
                >
                  <defs>
                    <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor="#d9ff58" stopOpacity=".3" />
                      <stop offset="1" stopColor="#d9ff58" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    className="chart-area"
                    style={{ fill: `url(#${gradientId})` }}
                    d={`${curve} L600,250 L0,250 Z`}
                  />
                  <path className="chart-path" d={curve} />
                </svg>
                <div className="chart-dot" />
                <div className="chart-tip">óptimo · 12:40</div>
              </div>
              <div className="chart-labels">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>ahora</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

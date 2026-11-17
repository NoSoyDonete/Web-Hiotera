import { useLanguage } from "./LanguageProvider.jsx";
import { useEffect, useRef, useState } from "react";
import { platformViews } from "../demoData.js";
import ApplicationDemo, { useDemoExperience } from "./ApplicationDemo.jsx";

export default function SignalSection() {
  const { localize, language } = useLanguage();
  const [active, setActive] = useState(0),
    [page, setPage] = useState("telemetry"),
    [expanded, setExpanded] = useState(false);
  const tabs = useRef([]),
    dialog = useRef(null);
  const view = platformViews[active];
  // En la web se enseñan 4 vistas; fincas y guías siguen dentro de la demo,
  // en su menú lateral.
  const tabViews = platformViews.filter(
    (item) => !["farms", "guides"].includes(item.id),
  );
  const experience = useDemoExperience();
  const select = (index) => {
    if (index < 0 || index >= platformViews.length) return;
    setActive(index);
    setPage(platformViews[index].id);
    experience.setGuide(null);
    experience.setMetric(null);
    experience.setGraph(null);
  };
  const selectView = (id) => {
    const index = platformViews.findIndex((item) => item.id === id);
    if (index >= 0) select(index);
    else if (["custom", "farm-telemetry"].includes(id)) {
      setPage(id);
      setActive(
        platformViews.findIndex(
          (item) =>
            item.id === (id === "farm-telemetry" ? "farms" : "telemetry"),
        ),
      );
      experience.setMetric(null);
      experience.setGraph(null);
    }
  };
  useEffect(() => {
    const element = dialog.current;
    if (expanded && !element.open) element.showModal();
    if (!expanded && element.open) element.close();
  }, [expanded]);
  const keyboard = (event, index) => {
    const position = tabViews.indexOf(platformViews[index]);
    const count = tabViews.length;
    let target;
    if (event.key === "ArrowRight") target = (position + 1) % count;
    else if (event.key === "ArrowLeft") target = (position + count - 1) % count;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = count - 1;
    else return;
    event.preventDefault();
    const next = platformViews.indexOf(tabViews[target]);
    select(next);
    tabs.current[next]?.focus();
  };
  return localize(
    <section
      id="senal"
      className="section platform-section"
      aria-labelledby="platform-title"
    >
      <div className="section-inner">
        <div className="platform-heading">
          <div>
            <h2 id="platform-title">
              La aplicación,
              <br />
              <span>con una finca de ejemplo.</span>
            </h2>
          </div>
          <p>
            Es una réplica de la que usan nuestros clientes, con datos
            inventados. Pulsa cualquier lectura para abrir su gráfica.
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Vistas de la aplicación Hiotera"
          className="platform-tabs"
        >
          {tabViews.map((item) => {
            const index = platformViews.indexOf(item);
            return (
            <button
              key={item.id}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              role="tab"
              id={`platform-tab-${item.id}`}
              aria-controls="platform-panel"
              aria-selected={active === index}
              tabIndex={active === index ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={(event) => keyboard(event, index)}
            >
              {item.tab}
            </button>
            );
          })}
        </div>
        <div
          id="platform-panel"
          role="tabpanel"
          aria-labelledby={`platform-tab-${view.id}`}
          tabIndex={0}
        >
          <div className="platform-window">
            <div className="platform-window-bar">
              <span>
                <i />
                <i />
                <i />
              </span>
              <b>HIOTERA / DEMOSTRACIÓN</b>
              <button
                onClick={() => setExpanded(true)}
                aria-label={`Ampliar demostración: ${view.tab}`}
              >
                Ampliar <span aria-hidden="true">↗</span>
              </button>
            </div>
            <div lang="es" translate="no">
              <ApplicationDemo
                view={page}
                onView={selectView}
                experience={experience}
              />
            </div>
          </div>
          <div className="platform-caption">
            <div>
              <span>{view.category}</span>
              <h3>{view.title}</h3>
              <p>{view.description}</p>
            </div>
            <ul>
              {view.notes.map((note) => (
                <li key={note}>
                  <span aria-hidden="true">↗</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {language !== "es" && (
          <p className="demo-language-note">
            La demostración de la aplicación se muestra en español.
          </p>
        )}
      </div>
      <dialog
        ref={dialog}
        className="platform-dialog"
        onCancel={(event) => {
          event.preventDefault();
          setExpanded(false);
        }}
        onClose={() => setExpanded(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setExpanded(false);
        }}
        aria-labelledby="demo-expanded-title"
      >
        <div className="platform-dialog-top">
          <h3 id="demo-expanded-title">{view.tab} · Datos simulados</h3>
          <button
            onClick={() => setExpanded(false)}
            aria-label="Cerrar demostración ampliada"
          >
            Cerrar ×
          </button>
        </div>
        {expanded && (
          <div lang="es" translate="no">
            <ApplicationDemo
              view={page}
              onView={selectView}
              experience={experience}
            />
          </div>
        )}
      </dialog>
    </section>,
  );
}

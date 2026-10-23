import { useEffect, useRef, useState } from "react";
import { platformViews } from "../demoData.js";
import ApplicationDemo, { useDemoExperience } from "./ApplicationDemo.jsx";

export default function SignalSection() {
  const [active, setActive] = useState(0),
    [expanded, setExpanded] = useState(false);
  const tabs = useRef([]),
    dialog = useRef(null);
  const view = platformViews[active];
  const experience = useDemoExperience();
  const select = (index) => {
    setActive(index);
    experience.setMetric(null);
  };
  const selectView = (id) =>
    select(platformViews.findIndex((item) => item.id === id));
  useEffect(() => {
    const element = dialog.current;
    if (expanded && !element.open) element.showModal();
    if (!expanded && element.open) element.close();
  }, [expanded]);
  const keyboard = (event, index) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % platformViews.length;
    else if (event.key === "ArrowLeft")
      next = (index + platformViews.length - 1) % platformViews.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = platformViews.length - 1;
    else return;
    event.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  };
  return (
    <section
      id="senal"
      className="section platform-section"
      aria-labelledby="platform-title"
    >
      <div className="section-inner">
        <div className="platform-heading">
          <div>
            <div className="section-label">DEL CAMPO A TU PANTALLA</div>
            <h2 id="platform-title">
              No son solo datos.
              <br />
              <span>Es tu cultivo.</span>
            </h2>
          </div>
          <p>
            Ambiente, suelo y meteorología en una misma aplicación. Cada
            parámetro tiene su propia gráfica histórica. Aquí puedes ver algunos
            ejemplos con un invernadero completamente ficticio.
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Vistas de la aplicación Hiotera"
          className="platform-tabs"
        >
          {platformViews.map((item, index) => (
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
              <span>0{index + 1}</span>
              {item.tab}
            </button>
          ))}
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
            <ApplicationDemo
              view={view.id}
              onView={selectView}
              experience={experience}
            />
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
        <p className="platform-disclaimer">
          INTERFAZ RECREADA · NOMBRES, FECHAS, FASES, LECTURAS Y CURVAS
          TOTALMENTE FICTICIOS · SIN DATOS REALES NI CONEXIÓN CON CUENTAS.
        </p>
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
          <ApplicationDemo
            view={view.id}
            onView={selectView}
            experience={experience}
          />
        )}
      </dialog>
    </section>
  );
}

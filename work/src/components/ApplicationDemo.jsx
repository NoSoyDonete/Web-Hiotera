import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import {
  demoFarm,
  demoMetrics,
  demoAlerts,
  metricById,
  periods,
  formatReading,
  demoDate,
  matchingMetrics,
  toggleDemoMetric,
} from "../demoData.js";
import {
  graphGroups,
  cropStages,
  deviceReading,
  deviceSeries,
  readingState,
  chartScale,
  transplantDay,
} from "../demoPresentation.js";
import { AppIcon as I, CropPlant } from "./ReplicaIcons.jsx";
import NotebookDemo from "./NotebookDemo.jsx";
import GuidesDemo from "./GuidesDemo.jsx";
import "../application-demo.css";

export function useDemoExperience() {
  const [period, setPeriod] = useState("7d"),
    [metric, setMetric] = useState(null),
    [graph, setGraph] = useState(null);
  const [device, setDevice] = useState(0),
    [phases, setPhases] = useState([3, 0]),
    [dates, setDates] = useState(["2030-03-16", "2030-05-09"]);
  const [name, setName] = useState("Temperatura y humedad del suelo"),
    [query, setQuery] = useState("");
  const [selected, setSelected] = useState(["air", "humidity", "radiation"]),
    [customGraphs, setCustomGraphs] = useState([]);
  const [customReady, setCustomReady] = useState(false),
    [alertFilter, setAlertFilter] = useState("Todos");
  const [customStart, setCustomStart] = useState("2030-05-02"),
    [customEnd, setCustomEnd] = useState("2030-05-09");
  const [guide, setGuide] = useState(null);
  const [notebook, setNotebook] = useState({
    owner: "",
    people: [],
    equipment: [],
    entries: [
      {
        id: "demo-entry-1",
        date: "2030-05-09",
        type: "Observación",
        detail:
          "Revisión visual del sector Demo1. Desarrollo uniforme en las filas de ejemplo.",
      },
      {
        id: "demo-entry-2",
        date: "2030-05-08",
        type: "Riego",
        detail: "Registro simulado del riego del sector Demo1.",
      },
    ],
  });
  return {
    period,
    setPeriod,
    metric,
    setMetric,
    graph,
    setGraph,
    device,
    setDevice,
    phases,
    setPhases,
    dates,
    setDates,
    name,
    setName,
    query,
    setQuery,
    selected,
    toggleMetric: (id) => setSelected((items) => toggleDemoMetric(items, id)),
    customGraphs,
    setCustomGraphs,
    customReady,
    setCustomReady,
    alertFilter,
    setAlertFilter,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    guide,
    setGuide,
    notebook,
    setNotebook,
  };
}
const deviceId = (device) => String(device).padStart(3, "0");
const navSections = [
  {
    label: "OPERACIÓN",
    items: [
      ["farm", "Fincas", "farms"],
      ["book", "Cuaderno de campo", "notebook"],
    ],
  },
  {
    label: "DATOS",
    items: [
      ["weather", "Estación Meteorológica", "meteo"],
      ["chart", "Telemetría LIBOx", "telemetry"],
    ],
  },
  {
    label: "CONSULTA",
    items: [
      ["bell", "Avisos", "alerts"],
      ["book", "Guías y manuales", "guides"],
    ],
  },
];

function Brand() {
  return (
    <div className="replica-brand" aria-label="Hiotera, el IQ de tu campo">
      <svg viewBox="0 0 90 80" aria-hidden="true">
        <path d="M40 37Q33 8 68 2Q69 29 40 37" fill="#218b20" />
        <path d="M40 37Q15 35 22 16Q41 18 40 37" fill="#83b900" />
        <path d="M40 37 57 13" stroke="#f7fff2" strokeWidth="2.2" />
        <text
          x="2"
          y="59"
          fontFamily="Arial,sans-serif"
          fontSize="27"
          fontWeight="600"
          letterSpacing="-2"
          fill="#19242a"
        >
          Hi<tspan fill="#77ae08">o</tspan>tera
        </text>
        <text x="3" y="75" fontSize="9.8" letterSpacing="1.2" fill="#17354d">
          El IQ de tu campo
        </text>
      </svg>
    </div>
  );
}
function Sidebar({ view, onView, onInfo }) {
  const farmActive = view === "farm-telemetry";
  return (
    <aside
      className="replica-sidebar"
      aria-label="Navegación de la aplicación de ejemplo"
    >
      <Brand />
      <nav>
        {navSections.map((section) => (
          <div className="replica-nav-group" key={section.label}>
            <div className="replica-nav-label">{section.label}</div>
            {section.items.map(([icon, label, target]) => (
              <div key={target}>
                <button
                  className={`replica-nav-item${view === target || (target === "farms" && farmActive) || (target === "telemetry" && view === "custom") ? " is-active" : ""}`}
                  aria-current={
                    view === target && !farmActive ? "page" : undefined
                  }
                  onClick={() => onView(target)}
                >
                  <I name={icon} />
                  <span>{label}</span>
                  {target === "alerts" && <b className="replica-count">3</b>}
                </button>
                {target === "farms" && (
                  <div className="replica-subnav">
                    <button
                      className={farmActive ? "is-active" : ""}
                      aria-current={farmActive ? "page" : undefined}
                      onClick={() => onView("farm-telemetry")}
                    >
                      <I name="chart" size={16} />
                      {demoFarm.name}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>
      <button
        className="replica-account"
        onClick={() => onInfo("Cuenta de demostración")}
      >
        <span className="replica-avatar">D1</span>
        <span>
          <b>{demoFarm.email}</b>
          <small>Superadmin Hiotera</small>
        </span>
        <I name="settings" size={16} />
      </button>
    </aside>
  );
}
function Header({ title, onInfo }) {
  return (
    <header className="replica-header">
      <h2>{title}</h2>
      <div>
        <span className="replica-sync">
          <I name="refresh" size={13} /> AL DÍA
        </span>
        <button className="replica-user" onClick={() => onInfo("Perfil Demo1")}>
          <span className="replica-avatar">D1</span>
          <span>
            TRABAJANDO EN<b>{demoFarm.person}</b>
          </span>
          <I name="down" size={16} />
        </button>
      </div>
    </header>
  );
}
function Banner({ icon = "map", title, children, actions }) {
  return (
    <div className="replica-banner">
      <div className="replica-banner-heading">
        <span className="replica-banner-icon">
          <I name={icon} size={30} />
        </span>
        <h3>{title}</h3>
        {actions && <div className="replica-banner-actions">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
function Farms({ onView, onInfo }) {
  const [query, setQuery] = useState(""),
    [map, setMap] = useState(false);
  const found = demoFarm.name
    .toLocaleLowerCase("es")
    .includes(query.trim().toLocaleLowerCase("es"));
  return (
    <div className="replica-page replica-farms">
      <Banner
        title="1 finca en el mapa"
        actions={
          <>
            <button
              className="replica-glass"
              onClick={() => onInfo("Equipos de la finca")}
            >
              <I name="antenna" /> Equipos
            </button>
            <button
              className="replica-primary"
              onClick={() => onInfo("Nueva finca")}
            >
              <I name="plus" /> Nueva finca
            </button>
          </>
        }
      >
        <div className="replica-farm-stats">
          {[
            ["location", "1", "Fincas"],
            ["layers", "0", "Recintos"],
            ["sprout", "2", "Puntos de control"],
          ].map(([icon, value, label]) => (
            <div key={label}>
              <I name={icon} size={22} />
              <span>
                <b>{value}</b>
                <small>{label}</small>
              </span>
            </div>
          ))}
        </div>
      </Banner>
      <div className="replica-farm-tools">
        <label className="replica-search">
          <I name="search" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar finca, explotación, municipio o contacto"
            aria-label="Buscar finca de demostración"
          />
          <b>{found ? 1 : 0}</b>
        </label>
        <div className="replica-segmented">
          <button
            className={!map ? "is-active" : ""}
            onClick={() => setMap(false)}
          >
            <I name="list" /> Lista
          </button>
          <button
            className={map ? "is-active" : ""}
            onClick={() => setMap(true)}
          >
            <I name="map" /> Mapa
          </button>
        </div>
      </div>
      {!found ? (
        <div className="replica-empty">
          No se han encontrado fincas con ese nombre.
        </div>
      ) : map ? (
        <div className="replica-map">
          <svg
            viewBox="0 0 1480 520"
            aria-label="Mapa ficticio sin coordenadas reales"
          >
            <path d="M0 0h1480v520H0Z" fill="#e3eadb" />
            <path
              d="M0 330 1480 80M150 0l440 520M1050 0 810 520M0 120l1480 300"
              stroke="#fcfdf9"
              strokeWidth="20"
            />
            <g fill="#c5d7ae" stroke="#97b57b" strokeWidth="2">
              <path d="m300 130 230-50 120 150-230 70Z" />
              <path d="m930 210 280 70-100 170-270-90Z" />
            </g>
          </svg>
          <button onClick={() => onView("farm-telemetry")}>
            <I name="location" />
            {demoFarm.name} · Abrir ficha
          </button>
          <small>Mapa de demostración · ubicación inventada</small>
        </div>
      ) : (
        <article className="replica-farm-card">
          <h3>{demoFarm.name}</h3>
          <div>
            {[
              ["layers", "Recintos", "0"],
              ["sprout", "Puntos de control", "2"],
              ["farm", "Superficie", "—"],
            ].map(([icon, label, value]) => (
              <span key={label}>
                <I name={icon} />
                <span>
                  {label}
                  <b>{value}</b>
                </span>
              </span>
            ))}
          </div>
          <footer>
            <button
              className="replica-primary"
              onClick={() => onView("farm-telemetry")}
            >
              Abrir ficha <I name="arrow" />
            </button>
            <button
              className="replica-square"
              onClick={() => onInfo("Configuración de la finca")}
              aria-label="Configuración de la finca"
            >
              <I name="settings" />
            </button>
          </footer>
        </article>
      )}
    </div>
  );
}
function CropPhase({ experience }) {
  const [expanded, setExpanded] = useState(false),
    device = experience.device,
    selected = experience.phases[device],
    day = transplantDay(experience.dates[device]);
  return (
    <section className="replica-crop">
      <h3>
        {demoFarm.crop} <span>en fase: </span>
        {cropStages[selected].name}
      </h3>
      <div className="replica-crop-box">
        <div className="replica-crop-summary">
          <div className="replica-crop-image">
            <CropPlant stage={selected} />
          </div>
          <div className="replica-crop-copy">
            <div>
              <span>
                <I name="calendar" size={14} /> Día {day} desde el trasplante
              </span>
              <span>
                {selected === 4
                  ? "Última fase"
                  : `En cosecha en ${Math.max(0, 90 - day)} días`}
              </span>
            </div>
            <div className="replica-crop-progress">
              <i style={{ width: `${Math.min(100, (day / 90) * 100)}%` }} />
            </div>
            <p>
              <b>
                <I name="bulb" size={14} /> CONSEJO
              </b>
              {
                [
                  "Observa las primeras hojas y comprueba las lecturas de la finca.",
                  "Consulta el desarrollo del cultivo y el histórico de sus parámetros.",
                  "Revisa las señales del ambiente durante esta fase de ejemplo.",
                  "Sigue la evolución del cultivo y compara los cambios en las gráficas.",
                  "Consulta el registro de la campaña y la evolución de sus lecturas.",
                ][selected]
              }
            </p>
          </div>
          <div className="replica-crop-controls">
            <button
              className="replica-secondary"
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
            >
              Cambiar fase{" "}
              <I
                name="down"
                size={16}
                style={{ transform: expanded ? "rotate(180deg)" : undefined }}
              />
            </button>
            <label>
              Fecha de trasplante (estimada)
              <input
                type="date"
                value={experience.dates[device]}
                max="2030-05-09"
                onChange={(e) => {
                  if (e.target.value)
                    experience.setDates((items) =>
                      items.map((v, i) => (i === device ? e.target.value : v)),
                    );
                }}
              />
            </label>
          </div>
        </div>
        {expanded && (
          <div
            className="replica-crop-choices"
            role="group"
            aria-label="Fase del cultivo de ejemplo"
          >
            {cropStages.map((stage, index) => (
              <button
                key={stage.name}
                className={selected === index ? "is-active" : ""}
                aria-pressed={selected === index}
                onClick={() =>
                  experience.setPhases((items) =>
                    items.map((v, i) => (i === device ? index : v)),
                  )
                }
              >
                <CropPlant stage={index} />
                <span>
                  <b>{stage.name}</b>
                  <small>{stage.days}</small>
                </span>
                {selected === index && <I name="check" size={16} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
function ReadingTable({ group, title, experience }) {
  return (
    <section className="replica-reading-card">
      <div className="replica-card-heading">
        <span>
          <I name="gauge" size={14} /> TARJETA RESUMEN
        </span>
        <h3>{title}</h3>
        <span
          className="replica-help"
          title="Lecturas y bandas ficticias de demostración"
        >
          <I name="help" size={18} />
        </span>
      </div>
      <div>
        {demoMetrics
          .filter((m) => m.group === group && m.id !== "direction")
          .map((metric) => {
            const value = deviceReading(
                metric.id,
                undefined,
                experience.device,
              ),
              state =
                group === "Meteo"
                  ? { key: "info", label: "Informativo" }
                  : readingState(metric.id, value);
            return (
              <div
                key={metric.id}
                className={`replica-reading replica-reading-${state.key}`}
              >
                <div className="replica-reading-title">
                  <b>{metric.name}</b>
                  <small>{group === "Meteo" ? "ahora" : "hace 2 min"}</small>
                </div>
                <span className="replica-state">
                  <span>
                    {state.icon && <I name={state.icon} size={14} />}{" "}
                    {state.label}
                  </span>
                </span>
                <span className="replica-recommendation">
                  {metric.band && (
                    <>
                      <small>Valor recomendado</small>
                      {metric.band
                        .map((v) => v.toLocaleString("es-ES"))
                        .join("–")}{" "}
                      {metric.unit}
                    </>
                  )}
                </span>
                <span className="replica-reading-value">
                  <b>{formatReading(metric.id, value)}</b>{" "}
                  <small>{metric.unit}</small>
                </span>
                <button
                  className="replica-chart-button"
                  aria-label={`Ver histórico de ${metric.name}`}
                  onClick={() => {
                    experience.setGraph(null);
                    experience.setMetric(metric.id);
                  }}
                >
                  <I name="chart" size={24} />
                </button>
              </div>
            );
          })}
      </div>
      {group === "Meteo" && (
        <div className="replica-wind">
          <b>Dirección del viento</b>
          <div className="replica-compass">
            <span>N</span>
            <span>L</span>
            <span>S</span>
            <span>P</span>
            <svg
              viewBox="0 0 100 100"
              aria-label="Dirección simulada del viento"
            >
              <circle cx="50" cy="50" r="48" fill="#f9fbf7" stroke="#94b681" />
              <circle cx="50" cy="50" r="42" fill="#e5efdf" />
              <g transform={`rotate(${deviceReading("direction") - 90} 50 50)`}>
                <path d="m7 50 43-9 43 9-43 9Z" fill="#7b8b87" />
                <path d="m50 41 43 9-43 9Z" fill="#19780d" />
                <circle cx="50" cy="50" r="6" fill="white" stroke="#55913f" />
              </g>
            </svg>
          </div>
          <h4>Levante</h4>
          <span>
            <I name="compass" size={15} /> {formatReading("direction")}°
          </span>
          <small>ahora</small>
        </div>
      )}
    </section>
  );
}
function GraphLink({ group, experience }) {
  return (
    <button
      className="replica-graph-link"
      onClick={() => {
        experience.setMetric(null);
        experience.setGraph(group);
      }}
    >
      <I name="chart" />
      <b>{group.title}</b>
      <small>
        {group.ids.length} {group.ids.length === 1 ? "serie" : "series"}
      </small>
      <I name="right" size={17} />
    </button>
  );
}
function Telemetry({ experience, onInfo, onView, farmContext = false }) {
  return (
    <div
      className={`replica-page replica-telemetry${farmContext ? "" : " replica-global-telemetry"}`}
    >
      {farmContext && (
        <div className="replica-farm-tabs">
          <b>{demoFarm.name}</b>
          <div>
            {[
              ["layers", "Resumen"],
              ["chart", "Telemetría"],
              ["sprout", "Cultivos"],
              ["book", "Cuaderno"],
            ].map(([icon, label]) => (
              <button
                className={label === "Telemetría" ? "is-active" : ""}
                key={label}
                onClick={() =>
                  label === "Resumen"
                    ? onView("farms")
                    : label === "Cuaderno"
                      ? onView("notebook")
                      : label !== "Telemetría" && onInfo(label)
                }
              >
                <I name={icon} size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="replica-telemetry-inner">
        <section className="replica-devices">
          <b>Equipos · LIBOx</b>
          <div>
            {[0, 1].map((device) => (
              <div
                className={`replica-device-row${device === experience.device ? " is-active" : ""}`}
                key={device}
              >
                <button
                  className="replica-device-select"
                  onClick={() => experience.setDevice(device)}
                >
                  <span>{String(device + 1).padStart(2, "0")}</span>
                  <span>
                    <b>LIBOx {deviceId(device)}</b>
                    <small>
                      {demoFarm.name} · {demoFarm.crop} ·{" "}
                      {cropStages[experience.phases[device]].name}
                    </small>
                  </span>
                  <CropPlant stage={experience.phases[device]} />
                </button>
                <button
                  className="replica-device-config"
                  onClick={() =>
                    onInfo(`Configuración LIBOx ${deviceId(device)}`)
                  }
                >
                  <I name="settings" size={18} /> Configuración
                </button>
              </div>
            ))}
          </div>
        </section>
        <div className="replica-device-status">
          <span>
            <I name="robot" size={48} />
          </span>
          {[
            [
              "battery",
              "BATERÍA",
              `${demoFarm.battery + experience.device * 4}%`,
            ],
            ["antenna", "COBERTURA", experience.device ? "Aceptable" : "Buena"],
            [
              "clock",
              "ÚLTIMO DATO",
              experience.device ? "5 minutos" : "2 minutos",
            ],
          ].map(([icon, label, value]) => (
            <div key={label}>
              <span>
                <I name={icon} size={14} /> {label}
              </span>
              <b>{value}</b>
            </div>
          ))}
        </div>
        <CropPhase experience={experience} />
        <h2 className="replica-section-heading">Ambiente y confort</h2>
        <ReadingTable
          group="Ambiente"
          title="Indicadores agronómicos"
          experience={experience}
        />
        <GraphLink group={graphGroups.environment} experience={experience} />
        <GraphLink group={graphGroups.dryness} experience={experience} />
        <h2 className="replica-section-heading">Suelo y nutrición</h2>
        <ReadingTable
          group="Suelo"
          title="Estado del Suelo"
          experience={experience}
        />
        {["water", "temperature", "probes"].map((id) => (
          <GraphLink key={id} group={graphGroups[id]} experience={experience} />
        ))}
        {experience.customGraphs.map((group) => (
          <GraphLink key={group.title} group={group} experience={experience} />
        ))}
        <button
          className="replica-graph-link replica-create-link"
          onClick={() => onView("custom")}
          disabled={experience.customGraphs.length >= 3}
        >
          <I name="plus" />
          <b>Crea tu gráfica</b>
          <small>{experience.customGraphs.length} de 3</small>
        </button>
      </div>
    </div>
  );
}
function Weather({ experience }) {
  return (
    <div className="replica-page replica-weather">
      <div className="replica-telemetry-inner">
        <div className="replica-weather-banner">
          <I name="weather" size={46} />
          <h3>Plantilla Meteo</h3>
          <div>
            {[
              ["antenna", "ESTACIÓN", "000"],
              ["wind", "MIDE PARA", demoFarm.name],
              ["weather", "VERSIÓN", "v1"],
            ].map(([icon, label, value]) => (
              <span key={label}>
                <small>
                  <I name={icon} size={14} /> {label}
                </small>
                <b>{value}</b>
              </span>
            ))}
          </div>
        </div>
        <h2 className="replica-section-heading">Resumen</h2>
        <ReadingTable
          group="Meteo"
          title="Condiciones exteriores"
          experience={experience}
        />
        <h2 className="replica-section-heading">Gráficas</h2>
        <GraphLink group={graphGroups.meteo} experience={experience} />
      </div>
    </div>
  );
}

export function ReplicaHistory({ group, experience, onClose }) {
  const [visible, setVisible] = useState(group.ids),
    [hover, setHover] = useState(null),
    [start, setStart] = useState(0),
    [end, setEnd] = useState(100),
    graphTitleId = useId();
  const fullRows = Object.fromEntries(
    group.ids.map((id) => [
      id,
      deviceSeries(
        id,
        experience.period === "custom" ? "30d" : experience.period,
        experience.device,
      ).filter(
        (p) =>
          experience.period !== "custom" ||
          (p.time >= Date.parse(experience.customStart + "T00:00:00Z") &&
            p.time <= Date.parse(experience.customEnd + "T23:59:59Z")),
      ),
    ]),
  );
  const total = fullRows[group.ids[0]].length,
    from = Math.floor((Math.max(0, total - 1) * start) / 100),
    to = Math.max(from + 1, Math.ceil(((total - 1) * end) / 100));
  const rows = Object.fromEntries(
      group.ids.map((id) => [id, fullRows[id].slice(from, to + 1)]),
    ),
    data = rows[group.ids[0]],
    length = data.length;
  const units = [...new Set(visible.map((id) => metricById[id].unit))];
  if (units.includes("W/m²")) {
    units.splice(units.indexOf("W/m²"), 1);
    units.unshift("W/m²");
  }
  const domains = Object.fromEntries(
    units.map((unit) => {
      const ids = visible.filter((id) => metricById[id].unit === unit);
      return [
        unit,
        chartScale(
          ids[0],
          ids.flatMap((id) => rows[id]),
        ),
      ];
    }),
  );
  const colors = [
    "#956200",
    "#169b08",
    "#007e6c",
    "#387bb4",
    "#657441",
    "#596572",
    "#8d4893",
    "#2f9f33",
    "#7c6434",
    "#496e87",
    "#837373",
  ];
  const left = 50,
    right = 1790,
    top = 18,
    bottom = 692,
    x = (index) => left + (index / Math.max(1, length - 1)) * (right - left),
    y = (id, value) => {
      const [min, max] = domains[metricById[id].unit];
      return bottom - ((value - min) / (max - min)) * (bottom - top);
    };
  const marker = hover === null || !length ? null : Math.min(hover, length - 1),
    reset = () => {
      setStart(0);
      setEnd(100);
      setHover(null);
    },
    timeLabel = (time) => new Date(time).toISOString().slice(11, 16);
  return (
    <div
      className="replica-history"
      role="region"
      aria-labelledby={graphTitleId}
    >
      <div className="replica-history-toolbar">
        <div className="replica-history-title">
          <span>
            <I name="history" size={15} /> HISTÓRICO
          </span>
          <h2 id={graphTitleId}>{group.title}</h2>
        </div>
        <div className="replica-period-block">
          <b>PERIODO DE VISUALIZACIÓN</b>
          <div className="replica-periods">
            {[...periods, { id: "custom", label: "Personalizado" }].map(
              (period) => (
                <button
                  key={period.id}
                  aria-pressed={experience.period === period.id}
                  onClick={() => {
                    experience.setPeriod(period.id);
                    reset();
                  }}
                >
                  {period.label}
                </button>
              ),
            )}
          </div>
          {experience.period === "custom" && (
            <div className="replica-custom-dates">
              <input
                type="date"
                aria-label="Inicio del período ficticio"
                min="2030-04-09"
                max={experience.customEnd}
                value={experience.customStart}
                onChange={(e) => {
                  if (e.target.value) {
                    experience.setCustomStart(e.target.value);
                    reset();
                  }
                }}
              />
              <input
                type="date"
                aria-label="Fin del período ficticio"
                min={experience.customStart}
                max="2030-05-09"
                value={experience.customEnd}
                onChange={(e) => {
                  if (e.target.value) {
                    experience.setCustomEnd(e.target.value);
                    reset();
                  }
                }}
              />
            </div>
          )}
        </div>
        <details className="replica-series">
          <summary>
            <b>SERIES VISIBLES</b>
            <span>
              {visible.length} / {group.ids.length}
              <I name="down" size={14} />
            </span>
          </summary>
          <div>
            {group.ids.map((id) => (
              <label key={id}>
                <input
                  type="checkbox"
                  checked={visible.includes(id)}
                  disabled={visible.length === 1 && visible.includes(id)}
                  onChange={() => {
                    setVisible((items) =>
                      items.includes(id)
                        ? items.filter((v) => v !== id)
                        : [...items, id],
                    );
                    setHover(null);
                  }}
                />
                <i
                  style={{
                    background: colors[group.ids.indexOf(id) % colors.length],
                  }}
                />
                {metricById[id].name}
                <small>{metricById[id].unit}</small>
              </label>
            ))}
            <p>Escalas independientes por unidad. Lecturas simuladas.</p>
          </div>
        </details>
        <div className="replica-range-label">
          <b>A LA VISTA</b>
          <span>
            {length
              ? `${timeLabel(data[0].time)} — ${timeLabel(data.at(-1).time)}`
              : "Sin muestras"}
            <small>
              {experience.period === "24h"
                ? "1 día"
                : experience.period === "30d"
                  ? "30 días"
                  : experience.period === "custom"
                    ? "Personalizado"
                    : "7 días"}
            </small>
          </span>
        </div>
        <div className="replica-history-actions">
          <button
            className="replica-round"
            aria-label="Cerrar histórico"
            onClick={onClose}
          >
            <I name="close" size={22} />
          </button>
          <button
            className="replica-round"
            aria-label="Restablecer histórico"
            onClick={reset}
          >
            <I name="refresh" size={22} />
          </button>
        </div>
      </div>
      <div className="replica-plot" onPointerLeave={() => setHover(null)}>
        <svg
          viewBox="0 0 1840 725"
          preserveAspectRatio="none"
          role="img"
          aria-label={`${group.title}. Curvas inventadas. Cada serie identifica su unidad.`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
              e.preventDefault();
              setHover((i) =>
                e.key === "Home"
                  ? 0
                  : e.key === "End"
                    ? length - 1
                    : Math.max(
                        0,
                        Math.min(
                          length - 1,
                          (i ?? 0) + (e.key === "ArrowLeft" ? -1 : 1),
                        ),
                      ),
              );
            }
          }}
          onPointerMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect(),
              position = ((e.clientX - rect.left) / rect.width) * 1840;
            setHover(
              Math.max(
                0,
                Math.min(
                  length - 1,
                  Math.round(
                    ((position - left) / (right - left)) * (length - 1),
                  ),
                ),
              ),
            );
          }}
        >
          {Array.from({ length: 6 }, (_, index) => {
            const plotY = top + ((bottom - top) * index) / 5;
            return (
              <g key={index}>
                <line
                  x1={left}
                  x2={right}
                  y1={plotY}
                  y2={plotY}
                  className="replica-grid-line"
                />
                {[units[0], units[1]].map((unit, side) => {
                  if (!unit) return null;
                  const [min, max] = domains[unit];
                  return (
                    <text
                      key={unit}
                      x={side ? right + 12 : left - 8}
                      y={plotY + 4}
                      textAnchor={side ? "start" : "end"}
                    >
                      {(max - ((max - min) * index) / 5).toLocaleString(
                        "es-ES",
                        { maximumFractionDigits: max < 3 ? 1 : 0 },
                      )}
                    </text>
                  );
                })}
              </g>
            );
          })}
          {visible.length === 1 && metricById[visible[0]].band && (
            <rect
              x={left}
              width={right - left}
              y={Math.max(top, y(visible[0], metricById[visible[0]].band[1]))}
              height={Math.max(
                0,
                Math.min(
                  bottom,
                  y(visible[0], metricById[visible[0]].band[0]),
                ) -
                  Math.max(top, y(visible[0], metricById[visible[0]].band[1])),
              )}
              fill="#cfe2dd"
              opacity=".6"
            />
          )}
          {visible.map((id) => (
            <path
              key={id}
              d={rows[id]
                .map(
                  (p, i) =>
                    `${i ? "L" : "M"}${x(i).toFixed(2)},${y(id, p.value).toFixed(2)}`,
                )
                .join(" ")}
              fill="none"
              stroke={colors[group.ids.indexOf(id) % colors.length]}
              strokeWidth="1.7"
            />
          ))}
          {marker !== null && (
            <g>
              <line
                x1={x(marker)}
                x2={x(marker)}
                y1={top}
                y2={bottom}
                stroke="#d1d5d2"
              />
              {visible.map((id) => (
                <circle
                  key={id}
                  cx={x(marker)}
                  cy={y(id, rows[id][marker].value)}
                  r="3.8"
                  fill={colors[group.ids.indexOf(id) % colors.length]}
                  stroke="white"
                  strokeWidth="1.5"
                />
              ))}
            </g>
          )}
          {[0, 0.33, 0.66, 1].map((ratio, index) =>
            length ? (
              <text
                key={index}
                x={x(Math.round((length - 1) * ratio))}
                y={bottom + 16}
                textAnchor="middle"
              >
                {timeLabel(data[Math.round((length - 1) * ratio)].time)}
              </text>
            ) : null,
          )}
        </svg>
        {marker !== null && (
          <div
            className="replica-tooltip"
            style={{
              left: `${Math.max(3, Math.min(76, (marker / Math.max(1, length - 1)) * 85 + 5))}%`,
            }}
          >
            <time>{demoDate(data[marker].time, true)}</time>
            {visible.map((id) => (
              <span key={id}>
                {metricById[id].name} :{" "}
                {formatReading(id, rows[id][marker].value)}{" "}
                {metricById[id].unit}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="replica-timeline">
        <div className="replica-timeline-dates">
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((ratio) => (
            <span key={ratio}>
              {total
                ? demoDate(
                    fullRows[group.ids[0]][Math.round((total - 1) * ratio)]
                      .time,
                  )
                : "—"}
            </span>
          ))}
        </div>
        <div
          className="replica-timeline-selection"
          style={{ left: `${start}%`, right: `${100 - end}%` }}
        />
        <input
          type="range"
          min="0"
          max="99"
          value={start}
          aria-label="Comienzo del rango de la gráfica"
          onChange={(e) => {
            setStart(Math.min(Number(e.target.value), end - 1));
            setHover(null);
          }}
        />
        <input
          type="range"
          min="1"
          max="100"
          value={end}
          aria-label="Final del rango de la gráfica"
          onChange={(e) => {
            setEnd(Math.max(Number(e.target.value), start + 1));
            setHover(null);
          }}
        />
      </div>
      <footer className="replica-history-foot">
        <span>{(length * visible.length).toLocaleString("es-ES")} puntos</span>
        <span>Periodo completo</span>
      </footer>
    </div>
  );
}
function useReplicaModal(ref, onClose) {
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const element = ref.current,
      previous = document.activeElement;
    const controls = () => [
      ...element.querySelectorAll(
        'button:not(:disabled), input:not(:disabled), [tabindex="0"]',
      ),
    ];
    (controls()[0] ?? element).focus();
    const keyboard = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close.current();
      } else if (event.key === "Tab") {
        const items = controls(),
          first = items[0],
          last = items.at(-1);
        if (!first) {
          event.preventDefault();
          element.focus();
        } else if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === element)
        ) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    element.addEventListener("keydown", keyboard);
    return () => {
      element.removeEventListener("keydown", keyboard);
      if (previous?.isConnected) previous.focus?.();
    };
  }, [ref]);
}

function Builder({ experience, onClose }) {
  const formId = useId();
  const modal = useRef(null);
  useReplicaModal(modal, onClose);
  return (
    <div className="replica-modal-backdrop">
      <section
        ref={modal}
        className="replica-modal replica-builder"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${formId}-title`}
        tabIndex={-1}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (
              experience.name.trim() &&
              experience.selected.length &&
              experience.customGraphs.length < 3
            ) {
              const graph = {
                title: experience.name.trim(),
                ids: [...experience.selected],
              };
              experience.setCustomGraphs((items) => [...items, graph]);
              onClose();
              experience.setGraph(graph);
            }
          }}
        >
          <div className="replica-modal-body">
            <h2 id={`${formId}-title`}>Crea tu gráfica</h2>
            <p>Ponle un nombre y elige las medidas que quieres comparar.</p>
            <div className="replica-builder-notice">
              Se verá en todos tus LIBOx. Puedes crear hasta 3 gráficas propias.
            </div>
            <label htmlFor={`${formId}-name`}>Nombre de la gráfica</label>
            <input
              id={`${formId}-name`}
              value={experience.name}
              maxLength={80}
              required
              onChange={(e) => experience.setName(e.target.value)}
              placeholder="Ej. Temperatura y humedad del suelo"
            />
            <div className="replica-builder-count">
              <label htmlFor={`${formId}-search`}>Medidas para comparar</label>
              <span>{experience.selected.length} de 6</span>
            </div>
            <p className="replica-builder-help">
              Elige al menos una medida de la lista.
            </p>
            <div className="replica-search">
              <I name="search" size={17} />
              <input
                id={`${formId}-search`}
                type="search"
                placeholder="Buscar medida"
                value={experience.query}
                onChange={(e) => experience.setQuery(e.target.value)}
              />
            </div>
            <div className="replica-builder-options">
              {matchingMetrics(experience.query).map((metric) => (
                <label key={metric.id}>
                  <input
                    type="checkbox"
                    checked={experience.selected.includes(metric.id)}
                    disabled={
                      !experience.selected.includes(metric.id) &&
                      experience.selected.length >= 6
                    }
                    onChange={() => experience.toggleMetric(metric.id)}
                  />
                  <b>{metric.name}</b>
                  <small>{metric.unit}</small>
                </label>
              ))}
              {!matchingMetrics(experience.query).length && (
                <p>No hay medidas con ese nombre.</p>
              )}
            </div>
          </div>
          <footer>
            <button
              type="button"
              className="replica-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="replica-primary"
              disabled={
                !experience.name.trim() ||
                !experience.selected.length ||
                experience.customGraphs.length >= 3
              }
            >
              Confirmar gráfica
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
function Alerts({ experience, onInfo }) {
  const [kind, setKind] = useState("cultivo"),
    [date, setDate] = useState("2030-05-09"),
    [devices, setDevices] = useState([0]);
  const visible =
    date !== "2030-05-09"
      ? []
      : demoAlerts.filter((a) =>
          kind === "cultivo"
            ? a.state !== "Informativo"
            : a.state === "Informativo",
        );
  return (
    <div className="replica-page replica-alert-page">
      <Banner
        icon="bell"
        title="Tus avisos, en un vistazo"
        actions={
          <>
            <button
              className="replica-glass"
              onClick={() => onInfo("Novedades")}
            >
              <I name="right" size={16} /> Novedades
            </button>
            <button
              className="replica-glass"
              onClick={() => onInfo("Notificaciones")}
            >
              <I name="bell" /> Notificaciones <small>Al móvil</small>
            </button>
            <button
              className="replica-lime"
              onClick={() => onInfo("Configurar avisos")}
            >
              <I name="settings" />
              Configurar avisos
            </button>
          </>
        }
      >
        <div className="replica-alert-filters">
          <div>
            <b>FINCAS · 1</b>
            <button className="is-active" onClick={() => onInfo("Finca Demo1")}>
              {demoFarm.name}
            </button>
          </div>
          <div>
            <b>EQUIPOS · 2</b>
            {[0, 1].map((device) => (
              <button
                key={device}
                className={devices.includes(device) ? "is-active" : ""}
                aria-pressed={devices.includes(device)}
                onClick={() =>
                  setDevices((items) =>
                    items.includes(device)
                      ? items.filter((i) => i !== device)
                      : [...items, device],
                  )
                }
              >
                LIBOx {deviceId(device)}
              </button>
            ))}
          </div>
        </div>
      </Banner>
      <div className="replica-alert-kind">
        <button
          className={kind === "equipo" ? "is-active" : ""}
          onClick={() => setKind("equipo")}
        >
          Avisos de equipo
        </button>
        <button
          className={kind === "cultivo" ? "is-active" : ""}
          onClick={() => setKind("cultivo")}
        >
          Avisos de cultivo{" "}
          <span>
            {demoAlerts.filter((a) => a.state !== "Informativo").length}
          </span>
        </button>
      </div>
      {devices.length ? (
        devices.map((device) => (
          <section className="replica-alert-card" key={device}>
            <header>
              <b>LIBOx {deviceId(device)}</b>
              <label>
                <I name="search" size={16} />
                <input
                  type="date"
                  aria-label="Fecha de avisos simulados"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <button
                  className="replica-icon-button"
                  aria-label="Restablecer fecha de ejemplo"
                  onClick={() => setDate("2030-05-09")}
                >
                  <I name="close" size={14} />
                </button>
              </label>
              <button
                className="replica-round"
                aria-label="Actualizar avisos de ejemplo"
                onClick={() => setDate("2030-05-09")}
              >
                <I name="refresh" size={18} />
              </button>
            </header>
            <div>
              {visible.map((alert, index) => (
                <article key={alert.id}>
                  <span className="replica-alert-tag">AVISO</span>
                  <div>
                    <b>{alert.title}</b>
                    <p>{alert.detail}</p>
                    <small>
                      {alert.state === "Atención"
                        ? "hace 12 minutos"
                        : `resuelto hace ${23 + index * 19} minutos`}
                    </small>
                  </div>
                  <button
                    className="replica-icon-button"
                    aria-label={`Ver histórico de ${metricById[alert.metric].name}`}
                    onClick={() => {
                      experience.setDevice(device);
                      experience.setGraph(null);
                      experience.setMetric(alert.metric);
                    }}
                  >
                    <I name="check" size={18} />
                  </button>
                </article>
              ))}
              {!visible.length && (
                <p className="replica-empty">
                  No hay avisos para esta fecha de ejemplo.
                </p>
              )}
            </div>
            <footer>{visible.length} avisos</footer>
          </section>
        ))
      ) : (
        <div className="replica-empty">
          Selecciona un equipo para ver sus avisos.
        </div>
      )}
    </div>
  );
}
function InfoModal({ title, onClose }) {
  const modal = useRef(null);
  useReplicaModal(modal, onClose);
  return (
    <div className="replica-modal-backdrop">
      <section
        ref={modal}
        className="replica-modal replica-info-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            onClose();
          }
        }}
      >
        <I name="help" size={36} />
        <h2>{title}</h2>
        <p>
          Estás explorando una demostración con Demo1, la {demoFarm.name} y los
          LIBOx 000 y 001.
        </p>
        <p>
          Este control no modifica ninguna cuenta ni equipo real. Los ajustes de
          esta muestra son temporales y no se envía información.
        </p>
        <button className="replica-primary" onClick={onClose}>
          Volver a la aplicación
        </button>
      </section>
    </div>
  );
}
export default function ApplicationDemo({ view, onView, experience }) {
  const root = useRef(null),
    scroll = useRef(null),
    [scale, setScale] = useState(1),
    [info, setInfo] = useState(null);
  useLayoutEffect(() => {
    const element = root.current,
      measure = () => setScale(element.getBoundingClientRect().width / 1920);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (scroll.current) scroll.current.scrollTop = 0;
  }, [view, experience.device, experience.guide]);
  const defaultGraph = [
    "environment",
    "dryness",
    "water",
    "temperature",
  ].includes(view)
    ? graphGroups[view]
    : null;
  const history = experience.metric
    ? { title: metricById[experience.metric].name, ids: [experience.metric] }
    : (experience.graph ?? defaultGraph);
  const closeHistory = () => {
    experience.setMetric(null);
    experience.setGraph(null);
    if (defaultGraph) onView("telemetry");
  };
  const title =
    view === "farms"
      ? "Fincas"
      : view === "meteo"
        ? "Estación Meteorológica"
        : view === "alerts"
          ? "Avisos"
          : view === "notebook"
            ? "Cuaderno de campo"
            : view === "guides"
              ? "Guías y manuales"
              : view === "farm-telemetry"
                ? "Telemetría de finca"
                : "Telemetría LIBOx";
  return (
    <div
      ref={root}
      className="app-demo replica-viewport"
      data-demo="synthetic"
      aria-label="Aplicación de demostración. Nombres, fechas y lecturas ficticios."
    >
      <div className="replica-canvas" style={{ transform: `scale(${scale})` }}>
        {history ? (
          <ReplicaHistory
            key={`${view}-${history.title}-${history.ids.join()}`}
            group={history}
            experience={experience}
            onClose={closeHistory}
          />
        ) : (
          <div className="replica-shell">
            <Sidebar view={view} onView={onView} onInfo={setInfo} />
            <div className="replica-workspace">
              <Header title={title} onInfo={setInfo} />
              <div className="replica-workspace-scroll" ref={scroll}>
                {view === "farms" ? (
                  <Farms onView={onView} onInfo={setInfo} />
                ) : view === "meteo" ? (
                  <Weather experience={experience} />
                ) : view === "alerts" ? (
                  <Alerts experience={experience} onInfo={setInfo} />
                ) : view === "notebook" ? (
                  <NotebookDemo experience={experience} />
                ) : view === "guides" ? (
                  <GuidesDemo experience={experience} />
                ) : (
                  <Telemetry
                    experience={experience}
                    onInfo={setInfo}
                    onView={onView}
                    farmContext={view === "farm-telemetry"}
                  />
                )}
              </div>
            </div>
          </div>
        )}
        {view === "custom" && !history && (
          <Builder
            experience={experience}
            onClose={() => onView("telemetry")}
          />
        )}
        {info && <InfoModal title={info} onClose={() => setInfo(null)} />}
      </div>
    </div>
  );
}

import { useEffect, useId, useRef, useState } from "react";
import { assetUrl } from "../config.js";
import {
  demoFarm,
  demoMetrics,
  metricById,
  demoSamples,
  demoAlerts,
  platformViews,
  periods,
  seriesFor,
  rainIntervals,
  chartDomain,
  demoDate,
  demoRange,
  formatReading,
  matchingMetrics,
  toggleDemoMetric,
} from "../demoData.js";
import "../application-demo.css";

export function useDemoExperience() {
  const [period, setPeriod] = useState("7d");
  const [metric, setMetric] = useState(null);
  const [name, setName] = useState("El clima de mi invernadero");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(["air", "humidity", "radiation"]);
  const [customReady, setCustomReady] = useState(false);
  const [alertFilter, setAlertFilter] = useState("Todos");
  return {
    period,
    setPeriod,
    metric,
    setMetric,
    name,
    setName,
    query,
    setQuery,
    selected,
    toggleMetric: (id) => setSelected((items) => toggleDemoMetric(items, id)),
    customReady,
    setCustomReady,
    alertFilter,
    setAlertFilter,
  };
}

function PeriodPicker({ experience }) {
  return (
    <div
      className="demo-periods"
      role="group"
      aria-label="Período de los datos simulados"
    >
      {periods.map((period) => (
        <button
          key={period.id}
          aria-pressed={experience.period === period.id}
          onClick={() => experience.setPeriod(period.id)}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}

function MetricButton({ id, experience }) {
  const metric = metricById[id];
  const value = demoSamples.at(-1).values[id];
  const outsideBand =
    metric.band && (value < metric.band[0] || value > metric.band[1]);
  return (
    <button
      className={`demo-metric${outsideBand ? " demo-metric-alert" : ""}`}
      onClick={() => experience.setMetric(id)}
      aria-label={`Ver histórico simulado de ${metric.name}`}
    >
      <span className="demo-metric-name">
        {metric.name}
        <i aria-hidden="true">↗</i>
      </span>
      <strong>
        {formatReading(id)} <small>{metric.unit}</small>
      </strong>
      <span className="demo-metric-state">
        {outsideBand ? "A revisar · ejemplo" : "Lectura de ejemplo"}
      </span>
    </button>
  );
}

function MetricsList({ group, experience }) {
  return (
    <details className="demo-indicators">
      <summary>
        Ver todos los indicadores de {group.toLowerCase()} <span>↗</span>
      </summary>
      <div className="demo-metric-grid">
        {demoMetrics
          .filter((metric) => metric.group === group)
          .map((metric) => (
            <MetricButton
              key={metric.id}
              id={metric.id}
              experience={experience}
            />
          ))}
      </div>
    </details>
  );
}

function DemoChart({ ids, title, period, bars = false }) {
  const titleId = useId();
  const [hover, setHover] = useState(null);
  const metrics = ids.map((id) => metricById[id]);
  const data = bars ? rainIntervals(period) : seriesFor(ids[0], period);
  const [rawMin, rawMax] = bars
    ? [0, Math.max(1, ...data.map((point) => point.value)) * 1.2]
    : chartDomain(ids, period);
  const min = rawMin,
    max = rawMax;
  const left = 52,
    right = 814,
    top = 19,
    bottom = 190;
  const x = (index) =>
    left + (index / Math.max(1, data.length - 1)) * (right - left);
  const y = (value) => bottom - ((value - min) / (max - min)) * (bottom - top);
  const points = (id) =>
    seriesFor(id, period)
      .map(
        (point, index) =>
          `${index ? "L" : "M"}${x(index).toFixed(2)},${y(point.value).toFixed(2)}`,
      )
      .join(" ");
  const visibleHover = hover === null ? null : Math.min(hover, data.length - 1);
  const decimals = max - min < 4 ? 1 : 0;
  return (
    <figure className="demo-chart">
      <figcaption>
        <div>
          <span className="demo-eyebrow">
            HISTÓRICO SIMULADO · {metrics[0].unit}
          </span>
          <h4>{title}</h4>
        </div>
        <span className="demo-chart-range">{demoRange(period)}</span>
      </figcaption>
      <div className="demo-legend">
        {metrics.map((metric) => (
          <span key={metric.id}>
            <i style={{ background: metric.color }} />
            {metric.name} <b>{metric.unit}</b>
          </span>
        ))}
      </div>
      <div
        className="demo-chart-scroll"
        tabIndex={0}
        aria-label={`Gráfica desplazable de ${title}`}
      >
        <svg
          viewBox="0 0 840 235"
          role="img"
          aria-labelledby={titleId}
          onPointerLeave={() => setHover(null)}
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const position = ((event.clientX - rect.left) * 840) / rect.width;
            setHover(
              Math.max(
                0,
                Math.min(
                  data.length - 1,
                  Math.round(
                    ((position - left) / (right - left)) * (data.length - 1),
                  ),
                ),
              ),
            );
          }}
        >
          <title id={titleId}>
            {title}. Datos inventados, {demoRange(period)}. Unidad:{" "}
            {metrics[0].unit}.
          </title>
          {[0, 1, 2, 3].map((index) => {
            const value = min + ((max - min) * index) / 3;
            const baseline = y(value);
            return (
              <g key={index}>
                <line
                  x1={left}
                  x2={right}
                  y1={baseline}
                  y2={baseline}
                  className="demo-grid-line"
                />
                <text x={left - 10} y={baseline + 4} textAnchor="end">
                  {value.toLocaleString("es-ES", {
                    maximumFractionDigits: decimals,
                  })}
                </text>
              </g>
            );
          })}
          {bars
            ? data.map((point, index) => (
                <rect
                  key={point.time}
                  x={x(index) - 4}
                  y={y(point.value)}
                  width={period === "24h" ? 15 : 12}
                  height={bottom - y(point.value)}
                  rx="2"
                  fill={metrics[0].color}
                  opacity="0.8"
                >
                  <title>
                    {demoDate(point.time, true)}:{" "}
                    {point.value.toLocaleString("es-ES")} mm simulados
                  </title>
                </rect>
              ))
            : metrics.map((metric) => (
                <path
                  key={metric.id}
                  d={points(metric.id)}
                  fill="none"
                  stroke={metric.color}
                  strokeWidth="2.25"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ))}
          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
            const index = Math.round((data.length - 1) * fraction);
            return (
              <text
                key={fraction}
                x={x(index)}
                y="219"
                textAnchor={
                  fraction === 0 ? "start" : fraction === 1 ? "end" : "middle"
                }
              >
                {demoDate(data[index].time, period === "24h")}
              </text>
            );
          })}
          {visibleHover !== null && (
            <g>
              <line
                x1={x(visibleHover)}
                x2={x(visibleHover)}
                y1={top}
                y2={bottom}
                stroke="#b0bdb8"
                strokeDasharray="4 4"
              />
              {bars
                ? null
                : metrics.map((metric) => (
                    <circle
                      key={metric.id}
                      cx={x(visibleHover)}
                      cy={y(seriesFor(metric.id, period)[visibleHover].value)}
                      r="4"
                      fill={metric.color}
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  ))}
            </g>
          )}
        </svg>
      </div>
      <div className="demo-chart-foot">
        {visibleHover !== null ? (
          <span>
            {demoDate(data[visibleHover].time, true)} ·{" "}
            {metrics
              .map(
                (metric) =>
                  `${formatReading(metric.id, bars ? data[visibleHover].value : seriesFor(metric.id, period)[visibleHover].value)} ${metric.unit}`,
              )
              .join(" / ")}
          </span>
        ) : (
          <span>
            {bars
              ? `Lluvia acumulada por intervalo de ${period === "24h" ? "1 h" : period === "30d" ? "24 h" : "6 h"}`
              : "Pasa el puntero por las curvas para consultar el ejemplo"}
          </span>
        )}
        <span>Calendario ficticio · 2030</span>
      </div>
    </figure>
  );
}

function Overview({ experience }) {
  return (
    <>
      <div className="demo-device">
        <div>
          <span className="demo-eyebrow">EQUIPO DE EJEMPLO</span>
          <h3>LIBOx {demoFarm.device}</h3>
          <p>
            {demoFarm.name} · {demoFarm.sector}
          </p>
        </div>
        <dl>
          <div>
            <dt>Batería</dt>
            <dd>{demoFarm.battery}%</dd>
          </div>
          <div>
            <dt>Cobertura</dt>
            <dd>{demoFarm.coverage}</dd>
          </div>
          <div>
            <dt>Última muestra</dt>
            <dd>16:00 · demo</dd>
          </div>
        </dl>
      </div>
      <div className="demo-crop-phase">
        <div className="demo-sprout" aria-hidden="true">
          ✳
        </div>
        <div>
          <span className="demo-eyebrow">
            CAMPAÑA INVENTADA · DÍA {demoFarm.campaignDay}
          </span>
          <h4>
            {demoFarm.crop} <span>/ {demoFarm.phase}</span>
          </h4>
          <p>
            Un ejemplo de cómo se presenta el estado del cultivo, sin datos de
            agricultores.
          </p>
        </div>
      </div>
      <div className="demo-subheading">
        <h3>Indicadores de tu cultivo</h3>
        <span>Pulsa una lectura para ver su histórico ↗</span>
      </div>
      <div className="demo-metric-grid">
        {["air", "humidity", "radiation", "soil", "tension15", "tension30"].map(
          (id) => (
            <MetricButton key={id} id={id} experience={experience} />
          ),
        )}
      </div>
      <MetricsList group="Ambiente" experience={experience} />
      <MetricsList group="Suelo" experience={experience} />
      <DemoChart
        ids={["air"]}
        title="El ritmo de un día de ejemplo"
        period="24h"
      />
    </>
  );
}

function CustomGraph({ experience }) {
  const formId = useId();
  const groups = experience.selected.reduce((result, id) => {
    const unit = metricById[id].unit;
    (result[unit] ??= []).push(id);
    return result;
  }, {});
  if (experience.customReady)
    return (
      <>
        <div className="demo-subheading">
          <div>
            <span className="demo-eyebrow">
              VISTA PREVIA · NO SE HA GUARDADO
            </span>
            <h3>{experience.name.trim()}</h3>
          </div>
          <button
            className="demo-secondary"
            onClick={() => experience.setCustomReady(false)}
          >
            Editar selección ↗
          </button>
        </div>
        {Object.entries(groups).map(([unit, ids]) => (
          <DemoChart
            key={unit}
            ids={ids}
            title={ids.map((id) => metricById[id].name).join(" + ")}
            period={experience.period}
          />
        ))}
      </>
    );
  return (
    <form
      className="demo-builder"
      onSubmit={(event) => {
        event.preventDefault();
        if (experience.selected.length && experience.name.trim())
          experience.setCustomReady(true);
      }}
    >
      <div className="demo-builder-title">
        <span className="demo-eyebrow">COMPARA TUS SEÑALES · EJEMPLO</span>
        <h3>Crea tu gráfica</h3>
        <p>
          Elige hasta seis medidas. Las unidades diferentes se muestran en
          paneles separados.
        </p>
      </div>
      <label htmlFor={`${formId}-name`}>Nombre de la gráfica</label>
      <input
        id={`${formId}-name`}
        maxLength={80}
        value={experience.name}
        onChange={(event) => experience.setName(event.target.value)}
        required
      />
      <div className="demo-builder-count">
        <label htmlFor={`${formId}-search`}>Medidas para comparar</label>
        <span aria-live="polite">{experience.selected.length} de 6</span>
      </div>
      <input
        type="search"
        id={`${formId}-search`}
        placeholder="Buscar medida…"
        value={experience.query}
        onChange={(event) => experience.setQuery(event.target.value)}
      />
      <div
        className="demo-measure-list"
        role="group"
        aria-label="Parámetros de la gráfica de ejemplo"
      >
        {matchingMetrics(experience.query).map((metric) => (
          <label
            key={metric.id}
            className={
              experience.selected.includes(metric.id) ? "is-selected" : ""
            }
          >
            <input
              type="checkbox"
              checked={experience.selected.includes(metric.id)}
              disabled={
                !experience.selected.includes(metric.id) &&
                experience.selected.length >= 6
              }
              onChange={() => experience.toggleMetric(metric.id)}
            />
            <span>
              {metric.name}
              <small>{metric.group}</small>
            </span>
            <b>{metric.unit}</b>
          </label>
        ))}
        {matchingMetrics(experience.query).length === 0 && (
          <p className="demo-no-results" role="status">
            No hay medidas con ese nombre.
          </p>
        )}
      </div>
      <p className="demo-local-note">
        Solo es una demostración: no conecta con tu cuenta, no guarda ni envía
        datos.
      </p>
      <button
        className="demo-primary"
        type="submit"
        disabled={!experience.selected.length || !experience.name.trim()}
      >
        Ver gráfica de ejemplo ↗
      </button>
    </form>
  );
}

function Alerts({ experience }) {
  const alerts = demoAlerts.filter(
    (alert) =>
      experience.alertFilter === "Todos" ||
      alert.state === experience.alertFilter,
  );
  return (
    <>
      <div className="demo-alert-banner">
        <span className="demo-eyebrow">AVISOS DE CULTIVO · DEMOSTRACIÓN</span>
        <h3>Una señal merece atención.</h3>
        <p>
          LIBOx {demoFarm.device} · {demoFarm.name} · 09/05/2030
        </p>
      </div>
      <div
        className="demo-alert-filters"
        role="group"
        aria-label="Filtrar avisos ficticios"
      >
        {["Todos", "Atención", "Resuelto", "Informativo"].map((filter) => (
          <button
            key={filter}
            aria-pressed={experience.alertFilter === filter}
            onClick={() => experience.setAlertFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="demo-alerts" aria-live="polite">
        {alerts.map((alert) => (
          <article
            key={alert.id}
            className={`demo-alert demo-alert-${alert.state === "Atención" ? "attention" : "resolved"}`}
          >
            <div>
              <span className="demo-alert-state">{alert.state} · simulado</span>
              <time>{alert.date}</time>
            </div>
            <h4>{alert.title}</h4>
            <p>{alert.detail}</p>
            <button
              className="demo-history-link"
              onClick={() => experience.setMetric(alert.metric)}
            >
              Ver histórico de ejemplo ↗
            </button>
          </article>
        ))}
      </div>
    </>
  );
}

export default function ApplicationDemo({ view, onView, experience }) {
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [view, experience.metric, experience.customReady]);
  const selectedView = platformViews.find((item) => item.id === view);
  const modeTitle = experience.metric
    ? metricById[experience.metric].name
    : selectedView.tab;
  return (
    <div className="app-demo" data-demo="synthetic">
      <div className="demo-layout" ref={scrollRef}>
        <aside
          className="demo-sidebar"
          aria-label="Navegación de la demostración"
        >
          <div className="demo-brand">
            <img src={assetUrl("brand/icon-128.png")} alt="" />
            <b>Hiotera</b>
          </div>
          <span className="demo-eyebrow">EXPLORA LA APLICACIÓN</span>
          <nav>
            {platformViews.map((item, index) => (
              <button
                key={item.id}
                onClick={() => onView(item.id)}
                aria-current={view === item.id ? "page" : undefined}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.tab}
              </button>
            ))}
          </nav>
          <div className="demo-sidebar-note">
            UN ENTORNO FICTICIO
            <br />
            <strong>Sin datos de clientes.</strong>
            <p>
              Todos los nombres, fechas y valores están creados para esta web.
            </p>
          </div>
        </aside>
        <div className="demo-workspace">
          <div className="demo-topline">
            <div>
              <strong>{modeTitle}</strong>
              <span>{demoFarm.name} · ejemplo</span>
            </div>
            <span className="demo-badge">
              <i />
              {demoFarm.notice}
            </span>
          </div>
          <div className="demo-main">
            <div className="demo-context">
              <span>CAMPAÑA FICTICIA / MAYO 2030</span>
              <span>LIBOx {demoFarm.device}</span>
            </div>
            {experience.metric ? (
              <>
                <button
                  className="demo-history-link demo-back"
                  onClick={() => experience.setMetric(null)}
                >
                  ← Volver a {selectedView.tab.toLowerCase()}
                </button>
                <div className="demo-history-heading">
                  <div>
                    <span className="demo-eyebrow">
                      CADA PARÁMETRO TIENE SU HISTÓRICO
                    </span>
                    <h3>{metricById[experience.metric].name}</h3>
                  </div>
                  <PeriodPicker experience={experience} />
                </div>
                <DemoChart
                  ids={[experience.metric]}
                  title={metricById[experience.metric].name}
                  period={experience.period}
                  bars={experience.metric === "rain"}
                />
                <p className="demo-local-note">
                  Curva generada para esta demostración. Las bandas y los
                  estados del ejemplo no son recomendaciones agronómicas.
                </p>
              </>
            ) : (
              <>
                {view !== "telemetry" && view !== "alerts" && (
                  <div className="demo-history-heading">
                    <div>
                      <span className="demo-eyebrow">
                        CALENDARIO Y LECTURAS INVENTADOS
                      </span>
                      <h3>
                        {view === "custom"
                          ? "Tus medidas, a tu manera."
                          : selectedView.tab}
                      </h3>
                    </div>
                    <PeriodPicker experience={experience} />
                  </div>
                )}
                {view === "telemetry" && <Overview experience={experience} />}
                {view === "environment" && (
                  <div className="demo-chart-stack">
                    <DemoChart
                      ids={["air"]}
                      title="Temperatura ambiente"
                      period={experience.period}
                    />
                    <DemoChart
                      ids={["humidity"]}
                      title="Humedad relativa"
                      period={experience.period}
                    />
                    <DemoChart
                      ids={["radiation"]}
                      title="Radiación interior"
                      period={experience.period}
                    />
                  </div>
                )}
                {view === "water" && (
                  <div className="demo-chart-stack">
                    <DemoChart
                      ids={["tension15", "tension30"]}
                      title="Tensión del agua a dos profundidades"
                      period={experience.period}
                    />
                    <DemoChart
                      ids={["moisture1", "moisture2"]}
                      title="Humedad del suelo"
                      period={experience.period}
                    />
                  </div>
                )}
                {view === "temperature" && (
                  <DemoChart
                    ids={["soil", "soil1", "soil2"]}
                    title="Temperaturas del suelo"
                    period={experience.period}
                  />
                )}
                {view === "meteo" && (
                  <>
                    <div className="demo-metric-grid">
                      {["outside", "wind", "gust"].map((id) => (
                        <MetricButton
                          key={id}
                          id={id}
                          experience={experience}
                        />
                      ))}
                    </div>
                    <DemoChart
                      ids={["wind", "gust"]}
                      title="Viento y rachas"
                      period={experience.period}
                    />
                    <DemoChart
                      ids={["rain"]}
                      title="Episodios de lluvia inventados"
                      period={experience.period}
                      bars
                    />
                    <MetricsList group="Meteo" experience={experience} />
                  </>
                )}
                {view === "custom" && <CustomGraph experience={experience} />}
                {view === "alerts" && <Alerts experience={experience} />}
              </>
            )}
            <div className="demo-screen-footer">
              <span>
                <i />
                ENTORNO DE DEMOSTRACIÓN
              </span>
              <p>
                Interfaz recreada a partir de las referencias de Hiotera.
                Nombres, fechas, fases, valores y curvas ficticios. No hay
                conexión con fincas reales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

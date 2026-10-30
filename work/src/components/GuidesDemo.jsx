import { useState } from "react";
import { demoGuides, guideSections, matchingGuides } from "../demoResources.js";
import { AppIcon as I } from "./ReplicaIcons.jsx";

export default function GuidesDemo({ experience }) {
  const [query, setQuery] = useState("");
  const article = demoGuides.find((item) => item.id === experience.guide);
  const matches = matchingGuides(query);
  if (article)
    return (
      <div className="replica-page replica-guide-reader">
        <button
          className="replica-guide-back"
          onClick={() => experience.setGuide(null)}
        >
          ← Todas las guías
        </button>
        <article className="replica-guide-article">
          <div className="replica-resource-eyebrow">GUÍAS Y MANUALES</div>
          <h1>{article.title}</h1>
          <p className="replica-guide-lead">{article.summary}</p>
          <h2>Qué significa</h2>
          <p>{article.body}</p>
          <h2>En la aplicación</h2>
          <p>
            Cada medida tiene una gráfica para ver cómo cambia con el tiempo.
            Puedes consultar 24 horas, 7 días o 30 días y comparar varias
            medidas en una misma gráfica.
          </p>
          {article.metric && (
            <button
              className="replica-primary"
              onClick={() => {
                experience.setGraph(null);
                experience.setMetric(article.metric);
              }}
            >
              <I name="history" /> Ver la gráfica de esta medida
            </button>
          )}
          <aside className="replica-resource-note">
            Es una demostración con datos inventados. No utilices estas lecturas
            para tomar decisiones sobre una finca real.
          </aside>
        </article>
      </div>
    );
  return (
    <div className="replica-page replica-guides">
      <label className="replica-guide-search">
        <I name="search" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar: riego, hongos, salinidad..."
          aria-label="Buscar guías y manuales"
        />
      </label>
      {guideSections.map((section) => {
        const items = matches.filter((item) => item.section === section.id);
        return (
          items.length > 0 && (
            <section className="replica-guide-section" key={section.id}>
              <header>
                <h3>{section.title}</h3>
                <p>{section.description}</p>
              </header>
              <div className="replica-guide-grid">
                {items.map((guide) => (
                  <button
                    className="replica-guide-card"
                    key={guide.id}
                    onClick={() => experience.setGuide(guide.id)}
                  >
                    <span>
                      <b>{guide.title}</b>
                      <span>{guide.summary}</span>
                    </span>
                    <I name="right" size={17} />
                  </button>
                ))}
              </div>
            </section>
          )
        );
      })}
      {!matches.length && (
        <p className="replica-empty" role="status">
          No hay guías para «{query}». Prueba con otra palabra.
        </p>
      )}
    </div>
  );
}

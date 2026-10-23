import { useEffect, useId, useRef, useState } from "react";
import { catalogCategories, filterCatalog } from "../catalog.js";
import CatalogModel from "./CatalogModel.jsx";

export default function CatalogSection({ onContact }) {
  const [category, setCategory] = useState("Todos"),
    [query, setQuery] = useState("");
  const inputId = useId();
  const dialogRef = useRef(null);
  const [activeModel, setActiveModel] = useState(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (activeModel && !dialog.open) dialog.showModal();
    if (!activeModel && dialog.open) dialog.close();
  }, [activeModel]);
  const items = filterCatalog(category, query);
  return (
    <section
      id="catalogo"
      className="section catalog-section"
      aria-labelledby="catalog-title"
    >
      <div className="section-inner">
        <div className="catalog-heading">
          <div>
            <div className="section-label">
              EL ECOSISTEMA / CATÁLOGO HIOTERA
            </div>
            <h2 id="catalog-title">
              Cada utensilio.
              <br />
              <span>Su lugar en el campo.</span>
            </h2>
          </div>
          <p>
            Un mismo sistema, distintas piezas. Explora los equipos, las sondas
            y la energía que conectan tu cultivo.
          </p>
        </div>
        <div className="catalog-toolbar">
          <div
            role="group"
            aria-label="Filtrar catálogo por categoría"
            className="catalog-filters"
          >
            {catalogCategories.map((item) => (
              <button
                key={item}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="catalog-search">
            <label htmlFor={inputId}>Buscar en el catálogo</label>
            <input
              id={inputId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="¿Qué estás buscando?"
            />
          </div>
        </div>
        <p className="catalog-count" role="status">
          {items.length} {items.length === 1 ? "elemento" : "elementos"}
        </p>
        <div className="catalog-grid">
          {items.map((item) => (
            <article className="catalog-card" key={item.id}>
              <div className={`catalog-visual model-${item.id}`}>
                <span className="catalog-category">{item.category}</span>
                <CatalogModel item={item} onExpand={setActiveModel} />
              </div>
              <div className="catalog-card-copy">
                <small>{item.type}</small>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                {item.contact ? (
                  <button
                    className="catalog-action"
                    onClick={onContact}
                    aria-label={`Consultar ${item.name.toLowerCase()}`}
                  >
                    {item.action}
                    <span aria-hidden="true">↗</span>
                  </button>
                ) : (
                  <a
                    className="catalog-action"
                    href={item.href}
                    onClick={() => {
                      if (item.href === "#nodo" && item.id !== "libox")
                        window.dispatchEvent(
                          new CustomEvent("hiotera:libox-part", {
                            detail: item.id,
                          }),
                        );
                    }}
                  >
                    {item.action}
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
        {items.length === 0 && (
          <div className="catalog-empty">
            <p>No encontramos ese utensilio en esta selección.</p>
            <button
              onClick={() => {
                setCategory("Todos");
                setQuery("");
              }}
            >
              Ver todo el catálogo ↗
            </button>
          </div>
        )}
        <div className="catalog-grow">
          <span aria-hidden="true">＋</span>
          <div>
            <h3>El campo cambia. El catálogo crece.</h3>
            <p>
              Este espacio seguirá reuniendo los utensilios del sistema Hiotera.
            </p>
          </div>
          <button className="button dark-button" onClick={onContact}>
            Consultar un equipo ↗
          </button>
        </div>
      </div>
      <dialog
        ref={dialogRef}
        className="catalog-model-dialog"
        aria-labelledby={`${inputId}-model-title`}
        onCancel={(event) => {
          event.preventDefault();
          setActiveModel(null);
        }}
        onClose={() => setActiveModel(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setActiveModel(null);
        }}
      >
        <div className="catalog-model-dialog-top">
          <div>
            <span>CATÁLOGO HIOTERA / MODELO 3D</span>
            <h3 id={`${inputId}-model-title`}>{activeModel?.name}</h3>
          </div>
          <button
            onClick={() => setActiveModel(null)}
            aria-label="Cerrar modelo 3D ampliado"
          >
            Cerrar ×
          </button>
        </div>
        {activeModel && (
          <CatalogModel key={activeModel.id} item={activeModel} large />
        )}
      </dialog>
    </section>
  );
}

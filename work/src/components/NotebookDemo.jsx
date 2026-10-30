import { useEffect, useRef, useState } from "react";
import { demoFarm } from "../demoData.js";
import { AppIcon as I } from "./ReplicaIcons.jsx";

function Status({ done, partial = false }) {
  return (
    <span
      className={`replica-notebook-status${done ? " is-ready" : partial ? " is-partial" : ""}`}
    >
      {done ? "Listo" : partial ? "A medias" : "Pendiente"}
    </span>
  );
}
function Step({ number, title, description, done, partial, action, children }) {
  return (
    <section className="replica-notebook-step">
      <div
        className={`replica-step-number${done ? " is-ready" : partial ? " is-partial" : ""}`}
      >
        {done ? <I name="check" /> : `0${number}`}
      </div>
      <div className="replica-step-content">
        <div className="replica-step-heading">
          <div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
          <div className="replica-step-actions">
            <Status done={done} partial={partial} />
            {action}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

export default function NotebookDemo({ experience }) {
  const root = useRef(null);
  const { notebook, setNotebook } = experience;
  const [bookOpen, setBookOpen] = useState(false),
    [panel, setPanel] = useState(null),
    [value, setValue] = useState("");
  const [entryDate, setEntryDate] = useState("2030-05-09"),
    [entryType, setEntryType] = useState("Observación"),
    [filter, setFilter] = useState("Todos");
  useEffect(() => {
    const scroller = root.current?.closest(".replica-workspace-scroll");
    if (scroller) scroller.scrollTop = 0;
  }, [bookOpen]);
  const farms = notebook.farms ?? [demoFarm.name];
  const ready = [
    Boolean(notebook.owner),
    notebook.people.length > 0,
    notebook.equipment.length > 0,
    true,
    Boolean(notebook.campaignReady),
  ];
  const edit = (target) => {
    setPanel(panel === target ? null : target);
    setValue(target === "owner" ? notebook.owner : "");
  };
  const save = (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    setNotebook((current) =>
      panel === "owner"
        ? { ...current, owner: value.trim() }
        : panel === "entry"
          ? {
              ...current,
              campaignReady: true,
              entries: [
                {
                  id: `demo-entry-${current.entries.length + 1}`,
                  date: entryDate,
                  type: entryType,
                  detail: value.trim(),
                },
                ...current.entries,
              ],
            }
          : panel === "farms"
            ? {
                ...current,
                farms: [...(current.farms ?? [demoFarm.name]), value.trim()],
              }
            : { ...current, [panel]: [...current[panel], value.trim()] },
    );
    setPanel(null);
    setValue("");
  };
  const editor = (target) =>
    panel === target && (
      <form className="replica-notebook-editor" onSubmit={save}>
        <p>Solo para esta demostración. Introduce información inventada.</p>
        {target === "entry" && (
          <>
            <label>
              Fecha de ejemplo
              <input
                type="date"
                required
                min="2030-01-01"
                max="2030-12-31"
                value={entryDate}
                onChange={(event) => setEntryDate(event.target.value)}
              />
            </label>
            <label>
              Tipo de registro
              <select
                value={entryType}
                onChange={(event) => setEntryType(event.target.value)}
              >
                {["Observación", "Riego", "Labores"].map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
          </>
        )}
        <label>
          {target === "owner"
            ? "Titular de ejemplo"
            : target === "people"
              ? "Nombre del aplicador de ejemplo"
              : target === "equipment"
                ? "Nombre del equipo de ejemplo"
                : target === "farms"
                  ? "Nombre de la finca de ejemplo"
                  : "Descripción del registro"}
          <input
            required
            maxLength={220}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={
              target === "entry"
                ? "Ej. Revisión del sector de demostración"
                : "Ej. Demo2"
            }
          />
        </label>
        <div>
          <button
            type="button"
            className="replica-secondary"
            onClick={() => setPanel(null)}
          >
            Cancelar
          </button>
          <button type="submit" className="replica-primary">
            Guardar en la demo
          </button>
        </div>
      </form>
    );
  if (bookOpen) {
    const entries = notebook.entries.filter(
      (entry) => filter === "Todos" || entry.type === filter,
    );
    return (
      <div ref={root} className="replica-page replica-notebook">
        <button
          className="replica-guide-back"
          onClick={() => {
            setBookOpen(false);
            setPanel(null);
          }}
        >
          ← Resumen del cuaderno
        </button>
        <section className="replica-notebook-summary">
          <div>
            <h1>Cuaderno de {demoFarm.person}</h1>
            <p>{demoFarm.name} · Campaña de ejemplo 2030</p>
          </div>
          <button className="replica-primary" onClick={() => edit("entry")}>
            <I name="plus" /> Nuevo registro
          </button>
        </section>
        {editor("entry")}
        <section className="replica-notebook-records">
          <header>
            <h3>Registros de campo</h3>
            <label>
              Mostrar
              <select
                aria-label="Filtrar registros del cuaderno"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                {["Todos", "Observación", "Riego", "Labores"].map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
          </header>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Finca</th>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Responsable</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.date.split("-").reverse().join("/")}</td>
                  <td>{demoFarm.name}</td>
                  <td>
                    <span className="replica-notebook-chip">{entry.type}</span>
                  </td>
                  <td>{entry.detail}</td>
                  <td>{demoFarm.person}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!entries.length && (
            <p className="replica-empty">
              No hay registros de este tipo en la demostración.
            </p>
          )}
        </section>
        <p className="replica-resource-note">
          Cuaderno de ejemplo, sin validez oficial. No se guarda ni se envía
          información a ninguna cuenta o administración.
        </p>
      </div>
    );
  }
  return (
    <div ref={root} className="replica-page replica-notebook">
      <section className="replica-notebook-summary">
        <div>
          <h1>{demoFarm.person}</h1>
          <p>{ready.filter(Boolean).length} de 5 apartados listos</p>
          <div
            className="replica-notebook-progress"
            aria-label={`${ready.filter(Boolean).length} de 5 apartados listos`}
          >
            {ready.map((done, index) => (
              <span key={index} className={done ? "is-ready" : ""} />
            ))}
          </div>
        </div>
        <button
          className="replica-primary"
          onClick={() => {
            setBookOpen(true);
            setPanel(null);
          }}
        >
          <I name="book" /> Abrir cuaderno
        </button>
      </section>
      <Step
        number={1}
        title="Explotación"
        description="Titular, NIF y código REGEPA de la explotación."
        done={ready[0]}
        partial
        action={
          <button className="replica-secondary" onClick={() => edit("owner")}>
            Editar
          </button>
        }
      >
        <dl className="replica-exploitation-fields">
          {[
            ["Titular", notebook.owner || "—"],
            ["NIF o CIF", "—"],
            ["Código REGEPA", "—"],
            ["Municipio", "—"],
            ["Superficie declarada", "—"],
          ].map(([label, field]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{field}</dd>
            </div>
          ))}
        </dl>
        {editor("owner")}
      </Step>
      <Step
        number={2}
        title="Personas"
        description="Quién aplica los tratamientos, con su carné, y quién asesora."
        done={ready[1]}
        action={
          <button className="replica-secondary" onClick={() => edit("people")}>
            <I name="list" size={16} /> Gestionar personas
          </button>
        }
      >
        <div className="replica-notebook-chips">
          <span>Titular registrado</span>
          <span>{notebook.people.length} aplicadores</span>
          <span>0 asesores</span>
          {notebook.people.map((person, index) => (
            <span key={index}>{person}</span>
          ))}
        </div>
        {editor("people")}
      </Step>
      <Step
        number={3}
        title="Equipos de aplicación"
        description="Con qué se trata y su inspección ITEAF."
        done={ready[2]}
        action={
          <button
            className="replica-secondary"
            onClick={() => edit("equipment")}
          >
            <I name="settings" size={16} /> Gestionar equipos
          </button>
        }
      >
        <div className="replica-notebook-chips">
          <span>{notebook.equipment.length} equipos</span>
          {notebook.equipment.map((equipment, index) => (
            <span key={index}>{equipment}</span>
          ))}
        </div>
        {editor("equipment")}
      </Step>
      <Step
        number={4}
        title="Fincas y recintos SIGPAC"
        description="Dónde se apunta: cada apunte va a un recinto de una finca."
        done
        action={
          <button className="replica-secondary" onClick={() => edit("farms")}>
            <I name="plus" size={16} /> Nueva finca
          </button>
        }
      >
        <div className="replica-notebook-farms">
          {farms.map((farm, index) => (
            <div key={index}>
              <span>
                <b>{farm}</b>
                <small>1 recinto de ejemplo</small>
              </span>
              <button
                className="replica-secondary"
                onClick={() => {
                  setBookOpen(true);
                  setPanel(null);
                }}
              >
                <I name="book" size={16} /> Abrir cuaderno
              </button>
            </div>
          ))}
        </div>
        {editor("farms")}
      </Step>
      <Step
        number={5}
        title="Registros de la campaña"
        description="Observaciones, riegos y labores de este escenario ficticio."
        done={ready[4]}
        action={
          <button
            className="replica-secondary"
            onClick={() => {
              setBookOpen(true);
              setPanel(null);
            }}
          >
            Ver registros
          </button>
        }
      >
        <div className="replica-notebook-chips">
          <span>{notebook.entries.length} registros de ejemplo</span>
          <span>Campaña 2030</span>
        </div>
      </Step>
      <p className="replica-resource-note">
        Información inventada. Los cambios son temporales y este cuaderno de
        muestra no tiene validez oficial.
      </p>
    </div>
  );
}

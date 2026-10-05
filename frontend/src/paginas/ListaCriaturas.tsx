import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerCriaturas } from "../api/criaturasApi";
import { Criatura, TipoCriatura, TIPOS_CRIATURA } from "../tipos";

export function ListaCriaturas() {
  const [criaturas, setCriaturas] = useState<Criatura[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<TipoCriatura | "">("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCargando(true);
    setError(null);

    obtenerCriaturas(filtroTipo || undefined)
      .then(setCriaturas)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Error al cargar las criaturas.");
      })
      .finally(() => setCargando(false));
  }, [filtroTipo]);

  return (
    <main className="page-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>
            <strong>Departamento de Pawnee</strong>
            <small>Fenómenos inexplicables</small>
          </span>
        </Link>
        <nav className="main-nav" aria-label="Navegación principal">
          <Link className="nav-link nav-link-active" to="/">Criaturas</Link>
          <Link className="nav-link" to="/avistamientos">Avistamientos</Link>
        </nav>
      </header>

      <section className="page-heading">
        <div>
          <p className="eyebrow">Registro central · Área 01</p>
          <h1>Criaturas de Pawnee</h1>
          <p className="page-description">Catálogo de entidades identificadas por el departamento.</p>
        </div>
        <Link className="button button-primary" to="/criaturas/nueva">
          <span aria-hidden="true">+</span> Registrar criatura
        </Link>
      </section>

      <section className="summary-grid" aria-label="Resumen del catálogo">
        <div className="summary-card">
          <span className="summary-label">Entidades registradas</span>
          <strong>{criaturas.length}</strong>
        </div>
        <div className="summary-card">
          <span className="summary-label">En investigación</span>
          <strong>{criaturas.filter((criatura) => criatura.estado === "en_investigacion").length}</strong>
        </div>
        <div className="summary-card summary-card-alert">
          <span className="summary-label">Nivel de peligro alto</span>
          <strong>{criaturas.filter((criatura) => criatura.nivelPeligro >= 7).length}</strong>
        </div>
      </section>

      <section className="content-card">
        <div className="table-toolbar">
          <div>
            <h2>Directorio de entidades</h2>
            <p>Consulta y administra los registros activos.</p>
          </div>
          <div className="filter-control">
            <label htmlFor="filtro-tipo">Filtrar por tipo</label>
            <select
              id="filtro-tipo"
              value={filtroTipo}
              onChange={(evento) => setFiltroTipo(evento.target.value as TipoCriatura | "")}
            >
              <option value="">Todos los tipos</option>
              {TIPOS_CRIATURA.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
        </div>

        {cargando && <p className="feedback-message">Cargando criaturas...</p>}
        {!cargando && error && <p className="feedback-message feedback-error">Ocurrió un error: {error}</p>}
        {!cargando && !error && criaturas.length === 0 && (
          <p className="feedback-message">Todavía no hay criaturas registradas.</p>
        )}

      {!cargando && !error && criaturas.length > 0 && (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Entidad</th>
                  <th>Tipo</th>
                  <th>Nivel de peligro</th>
                  <th>Estado</th>
                  <th><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                {criaturas.map((criatura) => (
                  <tr key={criatura._id}>
                    <td className="creature-name">
                      <span className="creature-avatar" aria-hidden="true">{criatura.nombre.charAt(0)}</span>
                      <Link to={`/criaturas/${criatura._id}`}>{criatura.nombre}</Link>
                    </td>
                    <td><span className={`type-pill type-${criatura.tipo}`}>{criatura.tipo}</span></td>
                    <td>
                      <span className="danger-level">
                        <span className="danger-track"><span style={{ width: `${criatura.nivelPeligro * 10}%` }} /></span>
                        {criatura.nivelPeligro}/10
                      </span>
                    </td>
                    <td><span className={`status-pill status-${criatura.estado}`}>{criatura.estado.replace("_", " ")}</span></td>
                    <td className="row-actions">
                      <Link to={`/criaturas/${criatura._id}`}>Ver</Link>
                      <Link to={`/criaturas/${criatura._id}/editar`}>Editar</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

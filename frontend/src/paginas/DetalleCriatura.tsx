/**
 * paginas/DetalleCriatura.tsx
 * -------------------------------
 * Muestra una criatura completa y la lista de sus avistamientos, usando
 * la ruta anidada del backend. También permite eliminar la criatura.
 */

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { eliminarCriatura, obtenerCriaturaPorId } from "../api/criaturasApi";
import { obtenerAvistamientosDeCriatura } from "../api/avistamientosApi";
import { Criatura } from "../tipos";

// El backend anida los avistamientos bajo /criaturas/:id/avistamientos
// SIN populate (ver criaturas.controller.ts de la Semana 6) — por eso aquí
// el campo `criatura` es un string, no un objeto.
interface AvistamientoSinPopular {
  _id: string;
  testigo: string;
  ubicacion: string;
  descripcion?: string;
  fecha: string;
}

export function DetalleCriatura() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [criatura, setCriatura] = useState<Criatura | null>(null);
  const [avistamientos, setAvistamientos] = useState<AvistamientoSinPopular[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    Promise.all([obtenerCriaturaPorId(id), obtenerAvistamientosDeCriatura(id)])
      .then(([criaturaCargada, avistamientosCargados]) => {
        setCriatura(criaturaCargada);
        setAvistamientos(avistamientosCargados as unknown as AvistamientoSinPopular[]);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error al cargar la criatura."))
      .finally(() => setCargando(false));
  }, [id]);

  async function manejarEliminar() {
    if (!id) return;
    if (!window.confirm("¿Seguro que quieres eliminar esta criatura?")) return;

    try {
      await eliminarCriatura(id);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la criatura.");
    }
  }

  if (cargando) return <main className="page-shell"><p className="feedback-message">Cargando ficha...</p></main>;
  if (error) return <main className="page-shell"><p className="feedback-message feedback-error">Error: {error}</p></main>;
  if (!criatura) return <main className="page-shell"><p className="feedback-message">No se encontró la criatura.</p></main>;

  return (
    <main className="page-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span><strong>Departamento de Pawnee</strong><small>Fenómenos inexplicables</small></span>
        </Link>
        <nav className="main-nav" aria-label="Navegación principal">
          <Link className="nav-link nav-link-active" to="/">Criaturas</Link>
          <Link className="nav-link" to="/avistamientos">Avistamientos</Link>
        </nav>
      </header>

      <div className="detail-back"><Link className="text-link" to="/">← Volver al directorio</Link></div>
      <section className="detail-hero">
        <div className="detail-title">
          <span className="detail-avatar" aria-hidden="true">{criatura.nombre.charAt(0)}</span>
          <div>
            <p className="eyebrow">Ficha de entidad · Registro {criatura._id.slice(-6)}</p>
            <h1>{criatura.nombre}</h1>
            <div className="detail-meta">
              <span className={`type-pill type-${criatura.tipo}`}>{criatura.tipo}</span>
              <span className={`status-pill status-${criatura.estado}`}>{criatura.estado.replace("_", " ")}</span>
            </div>
          </div>
        </div>
        <div className="detail-actions">
          <Link className="button button-secondary" to={`/criaturas/${criatura._id}/editar`}>Editar ficha</Link>
          <button className="button button-danger" type="button" onClick={manejarEliminar}>Eliminar</button>
        </div>
      </section>

      <section className="detail-grid">
        <div className="content-card detail-card">
          <div className="card-heading"><h2>Datos de investigación</h2><span>01</span></div>
          <div className="detail-stats">
            <div><span className="summary-label">Nivel de peligro</span><strong className="danger-number">{criatura.nivelPeligro}<small>/10</small></strong><span className="danger-track detail-danger-track"><span style={{ width: `${criatura.nivelPeligro * 10}%` }} /></span></div>
            <div><span className="summary-label">Estado actual</span><strong className="detail-stat-value">{criatura.estado.replace("_", " ")}</strong></div>
            <div><span className="summary-label">Avistamientos</span><strong className="detail-stat-value">{avistamientos.length}</strong></div>
          </div>
          <div className="skills-block">
            <span className="summary-label">Habilidades identificadas</span>
            {criatura.habilidades.length > 0 ? <div className="skill-list">{criatura.habilidades.map((habilidad) => <span key={habilidad}>{habilidad}</span>)}</div> : <p className="muted-copy">Ninguna habilidad registrada.</p>}
          </div>
        </div>

        <div className="content-card detail-card sightings-card">
          <div className="card-heading"><div><h2>Avistamientos registrados</h2><p>Reportes vinculados a esta entidad.</p></div><span>{String(avistamientos.length).padStart(2, "0")}</span></div>
          <Link className="button button-primary detail-report-button" to={`/avistamientos/nuevo?criaturaId=${criatura._id}`}>+ Registrar avistamiento</Link>
          {avistamientos.length === 0 ? <p className="muted-copy empty-detail">Todavía no hay avistamientos registrados.</p> : (
            <div className="sighting-list">
              {avistamientos.map((avistamiento) => (
                <article className="sighting-item" key={avistamiento._id}>
                  <time>{avistamiento.fecha.slice(0, 10)}</time>
                  <div><strong>{avistamiento.testigo}</strong><span>{avistamiento.ubicacion}</span>{avistamiento.descripcion && <p>{avistamiento.descripcion}</p>}</div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

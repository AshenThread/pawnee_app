import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { eliminarCriatura, obtenerCriaturaPorId } from "../api/criaturasApi";
import { obtenerAvistamientosDeCriatura } from "../api/avistamientosApi";
import { AppLayout } from "../componentes/AppLayout";
import { ConfirmModal } from "../componentes/ConfirmModal";
import { CreatureImage } from "../componentes/CreatureImage";
import { Criatura } from "../tipos";

interface AvistamientoSinPopular { _id: string; testigo: string; ubicacion: string; descripcion?: string; fecha: string; }

export function DetalleCriatura() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [criatura, setCriatura] = useState<Criatura | null>(null);
  const [avistamientos, setAvistamientos] = useState<AvistamientoSinPopular[]>([]);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState(false);
  const [confirmar, setConfirmar] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([obtenerCriaturaPorId(id), obtenerAvistamientosDeCriatura(id)])
      .then(([c, a]) => { setCriatura(c); setAvistamientos(a as unknown as AvistamientoSinPopular[]); })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error al cargar la criatura."))
      .finally(() => setCargando(false));
  }, [id]);

  async function manejarEliminar() {
    if (!id) return;
    try { setEliminando(true); await eliminarCriatura(id); navigate("/"); }
    catch (err) { setError(err instanceof Error ? err.message : "No se pudo eliminar la criatura."); setEliminando(false); setConfirmar(false); }
  }

  if (cargando) return <AppLayout area="criaturas"><p className="feedback-message" aria-live="polite">Cargando ficha...</p></AppLayout>;
  if (error) return <AppLayout area="criaturas"><p className="feedback-message feedback-error" role="alert">Error: {error}</p></AppLayout>;
  if (!criatura) return <AppLayout area="criaturas"><p className="feedback-message">No se encontró la criatura.</p></AppLayout>;

  return (
    <AppLayout area="criaturas">
      <div className="detail-back"><Link className="text-link" to="/">← Volver al directorio</Link></div>
      <section className="detail-hero">
        <div className="detail-title"><CreatureImage criatura={criatura} large /><div><p className="eyebrow">Ficha de entidad · Registro {criatura._id.slice(-6)}</p><h1>{criatura.nombre}</h1><div className="detail-meta"><span className={`type-pill type-${criatura.tipo}`}>{criatura.tipo}</span><span className={`status-pill status-${criatura.estado}`}>{criatura.estado.replace("_", " ")}</span></div></div></div>
        <div className="detail-actions"><Link className="button button-secondary" to={`/criaturas/${criatura._id}/editar`}>Editar ficha</Link><button className="button button-danger" type="button" onClick={() => setConfirmar(true)}>Eliminar</button></div>
      </section>
      <section className="detail-grid">
        <div className="content-card detail-card"><div className="card-heading"><h2>Datos de investigación</h2><span>01</span></div><div className="detail-stats"><div><span className="summary-label">Nivel de peligro</span><strong className="danger-number">{criatura.nivelPeligro}<small>/10</small></strong><span className={`danger-track danger-${criatura.nivelPeligro} detail-danger-track`}><span style={{ width: `${criatura.nivelPeligro * 10}%` }} /></span><span className="sr-only">{criatura.nivelPeligro >= 7 ? "Nivel alto" : criatura.nivelPeligro >= 4 ? "Nivel medio" : "Nivel bajo"}</span></div><div><span className="summary-label">Estado actual</span><strong className="detail-stat-value">{criatura.estado.replace("_", " ")}</strong></div><div><span className="summary-label">Avistamientos</span><strong className="detail-stat-value">{avistamientos.length}</strong></div></div><div className="skills-block"><span className="summary-label">Habilidades identificadas</span>{criatura.habilidades.length > 0 ? <div className="skill-list">{criatura.habilidades.map((h) => <span key={h}>{h}</span>)}</div> : <p className="muted-copy">Ninguna habilidad registrada.</p>}</div></div>
        <div className="content-card detail-card sightings-card"><div className="card-heading"><div><h2>Avistamientos registrados</h2><p>Reportes vinculados a esta entidad.</p></div><span>{String(avistamientos.length).padStart(2, "0")}</span></div><Link className="button button-primary detail-report-button" to={`/avistamientos/nuevo?criaturaId=${criatura._id}`}>+ Registrar avistamiento</Link>{avistamientos.length === 0 ? <p className="muted-copy empty-detail">Todavía no hay avistamientos registrados.</p> : <div className="sighting-list">{avistamientos.map((a) => <article className="sighting-item" key={a._id}><time dateTime={a.fecha}>{new Date(a.fecha).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}</time><div><strong>{a.testigo}</strong><span>{a.ubicacion}</span>{a.descripcion && <p>{a.descripcion}</p>}</div></article>)}</div>}</div>
      </section>
      <ConfirmModal open={confirmar} title={`¿Eliminar a ${criatura.nombre}?`} description="La ficha y sus datos asociados dejarán de estar disponibles. Esta acción no se puede deshacer." busy={eliminando} onCancel={() => setConfirmar(false)} onConfirm={manejarEliminar} />
    </AppLayout>
  );
}

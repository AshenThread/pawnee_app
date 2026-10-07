import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { eliminarAvistamiento, obtenerAvistamientos } from "../api/avistamientosApi";
import { AppLayout } from "../componentes/AppLayout";
import { ConfirmModal } from "../componentes/ConfirmModal";
import { Avistamiento } from "../tipos";

export function ListaAvistamientos() {
  const [avistamientos, setAvistamientos] = useState<Avistamiento[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState<Avistamiento | null>(null);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cargar = () => { setCargando(true); setError(null); obtenerAvistamientos().then(setAvistamientos).catch((err: unknown) => setError(err instanceof Error ? err.message : "Error al cargar los avistamientos.")).finally(() => setCargando(false)); };
  useEffect(() => { cargar(); }, []);
  const visibles = useMemo(() => avistamientos.filter((a) => `${a.criatura.nombre} ${a.testigo} ${a.ubicacion}`.toLowerCase().includes(busqueda.toLowerCase())).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()), [avistamientos, busqueda]);
  const ultimoReporte = avistamientos.length ? avistamientos.reduce((latest, a) => new Date(a.fecha) > new Date(latest.fecha) ? a : latest) : null;
  async function confirmarEliminar() { if (!seleccionado) return; try { setEliminando(true); await eliminarAvistamiento(seleccionado._id); setAvistamientos((items) => items.filter((a) => a._id !== seleccionado._id)); setSeleccionado(null); } catch (err) { setError(err instanceof Error ? err.message : "No se pudo eliminar el avistamiento."); } finally { setEliminando(false); } }
  return <AppLayout area="avistamientos">
    <section className="page-heading"><div><p className="eyebrow">Registro central · Área 02</p><h1>Avistamientos</h1><p className="page-description">Bitácora de reportes y encuentros registrados en Pawnee.</p></div><Link className="button button-primary" to="/avistamientos/nuevo"><span aria-hidden="true">+</span> Registrar avistamiento</Link></section>
    <section className="summary-grid"><div className="summary-card"><span className="summary-label">Reportes registrados</span><strong>{avistamientos.length}</strong></div><div className="summary-card"><span className="summary-label">Entidades observadas</span><strong>{new Set(avistamientos.map((a) => a.criatura._id)).size}</strong></div><div className="summary-card summary-card-alert"><span className="summary-label">Último reporte</span><strong>{ultimoReporte ? new Date(ultimoReporte.fecha).toLocaleDateString("es-MX", { day: "2-digit", month: "short" }) : "—"}</strong></div></section>
    <section className="content-card"><div className="table-toolbar"><div><h2>Bitácora de campo</h2><p>{visibles.length} reporte{visibles.length === 1 ? "" : "s"} encontrados.</p></div><label className="search-control"><span className="sr-only">Buscar reportes</span><input type="search" placeholder="Buscar criatura, testigo o ubicación..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} /></label></div>
      {cargando && <p className="feedback-message" aria-live="polite">Cargando avistamientos...</p>}
      {!cargando && error && <div className="feedback-message feedback-error" role="alert">Error: {error}<button className="inline-retry" onClick={cargar}>Reintentar</button></div>}
      {!cargando && !error && visibles.length === 0 && <div className="empty-state"><img className="empty-icon-image" src="/icons/sighting.svg" alt="" aria-hidden="true" /><h3>{avistamientos.length ? "No hay resultados" : "La bitácora está vacía"}</h3><p>{avistamientos.length ? "Prueba con otra búsqueda." : "Documenta el primer encuentro del departamento."}</p>{!avistamientos.length && <Link className="button button-primary" to="/avistamientos/nuevo">Registrar avistamiento</Link>}</div>}
      {!cargando && !error && visibles.length > 0 && <div className="table-scroll"><table><thead><tr><th>Fecha</th><th>Criatura</th><th>Testigo</th><th>Ubicación</th><th>Acciones</th></tr></thead><tbody>{visibles.map((a) => <tr key={a._id}><td data-label="Fecha"><time dateTime={a.fecha}>{new Date(a.fecha).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}</time></td><td data-label="Criatura"><Link to={`/criaturas/${a.criatura._id}`}>{a.criatura.nombre}</Link></td><td data-label="Testigo">{a.testigo}</td><td data-label="Ubicación">{a.ubicacion}</td><td data-label="Acciones"><button className="table-delete" type="button" onClick={() => setSeleccionado(a)}>Eliminar</button></td></tr>)}</tbody></table></div>}
    </section>
    <ConfirmModal open={Boolean(seleccionado)} title="¿Eliminar este avistamiento?" description={seleccionado ? `Se eliminará el reporte de ${seleccionado.criatura.nombre} registrado por ${seleccionado.testigo}.` : ""} busy={eliminando} onCancel={() => setSeleccionado(null)} onConfirm={confirmarEliminar} />
  </AppLayout>;
}

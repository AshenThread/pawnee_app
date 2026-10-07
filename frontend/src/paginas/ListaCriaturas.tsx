import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerCriaturas } from "../api/criaturasApi";
import { AppLayout } from "../componentes/AppLayout";
import { CreatureImage } from "../componentes/CreatureImage";
import { Criatura, TipoCriatura, TIPOS_CRIATURA } from "../tipos";

export function ListaCriaturas() {
  const [criaturas, setCriaturas] = useState<Criatura[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<TipoCriatura | "">("");
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("peligro");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCargando(true);
    setError(null);
    obtenerCriaturas(filtroTipo || undefined)
      .then(setCriaturas)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error al cargar las criaturas."))
      .finally(() => setCargando(false));
  }, [filtroTipo]);

  const criaturasVisibles = useMemo(() => criaturas
    .filter((criatura) => `${criatura.nombre} ${criatura.tipo} ${criatura.estado}`.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => orden === "nombre" ? a.nombre.localeCompare(b.nombre) : orden === "peligro-asc" ? a.nivelPeligro - b.nivelPeligro : b.nivelPeligro - a.nivelPeligro), [busqueda, criaturas, orden]);

  return (
    <AppLayout area="criaturas">
      <section className="page-heading">
        <div><p className="eyebrow">Registro central · Área 01</p><h1>Criaturas de Pawnee</h1><p className="page-description">Catálogo de entidades identificadas por el departamento.</p></div>
        <Link className="button button-primary" to="/criaturas/nueva"><span aria-hidden="true">+</span> Registrar criatura</Link>
      </section>
      <section className="summary-grid" aria-label="Resumen del catálogo">
        <div className="summary-card"><span className="summary-label">Entidades registradas</span><strong>{criaturas.length}</strong></div>
        <div className="summary-card"><span className="summary-label">En investigación</span><strong>{criaturas.filter((c) => c.estado === "en_investigacion").length}</strong></div>
        <div className="summary-card summary-card-alert"><span className="summary-label">Nivel de peligro alto</span><strong>{criaturas.filter((c) => c.nivelPeligro >= 7).length}</strong></div>
      </section>
      <section className="content-card">
        <div className="table-toolbar">
          <div><h2>Directorio de entidades</h2><p>{criaturasVisibles.length} resultado{criaturasVisibles.length === 1 ? "" : "s"} · Consulta y administra los registros activos.</p></div>
          <div className="toolbar-controls">
            <label className="search-control"><span className="sr-only">Buscar criaturas</span><input type="search" placeholder="Buscar por nombre..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} /></label>
            <label className="filter-control"><span className="sr-only">Filtrar por tipo</span><select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value as TipoCriatura | "")}><option value="">Todos los tipos</option>{TIPOS_CRIATURA.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}</select></label>
            <label className="filter-control"><span className="sr-only">Ordenar</span><select value={orden} onChange={(e) => setOrden(e.target.value)}><option value="peligro">Mayor peligro</option><option value="peligro-asc">Menor peligro</option><option value="nombre">Nombre A-Z</option></select></label>
          </div>
        </div>
        {cargando && <p className="feedback-message" aria-live="polite">Cargando criaturas...</p>}
        {!cargando && error && <div className="feedback-message feedback-error" role="alert">Ocurrió un error: {error}<button className="inline-retry" onClick={() => setFiltroTipo(filtroTipo)}>Reintentar</button></div>}
        {!cargando && !error && criaturasVisibles.length === 0 && <div className="empty-state"><span className="empty-icon" aria-hidden="true">✦</span><h3>{criaturas.length ? "No hay resultados" : "El catálogo está vacío"}</h3><p>{criaturas.length ? "Prueba con otra búsqueda o filtro." : "Registra la primera entidad para comenzar la investigación."}</p>{!criaturas.length && <Link className="button button-primary" to="/criaturas/nueva">Registrar criatura</Link>}</div>}
        {!cargando && !error && criaturasVisibles.length > 0 && <div className="table-scroll"><table><thead><tr><th>Entidad</th><th>Tipo</th><th>Nivel de peligro</th><th>Estado</th><th><span className="sr-only">Acciones</span></th></tr></thead><tbody>{criaturasVisibles.map((criatura) => <tr key={criatura._id}><td className="creature-name"><CreatureImage criatura={criatura} /><Link to={`/criaturas/${criatura._id}`}>{criatura.nombre}</Link></td><td><span className={`type-pill type-${criatura.tipo}`}>{criatura.tipo}</span></td><td><span className="danger-level" aria-label={`Nivel de peligro ${criatura.nivelPeligro} de 10`}><span className={`danger-track danger-${criatura.nivelPeligro}`}><span style={{ width: `${criatura.nivelPeligro * 10}%` }} /></span>{criatura.nivelPeligro}/10</span></td><td><span className={`status-pill status-${criatura.estado}`}>{criatura.estado.replace("_", " ")}</span></td><td className="row-actions"><Link to={`/criaturas/${criatura._id}`}>Ver</Link><Link to={`/criaturas/${criatura._id}/editar`}>Editar</Link></td></tr>)}</tbody></table></div>}
      </section>
    </AppLayout>
  );
}

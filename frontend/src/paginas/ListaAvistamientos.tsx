/**
 * paginas/ListaAvistamientos.tsx
 * -----------------------------------
 * Lista TODOS los avistamientos. Como el backend usa populate("criatura"),
 * cada avistamiento.criatura ya es el objeto completo.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eliminarAvistamiento, obtenerAvistamientos } from "../api/avistamientosApi";
import { Avistamiento } from "../tipos";

export function ListaAvistamientos() {
  const [avistamientos, setAvistamientos] = useState<Avistamiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function cargar() {
    setCargando(true);
    setError(null);
    obtenerAvistamientos()
      .then(setAvistamientos)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error al cargar los avistamientos."))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    cargar();
  }, []);

  async function manejarEliminar(id: string) {
    if (!window.confirm("¿Eliminar este avistamiento?")) return;
    try {
      await eliminarAvistamiento(id);
      cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el avistamiento.");
    }
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <Link className="brand" to="/"><span className="brand-mark" aria-hidden="true">P</span><span><strong>Departamento de Pawnee</strong><small>Fenómenos inexplicables</small></span></Link>
        <nav className="main-nav" aria-label="Navegación principal"><Link className="nav-link" to="/">Criaturas</Link><Link className="nav-link nav-link-active" to="/avistamientos">Avistamientos</Link></nav>
      </header>
      <section className="page-heading">
        <div><p className="eyebrow">Registro central · Área 02</p><h1>Avistamientos</h1><p className="page-description">Bitácora de reportes y encuentros registrados en Pawnee.</p></div>
        <Link className="button button-primary" to="/avistamientos/nuevo"><span aria-hidden="true">+</span> Registrar avistamiento</Link>
      </section>
      <section className="summary-grid">
        <div className="summary-card"><span className="summary-label">Reportes registrados</span><strong>{avistamientos.length}</strong></div>
        <div className="summary-card"><span className="summary-label">Entidades observadas</span><strong>{new Set(avistamientos.map((avistamiento) => avistamiento.criatura._id)).size}</strong></div>
        <div className="summary-card summary-card-alert"><span className="summary-label">Último reporte</span><strong>{avistamientos[0]?.fecha.slice(0, 10) ?? "—"}</strong></div>
      </section>
      <section className="content-card">
        <div className="table-toolbar"><div><h2>Bitácora de campo</h2><p>Todos los reportes documentados por el departamento.</p></div></div>
        {cargando && <p className="feedback-message">Cargando avistamientos...</p>}
        {!cargando && error && <p className="feedback-message feedback-error">Error: {error}</p>}
        {!cargando && !error && avistamientos.length === 0 && <p className="feedback-message">Todavía no hay avistamientos registrados.</p>}

      {!cargando && !error && avistamientos.length > 0 && (
        <div className="table-scroll"><table>
          <thead>
            <tr>
              <th>Fecha</th><th>Criatura</th>
              <th>Testigo</th>
              <th>Ubicación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {avistamientos.map((avistamiento) => (
              <tr key={avistamiento._id}>
                <td>{avistamiento.fecha.slice(0, 10)}</td>
                <td>
                  <Link to={`/criaturas/${avistamiento.criatura._id}`}>{avistamiento.criatura.nombre}</Link>
                </td>
                <td>{avistamiento.testigo}</td>
                <td>{avistamiento.ubicacion}</td>
                <td>
                  <button className="table-delete" type="button" onClick={() => manejarEliminar(avistamiento._id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      )}
      </section>
    </main>
  );
}

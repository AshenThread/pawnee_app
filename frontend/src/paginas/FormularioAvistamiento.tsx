/**
 * paginas/FormularioAvistamiento.tsx
 * ---------------------------------------
 * Crea un avistamiento nuevo. Si se llega desde el detalle de una
 * criatura (?criaturaId=...), ese campo se precarga.
 */

import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { crearAvistamiento } from "../api/avistamientosApi";
import { obtenerCriaturas } from "../api/criaturasApi";
import { AvistamientoFormulario, Criatura } from "../tipos";
import { AppLayout } from "../componentes/AppLayout";

const FORM_VACIO: AvistamientoFormulario = {
  criatura: "",
  testigo: "",
  ubicacion: "",
  descripcion: "",
  fecha: "",
};

export function FormularioAvistamiento() {
  const [parametros] = useSearchParams();
  const navigate = useNavigate();

  const [criaturas, setCriaturas] = useState<Criatura[]>([]);
  const [form, setForm] = useState<AvistamientoFormulario>({
    ...FORM_VACIO,
    criatura: parametros.get("criaturaId") ?? "",
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    obtenerCriaturas()
      .then((lista) => {
        setCriaturas(lista);
        if (!form.criatura && lista.length > 0) {
          setForm((actual) => ({ ...actual, criatura: lista[0]._id }));
        }
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "No se pudieron cargar las criaturas."))
      .finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);

    if (!form.criatura || !form.testigo.trim() || !form.ubicacion.trim() || !form.fecha) {
      setError("Criatura, testigo, ubicación y fecha son obligatorios.");
      return;
    }

    try {
      setGuardando(true);
      await crearAvistamiento(form);
      navigate("/avistamientos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el avistamiento.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <AppLayout area="avistamientos"><p className="feedback-message" aria-live="polite">Cargando formulario...</p></AppLayout>;

  return (
    <AppLayout area="avistamientos">
      <section className="page-heading page-heading-form"><div><p className="eyebrow">Registro central · Área 02</p><h1>Registrar avistamiento</h1><p className="page-description">Documenta un nuevo encuentro o reporte de campo.</p></div><Link className="text-link" to="/avistamientos">← Volver a la bitácora</Link></section>
      <section className="form-card">
      {error && <p className="feedback-message feedback-error form-error">Error: {error}</p>}
      <form className="creature-form" onSubmit={manejarEnvio}>
        <div className="form-section-heading"><span className="section-number">02</span><div><h2>Datos del avistamiento</h2><p>Registra cuándo, dónde y quién observó la entidad.</p></div></div>
        <div className="form-grid">
        <div className="form-field form-field-wide"><label htmlFor="criatura">Criatura observada <span aria-hidden="true">*</span></label>
          <select
            id="criatura"
            value={form.criatura}
            onChange={(e) => setForm({ ...form, criatura: e.target.value })}
          >
            {criaturas.map((criatura) => (
              <option key={criatura._id} value={criatura._id}>
                {criatura.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field"><label htmlFor="testigo">Testigo <span aria-hidden="true">*</span></label>
          <input
            id="testigo"
            type="text"
            required
            value={form.testigo}
            onChange={(e) => setForm({ ...form, testigo: e.target.value })}
          />
        </div>
        <div className="form-field"><label htmlFor="ubicacion">Ubicación <span aria-hidden="true">*</span></label>
          <input
            id="ubicacion"
            type="text"
            required
            value={form.ubicacion}
            onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
          />
        </div>
        <div className="form-field"><label htmlFor="fecha">Fecha <span aria-hidden="true">*</span></label>
          <input
            id="fecha"
            type="date"
            required
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          />
        </div>
        <div className="form-field form-field-wide"><label htmlFor="descripcion">Descripción <span>(opcional)</span></label><textarea
            id="descripcion"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
        </div></div>
        <div className="form-actions"><Link className="button button-secondary" to="/avistamientos">Cancelar</Link><button className="button button-primary" type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : "Registrar avistamiento"}
          </button></div>
      </form>
      </section>
    </AppLayout>
  );
}

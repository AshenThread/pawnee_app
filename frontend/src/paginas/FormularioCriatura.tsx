/**
 * paginas/FormularioCriatura.tsx
 * ----------------------------------
 * Un solo componente para CREAR y EDITAR, según la ruta.
 */

import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { crearCriatura, actualizarCriatura, obtenerCriaturaPorId } from "../api/criaturasApi";
import { CriaturaFormulario, TIPOS_CRIATURA, ESTADOS_INVESTIGACION } from "../tipos";

const FORM_VACIO: CriaturaFormulario = {
  nombre: "",
  tipo: "mitica",
  habilidades: [],
  nivelPeligro: 5,
  estado: "activa",
};

export function FormularioCriatura() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [form, setForm] = useState<CriaturaFormulario>(FORM_VACIO);
  const [habilidadesTexto, setHabilidadesTexto] = useState("");
  const [cargando, setCargando] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    obtenerCriaturaPorId(id)
      .then((criatura) => {
        setForm({
          nombre: criatura.nombre,
          tipo: criatura.tipo,
          habilidades: criatura.habilidades,
          nivelPeligro: criatura.nivelPeligro,
          estado: criatura.estado,
        });
        setHabilidadesTexto(criatura.habilidades.join(", "));
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "No se pudo cargar la criatura."))
      .finally(() => setCargando(false));
  }, [id]);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);

    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    const datosAEnviar: CriaturaFormulario = {
      ...form,
      habilidades: habilidadesTexto
        .split(",")
        .map((h) => h.trim())
        .filter((h) => h.length > 0),
    };

    try {
      setGuardando(true);
      if (esEdicion && id) {
        await actualizarCriatura(id, datosAEnviar);
      } else {
        await crearCriatura(datosAEnviar);
      }
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la criatura.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <p>Cargando datos de la criatura...</p>;

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

      <section className="page-heading page-heading-form">
        <div>
          <p className="eyebrow">Registro central · Área 01</p>
          <h1>{esEdicion ? "Editar criatura" : "Registrar criatura"}</h1>
          <p className="page-description">
            {esEdicion ? "Actualiza la ficha de esta entidad." : "Añade una nueva entidad al catálogo del departamento."}
          </p>
        </div>
        <Link className="text-link" to="/">← Volver al directorio</Link>
      </section>

      <section className="form-card">
        {error && <p className="feedback-message feedback-error form-error">Error: {error}</p>}

        <form className="creature-form" onSubmit={manejarEnvio}>
          <div className="form-section-heading">
            <span className="section-number">01</span>
            <div>
              <h2>Identificación</h2>
              <p>Información básica de la entidad.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field form-field-wide">
              <label htmlFor="nombre">Nombre de la criatura</label>
          <input
            id="nombre"
            type="text"
                placeholder="Ej. El Guardián del Lago"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
            </div>

            <div className="form-field">
              <label htmlFor="tipo">Tipo de entidad</label>
          <select
            id="tipo"
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value as CriaturaFormulario["tipo"] })}
          >
            {TIPOS_CRIATURA.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
            </div>

            <div className="form-field">
              <label htmlFor="nivelPeligro">Nivel de peligro <span>(1–10)</span></label>
              <input
                id="nivelPeligro"
                type="number"
                min={1}
                max={10}
                value={form.nivelPeligro}
                onChange={(e) => setForm({ ...form, nivelPeligro: Number(e.target.value) })}
              />
            </div>

            <div className="form-field form-field-wide">
              <label htmlFor="habilidades">Habilidades <span>(separadas por comas)</span></label>
          <input
            id="habilidades"
            type="text"
                placeholder="Ej. invisibilidad, telepatía"
            value={habilidadesTexto}
            onChange={(e) => setHabilidadesTexto(e.target.value)}
          />
            </div>

            <div className="form-field">
              <label htmlFor="estado">Estado de investigación</label>
          <select
            id="estado"
            value={form.estado}
            onChange={(e) => setForm({ ...form, estado: e.target.value as CriaturaFormulario["estado"] })}
          >
            {ESTADOS_INVESTIGACION.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
            </div>
          </div>

          <div className="form-actions">
            <Link className="button button-secondary" to="/">Cancelar</Link>
            <button className="button button-primary" type="submit" disabled={guardando}>
              {guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear criatura"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

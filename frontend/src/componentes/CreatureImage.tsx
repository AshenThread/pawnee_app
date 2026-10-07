import { Criatura } from "../tipos";

const IMAGEN_POR_NOMBRE: Record<string, string> = {
  "el dragon del estacionamiento": "/creatures/dragon.svg",
  "tornado azulado": "/creatures/tornado.svg",
  "el brillo del rio wamapo": "/creatures/river.svg",
  "la ardilla del martes": "/creatures/space-squirrel.svg",
  "el fantasma": "/creatures/ghost.svg",
};
const IMAGEN_POR_DEFECTO = "/creatures/entity.svg";

function normalizarNombre(nombre: string) {
  return nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export function CreatureImage({
  criatura,
  large = false,
}: {
  criatura: Pick<Criatura, "nombre" | "tipo" | "imagenUrl">;
  large?: boolean;
}) {
  const imagenPredeterminada = IMAGEN_POR_NOMBRE[normalizarNombre(criatura.nombre)] ?? IMAGEN_POR_DEFECTO;
  const imagen = criatura.imagenUrl || imagenPredeterminada;

  return (
    <div className={`creature-image creature-image-${criatura.tipo} ${large ? "creature-image-large" : ""}`}>
      <img
        src={imagen}
        alt={`Ilustración de ${criatura.nombre}`}
        onError={(event) => {
          if (event.currentTarget.src.endsWith(imagenPredeterminada)) return;
          event.currentTarget.src = imagenPredeterminada;
        }}
      />
    </div>
  );
}

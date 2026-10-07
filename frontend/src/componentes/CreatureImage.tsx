import { Criatura } from "../tipos";

const IMAGENES_SVG = [
  "/creatures/dragon.svg",
  "/creatures/tornado.svg",
  "/creatures/river.svg",
  "/creatures/space-squirrel.svg",
  "/creatures/fireflies.svg",
  "/creatures/ghost.svg",
];

export function CreatureImage({
  criatura,
  large = false,
}: {
  criatura: Pick<Criatura, "nombre" | "tipo" | "imagenUrl">;
  large?: boolean;
}) {
  const indice = [...criatura.nombre].reduce(
    (total, caracter) => total + caracter.charCodeAt(0),
    0
  ) % IMAGENES_SVG.length;
  const imagenPredeterminada = IMAGENES_SVG[indice];
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

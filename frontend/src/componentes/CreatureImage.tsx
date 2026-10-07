import { Criatura, TipoCriatura } from "../tipos";
import tornado from "../../img/tornado-azul-de-la-energía-2382624.webp";
import rio from "../../img/brillo rio wampu.jpeg";
import ardilla from "../../img/una-ardilla-con-un-traje-espacial-naranja-volando-por-el-aire-350465098.webp";
import dragon from "../../img/dragon-breath-magic-stockcake.jpg";
import bosque from "../../img/pngtree-the-soft-glow-of-fireflies-in-a-foggy-forest-glade-image_16724100.jpg";
import fantasma from "../../img/fantasma.jpg";

const IMAGENES = [dragon, tornado, rio, ardilla, bosque, fantasma];
const EMOJI: Record<TipoCriatura, string> = {
  mitica: "✦", elemental: "◈", mecanica: "⚙", espectral: "☾",
};

export function CreatureImage({ criatura, large = false }: { criatura: Pick<Criatura, "nombre" | "tipo" | "imagenUrl">; large?: boolean }) {
  const indice = [...criatura.nombre].reduce((total, caracter) => total + caracter.charCodeAt(0), 0) % IMAGENES.length;
  const imagen = criatura.imagenUrl || IMAGENES[indice];
  return (
    <div className={`creature-image creature-image-${criatura.tipo} ${large ? "creature-image-large" : ""}`}>
      {imagen ? (
        <img src={imagen} alt={`Ilustración de ${criatura.nombre}`} />
      ) : (
        <span aria-hidden="true">{EMOJI[criatura.tipo]}</span>
      )}
    </div>
  );
}

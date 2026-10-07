import { useState } from "react";
import { Criatura } from "../tipos";
import tornado from "../../img/tornado-azul-de-la-energía-2382624.webp";
import rio from "../../img/brillo rio wampu.jpeg";
import ardilla from "../../img/una-ardilla-con-un-traje-espacial-naranja-volando-por-el-aire-350465098.webp";
import dragon from "../../img/dragon-breath-magic-stockcake.jpg";
import bosque from "../../img/pngtree-the-soft-glow-of-fireflies-in-a-foggy-forest-glade-image_16724100.jpg";
import fantasma from "../../img/fantasma.jpg";
import { Icono } from "./Icono";

const IMAGENES = [dragon, tornado, rio, ardilla, bosque, fantasma];
export function CreatureImage({ criatura, large = false }: { criatura: Pick<Criatura, "nombre" | "tipo" | "imagenUrl">; large?: boolean }) {
  const indice = [...criatura.nombre].reduce((total, caracter) => total + caracter.charCodeAt(0), 0) % IMAGENES.length;
  const imagenPredeterminada = IMAGENES[indice];
  const imagen = criatura.imagenUrl || imagenPredeterminada;
  const [imagenDisponible, setImagenDisponible] = useState(true);
  return (
    <div className={`creature-image creature-image-${criatura.tipo} ${large ? "creature-image-large" : ""}`}>
      {imagenDisponible ? (
        <img src={imagen} alt={`Ilustración de ${criatura.nombre}`} onError={(event) => {
          if (event.currentTarget.src !== new URL(imagenPredeterminada, window.location.href).href) {
            event.currentTarget.src = imagenPredeterminada;
          } else {
            setImagenDisponible(false);
          }
        }} />
      ) : (
        <Icono name="entity" />
      )}
    </div>
  );
}

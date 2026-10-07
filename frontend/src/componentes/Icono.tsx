type IconName = "entity" | "sighting" | "warning" | "search";

export function Icono({ name, label }: { name: IconName; label?: string }) {
  return <img className={`icon icon-${name}`} src={`/icons/${name}.svg`} alt={label ?? ""} aria-hidden={label ? undefined : true} />;
}

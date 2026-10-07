import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
  area?: "criaturas" | "avistamientos";
}

export function AppLayout({ children, area }: AppLayoutProps) {
  const location = useLocation();
  const areaActiva = area ?? (location.pathname.startsWith("/avistamientos") ? "avistamientos" : "criaturas");

  return (
    <main className="page-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span><strong>Departamento de Pawnee</strong><small>Fenómenos inexplicables</small></span>
        </Link>
        <nav className="main-nav" aria-label="Navegación principal">
          <Link className={`nav-link ${areaActiva === "criaturas" ? "nav-link-active" : ""}`} to="/">Criaturas</Link>
          <Link className={`nav-link ${areaActiva === "avistamientos" ? "nav-link-active" : ""}`} to="/avistamientos">Avistamientos</Link>
        </nav>
      </header>
      {children}
    </main>
  );
}

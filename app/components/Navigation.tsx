import { Link, useLocation } from "react-router-dom";

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Styles werden jetzt über app.css geregelt (siehe nav und nav-link)
  return (
    <nav>
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between py-4 gap-2">
        <Link to="/" className="text-2xl font-extrabold tracking-tight" style={{ letterSpacing: '0.03em' }}>
          Miss Wortgewandt
        </Link>
        <ul className="flex flex-col sm:flex-row gap-2 sm:gap-6">
          <li>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/modules" 
              className={`nav-link ${isActive('/modules') ? 'active' : ''}`}
            >
              Planungs-Module
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

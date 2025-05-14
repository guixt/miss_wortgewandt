import { Link, useLocation } from "react-router";

export function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">IS-U Navigator</Link>
        <ul className="flex space-x-6">
          <li>
            <Link 
              to="/" 
              className={`hover:text-blue-200 ${isActive('/') ? 'font-bold' : ''}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/modules" 
              className={`hover:text-blue-200 ${isActive('/modules') ? 'font-bold' : ''}`}
            >
              Module
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

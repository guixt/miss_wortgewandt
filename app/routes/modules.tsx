import { Link } from "react-router-dom";
import modules from "../data/modules";

export default function Modules() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Hochzeitsplanung: Module</h1>
        <p className="text-gray-600 mb-8">Wähle einen Bereich aus, um eure Hochzeit individuell zu gestalten und perfekt zu planen:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((mod) => (
            <Link 
              key={mod.id}
              to={`/modules/${mod.id}`}
              className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{mod.title}</h3>
              <p className="text-gray-600">{mod.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

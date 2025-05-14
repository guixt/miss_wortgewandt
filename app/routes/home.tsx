import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "IS-U Navigator" },
    { name: "description", content: "Interaktives Lernen für SAP IS-U" },
  ];
}

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Willkommen beim IS-U Navigator 🚀</h1>
        
        <p className="mb-8 text-lg text-gray-600">
          Tauche ein in die Welt von SAP IS-U mit interaktiven Simulationen und praxisnahen Beispielen.
        </p>

        <Link 
          to="/modules" 
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Zu den Lernmodulen
        </Link>
      </div>
    </div>
  );
}

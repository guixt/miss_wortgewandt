import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Miss Wortgewandt Hochzeitsplaner" },
    { name: "description", content: "Individuelle Planung und kreative Ideen für eure Hochzeit – mit Miss Wortgewandt, IHK-zertifizierte Rednerin." },
  ];
}

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Willkommen beim Hochzeitsplaner von Miss Wortgewandt 💍</h1>
        
        <p className="mb-8 text-lg text-gray-600">
          Plant und gestaltet euren Hochzeitstag individuell, kreativ und entspannt – mit Inspiration und Tools von Miss Wortgewandt, eurer IHK-zertifizierten Rednerin.
        </p>

        <Link 
          to="/modules" 
          className="inline-block px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          Zu den Planungsmodulen
        </Link>
      </div>
    </div>
  );
}

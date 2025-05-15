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
    <div className="container mx-auto p-6">
      <div className="w-full flex flex-col gap-8 lg:flex-row lg:gap-8 items-stretch justify-center">
        {/* Linke Spalte: Bild und Begrüßung */}
        <div className="flex-1 flex flex-col gap-6 justify-between min-w-[340px] max-w-xl">
          <div className="shadow-card bg-[#fff] rounded-2xl p-6 flex flex-col items-center justify-center h-full">
            <img
              src="/hochzeit.png"
              alt="Hochzeitsfoto"
              className="rounded-2xl shadow-card object-cover w-full max-w-xs h-56 mb-6"
              style={{ background: '#f3e6e9' }}
            />
            <h1 className="text-4xl font-extrabold mb-2 text-[#7b517a] tracking-tight">Willkommen beim Hochzeitsplaner <br className="hidden md:inline"/>von Miss Wortgewandt <span role="img" aria-label="Ring">💍</span></h1>
            <p className="mb-0 text-lg text-gray-700">
              Schön, dass ihr hier seid!<br />
              Dieser digitale Planer unterstützt euch dabei, euren Hochzeitstag ganz nach euren Wünschen zu gestalten – mit Herz, Kreativität und Struktur.
            </p>
          </div>
        </div>

        {/* Rechte Spalte: Features & Persönliche Note */}
        <div className="flex-1 flex flex-col gap-6 min-w-[340px] max-w-xl">
          <div className="shadow-card bg-[#f8f5f7] border border-[#eadfe6] rounded-2xl p-6 flex-1 flex flex-col justify-between">
            <h2 className="text-xl font-semibold mb-2 text-[#a26b95] flex items-center gap-2">
              <span className="inline-block w-6 h-6 bg-[#eadfe6] rounded-full flex items-center justify-center mr-1">✨</span>
              Was euch erwartet
            </h2>
            <ul className="list-disc ml-7 text-base text-[#7b517a] space-y-1">
              <li><span className="font-semibold">Alle Module:</span> Rituale, Musik, Ablauf, Gäste, Budget ...</li>
              <li><span className="font-semibold">Individuelle Gestaltung</span> für euren Tag</li>
              <li><span className="font-semibold">Intuitive Bedienung</span> & modernes Design</li>
              <li><span className="font-semibold">Checklisten</span>, Aufgaben, Inspirationen, praktische Tools</li>
              <li><span className="font-semibold">Planung speichern & teilen</span></li>
            </ul>
          </div>
          <div className="shadow-card bg-[#fff] rounded-2xl p-6 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-block w-6 h-6 bg-[#f3e6e9] rounded-full flex items-center justify-center text-[#b48ca7]">❤️</span>
              <span className="text-lg font-semibold text-[#a26b95]">Mit Persönlichkeit & Erfahrung</span>
            </div>
            <p className="mb-0 text-base text-gray-600">
              Miss Wortgewandt begleitet euch als erfahrene und IHK-zertifizierte Rednerin mit Inspiration, Erfahrung und Liebe zum Detail – für eine Hochzeit, die zu euch passt.
            </p>
          </div>
          <div className="flex justify-center mt-4">
            <Link
              to="/modules"
              className="btn px-8 py-3 text-lg font-semibold shadow-card"
              style={{ background: 'var(--primary)', color: '#fff', minWidth: 240 }}
            >
              Zu den Planungsmodulen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}





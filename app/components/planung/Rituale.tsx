import { useState } from "react";

const RITUALE = [
  {
    id: "sand",
    name: "Sandzeremonie",
    beschreibung:
      "Das Brautpaar schüttet verschiedenfarbigen Sand in ein gemeinsames Gefäß – als Symbol für die Vereinigung.",
    ablauf:
      "Jede Person erhält ein Glas mit Sand. Abwechselnd wird der Sand in ein gemeinsames Gefäß geschüttet. Die Farben vermischen sich und können nicht mehr getrennt werden – wie eure Lebenswege.",
    inspiration: "Ihr könnt auch Kinder oder Eltern einbinden, verschiedene Farben wählen oder das Gefäß gravieren lassen.",
  },
  {
    id: "ringe",
    name: "Ringe wandern",
    beschreibung:
      "Die Eheringe wandern durch die Reihen der Gäste, bevor sie dem Paar übergeben werden.",
    ablauf:
      "Die Ringe werden an einem Band oder in einem Beutel durch die Gästereihen gegeben. Jede:r kann ihnen einen Wunsch mit auf den Weg geben.",
    inspiration: "Das Band kann in eurer Lieblingsfarbe sein, oder es werden kleine Kärtchen für Wünsche verteilt.",
  },
  {
    id: "baum",
    name: "Baum pflanzen",
    beschreibung:
      "Gemeinsam pflanzt ihr einen Baum als Symbol für eure wachsende Liebe.",
    ablauf:
      "Ihr setzt gemeinsam einen jungen Baum in die Erde und gießt ihn. Der Baum wächst mit eurer Ehe.",
    inspiration: "Ihr könnt den Baum später im eigenen Garten einpflanzen oder Gäste bitten, Wünsche an den Baum zu hängen.",
  },
  {
    id: "handfasting",
    name: "Handfasting (Handbinden)",
    beschreibung:
      "Eure Hände werden mit einem Band verbunden – ein Symbol für eure Verbindung.",
    ablauf:
      "Die Hände des Paares werden mit Bändern umwickelt. Oft sprechen die Beteiligten dazu persönliche Worte.",
    inspiration: "Die Bänder können individuell gestaltet oder von wichtigen Menschen ausgewählt werden.",
  },
];

export default function Rituale() {
  const [selected, setSelected] = useState<string | null>(null);
  const [konfig, setKonfig] = useState({
    beteiligte: "",
    besondereWuensche: "",
    materialien: "",
    persoenlicheWorte: "",
  });

  const ritual = RITUALE.find((r) => r.id === selected);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Rituale zur Auswahl</h2>
      <p className="mb-4 text-gray-600">
        Wählt hier euer Wunschritual aus und gestaltet es nach euren Vorstellungen:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {RITUALE.map((r) => (
          <button
            key={r.id}
            className={`p-4 rounded border shadow-sm text-left transition-all ${selected === r.id ? "border-pink-500 bg-pink-50" : "hover:border-pink-400"}`}
            onClick={() => setSelected(r.id)}
          >
            <div className="font-semibold text-lg mb-1">{r.name}</div>
            <div className="text-gray-700 text-sm">{r.beschreibung}</div>
          </button>
        ))}
      </div>
      {ritual && (
        <div className="bg-white rounded shadow-md p-6 mt-2">
          <h3 className="text-xl font-bold mb-2">{ritual.name}</h3>
          <p className="mb-2 text-gray-700"><b>Bedeutung:</b> {ritual.beschreibung}</p>
          <p className="mb-2"><b>Ablauf:</b> {ritual.ablauf}</p>
          <p className="mb-4 text-pink-700"><b>Inspiration:</b> {ritual.inspiration}</p>

          <h4 className="font-semibold mt-4 mb-2">Eure individuelle Gestaltung</h4>
          <form className="grid gap-3">
            <label className="block">
              <span className="font-medium">Beteiligte Personen</span>
              <input
                type="text"
                className="mt-1 block w-full border rounded p-2"
                placeholder="z.B. Eltern, Kinder, Trauzeugen..."
                value={konfig.beteiligte}
                onChange={e => setKonfig({ ...konfig, beteiligte: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="font-medium">Materialien / Farben / Symbole</span>
              <input
                type="text"
                className="mt-1 block w-full border rounded p-2"
                placeholder="z.B. Sandfarben, Band, Baumart..."
                value={konfig.materialien}
                onChange={e => setKonfig({ ...konfig, materialien: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="font-medium">Persönliche Worte / Wünsche</span>
              <textarea
                className="mt-1 block w-full border rounded p-2"
                rows={2}
                placeholder="Eigene Worte, Wünsche, Versprechen..."
                value={konfig.persoenlicheWorte}
                onChange={e => setKonfig({ ...konfig, persoenlicheWorte: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="font-medium">Besondere Wünsche</span>
              <input
                type="text"
                className="mt-1 block w-full border rounded p-2"
                placeholder="z.B. Musik, Überraschungen, ..."
                value={konfig.besondereWuensche}
                onChange={e => setKonfig({ ...konfig, besondereWuensche: e.target.value })}
              />
            </label>
          </form>
        </div>
      )}
    </div>
  );
}


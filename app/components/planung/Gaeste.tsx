import { useState } from "react";

interface Gast {
  name: string;
  seite: "Braut" | "Bräutigam" | "Beide";
  besonderheiten: string;
  tisch: string;
}

export default function Gaeste() {
  const [gaeste, setGaeste] = useState<Gast[]>([]);
  const [tische, setTische] = useState<string[]>(["Tisch 1", "Tisch 2"]);
  const [neuGast, setNeuGast] = useState<Gast>({ name: "", seite: "Beide", besonderheiten: "", tisch: tische[0] });
  const [neuTisch, setNeuTisch] = useState("");

  const addGast = () => {
    if (neuGast.name) {
      setGaeste([...gaeste, neuGast]);
      setNeuGast({ name: "", seite: "Beide", besonderheiten: "", tisch: tische[0] || "" });
    }
  };
  const removeGast = (idx: number) => setGaeste(gaeste.filter((_, i) => i !== idx));

  const addTisch = () => {
    if (neuTisch && !tische.includes(neuTisch)) {
      setTische([...tische, neuTisch]);
      setNeuTisch("");
    }
  };
  const removeTisch = (idx: number) => {
    const tischName = tische[idx];
    setTische(tische.filter((_, i) => i !== idx));
    setGaeste(gaeste.map(g => g.tisch === tischName ? { ...g, tisch: "" } : g));
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Gästeliste & Sitzordnung</h2>
      <p className="mb-4 text-gray-600">
        Verwalte alle Gäste, ihre Besonderheiten und ordne sie den Tischen zu. Lege weitere Tische an und plane die Sitzordnung individuell.
      </p>

      <div className="shadow-card mb-8">
        <h3 className="font-semibold text-lg mb-2">Neuen Gast hinzufügen</h3>
        <div className="grid md:grid-cols-4 gap-3 mb-2">
          <input
            type="text"
            placeholder="Name"
            value={neuGast.name}
            onChange={e => setNeuGast({ ...neuGast, name: e.target.value })}
          />
          <select
            value={neuGast.seite}
            onChange={e => setNeuGast({ ...neuGast, seite: e.target.value as Gast["seite"] })}
          >
            <option value="Braut">Braut-Seite</option>
            <option value="Bräutigam">Bräutigam-Seite</option>
            <option value="Beide">Beide</option>
          </select>
          <input
            type="text"
            placeholder="Besonderheiten (z.B. Allergien, Kinder...)"
            value={neuGast.besonderheiten}
            onChange={e => setNeuGast({ ...neuGast, besonderheiten: e.target.value })}
          />
          <select
            value={neuGast.tisch}
            onChange={e => setNeuGast({ ...neuGast, tisch: e.target.value })}
          >
            {tische.map(t => <option key={t} value={t}>{t}</option>)}
            <option value="">(Kein Tisch)</option>
          </select>
        </div>
        <button className="btn mt-2" type="button" onClick={addGast}>
          Hinzufügen
        </button>
      </div>

      <div className="shadow-card mb-8">
        <h3 className="font-semibold text-lg mb-2">Tische verwalten</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Neuer Tisch (z.B. Familie, Freunde...)"
            value={neuTisch}
            onChange={e => setNeuTisch(e.target.value)}
          />
          <button className="btn" type="button" onClick={addTisch}>Tisch hinzufügen</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tische.map((t, idx) => (
            <span key={t} className="inline-flex items-center bg-[#f3e6e9] px-3 py-1 rounded-full text-[#7b517a] font-medium">
              {t}
              <button type="button" className="ml-2 text-[#b48ca7] hover:text-[#a26b95]" title="Tisch entfernen" onClick={() => removeTisch(idx)}>
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full mb-4">
          <thead>
            <tr>
              <th>Name</th>
              <th>Seite</th>
              <th>Besonderheiten</th>
              <th>Tisch</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {gaeste.map((g, idx) => (
              <tr key={idx}>
                <td>{g.name}</td>
                <td>{g.seite}</td>
                <td>{g.besonderheiten}</td>
                <td>{g.tisch}</td>
                <td>
                  <button type="button" title="Gast entfernen" onClick={() => removeGast(idx)} style={{color:'#b48ca7'}}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


import { useState } from "react";

interface BudgetPosten {
  kategorie: string;
  geplant: number;
  kosten: number;
  bezahlt: boolean;
  notiz: string;
}

export default function Budget() {
  const [posten, setPosten] = useState<BudgetPosten[]>([
    { kategorie: "Location", geplant: 3000, kosten: 0, bezahlt: false, notiz: "inkl. Essen/Trinken" },
    { kategorie: "Musik/DJ", geplant: 800, kosten: 0, bezahlt: false, notiz: "" },
    { kategorie: "Fotograf", geplant: 1200, kosten: 0, bezahlt: false, notiz: "" },
    { kategorie: "Kleidung", geplant: 1500, kosten: 0, bezahlt: false, notiz: "Braut & Bräutigam" },
    { kategorie: "Deko/Blumen", geplant: 600, kosten: 0, bezahlt: false, notiz: "" },
  ]);
  const [neu, setNeu] = useState<BudgetPosten>({ kategorie: "", geplant: 0, kosten: 0, bezahlt: false, notiz: "" });

  const addPosten = () => {
    if (neu.kategorie) {
      setPosten([...posten, neu]);
      setNeu({ kategorie: "", geplant: 0, kosten: 0, bezahlt: false, notiz: "" });
    }
  };
  const removePosten = (idx: number) => setPosten(posten.filter((_, i) => i !== idx));
  const updatePosten = (idx: number, field: keyof BudgetPosten, value: any) => {
    setPosten(posten.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const summeGeplant = posten.reduce((sum, p) => sum + (isNaN(p.geplant) ? 0 : p.geplant), 0);
  const summeKosten = posten.reduce((sum, p) => sum + (isNaN(p.kosten) ? 0 : p.kosten), 0);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Budgetplanung</h2>
      <p className="mb-4 text-gray-600">
        Behaltet euer geplantes Budget und die tatsächlichen Kosten im Blick. Fügt Posten hinzu, aktualisiert Beträge und markiert bezahlte Rechnungen.
      </p>

      <div className="shadow-card mb-8">
        <h3 className="font-semibold text-lg mb-2">Neuen Posten hinzufügen</h3>
        <div className="grid md:grid-cols-5 gap-3 mb-2">
          <input
            type="text"
            placeholder="Kategorie (z.B. Torte)"
            value={neu.kategorie}
            onChange={e => setNeu({ ...neu, kategorie: e.target.value })}
          />
          <input
            type="number"
            placeholder="Geplant (€)"
            value={neu.geplant || ""}
            min={0}
            onChange={e => setNeu({ ...neu, geplant: Number(e.target.value) })}
          />
          <input
            type="number"
            placeholder="Kosten (€)"
            value={neu.kosten || ""}
            min={0}
            onChange={e => setNeu({ ...neu, kosten: Number(e.target.value) })}
          />
          <input
            type="text"
            placeholder="Notiz"
            value={neu.notiz}
            onChange={e => setNeu({ ...neu, notiz: e.target.value })}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={neu.bezahlt}
              onChange={e => setNeu({ ...neu, bezahlt: e.target.checked })}
            />
            Bezahlt
          </label>
        </div>
        <button className="btn mt-2" type="button" onClick={addPosten}>
          Hinzufügen
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full mb-4">
          <thead>
            <tr>
              <th>Kategorie</th>
              <th>Geplant (€)</th>
              <th>Kosten (€)</th>
              <th>Bezahlt</th>
              <th>Notiz</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {posten.map((p, idx) => (
              <tr key={idx} className={p.bezahlt ? "opacity-60" : ""}>
                <td>{p.kategorie}</td>
                <td>
                  <input
                    type="number"
                    className="w-20"
                    value={p.geplant}
                    min={0}
                    onChange={e => updatePosten(idx, "geplant", Number(e.target.value))}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="w-20"
                    value={p.kosten}
                    min={0}
                    onChange={e => updatePosten(idx, "kosten", Number(e.target.value))}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={p.bezahlt}
                    onChange={e => updatePosten(idx, "bezahlt", e.target.checked)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={p.notiz}
                    onChange={e => updatePosten(idx, "notiz", e.target.value)}
                  />
                </td>
                <td>
                  <button type="button" title="Posten entfernen" onClick={() => removePosten(idx)} style={{color:'#b48ca7'}}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold">
              <td>Summe</td>
              <td>{summeGeplant.toLocaleString("de-DE")} €</td>
              <td>{summeKosten.toLocaleString("de-DE")} €</td>
              <td colSpan={3}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

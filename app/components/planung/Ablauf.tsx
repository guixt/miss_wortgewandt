import { useState } from "react";

interface Programmpunkt {
  zeit: string;
  titel: string;
  beschreibung: string;
  beteiligte: string;
}

export default function Ablauf() {
  const [punkte, setPunkte] = useState<Programmpunkt[]>([
    { zeit: "14:00", titel: "Trauung", beschreibung: "Freie Trauung im Garten", beteiligte: "Rednerin, Brautpaar, Gäste" },
    { zeit: "15:00", titel: "Sektempfang", beschreibung: "Anstoßen und Häppchen", beteiligte: "Alle" },
    { zeit: "17:00", titel: "Dinner", beschreibung: "Festliches Essen", beteiligte: "Alle" },
    { zeit: "19:00", titel: "Reden & Beiträge", beschreibung: "Reden, Musik, Überraschungen", beteiligte: "Freunde, Familie" },
    { zeit: "21:00", titel: "Eröffnungstanz & Party", beschreibung: "Tanzfläche eröffnen, DJ startet", beteiligte: "Brautpaar, DJ, Gäste" },
  ]);
  const [neu, setNeu] = useState<Programmpunkt>({ zeit: "", titel: "", beschreibung: "", beteiligte: "" });

  const addPunkt = () => {
    if (neu.zeit && neu.titel) {
      setPunkte([...punkte, neu]);
      setNeu({ zeit: "", titel: "", beschreibung: "", beteiligte: "" });
    }
  };

  const removePunkt = (idx: number) => {
    setPunkte(punkte.filter((_, i) => i !== idx));
  };

  const movePunkt = (idx: number, dir: -1 | 1) => {
    const newArr = [...punkte];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= punkte.length) return;
    [newArr[idx], newArr[newIdx]] = [newArr[newIdx], newArr[idx]];
    setPunkte(newArr);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Ablaufplanung</h2>
      <p className="mb-4 text-gray-600">
        Plant und strukturiert euren Hochzeitstag: Legt Programmpunkte, Uhrzeiten und Beteiligte fest und gestaltet euren individuellen Ablauf.
      </p>

      <div className="shadow-card mb-8">
        <h3 className="font-semibold text-lg mb-2">Neuen Programmpunkt hinzufügen</h3>
        <div className="grid md:grid-cols-4 gap-3 mb-2">
          <input
            type="time"
            value={neu.zeit}
            onChange={e => setNeu({ ...neu, zeit: e.target.value })}
            placeholder="Zeit"
          />
          <input
            type="text"
            value={neu.titel}
            onChange={e => setNeu({ ...neu, titel: e.target.value })}
            placeholder="Titel (z.B. Torte)"
          />
          <input
            type="text"
            value={neu.beschreibung}
            onChange={e => setNeu({ ...neu, beschreibung: e.target.value })}
            placeholder="Beschreibung"
          />
          <input
            type="text"
            value={neu.beteiligte}
            onChange={e => setNeu({ ...neu, beteiligte: e.target.value })}
            placeholder="Beteiligte"
          />
        </div>
        <button className="btn mt-2" type="button" onClick={addPunkt}>
          Hinzufügen
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full mb-4">
          <thead>
            <tr>
              <th>Zeit</th>
              <th>Titel</th>
              <th>Beschreibung</th>
              <th>Beteiligte</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {punkte.map((p, idx) => (
              <tr key={idx}>
                <td>{p.zeit}</td>
                <td>{p.titel}</td>
                <td>{p.beschreibung}</td>
                <td>{p.beteiligte}</td>
                <td className="flex gap-1">
                  <button type="button" title="Nach oben" onClick={() => movePunkt(idx, -1)} disabled={idx === 0} style={{opacity: idx===0?0.3:1}}>↑</button>
                  <button type="button" title="Nach unten" onClick={() => movePunkt(idx, 1)} disabled={idx === punkte.length-1} style={{opacity: idx===punkte.length-1?0.3:1}}>↓</button>
                  <button type="button" title="Löschen" onClick={() => removePunkt(idx)} style={{color:'#b48ca7'}}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


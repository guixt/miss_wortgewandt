import { useState } from "react";

interface Task {
  text: string;
  erledigt: boolean;
  kategorie: string;
  faellig: string;
  notiz: string;
}

const defaultKategorien = [
  "Vor der Hochzeit",
  "Zeremonie",
  "Feier",
  "Nach der Hochzeit",
  "Sonstiges"
];

export default function Checklisten() {
  const [tasks, setTasks] = useState<Task[]>([
    { text: "Location buchen", erledigt: false, kategorie: "Vor der Hochzeit", faellig: "", notiz: "" },
    { text: "DJ/Liveband anfragen", erledigt: false, kategorie: "Feier", faellig: "", notiz: "" },
    { text: "Ringe besorgen", erledigt: false, kategorie: "Vor der Hochzeit", faellig: "", notiz: "" },
    { text: "Brautkleid aussuchen", erledigt: false, kategorie: "Vor der Hochzeit", faellig: "", notiz: "" },
    { text: "Danksagungen vorbereiten", erledigt: false, kategorie: "Nach der Hochzeit", faellig: "", notiz: "" },
  ]);
  const [neu, setNeu] = useState<Task>({ text: "", erledigt: false, kategorie: defaultKategorien[0], faellig: "", notiz: "" });
  const [kategorien, setKategorien] = useState<string[]>(defaultKategorien);
  const [neueKategorie, setNeueKategorie] = useState("");

  const addTask = () => {
    if (neu.text) {
      setTasks([...tasks, neu]);
      setNeu({ text: "", erledigt: false, kategorie: kategorien[0], faellig: "", notiz: "" });
    }
  };
  const removeTask = (idx: number) => setTasks(tasks.filter((_, i) => i !== idx));
  const toggleTask = (idx: number) => setTasks(tasks.map((t, i) => i === idx ? { ...t, erledigt: !t.erledigt } : t));

  const addKategorie = () => {
    if (neueKategorie && !kategorien.includes(neueKategorie)) {
      setKategorien([...kategorien, neueKategorie]);
      setNeueKategorie("");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Checklisten & Aufgaben</h2>
      <p className="mb-4 text-gray-600">
        Organisiert eure Aufgaben rund um die Hochzeit: Fügt Aufgaben hinzu, markiert sie als erledigt, sortiert nach Kategorie und verwaltet Fälligkeiten und Notizen.
      </p>

      <div className="shadow-card mb-8">
        <h3 className="font-semibold text-lg mb-2">Neue Aufgabe hinzufügen</h3>
        <div className="grid md:grid-cols-4 gap-3 mb-2">
          <input
            type="text"
            placeholder="Aufgabe"
            value={neu.text}
            onChange={e => setNeu({ ...neu, text: e.target.value })}
          />
          <select
            value={neu.kategorie}
            onChange={e => setNeu({ ...neu, kategorie: e.target.value })}
          >
            {kategorien.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <input
            type="date"
            placeholder="Fällig am"
            value={neu.faellig}
            onChange={e => setNeu({ ...neu, faellig: e.target.value })}
          />
          <input
            type="text"
            placeholder="Notiz"
            value={neu.notiz}
            onChange={e => setNeu({ ...neu, notiz: e.target.value })}
          />
        </div>
        <button className="btn mt-2" type="button" onClick={addTask}>
          Hinzufügen
        </button>
      </div>

      <div className="shadow-card mb-8">
        <h3 className="font-semibold text-lg mb-2">Kategorien verwalten</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Neue Kategorie"
            value={neueKategorie}
            onChange={e => setNeueKategorie(e.target.value)}
          />
          <button className="btn" type="button" onClick={addKategorie}>Kategorie hinzufügen</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {kategorien.map(k => (
            <span key={k} className="inline-flex items-center bg-[#f3e6e9] px-3 py-1 rounded-full text-[#7b517a] font-medium">
              {k}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full mb-4">
          <thead>
            <tr>
              <th></th>
              <th>Aufgabe</th>
              <th>Kategorie</th>
              <th>Fällig am</th>
              <th>Notiz</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, idx) => (
              <tr key={idx} className={t.erledigt ? "opacity-60" : ""}>
                <td>
                  <input
                    type="checkbox"
                    checked={t.erledigt}
                    onChange={() => toggleTask(idx)}
                  />
                </td>
                <td>{t.text}</td>
                <td>{t.kategorie}</td>
                <td>{t.faellig}</td>
                <td>{t.notiz}</td>
                <td>
                  <button type="button" title="Aufgabe entfernen" onClick={() => removeTask(idx)} style={{color:'#b48ca7'}}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

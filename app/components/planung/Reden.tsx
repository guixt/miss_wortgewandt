import { useState } from "react";
import { PlusIcon, TrashIcon, PencilIcon, LightBulbIcon } from "@heroicons/react/24/outline";

interface Beitrag {
  id: number;
  typ: string;
  name: string;
  rolle: string;
  zeitpunkt: string;
  notiz: string;
  erledigt: boolean;
}

const vorschlaege = [
  { typ: "Begrüßung", rolle: "Brautpaar, Rednerin" },
  { typ: "Traurede", rolle: "Freie Rednerin" },
  { typ: "Trauzeugenrede", rolle: "Trauzeugen" },
  { typ: "Elternbeitrag", rolle: "Eltern" },
  { typ: "Freunde-Beitrag", rolle: "Freunde" },
  { typ: "Musikbeitrag", rolle: "Musiker, Gäste" },
  { typ: "Überraschung", rolle: "Gäste, Freunde" },
];

export default function Reden() {
  const [beitraege, setBeitraege] = useState<Beitrag[]>([]);
  const [neu, setNeu] = useState<Omit<Beitrag, "id">>({
    typ: "",
    name: "",
    rolle: "",
    zeitpunkt: "",
    notiz: "",
    erledigt: false,
  });
  const [bearbeitenId, setBearbeitenId] = useState<number | null>(null);

  const addBeitrag = () => {
    if (neu.typ && neu.name) {
      setBeitraege([
        ...beitraege,
        { ...neu, id: Date.now() },
      ]);
      setNeu({ typ: "", name: "", rolle: "", zeitpunkt: "", notiz: "", erledigt: false });
    }
  };

  const removeBeitrag = (id: number) => {
    setBeitraege(beitraege.filter(b => b.id !== id));
  };

  const startBearbeiten = (b: Beitrag) => {
    setNeu({ ...b });
    setBearbeitenId(b.id);
  };

  const saveBearbeiten = () => {
    if (bearbeitenId !== null) {
      setBeitraege(beitraege.map(b => b.id === bearbeitenId ? { ...b, ...neu } : b));
      setNeu({ typ: "", name: "", rolle: "", zeitpunkt: "", notiz: "", erledigt: false });
      setBearbeitenId(null);
    }
  };

  const toggleErledigt = (id: number) => {
    setBeitraege(beitraege.map(b => b.id === id ? { ...b, erledigt: !b.erledigt } : b));
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl font-bold text-[#7b517a]">Reden & Beiträge</h2>
        <span className="ml-2 px-2 py-1 rounded-full bg-[#eadfe6] text-xs text-[#a26b95] font-semibold">Herzstück der Feier</span>
      </div>
      <p className="mb-4 text-gray-700">
        Plant und koordiniert alle Reden, musikalischen Beiträge und Überraschungen für eure Feier. <br/>
        <span className="inline-flex items-center gap-1 text-[#a26b95] font-medium"><LightBulbIcon className="w-5 h-5 inline" /> Tipp:</span> Inspiration findet ihr unten in den Vorschlägen!
      </p>

      {/* Beitragsliste */}
      <div className="mb-8">
        <table className="w-full text-left bg-[#fff] rounded-xl shadow-card overflow-hidden">
          <thead className="bg-[#f8f5f7]">
            <tr>
              <th className="p-2">Art</th>
              <th className="p-2">Name</th>
              <th className="p-2">Rolle</th>
              <th className="p-2">Zeitpunkt</th>
              <th className="p-2">Notiz</th>
              <th className="p-2">Erledigt</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {beitraege.length === 0 && (
              <tr><td colSpan={7} className="text-center text-gray-400 p-4">Noch keine Beiträge geplant.</td></tr>
            )}
            {beitraege.map(b => (
              <tr key={b.id} className={b.erledigt ? "opacity-60" : ""}>
                <td className="p-2">{b.typ}</td>
                <td className="p-2">{b.name}</td>
                <td className="p-2">{b.rolle}</td>
                <td className="p-2">{b.zeitpunkt}</td>
                <td className="p-2">{b.notiz}</td>
                <td className="p-2">
                  <input type="checkbox" checked={b.erledigt} onChange={() => toggleErledigt(b.id)} />
                </td>
                <td className="p-2 flex gap-2">
                  <button title="Bearbeiten" className="text-[#a26b95]" onClick={() => startBearbeiten(b)}><PencilIcon className="w-5 h-5" /></button>
                  <button title="Löschen" className="text-pink-500" onClick={() => removeBeitrag(b.id)}><TrashIcon className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Beitrag hinzufügen/bearbeiten */}
      <div className="mb-10 p-4 bg-[#f8f5f7] rounded-xl shadow-card">
        <div className="font-semibold mb-2 text-[#7b517a]">{bearbeitenId ? "Beitrag bearbeiten" : "Neuen Beitrag hinzufügen"}</div>
        <div className="flex flex-wrap gap-2 mb-2">
          <input className="border rounded px-2 py-1 w-32" placeholder="Art" value={neu.typ} onChange={e => setNeu({ ...neu, typ: e.target.value })} list="typen" />
          <datalist id="typen">
            {vorschlaege.map(v => <option key={v.typ} value={v.typ} />)}
          </datalist>
          <input className="border rounded px-2 py-1 w-32" placeholder="Name" value={neu.name} onChange={e => setNeu({ ...neu, name: e.target.value })} />
          <input className="border rounded px-2 py-1 w-32" placeholder="Rolle" value={neu.rolle} onChange={e => setNeu({ ...neu, rolle: e.target.value })} list="rollen" />
          <datalist id="rollen">
            {vorschlaege.map(v => <option key={v.rolle} value={v.rolle} />)}
          </datalist>
          <input className="border rounded px-2 py-1 w-32" placeholder="Zeitpunkt" value={neu.zeitpunkt} onChange={e => setNeu({ ...neu, zeitpunkt: e.target.value })} />
          <input className="border rounded px-2 py-1 w-40" placeholder="Notiz" value={neu.notiz} onChange={e => setNeu({ ...neu, notiz: e.target.value })} />
        </div>
        <div className="flex gap-2">
          {bearbeitenId ? (
            <button className="bg-[#a26b95] text-white rounded px-3 py-1" onClick={saveBearbeiten}><PencilIcon className="w-5 h-5 inline" /> Speichern</button>
          ) : (
            <button className="bg-pink-600 text-white rounded px-3 py-1" onClick={addBeitrag}><PlusIcon className="w-5 h-5 inline" /> Hinzufügen</button>
          )}
        </div>
      </div>

      {/* Inspirationsbereich */}
      <div className="mb-8 p-4 bg-[#fff] rounded-xl shadow-card">
        <div className="flex items-center gap-2 mb-2 text-[#a26b95] font-semibold"><LightBulbIcon className="w-5 h-5" /> Inspiration & Ideen</div>
        <ul className="list-disc ml-6 text-gray-700 space-y-1">
          {vorschlaege.map(v => (
            <li key={v.typ}><span className="font-medium">{v.typ}</span> <span className="text-xs text-gray-400">({v.rolle})</span></li>
          ))}
        </ul>
      </div>

      {/* RedeKunstWerk Hinweis */}
      <div className="p-4 bg-[#f8f5f7] rounded-xl shadow-card flex items-center gap-3 mb-10">
        <img src="https://redekunstwerk.de/wp-content/uploads/2021/01/cropped-Logo-Siegel-links-png-250x57.png.webp" alt="RedeKunstWerk Logo" className="h-10" />
        <span className="text-[#7b517a] text-sm font-medium">Mitglied bei <a href="https://www.redekunstwerk.de/" className="underline hover:text-pink-600" target="_blank" rel="noopener noreferrer">RedeKunstWerk</a> – Netzwerk für professionelle freie Redner:innen</span>
      </div>

      {/* Rede-Baukasten */}
      <div className="mb-10 p-4 bg-[#fff] rounded-xl shadow-card">
        <div className="flex items-center gap-2 mb-2 text-[#a26b95] font-semibold">
          <LightBulbIcon className="w-5 h-5" /> Rede-Baukasten: Deine persönliche Rede zusammenstellen
        </div>
        <Baukasten />
      </div>
    </div>
  );
}

// --- Rede-Baukasten-Komponente ---
import { ArrowUpIcon, ArrowDownIcon, ClipboardIcon, PlusCircleIcon, TrashIcon as TrashIconMini } from "@heroicons/react/24/outline";

const BAUSTEIN_VORSCHLAEGE = [
  {
    titel: "Begrüßung",
    text: "Liebe Gäste, liebe Familie, liebe Freunde, wir freuen uns sehr, dass ihr heute hier seid, um diesen besonderen Tag mit uns zu feiern.",
  },
  {
    titel: "Persönliche Worte",
    text: "Jede Liebesgeschichte ist einzigartig – und unsere begann ...",
  },
  {
    titel: "Dank",
    text: "Wir möchten uns von Herzen bei allen bedanken, die uns auf unserem Weg begleitet und unterstützt haben ...",
  },
  {
    titel: "Besonderer Moment",
    text: "Ein Moment, den wir nie vergessen werden, war ...",
  },
  {
    titel: "Ausblick",
    text: "Wir freuen uns auf alles, was vor uns liegt – gemeinsam mit euch an unserer Seite ...",
  },
  {
    titel: "Abschluss",
    text: "Lasst uns diesen Tag unvergesslich machen! Auf uns und auf die Liebe!",
  },
];

function Baukasten() {
  const [bausteine, setBausteine] = useState([
    { titel: "Begrüßung", text: "Liebe Gäste, liebe Familie, liebe Freunde, wir freuen uns sehr, dass ihr heute hier seid, um diesen besonderen Tag mit uns zu feiern." },
    { titel: "Persönliche Worte", text: "Jede Liebesgeschichte ist einzigartig – und unsere begann ..." },
  ]);
  const [neu, setNeu] = useState({ titel: "", text: "" });
  const [copySuccess, setCopySuccess] = useState(false);

  const addBaustein = (vorschlag?: { titel: string; text: string }) => {
    if (vorschlag) {
      setBausteine([...bausteine, { ...vorschlag }]);
    } else if (neu.titel && neu.text) {
      setBausteine([...bausteine, { ...neu }]);
      setNeu({ titel: "", text: "" });
    }
  };

  const removeBaustein = (idx: number) => {
    setBausteine(bausteine.filter((_, i) => i !== idx));
  };

  const moveBaustein = (idx: number, dir: -1 | 1) => {
    const newArr = [...bausteine];
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= bausteine.length) return;
    [newArr[idx], newArr[targetIdx]] = [newArr[targetIdx], newArr[idx]];
    setBausteine(newArr);
  };

  const updateBaustein = (idx: number, field: "titel" | "text", value: string) => {
    setBausteine(bausteine.map((b, i) => i === idx ? { ...b, [field]: value } : b));
  };

  const copyAll = async () => {
    const text = bausteine.map(b => (b.titel ? b.titel + ":\n" : "") + b.text).join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1500);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6">
        {bausteine.map((b, idx) => (
          <div key={idx} className="bg-[#f8f5f7] rounded-xl p-4 shadow-card flex flex-col md:flex-row gap-2 items-start md:items-center">
            <div className="flex-1">
              <input
                className="font-semibold text-[#a26b95] bg-transparent outline-none w-full mb-1"
                value={b.titel}
                onChange={e => updateBaustein(idx, "titel", e.target.value)}
                placeholder="Baustein-Titel"
              />
              <textarea
                className="w-full bg-transparent outline-none resize-none text-gray-700"
                value={b.text}
                onChange={e => updateBaustein(idx, "text", e.target.value)}
                rows={2}
                placeholder="Text für diesen Abschnitt ..."
              />
            </div>
            <div className="flex flex-col gap-1 items-center ml-2">
              <button title="Nach oben" onClick={() => moveBaustein(idx, -1)} disabled={idx === 0} className="disabled:opacity-30"><ArrowUpIcon className="w-5 h-5" /></button>
              <button title="Nach unten" onClick={() => moveBaustein(idx, 1)} disabled={idx === bausteine.length - 1} className="disabled:opacity-30"><ArrowDownIcon className="w-5 h-5" /></button>
              <button title="Entfernen" onClick={() => removeBaustein(idx)}><TrashIconMini className="w-5 h-5 text-pink-500" /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          className="border rounded px-2 py-1 w-40"
          placeholder="Neuer Abschnitt (Titel)"
          value={neu.titel}
          onChange={e => setNeu({ ...neu, titel: e.target.value })}
        />
        <input
          className="border rounded px-2 py-1 w-64"
          placeholder="Text für neuen Abschnitt"
          value={neu.text}
          onChange={e => setNeu({ ...neu, text: e.target.value })}
        />
        <button className="bg-pink-600 text-white rounded px-3 py-1 flex items-center gap-1" onClick={() => addBaustein()}><PlusCircleIcon className="w-5 h-5" /> Hinzufügen</button>
      </div>
      <div className="mb-4">
        <div className="font-semibold mb-1 text-[#7b517a] flex items-center gap-2"><LightBulbIcon className="w-5 h-5" /> Vorschläge für Bausteine:</div>
        <div className="flex flex-wrap gap-2">
          {BAUSTEIN_VORSCHLAEGE.map(v => (
            <button key={v.titel} className="bg-[#f8f5f7] border border-[#eadfe6] rounded px-3 py-1 text-[#a26b95] font-medium hover:bg-pink-50 transition" onClick={() => addBaustein(v)}>{v.titel}</button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <button className="bg-[#a26b95] text-white rounded px-4 py-2 flex items-center gap-2 font-semibold" onClick={copyAll}><ClipboardIcon className="w-5 h-5" /> Rede kopieren</button>
        {copySuccess && <span className="text-green-600 font-medium">Kopiert!</span>}
      </div>
    </div>
  );
}



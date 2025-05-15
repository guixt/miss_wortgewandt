import { useState } from "react";

const MOMENTE = [
  { id: "einzug", label: "Einzug" },
  { id: "trauung", label: "Während der Trauung" },
  { id: "auszug", label: "Auszug" },
  { id: "sektempfang", label: "Sektempfang" },
  { id: "dinner", label: "Dinner/Hintergrundmusik" },
  { id: "eroeffnungstanz", label: "Eröffnungstanz" },
  { id: "torte", label: "Tortenanschnitt" },
  { id: "party", label: "Party" },
];

const GENRES = [
  "Romantisch", "Klassisch", "Modern/Pop", "Rockig", "Deutsch", "International", "Individuell"
];

export default function Musik() {
  const [momente, setMomente] = useState(
    MOMENTE.map((m) => ({ ...m, song: "", interpret: "", notiz: "" }))
  );
  const [wuensche, setWuensche] = useState<string[]>([]);
  const [wunschInput, setWunschInput] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [nogos, setNogos] = useState("");

  const handleMomentChange = (idx: number, field: string, value: string) => {
    setMomente((prev) => prev.map((m, i) => i === idx ? { ...m, [field]: value } : m));
  };

  const handleGenreToggle = (genre: string) => {
    setGenres((prev) => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]);
  };

  const handleWunschAdd = () => {
    if (wunschInput.trim()) {
      setWuensche([...wuensche, wunschInput.trim()]);
      setWunschInput("");
    }
  };

  const handleWunschRemove = (idx: number) => {
    setWuensche((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Musik & Stimmung</h2>
      <p className="mb-4 text-gray-600">
        Legt die musikalische Begleitung für die wichtigsten Momente fest, sammelt Musikwünsche und beschreibt die gewünschte Stimmung.
      </p>

      <h3 className="font-semibold text-lg mb-2 mt-6">Musik für besondere Momente</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full mb-4 border rounded">
          <thead>
            <tr className="bg-pink-50">
              <th className="p-2 text-left">Moment</th>
              <th className="p-2 text-left">Songtitel</th>
              <th className="p-2 text-left">Interpret</th>
              <th className="p-2 text-left">Notiz</th>
            </tr>
          </thead>
          <tbody>
            {momente.map((m, idx) => (
              <tr key={m.id}>
                <td className="p-2 font-medium">{m.label}</td>
                <td className="p-2">
                  <input
                    type="text"
                    className="border rounded p-1 w-full"
                    placeholder="Songtitel"
                    value={m.song}
                    onChange={e => handleMomentChange(idx, "song", e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="border rounded p-1 w-full"
                    placeholder="Interpret"
                    value={m.interpret}
                    onChange={e => handleMomentChange(idx, "interpret", e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="border rounded p-1 w-full"
                    placeholder="Notiz (z.B. live, instrumental...)"
                    value={m.notiz}
                    onChange={e => handleMomentChange(idx, "notiz", e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="font-semibold text-lg mb-2 mt-6">Musikwünsche & Playlist</h3>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          className="border rounded p-2 flex-1"
          placeholder="Songwunsch oder Lieblingslied hinzufügen"
          value={wunschInput}
          onChange={e => setWunschInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleWunschAdd()}
        />
        <button
          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
          onClick={handleWunschAdd}
          type="button"
        >
          Hinzufügen
        </button>
      </div>
      <ul className="mb-4">
        {wuensche.map((w, idx) => (
          <li key={idx} className="flex items-center gap-2 mb-1">
            <span className="flex-1">{w}</span>
            <button
              className="text-xs text-gray-500 hover:text-pink-600"
              onClick={() => handleWunschRemove(idx)}
              title="Entfernen"
              type="button"
            >✕</button>
          </li>
        ))}
      </ul>

      <h3 className="font-semibold text-lg mb-2 mt-6">Stimmung & Genres</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {GENRES.map((g) => (
          <button
            key={g}
            className={`px-3 py-1 rounded border ${genres.includes(g) ? "bg-pink-500 text-white border-pink-500" : "bg-white border-pink-300 text-pink-700 hover:bg-pink-50"}`}
            type="button"
            onClick={() => handleGenreToggle(g)}
          >
            {g}
          </button>
        ))}
      </div>

      <h3 className="font-semibold text-lg mb-2 mt-6">No-Gos & Tabus</h3>
      <textarea
        className="border rounded w-full p-2"
        rows={2}
        placeholder="Welche Songs, Genres oder Stimmungen sollen auf keinen Fall laufen?"
        value={nogos}
        onChange={e => setNogos(e.target.value)}
      />
    </div>
  );
}

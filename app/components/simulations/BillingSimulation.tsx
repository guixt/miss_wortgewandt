import { useState } from 'react';

interface Contract {
  id: string;
  partner: string;
  address: string;
  startDate: string;
  product: string;
  deviceId: string;
}

interface Reading {
  date: string;
  value: number;
  type: 'ABLESUNG' | 'SELBSTABLESUNG' | 'SCHAETZUNG';
}

interface BillingDocument {
  id: string;
  contractId: string;
  fromDate: string;
  toDate: string;
  readings: Reading[];
  consumption: number;
  positions: BillingPosition[];
  totalAmount: number;
  status: 'SIMULATION' | 'FAKTURIERT' | 'STORNIERT';
}

interface BillingPosition {
  type: 'VERBRAUCH' | 'GRUNDPREIS' | 'ABSCHLAG';
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export function BillingSimulation() {
  const [contracts] = useState<Contract[]>([
    {
      id: "V001",
      partner: "Max Mustermann",
      address: "Hauptstraße 1, 12345 Stadt",
      startDate: "2025-01-01",
      product: "Strom Basic",
      deviceId: "Z001"
    }
  ]);

  const [readings, setReadings] = useState<Reading[]>([
    {
      date: "2025-01-01",
      value: 45280,
      type: "ABLESUNG"
    }
  ]);

  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [newReading, setNewReading] = useState<Partial<Reading>>({
    date: new Date().toISOString().split('T')[0],
    type: "ABLESUNG"
  });
  const [billingDocs, setBillingDocs] = useState<BillingDocument[]>([]);
  const [billingSimulation, setBillingSimulation] = useState<BillingDocument | null>(null);

  const addReading = () => {
    if (!newReading.value || !newReading.date) return;

    const lastReading = [...readings].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];

    if (lastReading && newReading.value < lastReading.value) {
      alert('Neuer Zählerstand kann nicht kleiner als der letzte sein!');
      return;
    }

    setReadings([...readings, newReading as Reading]);
    setNewReading({
      date: new Date().toISOString().split('T')[0],
      type: "ABLESUNG"
    });
  };

  const simulateBilling = (contract: Contract) => {
    const sortedReadings = [...readings].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (sortedReadings.length < 2) {
      alert('Mindestens zwei Zählerstände werden für eine Abrechnung benötigt!');
      return;
    }

    const firstReading = sortedReadings[0];
    const lastReading = sortedReadings[sortedReadings.length - 1];
    const consumption = lastReading.value - firstReading.value;

    const positions: BillingPosition[] = [
      // Arbeitspreis
      {
        type: "VERBRAUCH",
        description: "Arbeitspreis Strom",
        quantity: consumption,
        unitPrice: 0.35,
        amount: consumption * 0.35
      },
      // Grundpreis
      {
        type: "GRUNDPREIS",
        description: "Grundpreis Strom",
        quantity: 12,
        unitPrice: 12.50,
        amount: 12 * 12.50
      },
      // Abschlag
      {
        type: "ABSCHLAG",
        description: "Bereits gezahlte Abschläge",
        quantity: 12,
        unitPrice: -65,
        amount: 12 * -65
      }
    ];

    const totalAmount = positions.reduce((sum, pos) => sum + pos.amount, 0);

    const billingDoc: BillingDocument = {
      id: `R${(billingDocs.length + 1).toString().padStart(3, '0')}`,
      contractId: contract.id,
      fromDate: firstReading.date,
      toDate: lastReading.date,
      readings: sortedReadings,
      consumption,
      positions,
      totalAmount,
      status: 'SIMULATION'
    };

    setBillingSimulation(billingDoc);
  };

  const createBillingDoc = () => {
    if (!billingSimulation) return;

    setBillingDocs([
      ...billingDocs,
      { ...billingSimulation, status: 'FAKTURIERT' }
    ]);
    setBillingSimulation(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Verträge und Zählerstände */}
      <div>
        <h2 className="text-xl font-bold mb-4">Verträge</h2>
        <div className="space-y-4">
          {contracts.map(contract => (
            <div 
              key={contract.id}
              className={`p-4 border rounded cursor-pointer transition-colors ${
                selectedContract?.id === contract.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedContract(contract)}
            >
              <h3 className="font-semibold">{contract.partner}</h3>
              <p className="text-sm text-gray-600">{contract.address}</p>
              <p className="text-sm">Vertrag: {contract.id} | Produkt: {contract.product}</p>
              <p className="text-sm">Zähler: {contract.deviceId}</p>
            </div>
          ))}
        </div>

        {selectedContract && (
          <div className="mt-6">
            <h3 className="font-bold mb-2">Zählerstände erfassen</h3>
            <div className="space-y-3 bg-white p-4 rounded shadow-sm">
              <div>
                <label className="block text-sm mb-1">Datum</label>
                <input
                  type="date"
                  value={newReading.date}
                  onChange={e => setNewReading({ ...newReading, date: e.target.value })}
                  className="border rounded p-1"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Zählerstand</label>
                <input
                  type="number"
                  value={newReading.value || ''}
                  onChange={e => setNewReading({ ...newReading, value: Number(e.target.value) })}
                  className="border rounded p-1"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Art der Ablesung</label>
                <select
                  value={newReading.type}
                  onChange={e => setNewReading({ ...newReading, type: e.target.value as Reading['type'] })}
                  className="border rounded p-1"
                >
                  <option value="ABLESUNG">Ablesung</option>
                  <option value="SELBSTABLESUNG">Selbstablesung</option>
                  <option value="SCHAETZUNG">Schätzung</option>
                </select>
              </div>
              <button
                onClick={addReading}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Zählerstand erfassen
              </button>
            </div>

            <div className="mt-4">
              <h3 className="font-bold mb-2">Erfasste Zählerstände</h3>
              <div className="bg-white p-4 rounded shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">Datum</th>
                      <th className="text-left pb-2">Stand</th>
                      <th className="text-left pb-2">Art</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...readings].sort((a, b) => 
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                    ).map((reading, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="py-2">{reading.date}</td>
                        <td className="py-2">{reading.value}</td>
                        <td className="py-2">{reading.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              onClick={() => simulateBilling(selectedContract)}
              className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Abrechnung simulieren
            </button>
          </div>
        )}
      </div>

      {/* Abrechnungssimulation und Dokumente */}
      <div>
        {billingSimulation && (
          <div className="bg-white p-6 rounded shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Abrechnung (Simulation)</h2>
              <button
                onClick={createBillingDoc}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Rechnung erstellen
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-b pb-4">
                <p><strong>Vertrag:</strong> {selectedContract?.id}</p>
                <p><strong>Kunde:</strong> {selectedContract?.partner}</p>
                <p><strong>Zeitraum:</strong> {billingSimulation.fromDate} bis {billingSimulation.toDate}</p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Verbrauch</h3>
                <p>Anfangsstand: {billingSimulation.readings[0].value} kWh</p>
                <p>Endstand: {billingSimulation.readings[billingSimulation.readings.length - 1].value} kWh</p>
                <p className="font-bold">Verbrauch: {billingSimulation.consumption} kWh</p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Positionen</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">Position</th>
                      <th className="text-right pb-2">Menge</th>
                      <th className="text-right pb-2">Einzelpreis</th>
                      <th className="text-right pb-2">Betrag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingSimulation.positions.map((pos, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="py-2">{pos.description}</td>
                        <td className="py-2 text-right">{pos.quantity}</td>
                        <td className="py-2 text-right">{pos.unitPrice.toFixed(2)} €</td>
                        <td className="py-2 text-right">{pos.amount.toFixed(2)} €</td>
                      </tr>
                    ))}
                    <tr className="font-bold">
                      <td colSpan={3} className="pt-4">Gesamtbetrag</td>
                      <td className="pt-4 text-right">{billingSimulation.totalAmount.toFixed(2)} €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {billingDocs.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Erstellte Rechnungen</h2>
            <div className="space-y-2">
              {[...billingDocs].reverse().map(doc => (
                <div key={doc.id} className="bg-white p-4 rounded shadow-sm">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">Rechnung {doc.id}</p>
                      <p className="text-sm text-gray-600">
                        Zeitraum: {doc.fromDate} - {doc.toDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{doc.totalAmount.toFixed(2)} €</p>
                      <p className="text-sm text-green-600">{doc.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lernhinweise */}
      <div className="md:col-span-2 mt-6 p-4 bg-blue-50 rounded">
        <h4 className="font-bold">🎓 Lernhinweise:</h4>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Eine IS-U Rechnung basiert auf mindestens zwei Zählerständen (Anfang und Ende)</li>
          <li>Der Abrechnungszeitraum wird durch die Zählerstände definiert</li>
          <li>Verschiedene Arten der Zählerstandserfassung sind möglich (Ablesung, Selbstablesung, Schätzung)</li>
          <li>Die Rechnung enthält typischerweise Verbrauchspreise, Grundpreise und bereits gezahlte Abschläge</li>
          <li>Vor der endgültigen Rechnungserstellung kann eine Simulation durchgeführt werden</li>
        </ul>
      </div>

      {/* Lernhinweise Abrechnung */}
      <div className="md:col-span-2 mt-8 p-4 bg-blue-50 rounded">
        <h4 className="font-bold">🎓 Lernhinweise (Abrechnung & Fakturierung):</h4>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Die Abrechnung in SAP IS-U ist ein komplexer Prozess, der Zählerstände, Tarife, Verträge und Stammdaten berücksichtigt, um Rechnungen zu erstellen.</li>
          <li>Eine wichtige Transaktion ist die `EA00` (Abrechnungslauf), mit der Massenabrechnungen durchgeführt werden können. Einzelne Verträge können auch über `EA22` (Einzelabrechnungssimulation) oder `EA10` (Turnusabrechnung Einzelkunde) simuliert und abgerechnet werden.</li>
          <li>Abrechnungsbelege (`FKK_BILLDOC`) enthalten alle abrechnungsrelevanten Positionen und bilden die Grundlage für die Fakturierung.</li>
          <li>Die Fakturierung (`EA26` - Fakturierungslauf, `EA19` - Einzelfakturierung) erstellt aus den Abrechnungsbelegen die eigentlichen Rechnungen (Druckbelege) und bucht die Forderungen im Vertragskontokorrent (FI-CA).</li>
          <li>Wichtige Transaktionen im Abrechnungsumfeld:
            <ul className="list-disc list-inside pl-4">
              <li>`EA00`: Abrechnungslauf (Massenlauf)</li>
              <li>`EA10`: Turnusabrechnung Einzelkunde</li>
              <li>`EA22`: Einzelabrechnungssimulation</li>
              <li>`EA26`: Fakturierungslauf (Massenlauf)</li>
              <li>`EA19`: Einzelfakturierung</li>
              <li>`EA40`: Beleg anzeigen (Abrechnungsbeleg)</li>
              <li>`EA05`: Ableseergebnisse ändern/anzeigen</li>
              <li>`EL28`: Zählerstandserfassung (für Korrekturen/Nacherfassungen)</li>
            </ul>
          </li>
          <li>SPRO-Pfade für das Customizing der Abrechnung finden sich typischerweise unter: <i>SAP Utilities - Vertragsabrechnung</i>. Dort werden z.B. Abrechnungsschemata, Tarife, und Buchungsregeln konfiguriert.</li>
        </ul>
      </div>
    </div>
  );
}

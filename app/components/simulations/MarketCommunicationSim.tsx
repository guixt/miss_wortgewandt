import React, { useState } from 'react';

interface MarketPartner {
  id: string;
  name: string;
  role: 'Netzbetreiber' | 'Lieferant';
}

interface EdifactMessage {
  type: 'UTILMD' | 'MSCONS' | 'REMADV'; // Simplified
  sender: string;
  receiver: string;
  payload: Record<string, any>; // Simplified payload
  timestamp: string;
  status?: 'Gesendet' | 'Empfangen' | 'Fehler';
}

const initialPartners: MarketPartner[] = [
  { id: 'NB001', name: 'Stadtwerke Musterstadt Netz GmbH', role: 'Netzbetreiber' },
  { id: 'LF001', name: 'Alte Energie AG', role: 'Lieferant' },
  { id: 'LF002', name: 'Neue Strom GmbH', role: 'Lieferant' },
];

type SimulationStep = 
  | 'idle'
  | 'anmeldung_initiiert' 
  | 'utilmd_anmeldung_gesendet'
  | 'utilmd_anmeldung_bestaetigt'
  | 'prozess_abgeschlossen'
  | 'prozess_fehler';

export function MarketCommunicationSim() {
  const [partners] = useState<MarketPartner[]>(initialPartners);
  const [currentStep, setCurrentStep] = useState<SimulationStep>('idle');
  const [messages, setMessages] = useState<EdifactMessage[]>([]);
  const [processError, setProcessError] = useState<string | null>(null);

  const netzbetreiber = partners.find(p => p.role === 'Netzbetreiber')!;
  const neuerLieferant = partners.find(p => p.id === 'LF002')!;
  // const alterLieferant = partners.find(p => p.id === 'LF001')!;

  const startSupplierSwitch = () => {
    setMessages([]);
    setProcessError(null);
    setCurrentStep('anmeldung_initiiert');
  };

  const sendUtilmdAnmeldung = () => {
    if (currentStep !== 'anmeldung_initiiert') return;

    const anmeldungPayload = {
      nachrichtentyp: 'E01', // Anmeldung
      vertragsbeginn: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // In 14 Tagen
      zaehlpunkt: 'DE0001112223334445556667778889990',
      kunde: {
        name: 'Max Mustermann',
        anschrift: 'Beispielweg 1, 12345 Musterstadt'
      }
    };

    const newMessage: EdifactMessage = {
      type: 'UTILMD',
      sender: neuerLieferant.id,
      receiver: netzbetreiber.id,
      payload: anmeldungPayload,
      timestamp: new Date().toISOString(),
      status: 'Gesendet'
    };
    setMessages(prev => [...prev, newMessage]);
    setCurrentStep('utilmd_anmeldung_gesendet');
  };

  const receiveUtilmdBestaetigung = () => {
    if (currentStep !== 'utilmd_anmeldung_gesendet') return;

    // Simulate a positive confirmation (CONTRL message or positive response in UTILMD)
    const bestaetigungPayload = {
      referenz_anmeldung: messages.find(m => m.type === 'UTILMD' && m.sender === neuerLieferant.id)?.payload.nachrichtentyp + '_REF123',
      status: 'Zustimmung',
      detail: 'Anmeldung zum Zählpunkt DE0001112223334445556667778889990 akzeptiert.'
    };

    const responseMessage: EdifactMessage = {
      type: 'UTILMD', // Simplified, could be CONTRL
      sender: netzbetreiber.id,
      receiver: neuerLieferant.id,
      payload: bestaetigungPayload,
      timestamp: new Date().toISOString(),
      status: 'Empfangen'
    };
    setMessages(prev => [...prev, responseMessage]);
    setCurrentStep('utilmd_anmeldung_bestaetigt');
    // In a real scenario, further steps for old supplier notification etc. would follow
    // For this simulation, we consider it abgeschlossen after confirmation.
    setTimeout(() => setCurrentStep('prozess_abgeschlossen'), 1000);
  };
  
  const simulateError = () => {
    setProcessError('Fehler bei der Nachrichtenverarbeitung: Ungültiges Format (simuliert)');
    setCurrentStep('prozess_fehler');
  }

  const resetSimulation = () => {
    setCurrentStep('idle');
    setMessages([]);
    setProcessError(null);
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Marktkommunikation: Lieferantenwechsel (GPKE)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {partners.map(p => (
          <div key={p.id} className="p-3 bg-gray-100 rounded shadow">
            <h3 className="font-bold text-sm">{p.name} ({p.role})</h3>
            <p className="text-xs text-gray-600">ID: {p.id}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Simulationssteuerung</h3>
        {currentStep === 'idle' && (
          <button onClick={startSupplierSwitch} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Lieferantenwechsel starten
          </button>
        )}
        {currentStep === 'anmeldung_initiiert' && (
          <button onClick={sendUtilmdAnmeldung} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            UTILMD (Anmeldung) an Netzbetreiber senden
          </button>
        )}
        {currentStep === 'utilmd_anmeldung_gesendet' && (
          <button onClick={receiveUtilmdBestaetigung} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
            Positive Rückmeldung (UTILMD) vom Netzbetreiber empfangen
          </button>
        )}
        {(currentStep === 'prozess_abgeschlossen' || currentStep === 'prozess_fehler') && (
            <button onClick={resetSimulation} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                Simulation zurücksetzen
            </button>
        )}
         {currentStep === 'utilmd_anmeldung_gesendet' && (
             <button onClick={simulateError} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Fehler simulieren
            </button>
        )}
      </div>

      {processError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          <p><b>Simulationsfehler:</b> {processError}</p>
        </div>
      )}

      {messages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Nachrichtenverlauf (EDIFACT-ähnlich)</h3>
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className={`p-3 border rounded ${msg.sender === netzbetreiber.id ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
                <p className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</p>
                <p><b>Typ:</b> {msg.type} | <b>Von:</b> {partners.find(p=>p.id === msg.sender)?.name} | <b>An:</b> {partners.find(p=>p.id === msg.receiver)?.name}</p>
                <p><b>Status:</b> {msg.status}</p>
                <details className="text-xs mt-1">
                  <summary className="cursor-pointer">Payload anzeigen/verbergen</summary>
                  <pre className="mt-1 p-2 bg-gray-50 rounded text-xs overflow-auto">
                    {JSON.stringify(msg.payload, null, 2)}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentStep === 'prozess_abgeschlossen' && (
        <div className="p-4 bg-green-100 text-green-700 rounded">
          <p><b>Prozess erfolgreich abgeschlossen!</b> Der neue Lieferant wurde beim Netzbetreiber angemeldet.</p>
        </div>
      )}

      <div className="mt-8 p-4 bg-sky-50 rounded">
        <h4 className="font-bold">🎓 Lernhinweise (Marktkommunikation - Lieferantenwechsel)</h4>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Der <b>Lieferantenwechsel</b> (oft GPKE - Geschäftsprozesse zur Kundenbelieferung mit Elektrizität - genannt) ist ein standardisierter Prozess in der deutschen Energiewirtschaft.</li>
          <li><b>UTILMD</b> ist ein EDIFACT-Nachrichtenformat für Stammdatenänderungen, Anmeldungen, Abmeldungen etc. Es gibt verschiedene Nachrichtentypen (z.B. E01 für Anmeldung).</li>
          <li>Der Netzbetreiber prüft die Anmeldung und sendet eine Bestätigung (oft als CONTRL-Nachricht oder positive UTILMD-Antwort).</li>
          <li>SAP IS-U verwendet <b>IDocs</b> als internes Format, die dann in EDIFACT-Nachrichten konvertiert werden (und umgekehrt). Die Transaktion <code>WEDI</code> ist die Basis für IDoc-Verwaltung.</li>
          <li>Im Fehlerfall (z.B. ungültige Daten) sendet der Empfänger eine Fehlernachricht (z.B. APERAK oder negative CONTRL). Solche Fehler können in SAP IS-U im IDoc-Monitoring (<code>BD87</code>) oder speziellen MaKo-Monitoren (<code>EDIMON</code>) analysiert werden.</li>
          <li>Weitere wichtige Nachrichten im Prozess sind z.B. MSCONS für die Übermittlung von Zählerständen/Lastgängen.</li>
          <li>Das Customizing für diese Prozesse (Partnervereinbarungen, Formate, Prozessdefinitionen) ist sehr detailliert und findet sich u.a. unter <i>SAP Utilities - Intercompany Data Exchange</i>.</li>
        </ul>
      </div>
    </div>
  );
}

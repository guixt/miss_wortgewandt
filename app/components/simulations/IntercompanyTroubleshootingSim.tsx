import React, { useState } from 'react';

type SimStepId = 
  | 'initial' 
  | 'check_we02' 
  | 'check_edpartner' 
  | 'check_we20' 
  | 'check_sm59_we21' 
  | 'check_wlf_idoc' 
  | 'error_found_we20_missing_inbound_utilmd';

interface LogEntry {
  timestamp: string;
  text: string;
  isUserAction?: boolean;
}

interface ErrorDetails {
  id: string;
  title: string;
  message: string;
  explanation: string;
}

// Market partner data (can be expanded or moved to a separate data file)
const gridOperator = { id: 'Stadtwerke Musterstadt Netz', name: 'Stadtwerke Musterstadt Netz GmbH', partnerNumber: 'SW_MSTADT_NETZ' };
const newSupplier = { id: 'NeuerLieferant Energie', name: 'NeuerLieferant Energie GmbH', partnerNumber: 'NL_ENERGIE_GMBH' };

export const IntercompanyTroubleshootingSim: React.FC = () => {
  const [currentSimStep, setCurrentSimStep] = useState<SimStepId>('initial');
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [errorDetails, setErrorDetails] = useState<ErrorDetails | null>(null);

  const scenarioDescription = `
Ein neuer Lieferant, "${newSupplier.name}" (Partnernr: ${newSupplier.partnerNumber}), meldet telefonisch, 
dass er für den Kunden Max Mustermann (Zählpunkt DE0001112223330000111122223333444) 
eine UTILMD-Nachricht (Lieferbeginn) an "${gridOperator.name}" (Partnernr: ${gridOperator.partnerNumber}) gesendet hat.
Es kam bisher keine Bestätigung (CONTRL) zurück und im System des Lieferanten ist nichts ersichtlich. 
Der Kunde Max Mustermann hat aber noch Strom über den Altlieferanten.
Ihre Aufgabe ist es, das Problem zu analysieren.
  `;

  const addLogEntry = (text: string, isUserAction: boolean = false) => {
    setLogEntries(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), text, isUserAction }]);
  };

  const handleReset = () => {
    setCurrentSimStep('initial');
    setLogEntries([]);
    setErrorDetails(null);
  };

  const handleCheckWE02 = () => {
    addLogEntry("Aktion: IDoc Monitoring (WE02/WE05) prüfen.", true);
    setCurrentSimStep('check_we02');
    // Simulate WE02 check logic here in a subsequent step
    addLogEntry("System: In WE02/WE05 werden keine IDocs vom Absender '${newSupplier.partnerNumber}' für Nachrichtentyp UTILMD zum gemeldeten Zeitpunkt gefunden.");
  };

  const handleCheckEDPARTNER = () => {
    addLogEntry("Aktion: Partnervereinbarungen (EDPARTNER) prüfen.", true);
    setCurrentSimStep('check_edpartner');
    addLogEntry(`System: Partner '${newSupplier.name}' (${newSupplier.partnerNumber}, Rolle LF) ist in EDPARTNER korrekt als Handelspartner mit Kommunikationsmethode 'EDI' gepflegt.`);
  };

  const handleCheckWE20 = () => {
    addLogEntry("Aktion: Partnerprofile (WE20) prüfen.", true);
    // This is the path to the error
    // Simulate finding the partner, but missing inbound params
    addLogEntry(`System: Partnerprofil für ${newSupplier.partnerNumber} (Partnertyp LI) in WE20 gefunden.`);
    addLogEntry("System: Prüfung der eingehenden Parameter...");
    setErrorDetails({
      id: 'we20_missing_inbound_utilmd',
      title: 'Fehler im Partnerprofil (WE20) gefunden!',
      message: `Für Partner ${newSupplier.partnerNumber} (Partnertyp LI) fehlt der Eintrag für Nachrichtentyp UTILMD unter "Eingehende Parameter".`,
      explanation: `Ohne diesen Eintrag kann das SAP-System keine Prozesssteuerung für eingehende UTILMD-Nachrichten von diesem Lieferanten finden. Der IDoc wird ggf. mit Fehlerstatus abgewiesen oder nicht weiterverarbeitet. Lösung: EDI-Berater muss in WE20 für Partner ${newSupplier.partnerNumber} (LI) einen neuen eingehenden Parameter für UTILMD mit passendem Vorgangscode (z.B. UTILMD_IN) und 'Verbuchung über Hintergrundprogramm' anlegen.`
    });
    setCurrentSimStep('error_found_we20_missing_inbound_utilmd');
  };
  
  const handleCheckSM59WE21 = () => {
    addLogEntry("Aktion: Port-Konfiguration (SM59/WE21) prüfen.", true);
    setCurrentSimStep('check_sm59_we21');
    addLogEntry("System: Der EDI-Port (z.B. SAP_EDI) in WE21 ist aktiv. Die RFC-Destination (z.B. EDI_SYSTEM_RFC) in SM59 ist erreichbar. Grundlegende EDI-Kommunikationskanäle scheinen in Ordnung.");
  };

  const handleCheckWLF_IDOC = () => {
    addLogEntry("Aktion: IS-U spezifisches IDoc Monitoring (WLF_IDOC) prüfen.", true);
    setCurrentSimStep('check_wlf_idoc');
    addLogEntry("System: In WLF_IDOC werden keine spezifischen IS-U Verarbeitungsprotokolle für den Vorgang gefunden. Dies deutet darauf hin, dass das Problem vor der IS-U spezifischen Verarbeitung auftrat.");
  };

  const renderInitialStepActions = () => (
    <div className="space-y-2">
      <p className="text-md font-semibold mb-2">Womit möchten Sie mit der Fehlersuche beginnen?</p>
      <button onClick={handleCheckWE02} className="w-full px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 text-left">1. IDoc Monitoring prüfen (WE02/WE05)</button>
      <button onClick={handleCheckEDPARTNER} className="w-full px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 text-left">2. Partnervereinbarungen prüfen (EDPARTNER)</button>
      <button onClick={handleCheckWE20} className="w-full px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 text-left">3. Partnerprofile prüfen (WE20)</button>
      <button onClick={handleCheckSM59WE21} className="w-full px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 text-left">4. Port-Konfiguration prüfen (SM59/WE21)</button>
      <button onClick={handleCheckWLF_IDOC} className="w-full px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 text-left">5. IS-U IDoc Monitoring prüfen (WLF_IDOC)</button>
    </div>
  );

  // TODO: Implement rendering for other steps (check_we02, check_edpartner, etc.) 
  // to offer further actions or guidance based on findings.

  const renderActionsForStep = () => {
    switch (currentSimStep) {
      case 'check_we02':
        return (
          <div className="space-y-2">
            <p className="text-md font-semibold mb-2">WE02/WE05 zeigt keine passenden UTILMD IDocs. Nächste Schritte?</p>
            <button onClick={handleCheckWE20} className="w-full px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 text-left">Partnerprofile prüfen (WE20)</button>
            <button onClick={handleCheckSM59WE21} className="w-full px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 text-left">Port-Konfiguration prüfen (SM59/WE21)</button>
            <button onClick={handleCheckEDPARTNER} className="w-full px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 text-left">Partnervereinbarungen erneut prüfen (EDPARTNER)</button>
            <button onClick={() => setCurrentSimStep('initial')} className="w-full mt-2 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 text-left">Zurück zur Haupt-Aktionsauswahl</button>
          </div>
        );
      case 'check_edpartner':
        return (
          <div className="space-y-2">
            <p className="text-md font-semibold mb-2">EDPARTNER scheint korrekt. Nächste Schritte?</p>
            <button onClick={handleCheckWE20} className="w-full px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 text-left">Partnerprofile prüfen (WE20)</button>
            <button onClick={handleCheckWE02} className="w-full px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 text-left">IDoc Monitoring erneut prüfen (WE02/WE05)</button>
            <button onClick={handleCheckSM59WE21} className="w-full px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 text-left">Port-Konfiguration prüfen (SM59/WE21)</button>
            <button onClick={() => setCurrentSimStep('initial')} className="w-full mt-2 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 text-left">Zurück zur Haupt-Aktionsauswahl</button>
          </div>
        );
      case 'check_sm59_we21':
        return (
          <div className="space-y-2">
            <p className="text-md font-semibold mb-2">Port-Konfiguration scheint korrekt. Nächste Schritte?</p>
            <button onClick={handleCheckWE02} className="w-full px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 text-left">IDoc Monitoring prüfen (WE02/WE05)</button>
            <button onClick={handleCheckWE20} className="w-full px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 text-left">Partnerprofile prüfen (WE20)</button>
            <button onClick={handleCheckWLF_IDOC} className="w-full px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 text-left">IS-U IDoc Monitoring prüfen (WLF_IDOC)</button>
            <button onClick={() => setCurrentSimStep('initial')} className="w-full mt-2 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 text-left">Zurück zur Haupt-Aktionsauswahl</button>
          </div>
        );
      case 'check_wlf_idoc':
        return (
          <div className="space-y-2">
            <p className="text-md font-semibold mb-2">Keine IS-U spezifischen Logs in WLF_IDOC. Nächste Schritte?</p>
            <button onClick={handleCheckWE02} className="w-full px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 text-left">IDoc Monitoring prüfen (WE02/WE05)</button>
            <button onClick={handleCheckWE20} className="w-full px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 text-left">Partnerprofile prüfen (WE20)</button>
            <button onClick={handleCheckEDPARTNER} className="w-full px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 text-left">Partnervereinbarungen prüfen (EDPARTNER)</button>
            <button onClick={() => setCurrentSimStep('initial')} className="w-full mt-2 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 text-left">Zurück zur Haupt-Aktionsauswahl</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Simulation: Intercompany Troubleshooting - UTILMD Fehler</h2>
      
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="text-lg font-semibold text-blue-700 mb-2">Ausgangssituation</h3>
        <p className="text-sm text-gray-600 whitespace-pre-line">{scenarioDescription}</p>
      </div>

      {!errorDetails && currentSimStep === 'initial' && renderInitialStepActions()}
      {!errorDetails && currentSimStep !== 'initial' && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded">
          {renderActionsForStep()}
        </div>
      )}

      {logEntries.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Untersuchungsprotokoll</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {logEntries.map((entry, index) => (
              <li key={index} className={`${entry.isUserAction ? 'text-blue-600' : 'text-gray-700'}`}>
                <span className="font-mono text-xs">[{entry.timestamp}]</span> {entry.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {errorDetails && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded">
          <h3 className="text-xl font-bold text-green-700 mb-2">🏁 {errorDetails.title}</h3>
          <p className="text-md text-gray-800 mb-2">{errorDetails.message}</p>
          <div className="p-3 bg-green-50 rounded">
            <h4 className="text-md font-semibold text-green-600 mb-1">Erläuterung:</h4>
            <p className="text-sm text-gray-700 whitespace-pre-line">{errorDetails.explanation}</p>
          </div>
        </div>
      )}

      <button 
        onClick={handleReset}
        className="mt-8 px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-semibold"
      >
        Simulation zurücksetzen
      </button>
    </div>
  );
};

export default IntercompanyTroubleshootingSim; 

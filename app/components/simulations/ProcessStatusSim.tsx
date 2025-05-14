import React, { useState, useEffect } from 'react';

interface ProcessObject {
  id: string;
  name: string;
  status: string;
  type: 'Geschaeftspartner' | 'Vertragskonto' | 'Vertrag' | 'Geraet';
}

interface MoveInStep {
  step: number;
  description: string;
  objectTypeAffected: ProcessObject['type'];
  newStatus: string;
  actionText: string;
}

const initialObjects: ProcessObject[] = [
  { id: 'gp1', name: 'Max Mustermann', status: 'Nicht angelegt', type: 'Geschaeftspartner' },
  { id: 'vk1', name: 'VK für M. Mustermann', status: 'Nicht angelegt', type: 'Vertragskonto' },
  { id: 'v1', name: 'Stromvertrag Basis', status: 'Nicht angelegt', type: 'Vertrag' },
  { id: 'd1', name: 'Zähler Z00123', status: 'Im Lager', type: 'Geraet' },
];

const moveInProcessSteps: MoveInStep[] = [
  {
    step: 1,
    description: 'Geschäftspartner anlegen (Transaktion: BP).',
    objectTypeAffected: 'Geschaeftspartner',
    newStatus: 'Angelegt, Aktiv',
    actionText: 'GP anlegen'
  },
  {
    step: 2,
    description: 'Vertragskonto für Geschäftspartner anlegen (Transaktion: CAA1).',
    objectTypeAffected: 'Vertragskonto',
    newStatus: 'Angelegt, Aktiv',
    actionText: 'Vertragskonto anlegen'
  },
  {
    step: 3,
    description: 'Einzugsbeleg erstellen und Vertrag anlegen (Transaktion: EC50E oder CIC0 für CIC-Szenario).',
    objectTypeAffected: 'Vertrag',
    newStatus: 'Angelegt, Aktiv (Einzug gemeldet)',
    actionText: 'Vertrag anlegen (Einzug)'
  },
  {
    step: 4,
    description: 'Gerät dem Vertrag technisch zuordnen und Einbau simulieren (Transaktion: EG33/EG30).',
    objectTypeAffected: 'Geraet',
    newStatus: 'Eingebaut, Aktiv',
    actionText: 'Gerät einbauen/zuordnen'
  },
  {
    step: 5,
    description: 'Willkommensschreiben an Kunden senden (Teil des Einzugsprozesses, oft automatisiert).',
    objectTypeAffected: 'Vertrag', // Or a separate process object for correspondence
    newStatus: 'Aktiv (Willkommensbrief versandt)',
    actionText: 'Willkommensbrief generieren'
  },
];

export function ProcessStatusSim() {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [processObjects, setProcessObjects] = useState<ProcessObject[]>(initialObjects);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);

  const currentProcessDefinitionStep = moveInProcessSteps[currentStepIndex];

  const resetSimulation = () => {
    setCurrentStepIndex(0);
    setProcessObjects(initialObjects);
    setSimulationLog([]);
  };

  const executeNextStep = () => {
    if (!currentProcessDefinitionStep) return;

    const { description, objectTypeAffected, newStatus } = currentProcessDefinitionStep;

    setProcessObjects(prevObjects => 
      prevObjects.map(obj => 
        obj.type === objectTypeAffected ? { ...obj, status: newStatus } : obj
      )
    );
    setSimulationLog(prevLog => [...prevLog, `${new Date().toLocaleTimeString()}: ${description} - Objekt ${objectTypeAffected} Status: ${newStatus}`]);
    setCurrentStepIndex(prevIndex => prevIndex + 1);
  };

  useEffect(() => {
    // Reset objects if starting from scratch
    if(currentStepIndex === 0 && JSON.stringify(processObjects) !== JSON.stringify(initialObjects)){
        setProcessObjects(initialObjects);
        setSimulationLog([]);
    }
  }, [currentStepIndex, processObjects]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Einzugsprozess-Simulation</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Prozessobjekte & Status</h3>
          <div className="space-y-2">
            {processObjects.map(obj => (
              <div key={obj.id} className="p-3 bg-white rounded shadow border border-gray-200">
                <p className="font-medium">{obj.name} <span className="text-xs text-gray-500">({obj.type})</span></p>
                <p className={`text-sm ${obj.status.includes('Nicht') || obj.status.includes('Lager') ? 'text-red-600' : 'text-green-600'}`}>
                  Status: {obj.status}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Simulationssteuerung</h3>
          {currentProcessDefinitionStep ? (
            <div className="p-3 bg-white rounded shadow border border-gray-200">
              <p className="mb-1"><span className="font-semibold">Nächster Schritt ({currentProcessDefinitionStep.step}/{moveInProcessSteps.length}):</span> {currentProcessDefinitionStep.description}</p>
              <button 
                onClick={executeNextStep} 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
              >
                {currentProcessDefinitionStep.actionText}
              </button>
            </div>
          ) : (
            <div className="p-3 bg-green-100 rounded text-green-700">
              <p className="font-semibold">Einzugsprozess erfolgreich simuliert!</p>
            </div>
          )}
          <button 
            onClick={resetSimulation} 
            className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Simulation zurücksetzen
          </button>
        </div>
      </div>

      {simulationLog.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Simulationsprotokoll</h3>
          <div className="p-3 bg-gray-50 rounded shadow text-sm space-y-1 h-40 overflow-y-auto border">
            {simulationLog.map((logEntry, index) => (
              <p key={index} className="text-xs">{logEntry}</p>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-emerald-50 rounded">
        <h4 className="font-bold">🎓 Lernhinweise (Einzugsprozess & Status):</h4>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Der <b>Einzug</b> ist ein zentraler Geschäftsprozess in SAP IS-U, der die Aufnahme eines neuen Kunden und die Versorgung mit Energie initiiert.</li>
          <li>Typische Schritte umfassen: Anlage des <b>Geschäftspartners</b> (Transaktion <code>BP</code>), Eröffnung eines <b>Vertragskontos</b> (<code>CAA1</code>), Anlage des <b>Vertrags</b> (oft über Einzugsbeleg <code>EC50E</code> oder im CIC via <code>CIC0</code>), und die technische Installation/Zuordnung des <b>Geräts</b> (<code>EG30</code>, <code>EG33</code>).</li>
          <li>Jedes dieser Objekte (Geschäftspartner, Vertragskonto, Vertrag, Gerät, Anlage) besitzt ein <b>Statusnetzwerk</b>, das festlegt, welche Aktionen in welchem Zustand erlaubt sind und welche Statusübergänge möglich sind.</li>
          <li>Beispielsweise kann ein Vertrag erst abgerechnet werden, wenn er den Status 'Aktiv' oder einen vergleichbaren Status hat. Ein Gerät muss den Status 'Eingebaut' haben, um Ableseergebnisse zu erfassen.</li>
          <li>Die korrekte Abfolge und das Erreichen der richtigen Status sind entscheidend für nachfolgende Prozesse wie Ablesung, Abrechnung und Fakturierung.</li>
          <li>Im SAP-System werden diese Prozesse oft durch Workflows unterstützt, die automatisch Folgeaktivitäten anstoßen oder Benutzer zu bestimmten Aktionen auffordern. Transaktion <code>SWI1</code> kann zur Workflow-Analyse genutzt werden.</li>
           <li>Das Customizing für Status und Prozesse ist umfangreich und findet sich unter den jeweiligen Komponenten im SPRO (z.B. <i>SAP Utilities - Kundenmanagement - Vertrag</i> oder <i>Geräteverwaltung - Gerätemanagement - Statusmanagement</i>).</li>
        </ul>
      </div>
    </div>
  );
}

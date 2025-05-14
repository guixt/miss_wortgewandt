import { useState } from 'react';

interface CustomizingNode {
  id: string;
  name: string;
  description: string;
  children?: CustomizingNode[];
  settings?: CustomizingSetting[];
}

interface CustomizingSetting {
  id: string;
  name: string;
  type: 'CHECKBOX' | 'SELECT' | 'INPUT';
  value: string | boolean;
  options?: string[];
  impacts: Impact[];
}

interface Impact {
  area: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export function CustomizingSim() {
  const [spro, setSpro] = useState<CustomizingNode[]>([
    {
      id: "ISU",
      name: "IS-U/DEREGULIERT",
      description: "Grundeinstellungen für IS-U",
      children: [
        {
          id: "BASIC",
          name: "Grundeinstellungen",
          description: "Allgemeine IS-U Einstellungen",
          settings: [
            {
              id: "SPARTENSTEUERUNG",
              name: "Spartensteuerung",
              type: "SELECT",
              value: "STROM",
              options: ["STROM", "GAS", "WASSER"],
              impacts: [
                {
                  area: "Geräteverwaltung",
                  description: "Bestimmt verfügbare Gerätetypen und Messgrößen",
                  severity: "HIGH"
                },
                {
                  area: "Tarife",
                  description: "Filtert spartenspezifische Tarifmerkmale",
                  severity: "MEDIUM"
                }
              ]
            },
            {
              id: "BILLINGACTIVE",
              name: "Fakturierung aktiv",
              type: "CHECKBOX",
              value: true,
              impacts: [
                {
                  area: "Abrechnung",
                  description: "Deaktiviert/Aktiviert die gesamte Rechnungsstellung",
                  severity: "HIGH"
                }
              ]
            }
          ]
        },
        {
          id: "DEVICE",
          name: "Geräteverwaltung",
          description: "Einstellungen für Geräte und Zähler",
          settings: [
            {
              id: "AUTOINSTALL",
              name: "Automatische Installation",
              type: "CHECKBOX",
              value: false,
              impacts: [
                {
                  area: "Geräteverwaltung",
                  description: "Erlaubt automatische Zählerinstallation bei Anlage",
                  severity: "MEDIUM"
                }
              ]
            },
            {
              id: "READINGVALIDATION",
              name: "Zählerstandsprüfung",
              type: "SELECT",
              value: "STRICT",
              options: ["NONE", "BASIC", "STRICT"],
              impacts: [
                {
                  area: "Ablesung",
                  description: "Bestimmt Intensität der Plausibilitätsprüfungen",
                  severity: "HIGH"
                }
              ]
            }
          ]
        },
        {
          id: "BILLING",
          name: "Abrechnung",
          description: "Abrechnungsrelevante Einstellungen",
          settings: [
            {
              id: "BILLCYCLE",
              name: "Abrechnungszyklus",
              type: "INPUT",
              value: "12",
              impacts: [
                {
                  area: "Abrechnung",
                  description: "Standardintervall für Turnusabrechnung (Monate)",
                  severity: "MEDIUM"
                }
              ]
            },
            {
              id: "TOLERANCE",
              name: "Toleranz Verbrauchsabweichung",
              type: "INPUT",
              value: "20",
              impacts: [
                {
                  area: "Abrechnung",
                  description: "Maximale Abweichung in % vor Prüfprotokoll",
                  severity: "MEDIUM"
                }
              ]
            }
          ]
        }
      ]
    }
  ]);

  const [selectedNode, setSelectedNode] = useState<CustomizingNode | null>(null);
  const [impactLog, setImpactLog] = useState<string[]>([]);

  const handleSettingChange = (nodeId: string, settingId: string, newValue: string | boolean) => {
    const timestamp = new Date().toLocaleTimeString();
    
    // Update setting value
    setSpro(prevSpro => {
      const newSpro = JSON.parse(JSON.stringify(prevSpro)); // Deep clone
      const updateNode = (nodes: CustomizingNode[]) => {
        for (const node of nodes) {
          if (node.id === nodeId && node.settings) {
            const setting = node.settings.find(s => s.id === settingId);
            if (setting) {
              setting.value = newValue;
              // Log impacts
              setting.impacts.forEach(impact => {
                setImpactLog(prev => [
                  `[${timestamp}] ${impact.severity} Impact auf ${impact.area}: ${impact.description}`,
                  ...prev
                ]);
              });
            }
          }
          if (node.children) {
            updateNode(node.children);
          }
        }
      };
      updateNode(newSpro);
      return newSpro;
    });
  };

  const renderNode = (node: CustomizingNode) => (
    <div 
      key={node.id}
      className="mb-2"
    >
      <div 
        className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
        onClick={() => setSelectedNode(node)}
      >
        <h3 className="font-semibold">{node.name}</h3>
        <p className="text-sm text-gray-600">{node.description}</p>
      </div>
      {node.children && (
        <div className="ml-4 mt-2">
          {node.children.map(child => renderNode(child))}
        </div>
      )}
    </div>
  );

  const renderSetting = (setting: CustomizingSetting) => (
    <div key={setting.id} className="mb-4 p-4 bg-white rounded shadow-sm">
      <label className="block font-medium mb-2">{setting.name}</label>
      
      {setting.type === 'CHECKBOX' && (
        <input
          type="checkbox"
          checked={setting.value as boolean}
          onChange={e => handleSettingChange(selectedNode!.id, setting.id, e.target.checked)}
          className="rounded border-gray-300"
        />
      )}

      {setting.type === 'SELECT' && (
        <select
          value={setting.value as string}
          onChange={e => handleSettingChange(selectedNode!.id, setting.id, e.target.value)}
          className="border rounded p-1"
        >
          {setting.options?.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}

      {setting.type === 'INPUT' && (
        <input
          type="text"
          value={setting.value as string}
          onChange={e => handleSettingChange(selectedNode!.id, setting.id, e.target.value)}
          className="border rounded p-1"
        />
      )}

      <div className="mt-2">
        <p className="text-sm font-medium mb-1">Auswirkungen:</p>
        <ul className="text-sm space-y-1">
          {setting.impacts.map((impact, idx) => (
            <li 
              key={idx}
              className={`p-1 rounded ${
                impact.severity === 'HIGH' ? 'bg-red-50 text-red-700' :
                impact.severity === 'MEDIUM' ? 'bg-yellow-50 text-yellow-700' :
                'bg-blue-50 text-blue-700'
              }`}
            >
              {impact.area}: {impact.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* SPRO-Baum */}
      <div>
        <h2 className="text-xl font-bold mb-4">SPRO Navigation</h2>
        <div className="border rounded p-4">
          {spro.map(node => renderNode(node))}
        </div>
      </div>

      {/* Einstellungen und Impacts */}
      <div>
        {selectedNode?.settings ? (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Einstellungen: {selectedNode.name}
            </h2>
            <div className="space-y-4">
              {selectedNode.settings.map(setting => renderSetting(setting))}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded">
            <p>Wähle einen Knoten aus dem SPRO-Baum aus.</p>
          </div>
        )}

        {/* Impact Log */}
        {impactLog.length > 0 && (
          <div className="mt-6">
            <h3 className="font-bold mb-2">Änderungsprotokoll:</h3>
            <div className="bg-gray-50 p-4 rounded max-h-40 overflow-y-auto">
              {impactLog.map((log, idx) => (
                <p key={idx} className="text-sm mb-1">{log}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lernhinweise SPRO */}
      <div className="md:col-span-2 mt-6 p-4 bg-blue-50 rounded">
        <h4 className="font-bold">🎓 Lernhinweise (SPRO & Customizing):</h4>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>SPRO ist die Transaktion, mit der Administratoren und Berater das SAP-System konfigurieren. Es ist der zentrale Einstiegspunkt für alle Customizing-Aktivitäten. Die Haupttransaktion hierfür ist `SPRO`.</li>
          <li>Änderungen im Customizing haben oft weitreichende Auswirkungen auf das Systemverhalten. Es ist wichtig, die Zusammenhänge zu verstehen.</li>
          <li>Customizing-Einstellungen werden in der Regel in Entwicklungssystemen vorgenommen und dann über Transportaufträge (Transaktionen `SE09`, `SE10`) in Test- und Produktivsysteme (`STMS`) übertragen.</li>
          <li>Die Mandantenverwaltung (`SCC4`) legt fest, ob und wie Änderungen in einem Mandanten erlaubt sind.</li>
          <li>Berechtigungen für Customizing-Aktivitäten und den Zugriff auf Transaktionen werden über Rollen in der `PFCG` gesteuert.</li>
          <li>Viele Einstellungen, die hier simuliert werden (z.B. Spartensteuerung, Abrechnungszyklen), sind tief im SPRO-Pfad unter <i>SAP Utilities</i> zu finden. Beispielpfade könnten sein:
            <ul className="list-disc list-inside pl-4">
              <li><i>SAP Customizing Einführungsleitfaden - SAP Utilities - Grundeinstellungen - ...</i></li>
              <li><i>SAP Customizing Einführungsleitfaden - SAP Utilities - Geräteverwaltung - ...</i></li>
              <li><i>SAP Customizing Einführungsleitfaden - SAP Utilities - Vertragsabrechnung - ...</i></li>
            </ul>
          </li>
          <li>Es ist entscheidend, die Auswirkungen von Customizing-Änderungen sorgfältig zu testen und zu dokumentieren, bevor sie in produktive Umgebungen übernommen werden.</li>
        </ul>
      </div>
    </div>
  );
}

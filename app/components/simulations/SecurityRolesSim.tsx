import React, { useState } from 'react';

type Role = 'Administrator' | 'ISU_USER' | 'Read-Only User' | 'No Access';

interface SimulatedData {
  customerName: string;
  contractId: string;
  address: string;
  meterReading: string;
  billingAmount: string;
  paymentHistory: string;
}

const initialData: SimulatedData = {
  customerName: 'Erika Mustermann',
  contractId: 'V123456789',
  address: 'Musterstraße 1, 12345 Musterstadt',
  meterReading: '1578 kWh (Stand: 01.05.2025)',
  billingAmount: '€ 125,50',
  paymentHistory: 'Letzte Zahlung: € 120,00 am 15.04.2025',
};

const rolePermissions: Record<Role, Partial<Record<keyof SimulatedData, boolean>>> = {
  'Administrator': {
    customerName: true,
    contractId: true,
    address: true,
    meterReading: true,
    billingAmount: true,
    paymentHistory: true,
  },
  'ISU_USER': {
    customerName: true,
    contractId: true,
    address: true,
    meterReading: true,
    billingAmount: false, // Example: ISU_USER cannot see financial totals directly
    paymentHistory: false,
  },
  'Read-Only User': {
    customerName: true,
    contractId: true,
    address: false,
    meterReading: false,
    billingAmount: false,
    paymentHistory: false,
  },
  'No Access': {
    customerName: false,
    contractId: false,
    address: false,
    meterReading: false,
    billingAmount: false,
    paymentHistory: false,
  },
};

export const SecurityRolesSim: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<Role>('ISU_USER');
  const [showBapi, setShowBapi] = useState(false);

  const getVisibleData = () => {
    const permissions = rolePermissions[selectedRole];
    if (selectedRole === 'No Access') {
      return <p className="text-red-500 font-semibold">Kein Zugriff auf Daten mit dieser Rolle.</p>;
    }
    return Object.entries(initialData).map(([key, value]) => {
      if (permissions[key as keyof SimulatedData]) {
        return (
          <div key={key} className="py-1">
            <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
            <span>{value}</span>
          </div>
        );
      }
      return (
        <div key={key} className="py-1">
          <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
          <span className="text-gray-400 italic">Keine Berechtigung</span>
        </div>
      );
    });
  };

  const bapiExamplePFCG = `{
  "BAPI_USER_GET_DETAIL": {
    "USERNAME": "ISU_USER",
    "RETURN": {
      "ACTIVITYGROUPS": [
        { "AGR_NAME": "SAP_ISU_USER_COMPOSITE" },
        { "AGR_NAME": "Z_ISU_CUSTOM_DISPLAY" }
        // ... weitere Rollen / Profile
      ],
      "PROFILES": [
        { "PROFILE": "SAP_ALL" } // (Beispiel für Admin)
        // ... weitere Profile
      ]
    }
  },
  "BAPI_TRANSACTION_AUTHORITY_CHECK": {
    "TRANSACTION_CODE": "EA22 (Beleg anzeigen)",
    "RETURN": {
      "TYPE": "S", // 'S' = Success, 'E' = Error, 'A' = Abort
      "MESSAGE": "Berechtigungsprüfung erfolgreich"
    }
  }
}`;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Simulation: Sicherheit & Rollen</h2>

      <div className="mb-6 p-4 border rounded-md bg-blue-50">
        <h3 className="text-xl font-semibold mb-2 text-blue-700">Lernziele</h3>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Grundlegendes Verständnis von Rollen und Berechtigungen in SAP IS-U.</li>
          <li>Auswirkungen verschiedener Rollen auf die Datensichtbarkeit.</li>
          <li>Wichtige Transaktionen zur Benutzer- und Rollenverwaltung (z.B. SU01, PFCG).</li>
          <li>Beispielhafte BAPIs im Kontext von Benutzerberechtigungen.</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Rollenübersicht (Beispiele)</h3>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Administrator:</strong> Vollzugriff auf alle Daten und Funktionen. Typischerweise für Systembetreuung und Customizing.
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>ISU_USER (Sachbearbeiter):</strong> Zugriff auf abrechnungsrelevante Daten, Kundeninformationen und Prozesse. Eingeschränkte Berechtigungen für kritische Finanzdaten oder Systemänderungen. Dies ist eine häufig verwendete Standardrolle oder eine Basis für kundenindividuelle Rollen.
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Read-Only User (Anzeigebenutzer):</strong> Kann bestimmte Daten einsehen, aber keine Änderungen vornehmen. Nützlich für Reporting oder Support.
          </p>
          <p className="text-sm text-gray-600">
            <strong>Wichtige Transaktionen:</strong> SU01 (Benutzerpflege), PFCG (Rollenpflege).
          </p>
        </div>

        <div className="p-4 border rounded-md">
          <label htmlFor="role-select" className="block text-lg font-semibold mb-2 text-gray-800">
            Rolle auswählen:
          </label>
          <select
            id="role-select"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as Role)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Administrator">Administrator</option>
            <option value="ISU_USER">ISU_USER (Sachbearbeiter)</option>
            <option value="Read-Only User">Read-Only User (Anzeige)</option>
            <option value="No Access">Kein Zugriff</option>
          </select>
        </div>
      </div>

      <div className="mb-6 p-4 border rounded-md">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Simulierte Datensichtbarkeit für Rolle: <span className="text-blue-600">{selectedRole}</span></h3>
        <div className="text-sm text-gray-700 leading-relaxed">
          {getVisibleData()}
        </div>
      </div>

      <div className="p-4 border rounded-md">
        <button
          onClick={() => setShowBapi(!showBapi)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md mb-3"
        >
          {showBapi ? 'BAPI-Beispiele ausblenden' : 'BAPI-Beispiele anzeigen (PFCG & Berechtigungsprüfung)'}
        </button>
        {showBapi && (
          <div className="p-3 bg-gray-100 rounded-sm">
            <h4 className="text-md font-semibold mb-2 text-gray-700">BAPI-Beispiele (vereinfacht):</h4>
            <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
              <code>{bapiExamplePFCG}</code>
            </pre>
            <p className="mt-2 text-xs text-gray-600">
              Hinweis: Dies sind konzeptionelle Darstellungen. Echte BAPI-Aufrufe sind komplexer.
              BAPIs wie <code>BAPI_USER_GET_DETAIL</code> können Rollen und Profile eines Benutzers abrufen.
              <code>BAPI_TRANSACTION_AUTHORITY_CHECK</code> kann vor Ausführung einer Transaktion die Berechtigung prüfen.
            </p>
          </div>
        )}
      </div>
       <div className="mt-8 p-4 border rounded-md bg-yellow-50">
        <h3 className="text-xl font-semibold mb-2 text-yellow-800">Wichtige Hinweise</h3>
        <ul className="list-disc pl-5 text-sm text-yellow-700">
          <li>Die hier gezeigte Simulation ist stark vereinfacht. Das SAP-Berechtigungssystem ist sehr detailliert und basiert auf Berechtigungsobjekten, Feldern und Werten.</li>
          <li>Rollen werden in der Transaktion <code>PFCG</code> definiert und Benutzern in <code>SU01</code> zugewiesen.</li>
          <li>Eine typische Rolle wie <code>SAP_ISU_USER_COMPOSITE</code> ist eine Sammelrolle, die viele Einzelrollen für verschiedene Aufgabenbereiche enthält.</li>
          <li>Sicherheit umfasst auch Aspekte wie Datenschutz, Systemsicherheit und Zugriffskontrollen über verschiedene Ebenen.</li>
        </ul>
      </div>
    </div>
  );
};

export default SecurityRolesSim;


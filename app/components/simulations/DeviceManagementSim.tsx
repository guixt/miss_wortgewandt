import { useState } from 'react';

interface Device {
  id: string;
  type: 'ELEKTRO' | 'GAS' | 'WASSER';
  serialNumber: string;
  status: 'AKTIV' | 'AUSGEBAUT' | 'DEFEKT';
  location: string;
  lastReading?: number;
}

export function DeviceManagementSim() {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 'Z001',
      type: 'ELEKTRO',
      serialNumber: 'EL2025001',
      status: 'AKTIV',
      location: 'Hauptstraße 1',
      lastReading: 45280
    }
  ]);

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [newReading, setNewReading] = useState<string>('');

  const updateDeviceStatus = (deviceId: string, newStatus: Device['status']) => {
    setDevices(devices.map(device => 
      device.id === deviceId 
        ? { ...device, status: newStatus }
        : device
    ));
  };

  const addReading = (deviceId: string, reading: number) => {
    if (reading <= 0) {
      alert('Zählerstand muss größer als 0 sein');
      return;
    }

    const device = devices.find(d => d.id === deviceId);
    if (device && device.lastReading && reading < device.lastReading) {
      alert('Neuer Zählerstand kann nicht kleiner als der letzte sein');
      return;
    }

    setDevices(devices.map(device =>
      device.id === deviceId
        ? { ...device, lastReading: reading }
        : device
    ));
    setNewReading('');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Geräte-Simulator</h2>
      
      {/* Geräteliste */}
      <div className="mb-6">
        <h3 className="font-bold mb-2">Installierte Geräte:</h3>
        <div className="space-y-2">
          {devices.map(device => (
            <div 
              key={device.id}
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedDevice(device)}
            >
              <div className="flex justify-between">
                <span>Zähler {device.id} ({device.type})</span>
                <span className={`px-2 rounded ${
                  device.status === 'AKTIV' ? 'bg-green-100 text-green-800' :
                  device.status === 'DEFEKT' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100'
                }`}>
                  {device.status}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                SN: {device.serialNumber} | Standort: {device.location}
              </div>
              <div className="text-sm">
                Letzter Zählerstand: {device.lastReading || 'Keine Ablesung'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aktionen für ausgewähltes Gerät */}
      {selectedDevice && (
        <div className="border-t pt-4">
          <h3 className="font-bold mb-2">Aktionen für Zähler {selectedDevice.id}:</h3>
          
          <div className="space-y-4">
            {/* Statusänderung */}
            <div>
              <label className="block mb-2">Status ändern:</label>
              <select 
                value={selectedDevice.status}
                onChange={(e) => updateDeviceStatus(selectedDevice.id, e.target.value as Device['status'])}
                className="border p-2 rounded"
              >
                <option value="AKTIV">AKTIV</option>
                <option value="AUSGEBAUT">AUSGEBAUT</option>
                <option value="DEFEKT">DEFEKT</option>
              </select>
            </div>

            {/* Zählerstand erfassen */}
            <div>
              <label className="block mb-2">Neuer Zählerstand:</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newReading}
                  onChange={(e) => setNewReading(e.target.value)}
                  className="border p-2 rounded"
                  placeholder="Zählerstand eingeben"
                />
                <button
                  onClick={() => addReading(selectedDevice.id, Number(newReading))}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Erfassen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded">
          <h4 className="font-bold">🎓 Lernhinweise:</h4>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Ein Zähler kann verschiedene Status haben: AKTIV, AUSGEBAUT oder DEFEKT (Transaktion: `IQ02`/`IQ03` - Geräte anzeigen/ändern)</li>
            <li>Neue Zählerstände müssen immer höher sein als der letzte erfasste Stand (Transaktion: `EL28` - Ableseerfassung)</li>
            <li>Die Zählernummer (hier: {devices[0].id}) ist im IS-U ein wichtiges Merkmal zur Identifikation.</li>
            <li>Der technische Platz (hier: {devices[0].location}) gibt den Einbauort des Zählers an (Transaktion: `IL03` - Technischen Platz anzeigen).</li>
            <li>Wichtige SAP-Transaktionen (Geräteverwaltung): `EG30` (Einbau), `EG31` (Ausbau), `EG32` (Wechsel), `IQ01` (Anlegen), `IQ08` (Suchen), `EL01` (Ableseeinheit), `EL18` (Ableseaufträge).</li>
            <li>Customizing-Pfade (SPRO, beispielhaft): SAP Utilities - Geräteverwaltung - Stammdaten / Einbau/Ausbau/Wechsel.</li>
          </ul>
        </div>
    </div>
  );
}

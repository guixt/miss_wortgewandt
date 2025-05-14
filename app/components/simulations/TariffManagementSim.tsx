import { useState } from 'react';

interface Tariff {
  id: string;
  name: string;
  type: 'VERBRAUCH' | 'GRUNDPREIS' | 'STAFFEL';
  validFrom: string;
  validTo: string;
  prices: {
    value: number;
    unit: string;
    fromAmount?: number;
    toAmount?: number;
  }[];
}

interface PriceCalculation {
  consumption: number;
  selectedTariffs: string[];
  totalPrice: number;
  breakdown: {
    tariffId: string;
    amount: number;
    description: string;
  }[];
}

export function TariffManagementSim() {
  const [tariffs, setTariffs] = useState<Tariff[]>([
    {
      id: "T001",
      name: "Arbeitspreis Strom Basic",
      type: "VERBRAUCH",
      validFrom: "2025-01-01",
      validTo: "2025-12-31",
      prices: [{ value: 0.35, unit: "€/kWh" }]
    },
    {
      id: "T002",
      name: "Grundpreis Strom Basic",
      type: "GRUNDPREIS",
      validFrom: "2025-01-01",
      validTo: "2025-12-31",
      prices: [{ value: 12.50, unit: "€/Monat" }]
    },
    {
      id: "T003",
      name: "Staffelpreis Großkunden",
      type: "STAFFEL",
      validFrom: "2025-01-01",
      validTo: "2025-12-31",
      prices: [
        { value: 0.32, unit: "€/kWh", fromAmount: 0, toAmount: 10000 },
        { value: 0.30, unit: "€/kWh", fromAmount: 10001, toAmount: 50000 },
        { value: 0.28, unit: "€/kWh", fromAmount: 50001, toAmount: undefined }
      ]
    }
  ]);

  const [newTariff, setNewTariff] = useState<Partial<Tariff>>({
    type: "VERBRAUCH",
    validFrom: "2025-01-01",
    validTo: "2025-12-31",
    prices: [{ value: 0, unit: "€/kWh" }]
  });

  const [calculation, setCalculation] = useState<PriceCalculation>({
    consumption: 4000,
    selectedTariffs: ["T001", "T002"],
    totalPrice: 0,
    breakdown: []
  });

  const calculatePrice = () => {
    const breakdown: PriceCalculation['breakdown'] = [];
    let totalPrice = 0;

    for (const tariffId of calculation.selectedTariffs) {
      const tariff = tariffs.find(t => t.id === tariffId);
      if (!tariff) continue;

      switch (tariff.type) {
        case "VERBRAUCH":
          const consumptionPrice = tariff.prices[0].value * calculation.consumption;
          totalPrice += consumptionPrice;
          breakdown.push({
            tariffId: tariff.id,
            amount: consumptionPrice,
            description: `${calculation.consumption} kWh × ${tariff.prices[0].value} €/kWh`
          });
          break;

        case "GRUNDPREIS":
          const monthlyPrice = tariff.prices[0].value;
          totalPrice += monthlyPrice;
          breakdown.push({
            tariffId: tariff.id,
            amount: monthlyPrice,
            description: `Grundpreis: ${monthlyPrice} € pro Monat`
          });
          break;

        case "STAFFEL":
          let remainingConsumption = calculation.consumption;
          let staffelPrice = 0;
          let staffelDescription = [];

          for (const price of tariff.prices) {
            const fromAmount = price.fromAmount || 0;
            const toAmount = price.toAmount || Infinity;
            const consumptionInStaffel = Math.min(
              Math.max(0, remainingConsumption),
              toAmount - fromAmount
            );

            if (consumptionInStaffel > 0) {
              const priceForStaffel = consumptionInStaffel * price.value;
              staffelPrice += priceForStaffel;
              staffelDescription.push(
                `${consumptionInStaffel} kWh × ${price.value} €/kWh (${fromAmount}-${toAmount === Infinity ? '∞' : toAmount} kWh)`
              );
              remainingConsumption -= consumptionInStaffel;
            }
          }

          totalPrice += staffelPrice;
          breakdown.push({
            tariffId: tariff.id,
            amount: staffelPrice,
            description: staffelDescription.join('\n')
          });
          break;
      }
    }

    setCalculation(prev => ({
      ...prev,
      totalPrice,
      breakdown
    }));
  };

  const addTariff = () => {
    if (!newTariff.name || !newTariff.type) return;

    const tariff: Tariff = {
      id: `T${(tariffs.length + 1).toString().padStart(3, '0')}`,
      name: newTariff.name,
      type: newTariff.type,
      validFrom: newTariff.validFrom || "2025-01-01",
      validTo: newTariff.validTo || "2025-12-31",
      prices: newTariff.prices || [{ value: 0, unit: "€/kWh" }]
    };

    setTariffs([...tariffs, tariff]);
    setNewTariff({
      type: "VERBRAUCH",
      validFrom: "2025-01-01",
      validTo: "2025-12-31",
      prices: [{ value: 0, unit: "€/kWh" }]
    });
  };

  return (
    <div className="space-y-8">
      {/* Tarifübersicht */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Verfügbare Tarife</h2>
        <div className="space-y-4">
          {tariffs.map(tariff => (
            <div key={tariff.id} className="p-4 border rounded">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{tariff.name}</h3>
                  <p className="text-sm text-gray-600">
                    {tariff.type} | Gültig: {tariff.validFrom} bis {tariff.validTo}
                  </p>
                </div>
                <div className="text-right">
                  {tariff.prices.map((price, idx) => (
                    <p key={idx} className="text-sm">
                      {price.value} {price.unit}
                      {price.fromAmount !== undefined && ` (${price.fromAmount}-${price.toAmount || '∞'} kWh)`}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preisberechnung */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Preisberechnung</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Verbrauch (kWh)</label>
            <input
              type="number"
              value={calculation.consumption}
              onChange={e => setCalculation(prev => ({ ...prev, consumption: Number(e.target.value) }))}
              className="border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tarife auswählen</label>
            {tariffs.map(tariff => (
              <label key={tariff.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={calculation.selectedTariffs.includes(tariff.id)}
                  onChange={e => {
                    const newSelection = e.target.checked
                      ? [...calculation.selectedTariffs, tariff.id]
                      : calculation.selectedTariffs.filter(id => id !== tariff.id);
                    setCalculation(prev => ({ ...prev, selectedTariffs: newSelection }));
                  }}
                />
                <span>{tariff.name}</span>
              </label>
            ))}
          </div>

          <button
            onClick={calculatePrice}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Preis berechnen
          </button>

          {calculation.breakdown.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold mb-2">Preisaufschlüsselung:</h3>
              {calculation.breakdown.map((item, idx) => (
                <div key={idx} className="mb-2">
                  <p className="text-sm">
                    {tariffs.find(t => t.id === item.tariffId)?.name}:
                  </p>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {item.description}
                  </p>
                  <p className="text-sm font-semibold">
                    = {item.amount.toFixed(2)} €
                  </p>
                </div>
              ))}
              <div className="mt-4 pt-2 border-t">
                <p className="font-bold">
                  Gesamtpreis: {calculation.totalPrice.toFixed(2)} €
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h4 className="font-bold">🎓 Lernhinweise:</h4>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>In IS-U gibt es verschiedene Tarifarten: Verbrauchspreise, Grundpreise und Staffelpreise</li>
          <li>Jeder Tarif hat einen Gültigkeitszeitraum</li>
          <li>Staffelpreise ermöglichen unterschiedliche Preise je nach Verbrauchsmenge</li>
          <li>Die Preisfindung berücksichtigt alle aktiven Tarife und berechnet den Gesamtpreis</li>
        </ul>
      </div>
    </div>
  );
}

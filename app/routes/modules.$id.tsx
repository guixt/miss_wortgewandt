import { useParams } from "react-router";
import modules from "../data/modules";
import { DeviceManagementSim } from "../components/simulations/DeviceManagementSim";
import { TariffManagementSim } from "../components/simulations/TariffManagementSim";
import { CustomizingSim } from "../components/simulations/CustomizingSim";
import { BillingSimulation } from "../components/simulations/BillingSimulation";

export default function ModuleDetail() {
  const { id } = useParams();
  const module = modules.find((m) => m.id === id);

  if (!module) return <p>Modul nicht gefunden.</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{module.title}</h1>
        <p className="text-gray-600">{module.description}</p>
      </div>

      {/* Simulation basierend auf Modul-ID laden */}
      {id === 'devices' && <DeviceManagementSim />}
      {id === 'tariffs' && <TariffManagementSim />}
      {id === 'customizing' && <CustomizingSim />}
      {id === 'billing' && <BillingSimulation />}
      {id !== 'devices' && id !== 'tariffs' && id !== 'customizing' && id !== 'billing' && (
        <div className="p-4 bg-yellow-50 rounded">
          <p><i>Die Simulation für dieses Modul wird bald verfügbar sein! 🚧</i></p>
        </div>
      )}
    </div>
  );
}

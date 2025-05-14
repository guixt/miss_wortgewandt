import { useParams } from "react-router";
import modules from "../data/modules";
import { DeviceManagementSim } from "../components/simulations/DeviceManagementSim";
import { TariffManagementSim } from "../components/simulations/TariffManagementSim";
import { CustomizingSim } from "../components/simulations/CustomizingSim";
import { BillingSimulation } from "../components/simulations/BillingSimulation";
import { MarketCommunicationSim } from "../components/simulations/MarketCommunicationSim";
import { ProcessStatusSim } from "../components/simulations/ProcessStatusSim";
import { InvoicingAccountingSim } from "../components/simulations/InvoicingAccountingSim";
import { SecurityRolesSim } from "../components/simulations/SecurityRolesSim";
import { TariffDisturbanceMission } from "../components/missions/TariffDisturbanceMission";
import { IntercompanyTroubleshootingSim } from "../components/simulations/IntercompanyTroubleshootingSim";

export default function ModuleDetail() {
  const { id } = useParams();
  const module = modules.find((m) => m.id === id);

  if (!module) {
    return <div className="p-4 text-red-500">Modul nicht gefunden.</div>;
  }

  const renderModuleContent = () => {
    if (module.type === 'mission') {
      switch (module.id) {
        case 'mission-tariff-disturbance':
          return <TariffDisturbanceMission />;
        // Add other missions here in the future
        default:
          return <div className="p-4 bg-yellow-50 rounded"><p><i>Diese Consulting Mission wird bald verfügbar sein! 🚧</i></p></div>;
      }
    } else if (module.type === 'simulation') {
      switch (module.id) {
        case 'devices':
          return <DeviceManagementSim />;
        case 'tariffs':
          return <TariffManagementSim />;
        case 'customizing':
          return <CustomizingSim />;
        case 'billing':
          return <BillingSimulation />;
        case 'marketcomm':
          return <MarketCommunicationSim />;
        case 'processes':
          return <ProcessStatusSim />;
        case 'invoicingaccounting':
          return <InvoicingAccountingSim />;
        case 'securityroles':
          return <SecurityRolesSim />;
        case 'intercompany-troubleshooting':
          return <IntercompanyTroubleshootingSim />;
        default:
          return <div className="p-4 bg-yellow-50 rounded"><p><i>Die Simulation für dieses Modul wird bald verfügbar sein! 🚧</i></p></div>;
      }
    } else {
        return <div className="p-4 bg-yellow-50 rounded"><p><i>Unbekannter Modultyp! 🚧</i></p></div>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{module.title}</h1>
        <p className="text-gray-600">{module.description}</p>
      </div>
      {renderModuleContent()}
    </div>
  );
}

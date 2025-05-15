import { useParams } from "react-router-dom";
import modules from "../data/modules";
import Rituale from "../components/planung/Rituale";
import Ablauf from "../components/planung/Ablauf";
import Reden from "../components/planung/Reden";
import Gaeste from "../components/planung/Gaeste";
import Musik from "../components/planung/Musik";
import Checklisten from "../components/planung/Checklisten";
import Budget from "../components/planung/Budget";
import Wuensche from "../components/planung/Wuensche";

export default function ModuleDetail() {
  const { id } = useParams();
  const module = modules.find((m) => m.id === id);

  if (!module) {
    return <div className="p-4 text-red-500">Modul nicht gefunden.</div>;
  }

  const renderModuleContent = () => {
    switch (module.id) {
      case "rituale":
        return <Rituale />;
      case "ablauf":
        return <Ablauf />;
      case "reden":
        return <Reden />;
      case "gaeste":
        return <Gaeste />;
      case "musik":
        return <Musik />;
      case "checklisten":
        return <Checklisten />;
      case "budget":
        return <Budget />;
      case "wuensche":
        return <Wuensche />;
      default:
        return <div className="p-4 bg-yellow-50 rounded"><p><i>Dieses Modul wird bald verfügbar sein! 🚧</i></p></div>;
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

import React from 'react';

interface Choice {
  label: string;
  effect?: string; // Optional: To describe the outcome or hint
  action?: () => void; // Optional: Function to execute when choice is made
  nextStepId?: string; // Optional: To navigate to a specific next step
}

export interface MissionStepProps {
  title: string;
  description: string | React.ReactNode;
  choices?: Choice[];
  simulateTransaktionswahl?: string[]; // e.g. ["EA00", "ES30", "SPRO"]
  onChoiceMade?: (choice: Choice) => void; // Callback when a choice is made
  isCurrentStep?: boolean; // Injected by ConsultingMission
  stepId: string;
}

export const MissionStep: React.FC<MissionStepProps> = ({ 
  title, 
  description, 
  choices, 
  simulateTransaktionswahl, 
  onChoiceMade, 
  isCurrentStep,
  stepId 
}) => {
  if (!isCurrentStep) {
    return null; // Don't render if not the current step
  }

  return (
    <div id={stepId} className="mb-8 p-6 bg-white shadow-lg rounded-lg border border-blue-200">
      <h3 className="text-2xl font-semibold text-blue-700 mb-3">{title}</h3>
      {typeof description === 'string' ? <p className="text-gray-700 mb-4 leading-relaxed">{description}</p> : description}

      {choices && choices.length > 0 && (
        <div className="mt-4">
          <p className="text-md font-semibold text-gray-800 mb-2">Deine Optionen:</p>
          <div className="space-y-2">
            {choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => {
                  if (choice.action) choice.action();
                  if (onChoiceMade) onChoiceMade(choice);
                }}
                className="w-full text-left p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {choice.label}
                {choice.effect && <span className="block text-xs text-blue-200 mt-1"><em>Wirkung: {choice.effect}</em></span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {simulateTransaktionswahl && simulateTransaktionswahl.length > 0 && (
        <div className="mt-6">
          <p className="text-md font-semibold text-gray-800 mb-2">Verfügbare Aktionen/Transaktionen (Simulation):</p>
          <div className="flex flex-wrap gap-2">
            {simulateTransaktionswahl.map((tcode, index) => (
              <button
                key={index}
                onClick={() => {
                  // Here you would typically navigate to a simulated transaction view
                  // For now, let's just log it or pass it to a handler via onChoiceMade
                  if (onChoiceMade) onChoiceMade({ label: tcode, action: () => console.log(`Simulate T-Code: ${tcode}`) });
                }}
                className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm"
              >
                {tcode}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import type { ReactNode, ReactElement } from 'react';
import { type MissionStepProps } from './MissionStep'; // Import the actual MissionStepProps

interface ConsultingMissionProps {
  title: string;
  difficulty: 'einfach' | 'mittel' | 'schwer';
  children: ReactElement<MissionStepProps>[] | ReactElement<MissionStepProps>;
  learningObjectives: string[];
}

export const ConsultingMission: React.FC<ConsultingMissionProps> = ({ title, difficulty, children, learningObjectives }) => {
  const steps = React.Children.toArray(children) as ReactElement<MissionStepProps>[];
  const [currentStepId, setCurrentStepId] = useState<string>(steps[0]?.props.stepId || 'initial-step-id'); // Ensure a valid initial stepId
  const [missionLog, setMissionLog] = useState<string[]>([]); // To log decisions and outcomes

  const handleChoiceMade = (choice: { label: string; effect?: string; nextStepId?: string }) => {
    const logEntry = `Entscheidung: "${choice.label}"${choice.effect ? ", Wirkung: " + choice.effect : ''}`;
    setMissionLog(prevLog => [...prevLog, logEntry]);
    if (choice.nextStepId) {
      setCurrentStepId(choice.nextStepId);
    } else {
      // Default: advance to the next step in order if no specific nextStepId is provided
      const currentStepIndex = steps.findIndex(step => step.props.stepId === currentStepId);
      if (currentStepIndex !== -1 && currentStepIndex < steps.length - 1) {
        setCurrentStepId(steps[currentStepIndex + 1].props.stepId);
      }
    }
  };

  const difficultyBadge = () => {
    switch (difficulty) {
      case 'einfach': return 'bg-green-100 text-green-800';
      case 'mittel': return 'bg-yellow-100 text-yellow-800';
      case 'schwer': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-slate-50 to-sky-100 min-h-screen">
      <header className="mb-8 p-6 bg-white shadow-xl rounded-lg border-t-4 border-blue-600">
        <h1 className="text-4xl font-bold text-blue-800 mb-2">{title}</h1>
        <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${difficultyBadge()}`}>
          Schwierigkeit: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>
      </header>

      <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">Lernziele dieser Mission:</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {learningObjectives.map((obj, index) => (
            <li key={index}>{obj}</li>
          ))}
        </ul>
      </div>

      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { // child is already ReactElement<MissionStepProps>
            onChoiceMade: handleChoiceMade,
            isCurrentStep: child.props.stepId === currentStepId,
          });
        }
        return child;
      })}

      {missionLog.length > 0 && (
        <div className="mt-10 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Missionslogbuch:</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {missionLog.map((entry, index) => (
              <li key={index}>{entry}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

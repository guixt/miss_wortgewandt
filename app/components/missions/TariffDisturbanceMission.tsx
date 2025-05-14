import React from 'react';
import { ConsultingMission } from './ConsultingMission';
import { MissionStep } from './MissionStep';

const learningObjectivesTariff = [
  "Verstehen, wie Kundenanfragen zu Tarifproblemen typischerweise eingehen.",
  "Erste Analyseschritte im SAP IS-U System bei Tarifstörungen kennenlernen.",
  "Relevante Transaktionen für die Tarif- und Abrechnungsanalyse identifizieren.",
  "Grundlagen der Kommunikation mit dem Kunden in einem Consulting-Projekt üben.",
  "Verstehen, wie Customizing-Einstellungen die Tarifabrechnung beeinflussen können (Überblick)."
];

export const TariffDisturbanceMission: React.FC = () => {
  return (
    <ConsultingMission 
      title="Consulting Mission 01: Die Tarifstörung"
      difficulty="einfach"
      learningObjectives={learningObjectivesTariff}
    >
      <MissionStep
        stepId="step1-contact"
        title="Phase 1: 📞 Auftragsannahme"
        description={
          <>
            <p className="mb-2">Ein besorgter Anruf erreicht dich von Herrn Maier, dem Leiter der Abrechnungsabteilung der Stadtwerke Neustadt:</p>
            <blockquote className="p-3 my-2 bg-gray-100 border-l-4 border-gray-400 italic">
              "Guten Tag! Wir haben hier ein dringendes Problem. Seit der letzten Tarifumstellung scheinen einige unserer Rechnungen für Industriekunden nicht mehr zu stimmen. Die Beträge sind viel zu niedrig! Können Sie uns da schnellstmöglich helfen? Unsere Kunden beschweren sich schon."
            </blockquote>
            <p>Wie reagierst du auf diesen Anruf?</p>
          </>
        }
        choices={[
          { label: "Sofortige Beruhigung und Terminvereinbarung für Analyse anbieten.", effect: "Kunde fühlt sich ernst genommen, Vertrauen steigt.", nextStepId: "step2-analysis-prep" },
          { label: "Nach Details fragen und versuchen, das Problem direkt am Telefon zu lösen.", effect: "Riskant ohne Systemzugriff, könnte zu falschen Annahmen führen.", nextStepId: "step1-contact-detailtrap" },
          { label: "Eine E-Mail mit einer Checkliste anfordern, bevor ein Termin gemacht wird.", effect: "Könnte als bürokratisch und wenig hilfsbereit empfunden werden.", nextStepId: "step1-contact-mailfirst" },
        ]}
      />

      <MissionStep
        stepId="step1-contact-detailtrap"
        title="Phase 1: 📞 Auftragsannahme - Detailfalle"
        description={
          <>
            <p className="mb-2">Du versuchst, am Telefon mehr Details zu erfragen. Herr Maier wird ungeduldiger:</p>
            <blockquote className="p-3 my-2 bg-red-50 border-l-4 border-red-400 italic">
              "Hören Sie, ich bin kein SAP-Experte! Ich weiß nur, dass die Rechnungen falsch sind. Wir brauchen jemanden, der sich das bei uns im System ansieht!"
            </blockquote>
            <p>Das Gespräch endet etwas angespannt. Was ist dein nächster Schritt?</p>
          </>
        }
        choices={[
          { label: "Entschuldigen und umgehend einen Termin vor Ort anbieten.", effect: "Schadensbegrenzung, zurück zum professionellen Vorgehen.", nextStepId: "step2-analysis-prep" },
          { label: "Auflegen und hoffen, dass er sich beruhigt.", effect: "Sehr unprofessionell, gefährdet den Auftrag.", nextStepId: "step-mission-failed" },
        ]}
      />

      <MissionStep
        stepId="step1-contact-mailfirst"
        title="Phase 1: 📞 Auftragsannahme - E-Mail Zuerst"
        description={
          <>
            <p className="mb-2">Du bittest Herrn Maier, dir zuerst eine E-Mail mit allen Details und Beispielen zu schicken. Er klingt enttäuscht:</p>
            <blockquote className="p-3 my-2 bg-yellow-50 border-l-4 border-yellow-400 italic">
              "Eine E-Mail? Ich dachte, Sie helfen uns schnell. Na gut, dann schicke ich Ihnen was, aber das dauert dann wieder..."
            </blockquote>
            <p>Du erhältst später eine lückenhafte E-Mail. Das Projekt startet mit Verzögerung und einer leicht getrübten Kundenstimmung.</p>
          </>
        }
        choices={[
          { label: "Trotzdem proaktiv anrufen und einen baldigen Termin vorschlagen.", effect: "Versuch, das Ruder herumzureißen und Engagement zu zeigen.", nextStepId: "step2-analysis-prep" },
          { label: "Abwarten, bis alle angeforderten Infos per Mail da sind.", effect: "Passiv, verstärkt den negativen ersten Eindruck.", nextStepId: "step-mission-delayed" },
        ]}
      />

      <MissionStep
        stepId="step2-analysis-prep"
        title="Phase 2: 🕵️‍♂️ Vorbereitung & Erste Analyse (vor Ort/Remote)"
        description={
          <>
            <p className="mb-2">Die Stadtwerke Neustadt haben dir einen Systemzugang zum Entwicklungs- oder Testsystem (Mandant 100) eingerichtet und Beispielfälle genannt (z.B. Vertrag 4711, Belegnummer 987654). Du beginnst deine Analyse.</p>
            <p className="font-semibold">Wo fängst du an zu suchen, um das Problem der zu niedrigen Rechnungsbeträge einzugrenzen?</p>
          </>
        }
        simulateTransaktionswahl={["EA00 (Abrechnungssimulation)", "ES30/ES32 (Tarifdaten)", "EA22 (Beleganzeige)", "SPRO (Customizing)", "Kundenspezifische Tabellen (SE16N)"]}
        // Hier könnten choices später auf spezifische T-Codes oder Analysepfade verweisen, die zum nächsten Schritt führen
        // Fürs Erste dient simulateTransaktionswahl als Interaktion
         choices={[
          { label: "Mit EA00 die Abrechnung für einen betroffenen Vertrag simulieren.", effect: "Guter Startpunkt, um die Abrechnungsergebnisse nachzuvollziehen.", nextStepId: "step3-transaction-analysis" },
          { label: "In ES32 die Tarifstruktur und Operanden des betroffenen Tarifs prüfen.", effect: "Wichtig, um Fehler in der Tarifdefinition zu finden.", nextStepId: "step3-transaction-analysis" },
          { label: "Einen existierenden, falschen Beleg mit EA22 im Detail ansehen.", effect: "Hilft, die Auswirkungen des Fehlers zu verstehen und betroffene Komponenten zu identifizieren.", nextStepId: "step3-transaction-analysis" },
          { label: "Direkt im SPRO nach kürzlich geänderten Customizing-Objekten suchen.", effect: "Kann relevant sein, ist aber oft nicht der erste Schritt ohne genauere Hinweise.", nextStepId: "step3-transaction-analysis-spro" }
        ]}
      />

      <MissionStep
        stepId="step3-transaction-analysis"
        title="Phase 3: 🔍 Transaktionsanalyse (Platzhalter)"
        description="Hier würdest du nun tiefer in die ausgewählten Transaktionen eintauchen, Daten analysieren und nach der Ursache forschen. Diese Simulation wird in Kürze erweitert."
        choices={[
          { label: "Weiter zur nächsten Phase (Berichterstellung - vereinfacht)", nextStepId: "step4-reporting-intro" }
        ]}
      />

       <MissionStep
        stepId="step3-transaction-analysis-spro"
        title="Phase 3: 🔍 Transaktionsanalyse - SPRO Fokus"
        description={
        <>
            <p className="mb-2">Du entscheidest dich, direkt im SPRO nach Änderungen zu suchen. Das kann manchmal wie die Suche nach der Nadel im Heuhaufen sein, wenn man nicht genau weiß, wonach man sucht.</p>
            <p className="mb-2">Nach einiger Zeit findest du tatsächlich eine kürzlich geänderte Preiseinstellung in der Preisfindung, die verdächtig aussieht. Es scheint, als wäre ein Konditionssatz falsch abgegrenzt worden.</p>
            <p className="font-semibold">Dieser Fund ist vielversprechend!</p>
        </>
        }
        choices={[
          { label: "Diese Customizing-Einstellung genauer untersuchen.", nextStepId: "step4-customizing-check" }
        ]}
      />

      <MissionStep
        stepId="step4-customizing-check"
        title="Phase 4: 🛠️ Customizing prüfen (Beispiel)"
        description={
          <>
            <p className="mb-2">Du hast eine verdächtige Einstellung in der Preisfindung (z.B. Transaktion <code className='bg-gray-200 px-1 rounded'>EA87</code> - Konditionssätze pflegen oder ein ähnlicher SPRO-Pfad) gefunden. Angenommen, ein Mengenrabatt wird falsch berechnet, weil die Gültigkeitsdaten eines Konditionssatzes nicht zur Tarifumstellung passen.</p>
            <p className="font-semibold">Simulierte Darstellung des Problems:</p>
            <div className="p-3 my-2 bg-yellow-50 border border-yellow-300 rounded-md">
              <p><strong>Konditionssatz ZXR01 (Mengenrabatt Industriekunden)</strong></p>
              <p>Alter Satz (bis 31.12.Vorjahr): -0,02 €/kWh ab 100.000 kWh</p>
              <p className="text-red-600 font-bold">Neuer Satz (ab 01.01.Laufendes Jahr): -0.002 €/kWh ab 100.000 kWh (Fehler: eine Null zu viel!)</p>
            </div>
            <p>Dieser Tippfehler führt zu einem viel zu geringen Rabatt und somit zu niedrigen Rechnungsbeträgen.</p>
          </>
        }
        choices={[
          { label: "Problem identifiziert! Nächster Schritt: Bericht und Lösungsvorschlag.", nextStepId: "step5-reporting-intro" }
        ]}
      />

      <MissionStep
        stepId="step5-reporting-intro"
        title="Phase 5: 💡 Bericht erstellen & Lösung präsentieren (Vereinfacht)"
        description="Normalerweise würdest du jetzt einen detaillierten Bericht mit deinen Ergebnissen, der Ursachenanalyse und einem Lösungsvorschlag (inkl. Testplan) erstellen und dies dem Kunden präsentieren. Für diese Simulation halten wir es einfach."
        choices={[
          { label: "Lösung implementieren (Simulation)", nextStepId: "step6-implementation" }
        ]}
      />

      <MissionStep
        stepId="step6-implementation"
        title="Phase 6: ✅ Lösung implementieren & Testen (Simulation)"
        description={
          <>
            <p className="mb-2">Du hast die fehlerhafte Customizing-Einstellung (den Tippfehler im Konditionssatz) im Entwicklungssystem korrigiert und die Änderung in einen Transportauftrag aufgezeichnet.</p>
            <p className="mb-2">Nach dem Transport ins Test-/Qualitätssicherungssystem führst du erneut eine Abrechnungssimulation (z.B. mit <code className='bg-gray-200 px-1 rounded'>EA00</code>) für die betroffenen Verträge durch.</p>
            <p className="font-semibold text-green-600">Ergebnis: Die Rechnungsbeträge sind jetzt korrekt!</p>
            <p>Du informierst Herrn Maier über die erfolgreiche Korrektur und die nächsten Schritte (Transport ins Produktivsystem, ggf. Nachberechnungslauf).</p>
          </>
        }
        choices={[
          { label: "Mission erfolgreich abgeschlossen!", nextStepId: "step-mission-success" }
        ]}
      />

      <MissionStep
        stepId="step-mission-success"
        title="🎉 Mission Erfolgreich!"
        description={
          <>
            <p className="text-xl font-semibold text-green-700 mb-3">Herzlichen Glückwunsch!</p>
            <p>Du hast die Tarifstörung erfolgreich analysiert, die Ursache im Customizing gefunden und die Lösung simuliert. Herr Maier ist sehr zufrieden mit deiner schnellen und kompetenten Hilfe.</p>
            <p className="mt-4">Du hast wichtige Aspekte der Consultant-Tätigkeit durchlaufen:</p>
            <ul className="list-disc list-inside pl-4 mt-2 text-gray-700">
              <li>Kundenkommunikation und Auftragsannahme</li>
              <li>Systematische Analyse im SAP IS-U System</li>
              <li>Identifikation von Fehlern im Customizing</li>
              <li>Präsentation und Implementierung einer Lösung</li>
            </ul>
            <p className="mt-3">Diese Mission hat dir einen ersten Einblick gegeben. Echte Projekte können natürlich komplexer sein und erfordern tiefere Kenntnisse und mehr Interaktion.</p>
          </>
        }
        choices={[
          { label: "Zurück zur Modulübersicht", action: () => window.location.href = '/modules' } // Simple navigation for now
        ]}
      />
       <MissionStep
        stepId="step-mission-failed"
        title="🤕 Mission Gescheitert"
        description={
          <>
            <p className="text-xl font-semibold text-red-700 mb-3">Schade!</p>
            <p>Leider konnte diese Mission nicht erfolgreich abgeschlossen werden. Deine Herangehensweise hat zu Problemen mit dem Kunden oder zu keinem Ergebnis geführt.</p>
            <p className="mt-4">Nutze dies als Lernerfahrung. Überlege, welche Entscheidungen zu diesem Ergebnis geführt haben und wie du es beim nächsten Mal besser machen könntest.</p>
            <p className="mt-3 font-semibold">Wichtige Aspekte im Consulting sind:</p>
            <ul className="list-disc list-inside pl-4 mt-2 text-gray-700">
              <li>Professionelle und klare Kundenkommunikation</li>
              <li>Systematisches und logisches Vorgehen bei der Analyse</li>
              <li>Geduld und die Fähigkeit, auch bei Rückschlägen dranzubleiben</li>
            </ul>
          </>
        }
        choices={[
          { label: "Mission neu starten", nextStepId: "step1-contact" },
          { label: "Zurück zur Modulübersicht", action: () => window.location.href = '/modules' }
        ]}
      />
       <MissionStep
        stepId="step-mission-delayed"
        title="⏳ Mission Verzögert"
        description={
          <>
            <p className="text-xl font-semibold text-yellow-700 mb-3">Mission Verzögert...</p>
            <p>Durch die anfänglichen Kommunikationsschwierigkeiten hat sich der Start der Analyse verzögert und die Kundenstimmung ist nicht optimal. Dennoch ist die Mission noch nicht verloren!</p>
            <p className="mt-4">Versuche, durch proaktives Handeln und eine gründliche Analyse das Vertrauen des Kunden zurückzugewinnen.</p>
          </>
        }
        choices={[
          { label: "Weiter mit der Analysevorbereitung", nextStepId: "step2-analysis-prep" },
          { label: "Zurück zur Modulübersicht", action: () => window.location.href = '/modules' }
        ]}
      />

    </ConsultingMission>
  );
};

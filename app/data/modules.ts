const modules = [
  { id: "devices", title: "Geräteverwaltung", description: "Zähler, technische Plätze, Gerätestammdaten", type: 'simulation' },
  { id: "tariffs", title: "Tarife & Preise", description: "Verbrauchspreise, Staffelungen, Tarife", type: 'simulation' },
  { id: "billing", title: "Abrechnung", description: "Wie IS-U Rechnungen erzeugt", type: 'simulation' },
  { id: "customizing", title: "Customizing", description: "Einstellungen in SPRO und ihre Wirkung", type: 'simulation' },
  { id: "marketcomm", title: "Marktkommunikation", description: "Datenaustausch mit externen Partnern (EDIFACT)", type: 'simulation' },
  { id: "processes", title: "Prozesse & Statuskonzepte", description: "Ablauf von Einzug bis Abmeldung und Statusübergänge", type: 'simulation' },
  { id: "invoicingaccounting", title: "Faktura & Buchhaltung", description: "Belegerzeugung, Druck, Übertragung und Verbuchung", type: 'simulation' },
  { id: 'securityroles', title: 'Sicherheit & Rollen', description: 'Rollenkonzepte und Zugriffsberechtigungen in IS-U', type: 'simulation' },
  { id: 'mission-tariff-disturbance', title: 'Consulting Mission 01: Die Tarifstörung', description: 'Simulierter Consultant-Einsatz zur Analyse und Behebung von Tarifproblemen.', type: 'mission' },
  { id: 'intercompany-troubleshooting', title: 'Intercompany Troubleshooting: UTILMD Fehler', description: 'Ein Lieferant sendet eine UTILMD-Nachricht, aber im System passiert nichts. Finde den Fehler!', type: 'simulation' },
];

export default modules;

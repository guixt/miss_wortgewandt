import React, { useState } from 'react';

interface BillingDoc {
  id: string;
  contractId: string;
  amount: number;
  status: 'Simuliert' | 'Fakturiert';
}

interface InvoiceDoc {
  id: string;
  billingDocIds: string[];
  totalAmount: number;
  status: 'Erstellt' | 'Gedruckt' | 'An FI-CA übergeleitet' | 'Fehlerhaft' | 'Storniert';
  isError?: boolean;
}

interface PrintDoc {
  id: string;
  invoiceDocId: string;
  status: 'Generiert' | 'Versandt';
}

interface FiCaDoc {
  id: string;
  invoiceDocId: string;
  amount: number;
  type: 'Forderung' | 'Gutschrift (Storno)';
  status: 'Gebucht' | 'Ausgeglichen';
}

type SimulationState = 'idle' | 'billingDone' | 'invoicingDone' | 'printDone' | 'ficaDone' | 'errorActive' | 'stornoDone';

const BAPI_EXAMPLES = {
  CREATE_FICA_DOC: `
// BAPI_ACC_DOCUMENT_POST oder BAPI_ISUACCOUNT_CREATEFROMDATA (vereinfacht)
{
  DOCUMENTHEADER: {
    BUS_ACT: 'RFBU', // Geschäftsvorgang Hauptbuchhaltung
    COMP_CODE: '1000', // Buchungskreis
    DOC_DATE: '2024-12-01', // Belegdatum
    PSTNG_DATE: '2024-12-01', // Buchungsdatum
    DOC_TYPE: 'RE', // Belegart (Rechnung)
  },
  ACCOUNTGL: [
    { ITEMNO_ACC: '001', GL_ACCOUNT: '140000', AMOUNT: '120.00', CURRENCY: 'EUR', /* ... */ }, // Forderungskonto
  ],
  ACCOUNTPAYABLE: [],
  ACCOUNTRECEIVABLE: [
    { ITEMNO_ACC: '002', CUSTOMER: '4711', AMOUNT: '-120.00', CURRENCY: 'EUR', /* ... */ }, // Debitor (Kunde)
  ],
  // ... weitere Strukturen
}
  `,
  CREATE_INV_PRINT_DOC: `
// BAPI_INV_PRINTDOCUMENT_CREATE (vereinfacht)
{
  CONTRACT_ACCOUNT: 'CA001', // Vertragskontonummer
  INVOICE_DOC_NUMBER: 'INV001', // Fakturabelegnummer
  PRINT_DATE: '2024-12-02',
  // ... weitere Parameter
}
  `
};

export function InvoicingAccountingSim() {
  const [billingDocs, setBillingDocs] = useState<BillingDoc[]>([]);
  const [invoiceDocs, setInvoiceDocs] = useState<InvoiceDoc[]>([]);
  const [printDocs, setPrintDocs] = useState<PrintDoc[]>([]);
  const [fiCaDocs, setFiCaDocs] = useState<FiCaDoc[]>([]);
  const [simulationState, setSimulationState] = useState<SimulationState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showBapi, setShowBapi] = useState<string | null>(null);

  const handleSimulateBilling = () => {
    const newBillingDoc: BillingDoc = {
      id: `BILL${Date.now()}`,
      contractId: 'V00123',
      amount: parseFloat((Math.random() * 100 + 50).toFixed(2)), // Random amount between 50 and 150
      status: 'Simuliert',
    };
    setBillingDocs([newBillingDoc]);
    setInvoiceDocs([]);
    setPrintDocs([]);
    setFiCaDocs([]);
    setSimulationState('billingDone');
    setErrorMessage(null);
  };

  const handleSimulateInvoicing = (simulateError: boolean = false) => {
    if (billingDocs.length === 0) return;
    const targetBillingDoc = billingDocs[0];

    if (simulateError) {
      const errorInvoice: InvoiceDoc = {
        id: `INV_ERR${Date.now()}`,
        billingDocIds: [targetBillingDoc.id],
        totalAmount: targetBillingDoc.amount,
        status: 'Fehlerhaft',
        isError: true,
      };
      setInvoiceDocs([errorInvoice]);
      setErrorMessage('Fehler bei Fakturierung: Inkonsistente Zählpunktdaten.');
      setSimulationState('errorActive');
    } else {
      const newInvoiceDoc: InvoiceDoc = {
        id: `INV${Date.now()}`,
        billingDocIds: [targetBillingDoc.id],
        totalAmount: targetBillingDoc.amount, // Simplified, no tax calculation
        status: 'Erstellt',
      };
      setBillingDocs(prev => prev.map(bd => bd.id === targetBillingDoc.id ? { ...bd, status: 'Fakturiert' } : bd));
      setInvoiceDocs([newInvoiceDoc]);
      setSimulationState('invoicingDone');
      setErrorMessage(null);
    }
  };

  const handleSimulatePrint = () => {
    const creatableInvoice = invoiceDocs.find(inv => inv.status === 'Erstellt' && !inv.isError);
    if (!creatableInvoice) return;

    const newPrintDoc: PrintDoc = {
      id: `PRINT${Date.now()}`,
      invoiceDocId: creatableInvoice.id,
      status: 'Generiert',
    };
    setPrintDocs([newPrintDoc]);
    setInvoiceDocs(prev => prev.map(inv => inv.id === creatableInvoice.id ? { ...inv, status: 'Gedruckt' } : inv));
    setSimulationState('printDone');
  };

  const handleSimulateFiCaTransfer = () => {
    const printableInvoice = invoiceDocs.find(inv => inv.status === 'Gedruckt' && !inv.isError);
    if (!printableInvoice) return;

    const newFiCaDoc: FiCaDoc = {
      id: `FICA${Date.now()}`,
      invoiceDocId: printableInvoice.id,
      amount: printableInvoice.totalAmount,
      type: 'Forderung',
      status: 'Gebucht',
    };
    setFiCaDocs([newFiCaDoc]);
    setInvoiceDocs(prev => prev.map(inv => inv.id === printableInvoice.id ? { ...inv, status: 'An FI-CA übergeleitet' } : inv));
    setSimulationState('ficaDone');
  };
  
  const handleSimulateStorno = () => {
    const errorInvoice = invoiceDocs.find(inv => inv.status === 'Fehlerhaft');
    if (!errorInvoice) return;

    const stornoFiCaDoc: FiCaDoc = {
        id: `FICA_STORNO_${Date.now()}`,
        invoiceDocId: errorInvoice.id,
        amount: errorInvoice.totalAmount,
        type: 'Gutschrift (Storno)',
        status: 'Gebucht',
    };
    setFiCaDocs(prev => [...prev, stornoFiCaDoc]);
    setInvoiceDocs(prev => prev.map(inv => inv.id === errorInvoice.id ? { ...inv, status: 'Storniert' } : inv));
    setSimulationState('stornoDone');
    setErrorMessage('Fakturabeleg wurde storniert. Bitte Prozess neu starten oder korrigieren.')
  };

  const resetSimulation = () => {
    setBillingDocs([]);
    setInvoiceDocs([]);
    setPrintDocs([]);
    setFiCaDocs([]);
    setSimulationState('idle');
    setErrorMessage(null);
    setShowBapi(null);
  };

  const renderDoc = (doc: any, title: string) => (
    <div key={doc.id} className="mb-2 p-3 bg-gray-100 rounded shadow-sm">
      <p className="font-semibold text-sm">{title}: {doc.id}</p>
      <pre className="text-xs bg-white p-1 rounded mt-1 overflow-x-auto">{JSON.stringify(doc, null, 2)}</pre>
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Faktura & Buchhaltung Simulation</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Controls */} 
        <div className="md:col-span-1 space-y-2 bg-slate-50 p-3 rounded shadow">
            <h3 className="font-semibold mb-2 border-b pb-1">Aktionen</h3>
            <button onClick={handleSimulateBilling} disabled={simulationState !== 'idle' && simulationState !== 'stornoDone'} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded disabled:opacity-50 text-sm">1. Abrechnung simulieren</button>
            <button onClick={() => handleSimulateInvoicing(false)} disabled={simulationState !== 'billingDone'} className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded disabled:opacity-50 text-sm">2. Fakturierung</button>
            <button onClick={() => handleSimulateInvoicing(true)} disabled={simulationState !== 'billingDone'} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded disabled:opacity-50 text-sm">2a. Fakturierung (mit Fehler)</button>
            <button onClick={handleSimulatePrint} disabled={simulationState !== 'invoicingDone'} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-3 rounded disabled:opacity-50 text-sm">3. Rechnungsdruck</button>
            <button onClick={handleSimulateFiCaTransfer} disabled={simulationState !== 'printDone'} className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-3 rounded disabled:opacity-50 text-sm">4. An FI-CA überleiten</button>
            <button onClick={handleSimulateStorno} disabled={simulationState !== 'errorActive'} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded disabled:opacity-50 text-sm">Fehlerbehandlung: Storno</button>
            <hr className="my-3"/>
            <button onClick={() => setShowBapi(showBapi === 'CREATE_FICA_DOC' ? null : 'CREATE_FICA_DOC')} className="w-full bg-gray-400 hover:bg-gray-500 text-white py-1 px-3 rounded text-xs">BAPI FI-CA Beispiel Umschalten</button>
            <button onClick={() => setShowBapi(showBapi === 'CREATE_INV_PRINT_DOC' ? null : 'CREATE_INV_PRINT_DOC')} className="w-full bg-gray-400 hover:bg-gray-500 text-white py-1 px-3 rounded text-xs mt-1">BAPI Druckbeleg Beispiel Umschalten</button>
            <hr className="my-3"/>
            <button onClick={resetSimulation} className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 px-3 rounded text-sm">Simulation zurücksetzen</button>
        </div>

        {/* Document Display Areas */} 
        <div className="md:col-span-3 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="p-2 border rounded bg-white min-h-[100px]">
                <h4 className="font-medium text-center text-sm mb-1">Abrechnungsbelege</h4>
                {billingDocs.map(doc => renderDoc(doc, "Abrechn.Beleg"))}
            </div>
            <div className="p-2 border rounded bg-white min-h-[100px]">
                <h4 className="font-medium text-center text-sm mb-1">Fakturabelege</h4>
                {invoiceDocs.map(doc => renderDoc(doc, "Fakturabeleg"))}
            </div>
            <div className="p-2 border rounded bg-white min-h-[100px]">
                <h4 className="font-medium text-center text-sm mb-1">Druckbelege</h4>
                {printDocs.map(doc => renderDoc(doc, "Druckbeleg"))}
            </div>
            <div className="p-2 border rounded bg-white min-h-[100px]">
                <h4 className="font-medium text-center text-sm mb-1">FI-CA Belege</h4>
                {fiCaDocs.map(doc => renderDoc(doc, "FI-CA Beleg"))}
            </div>
        </div>
      </div>

      {errorMessage && (
        <div className={`p-3 rounded mb-4 text-white ${simulationState === 'errorActive' ? 'bg-red-500' : 'bg-yellow-500'}`}>
          <p className="font-semibold">Hinweis:</p>
          <p>{errorMessage}</p>
        </div>
      )}

      {showBapi && BAPI_EXAMPLES[showBapi as keyof typeof BAPI_EXAMPLES] && (
        <div className="mb-4 p-3 bg-gray-800 text-white rounded shadow">
          <h4 className="font-semibold mb-1">Beispiel BAPI Struktur ({showBapi})</h4>
          <pre className="text-xs whitespace-pre-wrap">{BAPI_EXAMPLES[showBapi as keyof typeof BAPI_EXAMPLES]}</pre>
        </div>
      )}

      <div className="mt-8 p-4 bg-emerald-50 rounded">
        <h4 className="font-bold">🎓 Lernhinweise (Faktura & Buchhaltung):</h4>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Die <b>Abrechnung</b> (Billing, Transaktion <code>EA00</code> für Einzeltest, <code>EASIBI</code> für Massenlauf) ermittelt Kosten basierend auf Verbrauch und Tarifen und erstellt Abrechnungsbelege.</li>
          <li>Die <b>Fakturierung</b> (Invoicing, Transaktion <code>EA26</code> für Einzelanzeige/-test, <code>EA22</code> für Massenlauf) bündelt Abrechnungsbelege, berechnet Steuern und erzeugt den Fakturabeleg. Dieser ist die Basis für die Rechnungsstellung.</li>
          <li>Der <b>Rechnungsdruck</b> (Print Workbench, Transaktion <code>EA60</code> für Einzeltest/-druck, <code>EA29</code> für Massendruck) generiert aus dem Fakturabeleg das Rechnungsformular.</li>
          <li>Die <b>Überleitung ins FI-CA</b> (Transaktion <code>FPF3</code> für Massenlauf) überträgt die Fakturadaten ins Vertragskontokorrent, wo Buchungsbelege (Forderungen/Gutschriften) entstehen. Der Kontenstand ist in <code>FPL9</code> ersichtlich.</li>
          <li><b>Belegfluss:</b> Abrechnungsbeleg → Fakturabeleg → Druckbeleg (Rechnung) → FI-CA Beleg.</li>
          <li><b>Fehlerbehandlung:</b> Fehlerhafte Fakturabelege (z.B. durch falsche Stammdaten) müssen storniert werden (z.B. via <code>EA20</code> - Fakturierungsstorno). Dies erzeugt oft einen Stornofakturabeleg und entsprechende FI-CA Buchungen.</li>
          <li><b>Wichtige BAPIs:</b>
            <ul className="list-disc list-inside ml-4">
                <li><code>BAPI_ISUACCOUNT_CREATEFROMDATA</code>: Zum Erstellen von FI-CA Belegen.</li>
                <li><code>BAPI_BILLINGDOC_CREATEFROMEXT</code>: Zum externen Erstellen von Abrechnungsbelegen.</li>
                <li><code>BAPI_INVOICEDOC_CREATEMULTIPLE</code>: Zum Erstellen von Fakturabelegen.</li>
                <li><code>BAPI_INV_PRINTDOCUMENT_CREATE</code>: Zum Erstellen von Druckbelegen für die Rechnung.</li>
            </ul>
          </li>
          <li>Im Customizing (SPRO) werden z.B. Belegarten, Nummernkreise, Steuerfindung und Buchungsregeln für FI-CA definiert.</li>
        </ul>
      </div>
    </div>
  );
}

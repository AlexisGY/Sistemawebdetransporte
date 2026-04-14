import { useState } from "react";
import { PageHeader } from "../../shared/PageHeader";
import { Calculator, Download, Send } from "lucide-react";

export function Cotizacion() {
  const [items, setItems] = useState([
    { id: 1, concepto: "Ticket Lima - Arequipa", cantidad: 2, precioUnitario: 85, subtotal: 170 },
  ]);

  const addItem = () => {
    setItems([...items, { id: items.length + 1, concepto: "", cantidad: 1, precioUnitario: 0, subtotal: 0 }]);
  };

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const igv = total * 0.18;
  const totalConIgv = total + igv;

  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Cotización"
        subtitle="Generar cotización para clientes"
      />

      <div className="p-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b border-slate-200">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">COTIZACIÓN</h2>
              <p className="text-slate-600">N° COT-2026-0142</p>
              <p className="text-sm text-slate-500 mt-1">Fecha: 14/04/2026</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-700">Cliente:</p>
              <p className="font-semibold text-slate-900">Empresa XYZ S.A.C.</p>
              <p className="text-sm text-slate-600">RUC: 20123456789</p>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <table className="w-full">
              <thead className="bg-slate-50 border-y border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Concepto</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase w-24">Cant.</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase w-32">P. Unit.</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase w-32">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        defaultValue={item.concepto}
                        className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Descripción del servicio"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        defaultValue={item.cantidad}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        defaultValue={item.precioUnitario}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-right font-medium">S/ {item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={addItem}
              className="mt-3 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              + Agregar ítem
            </button>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-80 space-y-2">
              <div className="flex justify-between py-2 border-t border-slate-200">
                <span className="text-slate-700">Subtotal:</span>
                <span className="font-medium">S/ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-700">IGV (18%):</span>
                <span className="font-medium">S/ {igv.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-slate-300">
                <span className="text-lg font-bold text-slate-900">Total:</span>
                <span className="text-2xl font-bold text-emerald-600">S/ {totalConIgv.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Observaciones</label>
            <textarea
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows={3}
              placeholder="Condiciones comerciales, validez de la cotización, etc."
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4" />
              Descargar PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
              <Send className="w-4 h-4" />
              Enviar por Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

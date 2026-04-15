import { Printer, Download } from "lucide-react";
import { useParams } from "react-router";

export function ComprobantePago() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-3xl mx-auto mb-4 flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-bold text-slate-900">Comprobante de Pago</h1>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-white bg-slate-700 rounded-lg hover:bg-slate-800">
            <Download className="w-4 h-4" />
            Descargar PDF
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto bg-white shadow-lg print:shadow-none">
        {/* Header */}
        <div className="border-b-4 border-slate-700 p-8 print:border-black">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">TransporteSaaS</h1>
              <p className="text-slate-600">Sistema Empresarial de Transporte</p>
              <p className="text-sm text-slate-500 mt-1">RUC: 20123456789</p>
              <p className="text-sm text-slate-500">Av. Principal 123, Lima, Perú</p>
            </div>
            <div className="text-right border-2 border-slate-700 p-4 print:border-black">
              <p className="text-lg font-bold">BOLETA DE VENTA</p>
              <p className="text-xl font-bold text-slate-700 print:text-black">{id}</p>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="p-8 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-600 uppercase mb-4">Datos del Cliente</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">Nombre/Razón Social:</p>
              <p className="font-semibold">Juan Carlos Pérez García</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">DNI/RUC:</p>
              <p className="font-semibold">12345678</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Dirección:</p>
              <p className="font-semibold">Calle Los Olivos 456, Lima</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Fecha de Emisión:</p>
              <p className="font-semibold">14/04/2026 10:30</p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="p-8 border-b border-slate-200">
          <table className="w-full">
            <thead className="border-b-2 border-slate-300">
              <tr>
                <th className="text-left py-3 text-xs font-bold text-slate-600 uppercase">Descripción</th>
                <th className="text-center py-3 text-xs font-bold text-slate-600 uppercase w-20">Cant.</th>
                <th className="text-right py-3 text-xs font-bold text-slate-600 uppercase w-28">P. Unit.</th>
                <th className="text-right py-3 text-xs font-bold text-slate-600 uppercase w-28">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-4">
                  <p className="font-semibold">Pasaje Lima - Arequipa</p>
                  <p className="text-xs text-slate-600">Fecha: 15/04/2026 - Hora: 08:00</p>
                  <p className="text-xs text-slate-600">Asiento: 05</p>
                </td>
                <td className="text-center">1</td>
                <td className="text-right">S/ 85.00</td>
                <td className="text-right font-semibold">S/ 85.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="p-8">
          <div className="flex justify-end">
            <div className="w-80 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-700">Subtotal:</span>
                <span className="font-semibold">S/ 85.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">IGV (18%):</span>
                <span className="font-semibold">S/ 0.00</span>
              </div>
              <div className="flex justify-between text-lg pt-3 border-t-2 border-slate-300">
                <span className="font-bold">TOTAL:</span>
                <span className="font-bold text-slate-700 print:text-black">S/ 85.00</span>
              </div>
              <div className="bg-slate-50 p-3 rounded print:bg-transparent print:border print:border-slate-300">
                <p className="text-xs text-slate-600 mb-1">Método de Pago:</p>
                <p className="font-semibold">Tarjeta de Crédito ****3456</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-6 print:bg-transparent print:border-t print:border-slate-300">
          <p className="text-xs text-center text-slate-600 mb-2">
            Representación impresa del comprobante electrónico
          </p>
          <p className="text-xs text-center text-slate-500">
            Consulte este comprobante en: www.transportesaas.com/consulta
          </p>
          <p className="text-xs text-center text-slate-500 mt-4">
            Gracias por su preferencia | Atención al Cliente: (01) 123-4567
          </p>
        </div>
      </div>
    </div>
  );
}

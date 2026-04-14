import { useState } from "react";
import { PageHeader } from "../../shared/PageHeader";
import { CreditCard, DollarSign, CheckCircle } from "lucide-react";

export function OrdenPago() {
  const [metodoPago, setMetodoPago] = useState("tarjeta");

  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Orden de Pago"
        subtitle="Procesar pago de reservas y tickets"
      />

      <div className="p-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Método de Pago</h3>

            {/* Payment Methods */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                onClick={() => setMetodoPago("tarjeta")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  metodoPago === "tarjeta"
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <CreditCard className="w-6 h-6 mx-auto mb-2 text-slate-700" />
                <p className="text-sm font-medium">Tarjeta</p>
              </button>
              <button
                onClick={() => setMetodoPago("efectivo")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  metodoPago === "efectivo"
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <DollarSign className="w-6 h-6 mx-auto mb-2 text-slate-700" />
                <p className="text-sm font-medium">Efectivo</p>
              </button>
              <button
                onClick={() => setMetodoPago("transferencia")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  metodoPago === "transferencia"
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <svg className="w-6 h-6 mx-auto mb-2 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <p className="text-sm font-medium">Transferencia</p>
              </button>
            </div>

            {/* Card Payment Form */}
            {metodoPago === "tarjeta" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Número de Tarjeta
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Fecha de Vencimiento
                    </label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre del Titular
                  </label>
                  <input
                    type="text"
                    placeholder="JUAN PEREZ GARCIA"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Cash Payment */}
            {metodoPago === "efectivo" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Monto Recibido
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700">Total a pagar:</span>
                    <span className="font-bold">S/ 170.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-700">Vuelto:</span>
                    <span className="font-bold text-emerald-600">S/ 0.00</span>
                  </div>
                </div>
              </div>
            )}

            {/* Transfer Payment */}
            {metodoPago === "transferencia" && (
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-3">Datos Bancarios</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Banco:</span>
                      <span className="font-medium">BCP</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Cuenta:</span>
                      <span className="font-medium">123-456789-0-12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">CCI:</span>
                      <span className="font-medium">012-123-001234567890-12</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    N° de Operación
                  </label>
                  <input
                    type="text"
                    placeholder="Ingresar número de operación"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            <button className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 text-white bg-emerald-600 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
              <CheckCircle className="w-5 h-5" />
              Procesar Pago
            </button>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Resumen</h3>
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Reserva:</p>
                <p className="font-semibold">RES-2026-0142</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Viaje:</p>
                <p className="font-semibold">Lima - Arequipa</p>
                <p className="text-sm text-slate-600">15/04/2026 - 08:00</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Asientos:</p>
                <p className="font-semibold">5, 6</p>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-700">Subtotal:</span>
                  <span className="font-medium">S/ 170.00</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-700">IGV:</span>
                  <span className="font-medium">S/ 0.00</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-900">Total:</span>
                  <span className="text-2xl font-bold text-emerald-600">S/ 170.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

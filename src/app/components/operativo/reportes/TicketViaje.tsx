import { Printer, Download } from "lucide-react";
import { useParams } from "react-router";

export function TicketViaje() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto mb-4 flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-bold text-slate-900">Ticket de Viaje</h1>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-white bg-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
            <Download className="w-4 h-4" />
            Descargar PDF
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-8 print:bg-none print:text-black print:border-b-2 print:border-black">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 print:text-black">TICKET DE VIAJE</h1>
              <p className="text-lg print:text-black">TransporteSaaS - Sistema Empresarial</p>
              <p className="text-sm mt-1 print:text-black">RUC: 20123456789</p>
            </div>
            <div className="text-right">
              <div className="bg-white text-slate-700 px-6 py-3 rounded-lg print:bg-transparent print:text-black print:border print:border-black">
                <p className="text-sm font-medium">N° Ticket</p>
                <p className="text-2xl font-bold">{id}</p>
              </div>
              <p className="text-sm mt-2 print:text-black">Fecha Emisión: 14/04/2026</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Passenger Info */}
          <div className="mb-8">
            <h2 className="text-sm font-bold text-slate-600 uppercase mb-4 pb-2 border-b border-slate-300">
              Datos del Pasajero
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-500 mb-1">Nombre Completo</p>
                <p className="text-lg font-semibold">Juan Carlos Pérez García</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Documento de Identidad</p>
                <p className="text-lg font-semibold">DNI: 12345678</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Teléfono</p>
                <p className="font-medium">+51 999 888 777</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Email</p>
                <p className="font-medium">jperez@email.com</p>
              </div>
            </div>
          </div>

          {/* Trip Info */}
          <div className="mb-8">
            <h2 className="text-sm font-bold text-slate-600 uppercase mb-4 pb-2 border-b border-slate-300">
              Detalles del Viaje
            </h2>
            <div className="bg-slate-50 rounded-lg p-6 print:bg-transparent print:border print:border-slate-300">
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Origen</p>
                  <p className="text-xl font-bold">Lima</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Destino</p>
                  <p className="text-xl font-bold">Arequipa</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Fecha de Viaje</p>
                  <p className="text-lg font-semibold">15/04/2026</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Hora de Salida</p>
                  <p className="text-lg font-semibold">08:00</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Número de Asiento</p>
                  <p className="text-2xl font-bold text-slate-700 print:text-black">05</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="mb-8">
            <h2 className="text-sm font-bold text-slate-600 uppercase mb-4 pb-2 border-b border-slate-300">
              Información del Vehículo
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-slate-500 mb-1">Placa</p>
                <p className="font-semibold">ABC-123</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Modelo</p>
                <p className="font-semibold">Mercedes-Benz Sprinter</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Conductor</p>
                <p className="font-semibold">Carlos Mendoza</p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="mb-8">
            <h2 className="text-sm font-bold text-slate-600 uppercase mb-4 pb-2 border-b border-slate-300">
              Información de Pago
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-700">Tarifa:</span>
                  <span className="font-semibold">S/ 85.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">IGV (18%):</span>
                  <span className="font-semibold">S/ 0.00</span>
                </div>
                <div className="flex justify-between pt-2 border-t-2 border-slate-300">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-2xl font-bold text-slate-700 print:text-black">S/ 85.00</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Método de Pago</p>
                <p className="font-semibold">Tarjeta de Crédito</p>
                <p className="text-xs text-slate-500 mt-3">Estado</p>
                <p className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold print:bg-transparent print:border print:border-black print:text-black">
                  Pagado
                </p>
              </div>
            </div>
          </div>

          {/* QR and Terms */}
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2">
              <h2 className="text-sm font-bold text-slate-600 uppercase mb-3">Condiciones y Términos</h2>
              <ul className="text-xs text-slate-700 space-y-2">
                <li>• El pasajero debe presentarse 30 minutos antes de la hora de salida</li>
                <li>• Es obligatorio presentar documento de identidad original</li>
                <li>• Equipaje permitido: 25kg en bodega + 8kg de mano</li>
                <li>• No se permiten devoluciones, solo cambios con 24 horas de anticipación</li>
                <li>• El pasajero es responsable de sus pertenencias durante el viaje</li>
                <li>• Prohibido fumar, consumir alcohol o alterar el orden público</li>
              </ul>
            </div>
            <div>
              <div className="w-full aspect-square bg-slate-100 border-2 border-slate-300 rounded-lg flex items-center justify-center print:border-black">
                <div className="text-center">
                  <svg className="w-32 h-32 text-slate-400 mx-auto print:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <p className="text-xs text-slate-500 mt-2 print:text-black">Código QR</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-300 text-center">
            <p className="text-xs text-slate-500">
              Este documento es válido como comprobante de viaje. Conserve hasta su destino.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Atención al Cliente: (01) 123-4567 | soporte@transportesaas.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

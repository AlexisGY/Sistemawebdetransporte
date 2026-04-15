import { useState } from "react";
import { PageHeader } from "../../shared/PageHeader";
import { Ticket, Download, Send, Printer } from "lucide-react";
import { Link } from "react-router";

export function EmisionTicket() {
  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Emisi贸n de Ticket"
        subtitle="Generar tickets de viaje"
      />

      <div className="p-8 max-w-4xl mx-auto">
        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Buscar Reserva</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Ingrese c贸digo de reserva o DNI del pasajero"
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
              Buscar
            </button>
          </div>
        </div>

        {/* Ticket Preview */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">TICKET DE VIAJE</h2>
                <p className="text-emerald-100">TransporteSaaS</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-emerald-100">C贸digo</p>
                <p className="text-2xl font-bold">TKT-142</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Passenger Info */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-600 mb-3">DATOS DEL PASAJERO</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500">Nombre Completo</p>
                    <p className="font-semibold">Juan Carlos P茅rez Garc铆a</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">DNI</p>
                    <p className="font-semibold">12345678</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-600 mb-3">CONTACTO</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500">Tel茅fono</p>
                    <p className="font-semibold">+51 999 888 777</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="font-semibold">jperez@email.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 my-6"></div>

            {/* Trip Info */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-600 mb-3">DETALLES DEL VIAJE</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500">Ruta</p>
                    <p className="font-semibold text-lg">Lima 鈫?Arequipa</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Fecha</p>
                      <p className="font-semibold">15/04/2026</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Hora Salida</p>
                      <p className="font-semibold">08:00</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-600 mb-3">INFORMACI脫N ADICIONAL</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500">Veh铆culo</p>
                    <p className="font-semibold">ABC-123</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Asiento</p>
                      <p className="font-semibold text-xl text-emerald-600">05</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Precio</p>
                      <p className="font-semibold text-xl">S/ 85.00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 my-6"></div>

            {/* QR Code */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-600 mb-2">CONDICIONES</h4>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>鈥?Presentarse 30 minutos antes de la hora de salida</li>
                  <li>鈥?Documento de identidad obligatorio</li>
                  <li>鈥?Equipaje permitido: 25kg por pasajero</li>
                </ul>
              </div>
              <div className="w-32 h-32 bg-slate-100 border-2 border-slate-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-24 h-24 text-slate-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <p className="text-xs text-slate-500 mt-1">QR Code</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border-t border-slate-200 px-8 py-4 flex items-center justify-between">
            <p className="text-xs text-slate-500">Emitido: 14/04/2026 10:30</p>
            <Link
              to="/operativo/reportes/ticket-viaje/TKT-142"
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Ver reporte completo 鈫?            </Link>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button className="flex items-center gap-2 px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors">
            <Printer className="w-5 h-5" />
            Imprimir
          </button>
          <button className="flex items-center gap-2 px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors">
            <Download className="w-5 h-5" />
            Descargar PDF
          </button>
          <button className="flex items-center gap-2 px-6 py-3 text-white bg-emerald-600 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
            <Send className="w-5 h-5" />
            Enviar por Email
          </button>
        </div>
      </div>
    </div>
  );
}
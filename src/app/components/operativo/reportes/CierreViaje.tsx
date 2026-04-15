import { Printer, Download } from "lucide-react";
import { useParams } from "react-router";

export function CierreViaje() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto mb-4 flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-bold text-slate-900">Reporte de Cierre de Viaje</h1>
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

      <div className="max-w-5xl mx-auto bg-white shadow-lg print:shadow-none">
        {/* Header */}
        <div className="bg-slate-900 text-white p-8 print:bg-transparent print:text-black print:border-b-4 print:border-black">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold mb-2 print:text-black">REPORTE DE CIERRE DE VIAJE</h1>
            <p className="text-lg print:text-black">TransporteSaaS - Sistema Empresarial</p>
          </div>
          <div className="flex justify-between items-center border-t border-slate-700 pt-4 print:border-black">
            <div>
              <p className="text-sm text-slate-300 print:text-black">Código de Viaje</p>
              <p className="text-2xl font-bold print:text-black">{id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-300 print:text-black">Fecha de Cierre</p>
              <p className="text-xl font-bold print:text-black">15/04/2026 16:05</p>
            </div>
          </div>
        </div>

        {/* Trip Summary */}
        <div className="p-8 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">RESUMEN DEL VIAJE</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Ruta:</span>
                <span className="font-semibold">Lima - Arequipa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Fecha:</span>
                <span className="font-semibold">15/04/2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Hora Salida:</span>
                <span className="font-semibold">08:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Hora Llegada:</span>
                <span className="font-semibold">16:05</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Vehículo:</span>
                <span className="font-semibold">ABC-123 - Mercedes Sprinter</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Conductor:</span>
                <span className="font-semibold">Carlos Mendoza</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Distancia:</span>
                <span className="font-semibold">1,018 km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Duración:</span>
                <span className="font-semibold">8h 05m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Passenger Stats */}
        <div className="p-8 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">ESTADÍSTICAS DE PASAJEROS</h2>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-slate-50 p-4 rounded-lg print:bg-transparent print:border print:border-slate-300">
              <p className="text-sm text-slate-600 mb-1">Capacidad Total</p>
              <p className="text-3xl font-bold text-slate-700 print:text-black">20</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg print:bg-transparent print:border print:border-slate-300">
              <p className="text-sm text-slate-600 mb-1">Embarcados</p>
              <p className="text-3xl font-bold text-slate-700 print:text-black">18</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg print:bg-transparent print:border print:border-slate-300">
              <p className="text-sm text-slate-600 mb-1">Ocupación</p>
              <p className="text-3xl font-bold text-slate-700 print:text-black">90%</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg print:bg-transparent print:border print:border-slate-300">
              <p className="text-sm text-slate-600 mb-1">No Shows</p>
              <p className="text-3xl font-bold text-slate-700 print:text-black">2</p>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="p-8 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">RESUMEN FINANCIERO</h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-slate-700 mb-3">Ingresos</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Tickets vendidos (18):</span>
                  <span className="font-semibold">S/ 1,530.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Equipaje extra:</span>
                  <span className="font-semibold">S/ 45.00</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-300">
                  <span className="font-bold">Total Ingresos:</span>
                  <span className="font-bold text-slate-700 print:text-black">S/ 1,575.00</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-3">Gastos</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Combustible:</span>
                  <span className="font-semibold">S/ 380.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Peajes:</span>
                  <span className="font-semibold">S/ 85.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Otros:</span>
                  <span className="font-semibold">S/ 25.00</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-300">
                  <span className="font-bold">Total Gastos:</span>
                  <span className="font-bold text-slate-700 print:text-black">S/ 490.00</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-slate-50 border-2 border-slate-700 rounded-lg print:bg-transparent print:border-black">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">UTILIDAD NETA:</span>
              <span className="text-3xl font-bold text-slate-700 print:text-black">S/ 1,085.00</span>
            </div>
          </div>
        </div>

        {/* Incidents */}
        <div className="p-8 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">INCIDENCIAS Y OBSERVACIONES</h2>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 print:bg-transparent">
            <p className="text-sm text-slate-700">
              • Retraso de 5 minutos en llegada debido a tráfico en ingreso a Arequipa.
            </p>
            <p className="text-sm text-slate-700 mt-2">
              • Sin incidencias técnicas reportadas.
            </p>
            <p className="text-sm text-slate-700 mt-2">
              • Todos los pasajeros descendieron sin novedad.
            </p>
          </div>
        </div>

        {/* Checklist */}
        <div className="p-8 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">VERIFICACIÓN DE CIERRE</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center print:border print:border-black print:bg-transparent">
                  <span className="text-white text-sm print:text-black">✓</span>
                </div>
                <span className="text-sm">Todos los pasajeros descendieron</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center print:border print:border-black print:bg-transparent">
                  <span className="text-white text-sm print:text-black">✓</span>
                </div>
                <span className="text-sm">Vehículo inspeccionado</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center print:border print:border-black print:bg-transparent">
                  <span className="text-white text-sm print:text-black">✓</span>
                </div>
                <span className="text-sm">Documentación completa</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center print:border print:border-black print:bg-transparent">
                  <span className="text-white text-sm print:text-black">✓</span>
                </div>
                <span className="text-sm">Manifiesto firmado</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center print:border print:border-black print:bg-transparent">
                  <span className="text-white text-sm print:text-black">✓</span>
                </div>
                <span className="text-sm">Ingresos registrados</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center print:border print:border-black print:bg-transparent">
                  <span className="text-white text-sm print:text-black">✓</span>
                </div>
                <span className="text-sm">Vehículo listo para próximo servicio</span>
              </div>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="p-8">
          <div className="grid grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <div className="border-t-2 border-slate-900 pt-3 mt-16">
                <p className="font-semibold">Conductor</p>
                <p className="text-sm text-slate-600">Carlos Mendoza</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t-2 border-slate-900 pt-3 mt-16">
                <p className="font-semibold">Supervisor</p>
                <p className="text-sm text-slate-600">Firma y Sello</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t-2 border-slate-900 pt-3 mt-16">
                <p className="font-semibold">Gerente Operaciones</p>
                <p className="text-sm text-slate-600">Firma y Sello</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-900 text-white p-4 text-center text-xs print:bg-transparent print:text-black print:border-t print:border-black">
          <p>Documento generado automáticamente por TransporteSaaS</p>
          <p className="mt-1">Emitido: 15/04/2026 16:10 | Sistema Empresarial de Transporte</p>
        </div>
      </div>
    </div>
  );
}

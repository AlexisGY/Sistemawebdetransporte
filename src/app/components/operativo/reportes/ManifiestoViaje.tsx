import { Printer, Download } from "lucide-react";
import { useParams } from "react-router";

const pasajeros = [
  { n: 1, nombre: "Juan Pérez García", dni: "12345678", asiento: 5, destino: "Arequipa" },
  { n: 2, nombre: "María García López", dni: "87654321", asiento: 6, destino: "Arequipa" },
  { n: 3, nombre: "Carlos López Ruiz", dni: "45678912", asiento: 8, destino: "Arequipa" },
  { n: 4, nombre: "Ana Santos Torres", dni: "78912345", asiento: 12, destino: "Arequipa" },
  { n: 5, nombre: "Pedro Ramírez Silva", dni: "32165498", asiento: 15, destino: "Arequipa" },
];

export function ManifiestoViaje() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto mb-4 flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-bold text-slate-900">Manifiesto de Viaje</h1>
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
        <div className="border-b-4 border-slate-900 p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">MANIFIESTO DE PASAJEROS</h1>
            <p className="text-lg font-semibold">TransporteSaaS - Sistema Empresarial</p>
            <p className="text-sm text-slate-600">RUC: 20123456789 | Registro MTC: 123456</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 border-2 border-slate-300 p-6">
            <div>
              <h3 className="font-bold mb-3 text-slate-900">DATOS DEL VIAJE</h3>
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="w-32 text-slate-600">N° Manifiesto:</span>
                  <span className="font-semibold">{id}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-600">Ruta:</span>
                  <span className="font-semibold">Lima - Arequipa</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-600">Fecha:</span>
                  <span className="font-semibold">15/04/2026</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-600">Hora Salida:</span>
                  <span className="font-semibold">08:00</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-3 text-slate-900">DATOS DEL VEHÍCULO</h3>
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="w-32 text-slate-600">Placa:</span>
                  <span className="font-semibold">ABC-123</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-600">Marca/Modelo:</span>
                  <span className="font-semibold">Mercedes-Benz Sprinter</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-600">Conductor:</span>
                  <span className="font-semibold">Carlos Mendoza</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-600">Licencia:</span>
                  <span className="font-semibold">A-IIIc - Q12345678</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Passenger List */}
        <div className="p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">RELACIÓN DE PASAJEROS</h2>
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-white print:bg-slate-200 print:text-black">
              <tr>
                <th className="px-4 py-3 text-left w-12">N°</th>
                <th className="px-4 py-3 text-left">Apellidos y Nombres</th>
                <th className="px-4 py-3 text-left w-32">DNI</th>
                <th className="px-4 py-3 text-center w-24">Asiento</th>
                <th className="px-4 py-3 text-left">Destino</th>
                <th className="px-4 py-3 text-center w-32 print:block">Firma</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {pasajeros.map((pasajero) => (
                <tr key={pasajero.n} className="hover:bg-slate-50 print:hover:bg-transparent">
                  <td className="px-4 py-3">{pasajero.n}</td>
                  <td className="px-4 py-3 font-medium">{pasajero.nombre}</td>
                  <td className="px-4 py-3">{pasajero.dni}</td>
                  <td className="px-4 py-3 text-center font-semibold">{pasajero.asiento}</td>
                  <td className="px-4 py-3">{pasajero.destino}</td>
                  <td className="px-4 py-3 print:border-l print:border-slate-300"></td>
                </tr>
              ))}
              {/* Empty rows for additional passengers */}
              {Array.from({ length: 15 }, (_, i) => (
                <tr key={`empty-${i}`} className="print:block">
                  <td className="px-4 py-3 text-slate-400">{pasajeros.length + i + 1}</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 print:border-l print:border-slate-300"></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 p-4 bg-slate-100 border border-slate-300 print:bg-transparent">
            <div className="flex justify-between text-sm font-semibold">
              <span>Total de pasajeros registrados:</span>
              <span className="text-lg">{pasajeros.length} / 20</span>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="p-8 border-t-2 border-slate-300">
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div>
              <p className="text-xs text-slate-600 mb-2">Observaciones:</p>
              <div className="border border-slate-300 rounded h-20"></div>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-2">Hora de Salida Real:</p>
              <div className="border border-slate-300 rounded h-20 flex items-center justify-center">
                <span className="text-2xl font-bold">08:00</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-2">Hora de Llegada:</p>
              <div className="border border-slate-300 rounded h-20"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 mt-12">
            <div className="text-center">
              <div className="border-t-2 border-slate-900 pt-2 mt-16">
                <p className="font-semibold">Conductor</p>
                <p className="text-sm text-slate-600">Carlos Mendoza</p>
                <p className="text-xs text-slate-500">DNI: 12345678</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t-2 border-slate-900 pt-2 mt-16">
                <p className="font-semibold">Supervisor de Terminal</p>
                <p className="text-sm text-slate-600">Nombre y Sello</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-800 text-white p-4 text-center text-xs print:bg-transparent print:text-black print:border-t print:border-slate-300">
          <p>Este documento es de uso obligatorio según normativa MTC - Conservar durante el viaje</p>
          <p className="mt-1">Emitido: 14/04/2026 10:30 | Sistema TransporteSaaS</p>
        </div>
      </div>
    </div>
  );
}

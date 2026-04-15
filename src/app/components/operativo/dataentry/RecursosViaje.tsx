import { useState } from "react";
import { PageHeader } from "../../shared/PageHeader";
import { DataTable } from "../../shared/DataTable";
import { Truck, Users, MapPin, Calendar, Plus, X, Save } from "lucide-react";

const viajesData = [
  { id: 1, codigo: "VJ-001", ruta: "Lima - Arequipa", fecha: "14/04/2026", hora: "08:00", vehiculo: "ABC-123", conductor: "Carlos Mendoza", copiloto: "Ana García", estado: "Confirmado" },
  { id: 2, codigo: "VJ-002", ruta: "Lima - Cusco", fecha: "14/04/2026", hora: "09:30", vehiculo: "XYZ-789", conductor: "Luis Torres", copiloto: "María Santos", estado: "Confirmado" },
  { id: 3, codigo: "VJ-003", ruta: "Lima - Trujillo", fecha: "15/04/2026", hora: "10:00", vehiculo: "GHI-321", conductor: "Pedro Ramírez", copiloto: "-", estado: "Pendiente" },
];

export function RecursosViaje() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Recursos de Viaje"
        subtitle="Asignación de vehículos y personal operativo"
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Programar Nuevo Viaje
          </button>
        }
      />

      <div className="p-8">
        <DataTable
          columns={[
            { key: "codigo", label: "Código", sortable: true },
            {
              key: "ruta",
              label: "Ruta",
              sortable: true,
              render: (item: any) => (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{item.ruta}</span>
                </div>
              ),
            },
            {
              key: "fecha",
              label: "Fecha/Hora",
              render: (item: any) => (
                <div>
                  <p className="font-medium">{item.fecha}</p>
                  <p className="text-sm text-slate-600">{item.hora}</p>
                </div>
              ),
            },
            { key: "vehiculo", label: "Vehículo" },
            { key: "conductor", label: "Conductor" },
            { key: "copiloto", label: "Copiloto" },
            {
              key: "estado",
              label: "Estado",
              render: (item: any) => (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.estado === "Confirmado"
                      ? "bg-slate-100 text-slate-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {item.estado}
                </span>
              ),
            },
          ]}
          data={viajesData}
          searchPlaceholder="Buscar viaje..."
          onExport={() => console.log("Export")}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl">
            <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Programar Nuevo Viaje</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ruta
                  </label>
                  <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600">
                    <option>Lima - Arequipa</option>
                    <option>Lima - Cusco</option>
                    <option>Lima - Trujillo</option>
                    <option>Lima - Piura</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                    defaultValue="2026-04-15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hora de Salida
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                    defaultValue="08:00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hora de Llegada Estimada
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                    defaultValue="16:00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Vehículo Asignado
                </label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600">
                  <option>ABC-123 - Mercedes Sprinter (Cap: 20)</option>
                  <option>XYZ-789 - Volvo 9700 (Cap: 45)</option>
                  <option>GHI-321 - Mercedes O500 (Cap: 48)</option>
                  <option>JKL-654 - Iveco Daily (Cap: 18)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Conductor Principal
                  </label>
                  <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600">
                    <option>Carlos Mendoza - Lic: A-IIIc</option>
                    <option>Luis Torres - Lic: A-IIIb</option>
                    <option>Pedro Ramírez - Lic: A-IIIc</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Copiloto (Opcional)
                  </label>
                  <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600">
                    <option value="">Sin copiloto</option>
                    <option>Ana García - Lic: A-I</option>
                    <option>María Santos - Supervisor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                  rows={3}
                  placeholder="Notas adicionales sobre el viaje..."
                ></textarea>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Save className="w-4 h-4" />
                Programar Viaje
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

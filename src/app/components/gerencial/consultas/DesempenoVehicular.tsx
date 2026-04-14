import { PageHeader } from "../../shared/PageHeader";
import { Truck, Fuel, Wrench, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { DataTable } from "../../shared/DataTable";

const vehiculosData = [
  { id: 1, placa: "ABC-123", modelo: "Mercedes Sprinter", viajes: 52, kmRecorridos: 8450, consumo: 12.5, mantenimientos: 2, estado: "Óptimo" },
  { id: 2, placa: "XYZ-789", modelo: "Volvo 9700", viajes: 48, kmRecorridos: 9200, consumo: 15.8, mantenimientos: 1, estado: "Óptimo" },
  { id: 3, placa: "DEF-456", modelo: "Scania K410", viajes: 0, kmRecorridos: 0, consumo: 0, mantenimientos: 1, estado: "Mantenimiento" },
  { id: 4, placa: "GHI-321", modelo: "Mercedes O500", viajes: 45, kmRecorridos: 7800, consumo: 14.2, mantenimientos: 2, estado: "Óptimo" },
  { id: 5, placa: "JKL-654", modelo: "Iveco Daily", viajes: 38, kmRecorridos: 5600, consumo: 11.8, mantenimientos: 3, estado: "Advertencia" },
];

const consumoMensual = [
  { mes: "Ene", consumo: 13.5 },
  { mes: "Feb", consumo: 13.2 },
  { mes: "Mar", consumo: 13.8 },
  { mes: "Abr", consumo: 13.4 },
  { mes: "May", consumo: 13.6 },
  { mes: "Jun", consumo: 13.1 },
];

export function DesempenoVehicular() {
  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Desempeño Vehicular"
        subtitle="Monitoreo y análisis de la flota"
        actions={
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Todos los vehículos</option>
              <option>Solo activos</option>
              <option>En mantenimiento</option>
            </select>
            <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Junio 2026</option>
              <option>Mayo 2026</option>
              <option>Abril 2026</option>
            </select>
          </div>
        }
      />

      <div className="p-8 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Truck className="w-10 h-10 text-indigo-600" />
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                78%
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">50</p>
            <p className="text-sm text-slate-600">Flota Total</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-emerald-600" />
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                +12%
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">183</p>
            <p className="text-sm text-slate-600">Viajes del Mes</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Fuel className="w-10 h-10 text-amber-600" />
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                -3%
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">13.1</p>
            <p className="text-sm text-slate-600">Consumo Promedio (L/100km)</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Wrench className="w-10 h-10 text-purple-600" />
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                +2
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">9</p>
            <p className="text-sm text-slate-600">Mantenimientos Programados</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Consumo Mensual de Combustible</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={consumoMensual}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mes" tick={{ fill: "#64748b" }} />
                <YAxis tick={{ fill: "#64748b" }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="consumo"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: "#f59e0b", r: 6 }}
                  name="Consumo (L/100km)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Kilómetros Recorridos (Top 5)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vehiculosData.slice(0, 5).filter(v => v.kmRecorridos > 0)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="placa" tick={{ fill: "#64748b" }} />
                <YAxis tick={{ fill: "#64748b" }} />
                <Tooltip />
                <Bar dataKey="kmRecorridos" fill="#6366f1" radius={[8, 8, 0, 0]} name="Km" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <DataTable
          title="Detalle de Vehículos"
          columns={[
            { key: "placa", label: "Placa", sortable: true },
            { key: "modelo", label: "Modelo", sortable: true },
            { key: "viajes", label: "Viajes", sortable: true },
            { key: "kmRecorridos", label: "Km Recorridos", sortable: true },
            {
              key: "consumo",
              label: "Consumo (L/100km)",
              sortable: true,
              render: (item: any) => (
                <span className="font-medium">{item.consumo || "-"}</span>
              ),
            },
            { key: "mantenimientos", label: "Mantenimientos" },
            {
              key: "estado",
              label: "Estado",
              render: (item: any) => (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.estado === "Óptimo"
                      ? "bg-emerald-100 text-emerald-700"
                      : item.estado === "Advertencia"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {item.estado}
                </span>
              ),
            },
          ]}
          data={vehiculosData}
          searchPlaceholder="Buscar vehículo..."
          onExport={() => console.log("Export")}
        />
      </div>
    </div>
  );
}

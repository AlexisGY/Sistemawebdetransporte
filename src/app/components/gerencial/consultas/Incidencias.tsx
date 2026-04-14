import { PageHeader } from "../../shared/PageHeader";
import { DataTable } from "../../shared/DataTable";
import { AlertTriangle, TrendingDown, Clock, CheckCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const incidenciasData = [
  { id: 1, fecha: "12/04/2026", tipo: "Retraso", viaje: "Lima-Arequipa #234", gravedad: "Media", estado: "Resuelta", tiempo: "45 min" },
  { id: 2, fecha: "11/04/2026", tipo: "Falla Mecánica", viaje: "Lima-Cusco #189", gravedad: "Alta", estado: "Resuelta", tiempo: "2.5 hrs" },
  { id: 3, fecha: "10/04/2026", tipo: "Queja Cliente", viaje: "Lima-Trujillo #301", gravedad: "Baja", estado: "En Proceso", tiempo: "-" },
  { id: 4, fecha: "09/04/2026", tipo: "Retraso", viaje: "Arequipa-Cusco #156", gravedad: "Media", estado: "Resuelta", tiempo: "30 min" },
  { id: 5, fecha: "08/04/2026", tipo: "Accidente Menor", viaje: "Lima-Piura #278", gravedad: "Alta", estado: "Resuelta", tiempo: "3 hrs" },
];

const porTipoData = [
  { name: "Retraso", value: 45, color: "#f59e0b" },
  { name: "Falla Mecánica", value: 25, color: "#ef4444" },
  { name: "Queja Cliente", value: 20, color: "#6366f1" },
  { name: "Otros", value: 10, color: "#8b5cf6" },
];

const tendenciaData = [
  { mes: "Ene", incidencias: 18 },
  { mes: "Feb", incidencias: 15 },
  { mes: "Mar", incidencias: 20 },
  { mes: "Abr", incidencias: 14 },
  { mes: "May", incidencias: 16 },
  { mes: "Jun", incidencias: 12 },
];

export function Incidencias() {
  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Gestión de Incidencias"
        subtitle="Monitoreo y seguimiento de eventos"
        actions={
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Todas las incidencias</option>
              <option>Resueltas</option>
              <option>En proceso</option>
              <option>Pendientes</option>
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
              <AlertTriangle className="w-10 h-10 text-amber-600" />
              <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs font-medium rounded-full">
                Total
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">12</p>
            <p className="text-sm text-slate-600">Incidencias del Mes</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingDown className="w-10 h-10 text-emerald-600" />
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                -25%
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">-4</p>
            <p className="text-sm text-slate-600">vs Mes Anterior</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-10 h-10 text-indigo-600" />
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                83%
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">10</p>
            <p className="text-sm text-slate-600">Incidencias Resueltas</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-10 h-10 text-purple-600" />
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                Promedio
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">1.2 hrs</p>
            <p className="text-sm text-slate-600">Tiempo de Resolución</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Incidencias por Tipo</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={porTipoData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {porTipoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Tendencia Mensual</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tendenciaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mes" tick={{ fill: "#64748b" }} />
                <YAxis tick={{ fill: "#64748b" }} />
                <Tooltip />
                <Bar dataKey="incidencias" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Incidencias" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <DataTable
          title="Registro de Incidencias"
          columns={[
            { key: "fecha", label: "Fecha", sortable: true },
            {
              key: "tipo",
              label: "Tipo",
              sortable: true,
              render: (item: any) => (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.tipo === "Falla Mecánica" || item.tipo === "Accidente Menor"
                      ? "bg-rose-100 text-rose-700"
                      : item.tipo === "Retraso"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {item.tipo}
                </span>
              ),
            },
            { key: "viaje", label: "Viaje" },
            {
              key: "gravedad",
              label: "Gravedad",
              render: (item: any) => (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.gravedad === "Alta"
                      ? "bg-rose-100 text-rose-700"
                      : item.gravedad === "Media"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {item.gravedad}
                </span>
              ),
            },
            {
              key: "estado",
              label: "Estado",
              render: (item: any) => (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.estado === "Resuelta"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {item.estado}
                </span>
              ),
            },
            { key: "tiempo", label: "Tiempo Resolución" },
          ]}
          data={incidenciasData}
          searchPlaceholder="Buscar incidencia..."
          onExport={() => console.log("Export")}
        />
      </div>
    </div>
  );
}

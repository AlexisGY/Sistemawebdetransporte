import { PageHeader } from "../../shared/PageHeader";
import { Users, Star, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { DataTable } from "../../shared/DataTable";

const operariosDesempeno = [
  { id: 1, nombre: "Carlos Mendoza", viajes: 45, puntualidad: 98, satisfaccion: 4.8, incidencias: 1 },
  { id: 2, nombre: "Luis Torres", viajes: 42, puntualidad: 95, satisfaccion: 4.7, incidencias: 2 },
  { id: 3, nombre: "Ana García", viajes: 38, puntualidad: 99, satisfaccion: 4.9, incidencias: 0 },
  { id: 4, nombre: "María Santos", viajes: 35, puntualidad: 92, satisfaccion: 4.5, incidencias: 3 },
  { id: 5, nombre: "Pedro Ramírez", viajes: 40, puntualidad: 97, satisfaccion: 4.6, incidencias: 1 },
];

const tendenciaData = [
  { mes: "Ene", promedio: 4.5 },
  { mes: "Feb", promedio: 4.6 },
  { mes: "Mar", promedio: 4.7 },
  { mes: "Abr", promedio: 4.6 },
  { mes: "May", promedio: 4.8 },
  { mes: "Jun", promedio: 4.7 },
];

export function DesempenoOperarios() {
  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Desempeño de Operarios"
        subtitle="Evaluación y seguimiento del personal operativo"
        actions={
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Todos los operarios</option>
              <option>Conductores</option>
              <option>Copilotos</option>
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
              <Users className="w-10 h-10 text-indigo-600" />
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                +5%
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">124</p>
            <p className="text-sm text-slate-600">Operarios Activos</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Star className="w-10 h-10 text-amber-500" />
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                +0.2
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">4.7</p>
            <p className="text-sm text-slate-600">Satisfacción Promedio</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-10 h-10 text-emerald-600" />
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                +3%
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">96%</p>
            <p className="text-sm text-slate-600">Puntualidad General</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="w-10 h-10 text-rose-600" />
              <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs font-medium rounded-full">
                -8
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">12</p>
            <p className="text-sm text-slate-600">Incidencias del Mes</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Tendencia de Satisfacción</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tendenciaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mes" tick={{ fill: "#64748b" }} />
                <YAxis domain={[0, 5]} tick={{ fill: "#64748b" }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="promedio"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: "#6366f1", r: 6 }}
                  name="Promedio"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Viajes por Operario (Top 5)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={operariosDesempeno.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fill: "#64748b" }} />
                <YAxis dataKey="nombre" type="category" tick={{ fill: "#64748b" }} width={120} />
                <Tooltip />
                <Bar dataKey="viajes" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <DataTable
          title="Detalle de Operarios"
          columns={[
            { key: "nombre", label: "Operario", sortable: true },
            { key: "viajes", label: "Viajes", sortable: true },
            {
              key: "puntualidad",
              label: "Puntualidad",
              sortable: true,
              render: (item: any) => (
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${item.puntualidad}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{item.puntualidad}%</span>
                </div>
              ),
            },
            {
              key: "satisfaccion",
              label: "Satisfacción",
              sortable: true,
              render: (item: any) => (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{item.satisfaccion}</span>
                </div>
              ),
            },
            {
              key: "incidencias",
              label: "Incidencias",
              sortable: true,
              render: (item: any) => (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.incidencias === 0
                      ? "bg-emerald-100 text-emerald-700"
                      : item.incidencias <= 2
                      ? "bg-amber-100 text-amber-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {item.incidencias}
                </span>
              ),
            },
          ]}
          data={operariosDesempeno}
          searchPlaceholder="Buscar operario..."
          onExport={() => console.log("Export")}
        />
      </div>
    </div>
  );
}

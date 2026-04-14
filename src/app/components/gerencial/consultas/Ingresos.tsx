import { PageHeader } from "../../shared/PageHeader";
import { DollarSign, TrendingUp, CreditCard, PieChart as PieChartIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const ingresosData = [
  { mes: "Ene", ingresos: 125000, gastos: 85000, utilidad: 40000 },
  { mes: "Feb", ingresos: 135000, gastos: 88000, utilidad: 47000 },
  { mes: "Mar", ingresos: 148000, gastos: 92000, utilidad: 56000 },
  { mes: "Abr", ingresos: 142000, gastos: 90000, utilidad: 52000 },
  { mes: "May", ingresos: 158000, gastos: 95000, utilidad: 63000 },
  { mes: "Jun", ingresos: 165000, gastos: 97000, utilidad: 68000 },
];

const porRutaData = [
  { name: "Lima-Arequipa", value: 32500, color: "#6366f1" },
  { name: "Lima-Cusco", value: 28900, color: "#10b981" },
  { name: "Lima-Trujillo", value: 26000, color: "#f59e0b" },
  { name: "Otros", value: 77600, color: "#8b5cf6" },
];

const metodoPagoData = [
  { metodo: "Efectivo", monto: 58000, porcentaje: 35 },
  { metodo: "Tarjeta", monto: 82500, porcentaje: 50 },
  { metodo: "Transferencia", monto: 24500, porcentaje: 15 },
];

export function Ingresos() {
  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Análisis de Ingresos"
        subtitle="Seguimiento financiero y rentabilidad"
        actions={
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Este mes</option>
              <option>Últimos 3 meses</option>
              <option>Últimos 6 meses</option>
              <option>Este año</option>
            </select>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              Exportar Reporte
            </button>
          </div>
        }
      />

      <div className="p-8 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-10 h-10 text-emerald-600" />
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                +8.5%
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">S/ 165,000</p>
            <p className="text-sm text-slate-600">Ingresos del Mes</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-indigo-600" />
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                +12.1%
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">S/ 68,000</p>
            <p className="text-sm text-slate-600">Utilidad Neta</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="w-10 h-10 text-purple-600" />
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                50%
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">S/ 82,500</p>
            <p className="text-sm text-slate-600">Pagos con Tarjeta</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <PieChartIcon className="w-10 h-10 text-amber-600" />
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                41%
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">41.2%</p>
            <p className="text-sm text-slate-600">Margen de Utilidad</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Evolución de Ingresos y Utilidad</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ingresosData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mes" tick={{ fill: "#64748b" }} />
                <YAxis tick={{ fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ingresos"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 6 }}
                  name="Ingresos"
                />
                <Line
                  type="monotone"
                  dataKey="utilidad"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: "#6366f1", r: 6 }}
                  name="Utilidad"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Ingresos por Ruta</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={porRutaData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {porRutaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Ingresos vs Gastos Mensuales</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ingresosData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mes" tick={{ fill: "#64748b" }} />
                <YAxis tick={{ fill: "#64748b" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="ingresos" fill="#10b981" radius={[8, 8, 0, 0]} name="Ingresos" />
                <Bar dataKey="gastos" fill="#ef4444" radius={[8, 8, 0, 0]} name="Gastos" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Métodos de Pago</h3>
            <div className="space-y-4">
              {metodoPagoData.map((metodo, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{metodo.metodo}</span>
                    <span className="text-sm font-bold text-slate-900">
                      S/ {metodo.monto.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-indigo-600 h-3 rounded-full transition-all"
                        style={{ width: `${metodo.porcentaje}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-600 w-12">{metodo.porcentaje}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="text-xl font-bold text-emerald-600">
                  S/ {metodoPagoData.reduce((sum, m) => sum + m.monto, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

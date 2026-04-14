import { PageHeader } from "../../shared/PageHeader";
import { KPICard } from "../../shared/KPICard";
import {
  DollarSign,
  TrendingUp,
  Users,
  Truck,
  Star,
  Clock,
  Target,
  AlertTriangle,
  ThumbsUp,
  Percent,
  Calendar,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const kpiEvolutionData = [
  { mes: "Ene", satisfaccion: 4.5, puntualidad: 92, ocupacion: 72 },
  { mes: "Feb", satisfaccion: 4.6, puntualidad: 93, ocupacion: 74 },
  { mes: "Mar", satisfaccion: 4.7, puntualidad: 94, ocupacion: 76 },
  { mes: "Abr", satisfaccion: 4.6, puntualidad: 92, ocupacion: 75 },
  { mes: "May", satisfaccion: 4.8, puntualidad: 95, ocupacion: 78 },
  { mes: "Jun", satisfaccion: 4.7, puntualidad: 96, ocupacion: 78 },
];

const radarData = [
  { categoria: "Satisfacción", valor: 94, fullMark: 100 },
  { categoria: "Puntualidad", valor: 96, fullMark: 100 },
  { categoria: "Ocupación", valor: 78, fullMark: 100 },
  { categoria: "Rentabilidad", valor: 85, fullMark: 100 },
  { categoria: "Seguridad", valor: 98, fullMark: 100 },
  { categoria: "Eficiencia", valor: 88, fullMark: 100 },
];

export function IndicadoresKPI() {
  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Indicadores KPI"
        subtitle="Métricas clave de desempeño empresarial"
        actions={
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Vista Mensual</option>
              <option>Vista Trimestral</option>
              <option>Vista Anual</option>
            </select>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              Generar Dashboard
            </button>
          </div>
        }
      />

      <div className="p-8 space-y-6">
        {/* KPIs Financieros */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">KPIs Financieros</h3>
          <div className="grid grid-cols-4 gap-6">
            <KPICard
              title="Ingresos Mensuales"
              value="S/ 165K"
              change={8.5}
              icon={DollarSign}
              color="emerald"
            />
            <KPICard
              title="Margen de Utilidad"
              value="41.2%"
              change={3.2}
              icon={TrendingUp}
              color="indigo"
            />
            <KPICard
              title="Ticket Promedio"
              value="S/ 85"
              change={5.1}
              icon={Target}
              color="purple"
            />
            <KPICard
              title="ROI Mensual"
              value="22.5%"
              change={4.8}
              icon={Percent}
              color="amber"
            />
          </div>
        </div>

        {/* KPIs Operacionales */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">KPIs Operacionales</h3>
          <div className="grid grid-cols-4 gap-6">
            <KPICard
              title="Ocupación Promedio"
              value="78%"
              change={5.2}
              icon={Users}
              color="emerald"
            />
            <KPICard
              title="Puntualidad"
              value="96%"
              change={3.1}
              icon={Clock}
              color="indigo"
            />
            <KPICard
              title="Disponibilidad Flota"
              value="94%"
              change={2.5}
              icon={Truck}
              color="purple"
            />
            <KPICard
              title="Viajes Completados"
              value="198"
              change={12.3}
              icon={Calendar}
              color="blue"
            />
          </div>
        </div>

        {/* KPIs de Calidad */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">KPIs de Calidad</h3>
          <div className="grid grid-cols-4 gap-6">
            <KPICard
              title="Satisfacción Cliente"
              value="4.7/5"
              change={4.2}
              icon={Star}
              color="amber"
            />
            <KPICard
              title="NPS Score"
              value="68"
              change={6.5}
              icon={ThumbsUp}
              color="emerald"
            />
            <KPICard
              title="Tasa de Incidencias"
              value="0.6%"
              change={-15.4}
              icon={AlertTriangle}
              color="rose"
            />
            <KPICard
              title="Cumplimiento Servicio"
              value="98.5%"
              change={2.8}
              icon={Target}
              color="indigo"
            />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Evolución de KPIs Principales</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={kpiEvolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mes" tick={{ fill: "#64748b" }} />
                <YAxis tick={{ fill: "#64748b" }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="satisfaccion"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  name="Satisfacción"
                />
                <Line
                  type="monotone"
                  dataKey="puntualidad"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  name="Puntualidad %"
                />
                <Line
                  type="monotone"
                  dataKey="ocupacion"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  name="Ocupación %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Radar de Desempeño</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="categoria" tick={{ fill: "#64748b", fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#64748b" }} />
                <Radar
                  name="Desempeño"
                  dataKey="valor"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Resumen de Desempeño</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-600">Objetivos Cumplidos</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Ingresos</span>
                  <span className="text-sm font-bold text-emerald-600">✓ 105%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Ocupación</span>
                  <span className="text-sm font-bold text-emerald-600">✓ 98%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Satisfacción</span>
                  <span className="text-sm font-bold text-emerald-600">✓ 112%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-600">En Progreso</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Puntualidad</span>
                  <span className="text-sm font-bold text-amber-600">⚠ 96%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Eficiencia</span>
                  <span className="text-sm font-bold text-amber-600">⚠ 88%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-600">Índice Global</h4>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-4xl font-bold text-indigo-600">87.5</div>
                  <p className="text-sm text-slate-600 mt-1">Puntuación General</p>
                </div>
                <div className="w-24 h-24 rounded-full border-8 border-indigo-600 flex items-center justify-center bg-indigo-50">
                  <span className="text-lg font-bold text-indigo-600">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

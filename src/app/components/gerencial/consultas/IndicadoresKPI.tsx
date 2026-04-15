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
    <div className="min-h-full bg-background">
      <PageHeader
        title="Indicadores KPI"
        subtitle="Métricas clave de desempeño empresarial"
        actions={
          <div className="flex items-center gap-3">
            <select className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option>Vista Mensual</option>
              <option>Vista Trimestral</option>
              <option>Vista Anual</option>
            </select>
            <button className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90">
              Generar Dashboard
            </button>
          </div>
        }
      />

      <div className="p-8 space-y-6">
        {/* KPIs Financieros */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-foreground">KPIs Financieros</h3>
          <div className="grid grid-cols-4 gap-6">
            <KPICard title="Ingresos Mensuales" value="S/ 165K" change={8.5} icon={DollarSign} variant="secondary" />
            <KPICard title="Margen de Utilidad" value="41.2%" change={3.2} icon={TrendingUp} variant="secondary" />
            <KPICard title="Ticket Promedio" value="S/ 85" change={5.1} icon={Target} variant="secondary" />
            <KPICard title="ROI Mensual" value="22.5%" change={4.8} icon={Percent} variant="secondary" />
          </div>
        </div>

        {/* KPIs Operacionales */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-foreground">KPIs Operacionales</h3>
          <div className="grid grid-cols-4 gap-6">
            <KPICard title="Ocupación Promedio" value="78%" change={5.2} icon={Users} variant="secondary" />
            <KPICard title="Puntualidad" value="96%" change={3.1} icon={Clock} variant="secondary" />
            <KPICard title="Disponibilidad Flota" value="94%" change={2.5} icon={Truck} variant="secondary" />
            <KPICard title="Viajes Completados" value="198" change={12.3} icon={Calendar} variant="secondary" />
          </div>
        </div>

        {/* KPIs de Calidad */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-foreground">KPIs de Calidad</h3>
          <div className="grid grid-cols-4 gap-6">
            <KPICard title="Satisfacción Cliente" value="4.7/5" change={4.2} icon={Star} variant="secondary" />
            <KPICard title="NPS Score" value="68" change={6.5} icon={ThumbsUp} variant="secondary" />
            <KPICard
              title="Tasa de Incidencias"
              value="0.6%"
              change={-15.4}
              icon={AlertTriangle}
              variant="destructive"
            />
            <KPICard title="Cumplimiento Servicio" value="98.5%" change={2.8} icon={Target} variant="secondary" />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-foreground">Evolución de KPIs Principales</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={kpiEvolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" tick={{ fill: "var(--muted-foreground)" }} />
                <YAxis tick={{ fill: "var(--muted-foreground)" }} />
                <Tooltip
                  labelStyle={{
                    color: "var(--foreground)",
                    fontWeight: 600,
                  }}
                  itemStyle={{
                    color: "var(--foreground)",
                    fontWeight: 500,
                  }}
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
                    color: "var(--foreground)",
                  }}
                />
                <Legend wrapperStyle={{ color: "var(--muted-foreground)" }} />
                <Line
                  type="monotone"
                  dataKey="satisfaccion"
                  stroke="var(--muted-foreground)"
                  strokeDasharray="5 4"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "var(--muted-foreground)" }}
                  name="Satisfacción"
                />
                <Line
                  type="monotone"
                  dataKey="puntualidad"
                  stroke="var(--foreground)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "var(--foreground)" }}
                  name="Puntualidad %"
                />
                <Line
                  type="monotone"
                  dataKey="ocupacion"
                  stroke="#4b5563"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#4b5563" }}
                  name="Ocupación %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-foreground">Radar de Desempeño</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="categoria" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "var(--muted-foreground)" }} />
                <Radar
                  name="Desempeño"
                  dataKey="valor"
                  stroke="var(--foreground)"
                  fill="#9ca3af"
                  fillOpacity={0.28}
                  strokeWidth={2}
                />
                <Tooltip
                  labelStyle={{
                    color: "var(--foreground)",
                    fontWeight: 600,
                  }}
                  itemStyle={{
                    color: "var(--foreground)",
                    fontWeight: 500,
                  }}
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
                    color: "var(--foreground)",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-foreground">Resumen de Desempeño</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Objetivos Cumplidos</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Ingresos</span>
                  <span className="text-sm font-bold text-emerald-700">✓ 105%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Ocupación</span>
                  <span className="text-sm font-bold text-emerald-700">✓ 98%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Satisfacción</span>
                  <span className="text-sm font-bold text-emerald-700">✓ 112%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">En Progreso</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Puntualidad</span>
                  <span className="text-sm font-bold text-amber-600">⚠ 96%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Eficiencia</span>
                  <span className="text-sm font-bold text-amber-600">⚠ 88%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Índice Global</h4>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-4xl font-bold text-foreground">87.5</div>
                  <p className="mt-1 text-sm text-muted-foreground">Puntuación General</p>
                </div>
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-8 border-foreground bg-muted">
                  <span className="text-lg font-bold text-foreground">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

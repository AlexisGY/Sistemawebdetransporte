import { PageHeader } from "../../shared/PageHeader";
import { Users, TrendingUp, Calendar, PieChart as PieChartIcon } from "lucide-react";
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

const ocupacionSemanalData = [
  { dia: "Lun", ocupacion: 65, capacidad: 100 },
  { dia: "Mar", ocupacion: 58, capacidad: 100 },
  { dia: "Mié", ocupacion: 72, capacidad: 100 },
  { dia: "Jue", ocupacion: 68, capacidad: 100 },
  { dia: "Vie", ocupacion: 85, capacidad: 100 },
  { dia: "Sáb", ocupacion: 92, capacidad: 100 },
  { dia: "Dom", ocupacion: 88, capacidad: 100 },
];

const demandaPorRutaData = [
  { ruta: "Lima-Arequipa", demanda: 420, capacidad: 500 },
  { ruta: "Lima-Cusco", demanda: 380, capacidad: 450 },
  { ruta: "Lima-Trujillo", demanda: 520, capacidad: 600 },
  { ruta: "Arequipa-Cusco", demanda: 280, capacidad: 350 },
  { ruta: "Lima-Piura", demanda: 350, capacidad: 400 },
];

const porHorarioData = [
  { name: "Madrugada (00-06)", value: 12, color: "#111111" },
  { name: "Mañana (06-12)", value: 35, color: "#4b5563" },
  { name: "Tarde (12-18)", value: 28, color: "#6b7280" },
  { name: "Noche (18-00)", value: 25, color: "#9ca3af" },
];

export function DemandaOcupacion() {
  return (
    <div className="min-h-full bg-background">
      <PageHeader
        title="Demanda y Ocupación"
        subtitle="Análisis de utilización de capacidad"
        actions={
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground">
              <option>Esta semana</option>
              <option>Semana anterior</option>
              <option>Este mes</option>
            </select>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              Exportar Análisis
            </button>
          </div>
        }
      />

      <div className="p-8 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-10 h-10 text-foreground" />
              <span className="px-2 py-1 bg-muted text-foreground text-xs font-medium rounded-full border border-border">
                +8%
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">78%</p>
            <p className="text-sm text-muted-foreground">Ocupación Promedio</p>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-foreground" />
              <span className="px-2 py-1 bg-muted text-foreground text-xs font-medium rounded-full border border-border">
                Pico
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">92%</p>
            <p className="text-sm text-muted-foreground">Ocupación Máxima (Sáb)</p>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-10 h-10 text-foreground" />
              <span className="px-2 py-1 bg-muted text-foreground text-xs font-medium rounded-full border border-border">
                Valle
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">58%</p>
            <p className="text-sm text-muted-foreground">Ocupación Mínima (Mar)</p>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <PieChartIcon className="w-10 h-10 text-foreground" />
              <span className="px-2 py-1 bg-muted text-foreground text-xs font-medium rounded-full border border-border">
                Total
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">1,950</p>
            <p className="text-sm text-muted-foreground">Pasajeros esta Semana</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Ocupación Semanal</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ocupacionSemanalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="dia" tick={{ fill: "var(--muted-foreground)" }} />
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
                <Legend />
                <Bar dataKey="ocupacion" fill="var(--foreground)" radius={[8, 8, 0, 0]} name="Ocupación %" />
                <Bar dataKey="capacidad" fill="var(--muted-foreground)" radius={[8, 8, 0, 0]} name="Capacidad %" opacity={0.45} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Distribución por Horario</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={porHorarioData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  labelLine={{ stroke: "var(--muted-foreground)" }}
                  label={(props: any) => {
                    const { cx, cy, midAngle, outerRadius, value } = props;
                    const RADIAN = Math.PI / 180;
                    const radius = outerRadius + 14;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="var(--foreground)"
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                        fontSize={13}
                        fontWeight={500}
                      >
                        {`${value}%`}
                      </text>
                    );
                  }}
                >
                  {porHorarioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
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
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {porHorarioData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Demanda por Ruta (tabla de resultados) */}
        <div className="bg-card rounded-xl shadow-sm border border-border">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 className="font-semibold text-foreground">Demanda por ruta</h3>
            <span className="text-xs text-muted-foreground">Última actualización: 30/06/2026 03:45</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/35 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Ruta</th>
                  <th className="px-6 py-3 text-right font-semibold">Demanda</th>
                  <th className="px-6 py-3 text-right font-semibold">Capacidad</th>
                  <th className="px-6 py-3 text-right font-semibold">Ocupación</th>
                  <th className="px-6 py-3 text-left font-semibold">Nivel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {demandaPorRutaData.map((ruta) => {
                  const pct = Math.round((ruta.demanda / ruta.capacidad) * 100);
                  const nivel = pct >= 85 ? "Alta" : pct >= 70 ? "Media" : "Baja";
                  return (
                    <tr key={ruta.ruta}>
                      <td className="px-6 py-3 font-medium text-foreground">{ruta.ruta}</td>
                      <td className="px-6 py-3 text-right text-foreground">{ruta.demanda}</td>
                      <td className="px-6 py-3 text-right text-muted-foreground">{ruta.capacidad}</td>
                      <td className="px-6 py-3 text-right font-semibold text-foreground">{pct}%</td>
                      <td className="px-6 py-3">
                        <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-foreground">
                          {nivel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center border border-border">
                <TrendingUp className="w-6 h-6 text-foreground" />
              </div>
              <h4 className="font-semibold text-foreground">Alta Demanda</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Los fines de semana presentan ocupación del 90%. Considere agregar más servicios.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center border border-border">
                <Calendar className="w-6 h-6 text-foreground" />
              </div>
              <h4 className="font-semibold text-foreground">Optimización</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Martes y miércoles tienen baja ocupación. Evalúe reducir frecuencias.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center border border-border">
                <Users className="w-6 h-6 text-foreground" />
              </div>
              <h4 className="font-semibold text-foreground">Horario Pico</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              El 35% de la demanda se concentra en horarios de mañana (06-12).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}




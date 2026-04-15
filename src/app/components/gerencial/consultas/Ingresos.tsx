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
  { name: "Lima-Arequipa", value: 32500, color: "var(--foreground)" },
  { name: "Lima-Cusco", value: 28900, color: "#5f5f5f" },
  { name: "Lima-Trujillo", value: 26000, color: "#8a8a8a" },
  { name: "Otros", value: 77600, color: "#b0b0b0" },
];

const metodoPagoData = [
  { metodo: "Efectivo", monto: 58000, porcentaje: 35 },
  { metodo: "Tarjeta", monto: 82500, porcentaje: 50 },
  { metodo: "Transferencia", monto: 24500, porcentaje: 15 },
];

export function Ingresos() {
  return (
    <div className="min-h-full bg-background">
      <PageHeader
        title="Análisis de Ingresos"
        subtitle="Seguimiento financiero y rentabilidad"
        actions={
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground">
              <option>Este mes</option>
              <option>Últimos 3 meses</option>
              <option>Últimos 6 meses</option>
              <option>Este año</option>
            </select>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              Exportar Reporte
            </button>
          </div>
        }
      />

      <div className="p-8 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-10 h-10 text-foreground" />
              <span className="px-2 py-1 bg-muted text-foreground text-xs font-medium rounded-full border border-border">
                +8.5%
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">S/ 165,000</p>
            <p className="text-sm text-muted-foreground">Ingresos del Mes</p>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-foreground" />
              <span className="px-2 py-1 bg-muted text-foreground text-xs font-medium rounded-full border border-border">
                +12.1%
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">S/ 68,000</p>
            <p className="text-sm text-muted-foreground">Utilidad Neta</p>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="w-10 h-10 text-foreground" />
              <span className="px-2 py-1 bg-muted text-foreground text-xs font-medium rounded-full border border-border">
                50%
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">S/ 82,500</p>
            <p className="text-sm text-muted-foreground">Ingresos por tarjeta</p>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <PieChartIcon className="w-10 h-10 text-foreground" />
              <span className="px-2 py-1 bg-muted text-foreground text-xs font-medium rounded-full border border-border">
                41%
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">41.2%</p>
            <p className="text-sm text-muted-foreground">Margen de Utilidad</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Evolución de Ingresos y Utilidad</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ingresosData}>
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ingresos"
                  stroke="var(--foreground)"
                  strokeWidth={3}
                  dot={{ fill: "var(--foreground)", r: 6 }}
                  name="Ingresos"
                />
                <Line
                  type="monotone"
                  dataKey="utilidad"
                  stroke="var(--muted-foreground)"
                  strokeWidth={3}
                  dot={{ fill: "var(--muted-foreground)", r: 6 }}
                  name="Utilidad"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Ingresos por Ruta</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={porRutaData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    labelLine={{ stroke: "var(--muted-foreground)" }}
                    label={(props: any) => {
                      const { cx, cy, midAngle, outerRadius, name, percent } = props;
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius + 18;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);

                      return (
                        <text
                          x={x}
                          y={y}
                          fill="var(--foreground)"
                          textAnchor={x > cx ? "start" : "end"}
                          dominantBaseline="central"
                          fontSize={14}
                          fontWeight={500}
                        >
                          {`${name} ${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
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
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Ingresos vs Gastos Mensuales</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ingresosData}>
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
                <Legend />
                <Bar dataKey="ingresos" fill="var(--foreground)" radius={[8, 8, 0, 0]} name="Ingresos" />
                <Bar dataKey="gastos" fill="var(--muted-foreground)" radius={[8, 8, 0, 0]} name="Gastos" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Métodos de Pago</h3>
            <div className="space-y-4">
              {metodoPagoData.map((metodo, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{metodo.metodo}</span>
                    <span className="text-sm font-bold text-foreground">
                      S/ {metodo.monto.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-muted rounded-full h-3">
                      <div
                        className="bg-foreground h-3 rounded-full transition-all"
                        style={{ width: `${metodo.porcentaje}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground w-12">{metodo.porcentaje}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-foreground">
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




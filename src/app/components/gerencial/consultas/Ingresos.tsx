import { CreditCard, DollarSign, Receipt, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "../../shared/PageHeader";
import { KPICard } from "../../shared/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

// GER-04 — Consulta de ingresos.
// Nota (arquitectura §2.1.2.3): mientras no se modelen costos operativos, esta
// consulta presenta SOLO ingresos. No muestra utilidad, margen ni rentabilidad.

const ingresosMensuales = [
  { mes: "Ene", ingresos: 125000 },
  { mes: "Feb", ingresos: 135000 },
  { mes: "Mar", ingresos: 148000 },
  { mes: "Abr", ingresos: 142000 },
  { mes: "May", ingresos: 158000 },
  { mes: "Jun", ingresos: 165000 },
];

const ingresosPorRuta = [
  { name: "Lima - Arequipa", value: 52500, color: "var(--foreground)" },
  { name: "Lima - Cusco", value: 41900, color: "#5f5f5f" },
  { name: "Lima - Trujillo", value: 36000, color: "#8a8a8a" },
  { name: "Otros", value: 34600, color: "#b0b0b0" },
];

const ingresosPorServicio = [
  { servicio: "Pasajeros", ingresos: 98000 },
  { servicio: "Carga general", ingresos: 41000 },
  { servicio: "Carga refrigerada", ingresos: 18500 },
  { servicio: "Ejecutivo VIP", ingresos: 7500 },
];

const metodoPagoData = [
  { metodo: "Efectivo", monto: 58000, porcentaje: 35 },
  { metodo: "Tarjeta", monto: 82500, porcentaje: 50 },
  { metodo: "Transferencia", monto: 24500, porcentaje: 15 },
];

const tablaIngresos = [
  { ruta: "Lima - Arequipa", servicio: "Pasajeros", boletas: 412, ingresos: 52500 },
  { ruta: "Lima - Cusco", servicio: "Pasajeros", boletas: 318, ingresos: 41900 },
  { ruta: "Lima - Trujillo", servicio: "Carga general", boletas: 96, ingresos: 36000 },
  { ruta: "Lima - Piura", servicio: "Carga refrigerada", boletas: 54, ingresos: 18500 },
  { ruta: "Arequipa - Cusco", servicio: "Ejecutivo VIP", boletas: 38, ingresos: 16100 },
];

const totalIngresos = tablaIngresos.reduce((sum, r) => sum + r.ingresos, 0);
const totalBoletas = tablaIngresos.reduce((sum, r) => sum + r.boletas, 0);

const selectClass =
  "h-10 rounded-xl border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

const tooltipStyle = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  color: "var(--foreground)",
} as const;

export function Ingresos() {
  return (
    <div className="min-h-full bg-background">
      <PageHeader
        title="Consulta de ingresos"
        subtitle="Análisis de ingresos por ruta, servicio, horario o periodo. No incluye costos ni utilidad."
        actions={
          <button className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Exportar reporte
          </button>
        }
      />

      <div className="space-y-6 p-6 lg:p-8">
        {/* Filtros */}
        <Card className="border-border/70 bg-card/90">
          <CardContent className="flex flex-wrap items-end gap-4 p-5">
            <FilterField label="Periodo">
              <select className={selectClass} defaultValue="6m">
                <option value="1m">Este mes</option>
                <option value="3m">Últimos 3 meses</option>
                <option value="6m">Últimos 6 meses</option>
                <option value="1y">Este año</option>
              </select>
            </FilterField>
            <FilterField label="Ruta">
              <select className={selectClass} defaultValue="">
                <option value="">Todas</option>
                <option>Lima - Arequipa</option>
                <option>Lima - Cusco</option>
                <option>Lima - Trujillo</option>
              </select>
            </FilterField>
            <FilterField label="Servicio">
              <select className={selectClass} defaultValue="">
                <option value="">Todos</option>
                <option>Pasajeros</option>
                <option>Carga general</option>
                <option>Carga refrigerada</option>
                <option>Ejecutivo VIP</option>
              </select>
            </FilterField>
            <p className="ml-auto text-xs text-muted-foreground">Última actualización: 30/06/2026 03:45</p>
          </CardContent>
        </Card>

        {/* KPIs (solo ingresos) */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <KPICard title="Ingresos del mes" value="S/ 165,000" change={8.5} icon={DollarSign} />
          <KPICard title="Ingresos por tarjeta" value="S/ 82,500" icon={CreditCard} variant="secondary" subtitle="50% del total" />
          <KPICard title="Boletas emitidas" value={totalBoletas} icon={Receipt} variant="accent" subtitle="En el periodo" />
          <KPICard title="Ingreso promedio / boleta" value={`S/ ${Math.round(totalIngresos / totalBoletas)}`} icon={TrendingUp} />
        </div>

        {/* Gráficas */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/70 bg-card/90">
            <CardHeader className="border-b border-border/60">
              <CardTitle className="text-base font-semibold">Evolución de ingresos</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ingresosMensuales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="mes" tick={{ fill: "var(--muted-foreground)" }} />
                  <YAxis tick={{ fill: "var(--muted-foreground)" }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="ingresos" stroke="var(--foreground)" strokeWidth={3} dot={{ r: 5 }} name="Ingresos" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90">
            <CardHeader className="border-b border-border/60">
              <CardTitle className="text-base font-semibold">Ingresos por ruta</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={ingresosPorRuta} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={(p: any) => `${p.name} ${(p.percent * 100).toFixed(0)}%`}>
                    {ingresosPorRuta.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90">
            <CardHeader className="border-b border-border/60">
              <CardTitle className="text-base font-semibold">Ingresos por servicio</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ingresosPorServicio}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="servicio" tick={{ fill: "var(--muted-foreground)" }} />
                  <YAxis tick={{ fill: "var(--muted-foreground)" }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="ingresos" fill="var(--foreground)" radius={[8, 8, 0, 0]} name="Ingresos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90">
            <CardHeader className="border-b border-border/60">
              <CardTitle className="text-base font-semibold">Ingresos por método de pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {metodoPagoData.map((m) => (
                <div key={m.metodo} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{m.metodo}</span>
                    <span className="font-bold text-foreground">S/ {m.monto.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-3 flex-1 rounded-full bg-muted">
                      <div className="h-3 rounded-full bg-foreground" style={{ width: `${m.porcentaje}%` }} />
                    </div>
                    <span className="w-12 text-sm text-muted-foreground">{m.porcentaje}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Tabla de resultados */}
        <Card className="border-border/70 bg-card/90">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="text-base font-semibold">Detalle de ingresos por ruta y servicio</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/35 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Ruta</th>
                    <th className="px-6 py-3 text-left font-semibold">Servicio</th>
                    <th className="px-6 py-3 text-right font-semibold">Boletas</th>
                    <th className="px-6 py-3 text-right font-semibold">Ingresos (S/)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {tablaIngresos.map((row) => (
                    <tr key={`${row.ruta}-${row.servicio}`}>
                      <td className="px-6 py-3 font-medium text-foreground">{row.ruta}</td>
                      <td className="px-6 py-3 text-muted-foreground">{row.servicio}</td>
                      <td className="px-6 py-3 text-right text-foreground">{row.boletas}</td>
                      <td className="px-6 py-3 text-right font-semibold text-foreground">{row.ingresos.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border/60 bg-muted/20">
                    <td className="px-6 py-3 font-bold text-foreground" colSpan={2}>Total</td>
                    <td className="px-6 py-3 text-right font-bold text-foreground">{totalBoletas}</td>
                    <td className="px-6 py-3 text-right font-bold text-foreground">S/ {totalIngresos.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

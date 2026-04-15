import { PageHeader } from "../../shared/PageHeader";
import { DataTable } from "../../shared/DataTable";
import { AlertTriangle, TrendingDown, Clock, CheckCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const incidenciasData = [
  { id: 1, fecha: "12/04/2026", tipo: "Retraso", viaje: "Lima-Arequipa #234", gravedad: "Media", estado: "Resuelta", tiempo: "45 min" },
  { id: 2, fecha: "11/04/2026", tipo: "Falla Mec谩nica", viaje: "Lima-Cusco #189", gravedad: "Alta", estado: "Resuelta", tiempo: "2.5 hrs" },
  { id: 3, fecha: "10/04/2026", tipo: "Queja Cliente", viaje: "Lima-Trujillo #301", gravedad: "Baja", estado: "En Proceso", tiempo: "-" },
  { id: 4, fecha: "09/04/2026", tipo: "Retraso", viaje: "Arequipa-Cusco #156", gravedad: "Media", estado: "Resuelta", tiempo: "30 min" },
  { id: 5, fecha: "08/04/2026", tipo: "Accidente Menor", viaje: "Lima-Piura #278", gravedad: "Alta", estado: "Resuelta", tiempo: "3 hrs" },
];

const porTipoData = [
  { name: "Retraso", value: 45, color: "#6b7280" },
  { name: "Falla Mec谩nica", value: 25, color: "#dc2626" },
  { name: "Queja Cliente", value: 20, color: "#4b5563" },
  { name: "Otros", value: 10, color: "#9ca3af" },
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
    <div className="min-h-full bg-background">
      <PageHeader
        title="Gesti贸n de Incidencias"
        subtitle="Monitoreo y seguimiento de eventos"
        actions={
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground">
              <option>Todas las incidencias</option>
              <option>Resueltas</option>
              <option>En proceso</option>
              <option>Pendientes</option>
            </select>
            <select className="px-4 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground">
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
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="w-10 h-10 text-destructive" />
              <span className="px-2 py-1 bg-muted text-foreground text-xs font-semibold rounded-full border border-border">
                Total
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">12</p>
            <p className="text-sm text-muted-foreground">Incidencias del Mes</p>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingDown className="w-10 h-10 text-foreground" />
              <span className="px-2 py-1 bg-muted text-foreground text-xs font-medium rounded-full border border-border">
                -25%
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">-4</p>
            <p className="text-sm text-muted-foreground">vs Mes Anterior</p>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-700" />
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                83%
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">10</p>
            <p className="text-sm text-muted-foreground">Incidencias Resueltas</p>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-10 h-10 text-foreground" />
              <span className="px-2 py-1 bg-muted text-foreground text-xs font-medium rounded-full border border-border">
                Promedio
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">1.2 hrs</p>
            <p className="text-sm text-muted-foreground">Tiempo de Resoluci贸n</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Incidencias por Tipo</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={porTipoData}
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
                  {porTipoData.map((entry, index) => (
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
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Tendencia Mensual</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tendenciaData}>
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
                <Bar dataKey="incidencias" fill="var(--muted-foreground)" radius={[8, 8, 0, 0]} name="Incidencias" />
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
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-muted text-foreground border border-border">
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
                      ? "bg-destructive/20 text-destructive border border-destructive/30"
                      : item.gravedad === "Media"
                      ? "bg-muted text-foreground border border-border"
                      : "bg-background text-muted-foreground border border-border"
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
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : "bg-amber-100 text-amber-700 border border-amber-200"
                  }`}
                >
                  {item.estado}
                </span>
              ),
            },
            { key: "tiempo", label: "Tiempo Resoluci贸n" },
          ]}
          data={incidenciasData}
          searchPlaceholder="Buscar incidencia..."
          onExport={() => console.log("Export")}
        />
      </div>
    </div>
  );
}
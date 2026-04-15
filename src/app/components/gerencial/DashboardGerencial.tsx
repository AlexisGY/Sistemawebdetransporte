import { KPICard } from "../shared/KPICard";
import { PageHeader } from "../shared/PageHeader";
import {
  DollarSign,
  TrendingUp,
  Truck,
  Users,
  AlertTriangle,
  CheckCircle,
  Calendar,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ingresosData = [
  { mes: "Ene", ingresos: 125000, gastos: 85000 },
  { mes: "Feb", ingresos: 135000, gastos: 88000 },
  { mes: "Mar", ingresos: 148000, gastos: 92000 },
  { mes: "Abr", ingresos: 142000, gastos: 90000 },
  { mes: "May", ingresos: 158000, gastos: 95000 },
  { mes: "Jun", ingresos: 165000, gastos: 97000 },
];

const ocupacionData = [
  { name: "Ocupado", value: 78, color: "hsl(var(--primary))" },
  { name: "Disponible", value: 22, color: "hsl(var(--border))" },
];

const rutasData = [
  { ruta: "Lima - Arequipa", viajes: 45, ingresos: 32500 },
  { ruta: "Lima - Cusco", viajes: 38, ingresos: 28900 },
  { ruta: "Lima - Trujillo", viajes: 52, ingresos: 26000 },
  { ruta: "Arequipa - Cusco", viajes: 28, ingresos: 18500 },
  { ruta: "Lima - Piura", viajes: 35, ingresos: 24800 },
];

export function DashboardGerencial() {
  return (
    <div className="min-h-full bg-background">
      <PageHeader
        title="Dashboard Gerencial"
        subtitle="Visión general del desempeño empresarial"
      />

      <div className="p-8 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-6">
          <KPICard
            title="Ingresos del Mes"
            value="S/ 165,000"
            change={8.5}
            icon={DollarSign}
            variant="primary"
            subtitle="Junio 2026"
          />
          <KPICard
            title="Viajes Realizados"
            value="198"
            change={12.3}
            icon={Truck}
            variant="primary"
            subtitle="Este mes"
          />
          <KPICard
            title="Ocupación Promedio"
            value="78%"
            change={5.2}
            icon={TrendingUp}
            variant="secondary"
            subtitle="Capacidad utilizada"
          />
          <KPICard
            title="Incidencias"
            value="12"
            change={-15.4}
            icon={AlertTriangle}
            variant="destructive"
            subtitle="Reducción mensual"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-2 gap-6">
          {/* Ingresos y Gastos */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-foreground">Ingresos vs Gastos</h3>
                <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
              </div>
              <select className="px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground">
                <option>2026</option>
                <option>2025</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ingresosData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Legend />
                <Bar dataKey="ingresos" fill="hsl(var(--primary))" name="Ingresos" radius={[8, 8, 0, 0]} />
                <Bar dataKey="gastos" fill="hsl(var(--accent))" name="Gastos" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ocupación */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-foreground">Ocupación de Flota</h3>
                <p className="text-sm text-muted-foreground">Estado actual</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-64 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ocupacionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {ocupacionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="ml-8 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-primary rounded"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Ocupado</p>
                    <p className="text-xs text-muted-foreground">78% (39 vehículos)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-border rounded"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Disponible</p>
                    <p className="text-xs text-muted-foreground">22% (11 vehículos)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rutas más Rentables */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Rutas más Rentables</h3>
              <p className="text-sm text-muted-foreground">Top 5 del mes</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-primary hover:bg-muted rounded-lg transition-colors">
              Ver detalle completo
            </button>
          </div>
          <div className="space-y-4">
            {rutasData.map((ruta, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <span className="font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{ruta.ruta}</p>
                    <p className="text-sm text-muted-foreground">{ruta.viajes} viajes realizados</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">S/ {ruta.ingresos.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Ingresos</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-primary rounded-xl shadow-lg p-6 text-primary-foreground">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium bg-primary-foreground/20 px-3 py-1 rounded-full">Activos</span>
            </div>
            <p className="text-3xl font-bold mb-1">124</p>
            <p className="text-primary-foreground/80">Operarios en Servicio</p>
          </div>

          <div className="bg-accent rounded-xl shadow-lg p-6 text-accent-foreground">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium bg-accent-foreground/20 px-3 py-1 rounded-full">Hoy</span>
            </div>
            <p className="text-3xl font-bold mb-1">42</p>
            <p className="text-accent-foreground/80">Viajes Completados</p>
          </div>

          <div className="bg-secondary rounded-xl shadow-lg p-6 text-secondary-foreground">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium bg-secondary-foreground/20 px-3 py-1 rounded-full">Semana</span>
            </div>
            <p className="text-3xl font-bold mb-1">286</p>
            <p className="text-secondary-foreground/80">Tickets Vendidos</p>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  { name: "Madrugada (00-06)", value: 12, color: "#6366f1" },
  { name: "Mañana (06-12)", value: 35, color: "#10b981" },
  { name: "Tarde (12-18)", value: 28, color: "#f59e0b" },
  { name: "Noche (18-00)", value: 25, color: "#8b5cf6" },
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
              <Users className="w-10 h-10 text-primary" />
              <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
                +8%
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">78%</p>
            <p className="text-sm text-muted-foreground">Ocupación Promedio</p>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-accent" />
              <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-medium rounded-full">
                Pico
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">92%</p>
            <p className="text-sm text-muted-foreground">Ocupación Máxima (Sáb)</p>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-10 h-10 text-secondary-foreground" />
              <span className="px-2 py-1 bg-secondary/20 text-secondary-foreground text-xs font-medium rounded-full">
                Valle
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">58%</p>
            <p className="text-sm text-muted-foreground">Ocupación Mínima (Mar)</p>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <PieChartIcon className="w-10 h-10 text-accent" />
              <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-medium rounded-full">
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
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="dia" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="ocupacion" fill="#10b981" radius={[8, 8, 0, 0]} name="Ocupación %" />
                <Bar dataKey="capacidad" fill="#e5e7eb" radius={[8, 8, 0, 0]} name="Capacidad %" opacity={0.3} />
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
                  label={({ name, value }) => `${value}%`}
                >
                  {porHorarioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
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

        {/* Demanda por Ruta */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Demanda por Ruta</h3>
          <div className="space-y-4">
            {demandaPorRutaData.map((ruta, index) => {
              const porcentaje = (ruta.demanda / ruta.capacidad) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{ruta.ruta}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {ruta.demanda} / {ruta.capacidad} asientos
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          porcentaje >= 80
                            ? "text-emerald-600"
                            : porcentaje >= 60
                            ? "text-amber-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {porcentaje.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 bg-slate-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        porcentaje >= 80
                          ? "bg-emerald-500"
                          : porcentaje >= 60
                          ? "bg-amber-500"
                          : "bg-indigo-500"
                      }`}
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <h4 className="font-semibold text-emerald-900">Alta Demanda</h4>
            </div>
            <p className="text-sm text-emerald-800">
              Los fines de semana presentan ocupación del 90%. Considere agregar más servicios.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-foreground" />
              </div>
              <h4 className="font-semibold text-amber-900">Optimización</h4>
            </div>
            <p className="text-sm text-amber-800">
              Martes y miércoles tienen baja ocupación. Evalúe reducir frecuencias.
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <h4 className="font-semibold text-indigo-900">Horario Pico</h4>
            </div>
            <p className="text-sm text-indigo-800">
              El 35% de la demanda se concentra en horarios de mañana (06-12).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}




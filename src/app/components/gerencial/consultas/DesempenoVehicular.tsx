import { PageHeader } from "../../shared/PageHeader";
import { Truck, Fuel, Wrench, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { DataTable } from "../../shared/DataTable";

const vehiculosData = [
  { id: 1, placa: "ABC-123", modelo: "Mercedes Sprinter", viajes: 52, kmRecorridos: 8450, consumo: 12.5, mantenimientos: 2, estado: "脫ptimo" },
  { id: 2, placa: "XYZ-789", modelo: "Volvo 9700", viajes: 48, kmRecorridos: 9200, consumo: 15.8, mantenimientos: 1, estado: "脫ptimo" },
  { id: 3, placa: "DEF-456", modelo: "Scania K410", viajes: 0, kmRecorridos: 0, consumo: 0, mantenimientos: 1, estado: "Mantenimiento" },
  { id: 4, placa: "GHI-321", modelo: "Mercedes O500", viajes: 45, kmRecorridos: 7800, consumo: 14.2, mantenimientos: 2, estado: "脫ptimo" },
  { id: 5, placa: "JKL-654", modelo: "Iveco Daily", viajes: 38, kmRecorridos: 5600, consumo: 11.8, mantenimientos: 3, estado: "Advertencia" },
];

const consumoMensual = [
  { mes: "Ene", consumo: 13.5 },
  { mes: "Feb", consumo: 13.2 },
  { mes: "Mar", consumo: 13.8 },
  { mes: "Abr", consumo: 13.4 },
  { mes: "May", consumo: 13.6 },
  { mes: "Jun", consumo: 13.1 },
];

export function DesempenoVehicular() {
  return (
    <div className="min-h-full bg-background">
      <PageHeader
        title="Desempe帽o Vehicular"
        subtitle="Monitoreo y an谩lisis de la flota"
        actions={
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground">
              <option>Todos los veh铆culos</option>
              <option>Solo activos</option>
              <option>En mantenimiento</option>
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
              <Truck className="w-10 h-10 text-primary" />
              <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
                78%
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">50</p>
            <p className="text-sm text-muted-foreground">Flota Total</p>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-foreground" />
              <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
                +12%
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">183</p>
            <p className="text-sm text-muted-foreground">Viajes del Mes</p>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <Fuel className="w-10 h-10 text-foreground" />
              <span className="px-2 py-1 bg-muted text-foreground text-xs font-semibold rounded-full border border-border">
                -3%
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">13.1</p>
            <p className="text-sm text-muted-foreground">Consumo Promedio (L/100km)</p>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <Wrench className="w-10 h-10 text-foreground" />
              <span className="px-2 py-1 bg-destructive/20 text-destructive text-xs font-medium rounded-full">
                +2
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">9</p>
            <p className="text-sm text-muted-foreground">Mantenimientos Programados</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Consumo Mensual de Combustible</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={consumoMensual}>
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
                <Line
                  type="monotone"
                  dataKey="consumo"
                  stroke="var(--secondary-foreground)"
                  strokeWidth={3}
                  dot={{ fill: "var(--secondary-foreground)", r: 6 }}
                  name="Consumo (L/100km)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Kil贸metros Recorridos (Top 5)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vehiculosData.slice(0, 5).filter(v => v.kmRecorridos > 0)}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="placa" tick={{ fill: "var(--muted-foreground)" }} />
                <YAxis tick={{ fill: "var(--muted-foreground)" }} />
                <Tooltip
                  formatter={(value) => [Number(value).toLocaleString(), "Km recorridos"]}
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
                <Bar dataKey="kmRecorridos" fill="var(--primary)" radius={[8, 8, 0, 0]} name="Km" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <DataTable
          title="Detalle de Veh铆culos"
          columns={[
            { key: "placa", label: "Placa", sortable: true },
            { key: "modelo", label: "Modelo", sortable: true },
            { key: "viajes", label: "Viajes", sortable: true },
            { key: "kmRecorridos", label: "Km Recorridos", sortable: true },
            {
              key: "consumo",
              label: "Consumo (L/100km)",
              sortable: true,
              render: (item: any) => (
                <span className="font-medium">{item.consumo || "-"}</span>
              ),
            },
            { key: "mantenimientos", label: "Mantenimientos" },
            {
              key: "estado",
              label: "Estado",
              render: (item: any) => (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.estado === "脫ptimo"
                      ? "bg-primary/20 text-primary"
                      : item.estado === "Advertencia"
                      ? "bg-accent/20 text-accent"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.estado}
                </span>
              ),
            },
          ]}
          data={vehiculosData}
          searchPlaceholder="Buscar veh铆culo..."
          onExport={() => console.log("Export")}
        />
      </div>
    </div>
  );
}
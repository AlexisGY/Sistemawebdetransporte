import { Link } from "react-router";
import {
  AlertCircle,
  Calculator,
  CheckSquare,
  Clock,
  CreditCard,
  MapPin,
  Ticket,
  Truck,
  Users,
} from "lucide-react";

import { PageHeader } from "../shared/PageHeader";
import { KPICard } from "../shared/KPICard";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const viajesHoy = [
  { id: "VJ-001", ruta: "Lima - Arequipa", hora: "08:00", conductor: "Carlos Mendoza", placa: "ABC-123", estado: "En Ruta", ocupacion: 18, capacidad: 20 },
  { id: "VJ-002", ruta: "Lima - Cusco", hora: "09:30", conductor: "Luis Torres", placa: "XYZ-789", estado: "Check-in", ocupacion: 42, capacidad: 45 },
  { id: "VJ-003", ruta: "Lima - Trujillo", hora: "10:00", conductor: "Ana García", placa: "GHI-321", estado: "Programado", ocupacion: 35, capacidad: 48 },
  { id: "VJ-004", ruta: "Arequipa - Cusco", hora: "14:00", conductor: "María Santos", placa: "JKL-654", estado: "Programado", ocupacion: 12, capacidad: 18 },
];

const accionesRapidas = [
  { title: "Cotización", icon: Calculator, path: "/operativo/cotizacion" },
  { title: "Reservar ticket", icon: Ticket, path: "/operativo/reserva-tickets" },
  { title: "Orden de pago", icon: CreditCard, path: "/operativo/orden-pago" },
  { title: "Check-in", icon: Users, path: "/operativo/checkin-embarque" },
];

export function DashboardOperativo() {
  return (
    <div className="min-h-full bg-background">
      <PageHeader title="Panel operativo" subtitle="Control de operaciones diarias del servicio." />

      <div className="space-y-6 p-6 lg:p-8">
        {/* KPIs */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <KPICard title="Viajes activos" value={12} icon={Truck} subtitle="Programados hoy" />
          <KPICard title="Tickets del día" value={87} icon={Ticket} variant="secondary" subtitle="Vendidos / confirmados" />
          <KPICard title="Check-ins realizados" value={45} icon={CheckSquare} variant="accent" subtitle="En proceso de embarque" />
          <KPICard title="Pendientes de atención" value={3} icon={AlertCircle} variant="destructive" subtitle="Alertas operativas" />
        </div>

        {/* Acciones rápidas */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-foreground">Acciones rápidas (flujo operativo)</h3>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {accionesRapidas.map(({ title, icon: Icon, path }) => (
              <Link
                key={path}
                to={path}
                className="group rounded-2xl border border-border/70 bg-card/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:border-foreground/20"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
                  <Icon className="size-5" />
                </div>
                <p className="mt-4 font-semibold text-foreground">{title}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Viajes de hoy */}
        <Card className="border-border/70 bg-card/90">
          <CardHeader className="flex flex-col gap-2 border-b border-border/60 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Viajes programados hoy</CardTitle>
              <p className="text-sm text-muted-foreground">30 de junio, 2026</p>
            </div>
            <Link
              to={`/operativo/reportes/seguimiento-viaje/${viajesHoy[0].id}`}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Ver seguimiento
            </Link>
          </CardHeader>

          <CardContent className="divide-y divide-border/60 p-0">
            {viajesHoy.map((viaje) => {
              const pct = Math.round((viaje.ocupacion / viaje.capacidad) * 100);
              return (
                <div key={viaje.id} className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-1 flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-xl border border-border/70 bg-muted/30">
                        <Truck className="size-5 text-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{viaje.id}</p>
                        <p className="text-sm text-muted-foreground">{viaje.placa}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="size-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{viaje.ruta}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="size-4 text-muted-foreground" />
                      <span className="text-foreground">{viaje.hora}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="size-4 text-muted-foreground" />
                      <span className="text-foreground">{viaje.conductor}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground">Ocupación</p>
                      <p className="font-bold text-foreground">
                        {viaje.ocupacion}/{viaje.capacidad}
                      </p>
                    </div>
                    <div className="w-32">
                      <div className="mb-1 h-2 rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-foreground" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-right text-xs text-muted-foreground">{pct}%</p>
                    </div>
                    <Badge variant="secondary" className="rounded-full">{viaje.estado}</Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Quick stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <QuickStat icon={Clock} title="Próxima salida" value="08:00" detail="Lima - Arequipa (VJ-001)" />
          <QuickStat icon={CreditCard} title="Ingresos hoy" value="S/ 7,395" detail="87 tickets vendidos" />
          <QuickStat icon={Truck} title="Flota disponible" value="38" detail="De 50 vehículos totales" />
        </div>
      </div>
    </div>
  );
}

function QuickStat({
  icon: Icon,
  title,
  value,
  detail,
}: {
  icon: typeof Clock;
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <Card className="border-border/70 bg-card/90">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex size-10 items-center justify-center rounded-lg border border-border/70 bg-muted/30">
            <Icon className="size-5 text-foreground" />
          </div>
          <h4 className="font-semibold text-foreground">{title}</h4>
        </div>
        <p className="mb-1 text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

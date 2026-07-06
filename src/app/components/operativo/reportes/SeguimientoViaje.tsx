import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Bus,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  MapPin,
  Printer,
  Users,
} from "lucide-react";

import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { getIncidencias, getReservas, getViajes, type Viaje } from "../../../store/localDb";

// REP-05 — Seguimiento de viaje (reporte de SOLO LECTURA).
// Muestra estado actual, ruta, horario, vehículo, operarios, pasajeros/carga e
// incidencias. No modifica datos.

const ETAPAS = ["Programado", "Check-in", "Embarque", "En ruta", "Llegada", "Cierre"] as const;

function etapaActual(viaje?: Viaje): number {
  switch (viaje?.estado) {
    case "Pendiente":
      return 0;
    case "Confirmado":
      return 1;
    case "En Ruta":
      return 3;
    case "Cerrado":
      return 5;
    default:
      return 1;
  }
}

export function SeguimientoViaje() {
  const { id } = useParams();
  const navigate = useNavigate();

  const viajes = useMemo(() => getViajes(), []);
  const viaje = useMemo(() => viajes.find((v) => v.id === id) ?? viajes[0], [viajes, id]);
  const reservas = useMemo(
    () => getReservas().filter((r) => r.viajeId === viaje?.id),
    [viaje?.id],
  );
  const incidencias = useMemo(
    () => getIncidencias().filter((i) => i.viajeId === viaje?.id),
    [viaje?.id],
  );

  const etapa = etapaActual(viaje);
  const pasajeros = reservas.reduce((sum, r) => sum + (r.asientos?.length ?? 0), 0);
  const ocupacion = viaje?.capacidad ? Math.round((pasajeros / viaje.capacidad) * 100) : 0;

  return (
    <div className="min-h-full bg-background p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Barra de acciones (oculta al imprimir) */}
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Button variant="outline" className="rounded-xl" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-4" />
            Volver
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => window.print()}>
              <Printer className="size-4" />
              Imprimir
            </Button>
            <Button className="rounded-xl">
              <Download className="size-4" />
              Descargar PDF
            </Button>
          </div>
        </div>

        {/* Encabezado del reporte */}
        <Card className="border-border/70 bg-card/90">
          <CardHeader className="flex flex-col gap-2 border-b border-border/60 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Reporte REP-05 · Seguimiento de viaje
              </p>
              <CardTitle className="mt-1 text-2xl font-semibold">{viaje?.codigo ?? "—"}</CardTitle>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="rounded-full">Estado: {viaje?.estado ?? "—"}</Badge>
              <p className="mt-2 text-xs text-muted-foreground">
                Generado: {new Date().toLocaleString("es-PE")}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            {/* Avance del viaje */}
            <div>
              <p className="mb-4 text-sm font-semibold text-foreground">Avance operativo</p>
              <div className="flex flex-wrap items-center gap-y-3">
                {ETAPAS.map((nombre, index) => {
                  const done = index <= etapa;
                  return (
                    <div key={nombre} className="flex items-center">
                      <div className="flex flex-col items-center gap-1">
                        {done ? (
                          <CheckCircle2 className="size-6 text-foreground" />
                        ) : (
                          <Circle className="size-6 text-muted-foreground/50" />
                        )}
                        <span
                          className={
                            done ? "text-xs font-medium text-foreground" : "text-xs text-muted-foreground"
                          }
                        >
                          {nombre}
                        </span>
                      </div>
                      {index < ETAPAS.length - 1 && (
                        <div
                          className={`mx-2 h-0.5 w-10 ${index < etapa ? "bg-foreground" : "bg-border"}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Datos del viaje */}
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoBlock icon={MapPin} label="Ruta" value={viaje?.ruta ?? "—"} />
              <InfoBlock
                icon={Clock}
                label="Horario"
                value={`${viaje?.fechaISO ?? "—"} · ${viaje?.horaSalida ?? "—"}${
                  viaje?.horaLlegadaEstimada ? ` → ${viaje.horaLlegadaEstimada}` : ""
                }`}
              />
              <InfoBlock icon={Bus} label="Vehículo" value={viaje?.vehiculoId ?? "—"} />
              <InfoBlock
                icon={Users}
                label="Operarios"
                value={[viaje?.conductorOperarioId, viaje?.copilotoOperarioId].filter(Boolean).join(" · ") || "—"}
              />
            </div>

            {/* Ocupación */}
            <div className="grid gap-4 sm:grid-cols-3">
              <StatBlock label="Pasajeros / carga asociados" value={String(pasajeros)} />
              <StatBlock label="Capacidad" value={String(viaje?.capacidad ?? "—")} />
              <StatBlock label="Ocupación" value={`${ocupacion}%`} />
            </div>

            {/* Incidencias */}
            <div>
              <p className="mb-3 text-sm font-semibold text-foreground">Incidencias registradas</p>
              {incidencias.length === 0 ? (
                <p className="rounded-xl border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
                  Sin incidencias registradas para este viaje.
                </p>
              ) : (
                <div className="divide-y divide-border/60 rounded-xl border border-border/60">
                  {incidencias.map((inc) => (
                    <div key={inc.id} className="flex items-start justify-between gap-3 p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {inc.codigo} · {inc.tipo}
                        </p>
                        <p className="text-xs text-muted-foreground">{inc.detalle}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0 rounded-full text-xs">
                        {inc.estado}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/15 p-4">
      <div className="flex size-9 items-center justify-center rounded-lg border border-border/70 bg-background">
        <Icon className="size-4 text-foreground" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/15 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

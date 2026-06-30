import { useState } from "react";
import { CheckCircle2, ScanLine, ShieldCheck, XCircle } from "lucide-react";

import { PageHeader } from "../shared/PageHeader";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// TEC-03 — Verificación de integridad. Valida consistencia de datos tras
// procesos técnicos. Herramienta técnica/administrativa.

type Chequeo = {
  nombre: string;
  descripcion: string;
  resultado: "OK" | "Advertencia";
  detalle: string;
};

const CHEQUEOS: Chequeo[] = [
  { nombre: "Integridad referencial", descripcion: "Claves foráneas entre viajes, tickets, reservas y pagos.", resultado: "OK", detalle: "0 referencias huérfanas" },
  { nombre: "Consistencia de estados", descripcion: "Estados de tickets/viajes coherentes con sus eventos.", resultado: "OK", detalle: "Estados consistentes" },
  { nombre: "Duplicados", descripcion: "Detección de registros duplicados en catálogos.", resultado: "Advertencia", detalle: "2 posibles duplicados en clientes" },
  { nombre: "Cuadre de lotes de disponibilidad", descripcion: "Totales de lote vs. tickets individuales.", resultado: "OK", detalle: "Lotes cuadrados" },
  { nombre: "Estructuras e índices", descripcion: "Validez de índices y estructuras físicas.", resultado: "OK", detalle: "Sin corrupción detectada" },
];

export function Verificacion() {
  const [ejecutado, setEjecutado] = useState(false);
  const [fecha, setFecha] = useState<string>("29/06/2026 04:10");

  const okCount = CHEQUEOS.filter((c) => c.resultado === "OK").length;
  const warnCount = CHEQUEOS.length - okCount;

  return (
    <div className="min-h-full bg-background">
      <PageHeader
        title="Verificación de integridad"
        subtitle="Valida la consistencia de la base de datos tras procesos de mantenimiento o restauración."
        actions={
          <Button
            className="rounded-xl"
            onClick={() => {
              setEjecutado(true);
              setFecha(new Date().toLocaleString("es-PE"));
            }}
          >
            <ScanLine className="size-4" />
            Ejecutar verificación
          </Button>
        }
      />

      <div className="space-y-6 p-6 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard label="Última ejecución" value={fecha} icon={ShieldCheck} />
          <SummaryCard label="Chequeos OK" value={`${okCount} / ${CHEQUEOS.length}`} icon={CheckCircle2} />
          <SummaryCard label="Advertencias" value={String(warnCount)} icon={XCircle} />
        </div>

        {ejecutado && (
          <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/25 p-4 text-sm text-foreground">
            <CheckCircle2 className="size-5" />
            Verificación ejecutada el {fecha}. Resultados actualizados.
          </div>
        )}

        <Card className="border-border/70 bg-card/90">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="text-lg font-semibold">Resultados de la verificación</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border/60 p-0">
            {CHEQUEOS.map((chequeo) => (
              <div key={chequeo.nombre} className="flex items-start justify-between gap-3 p-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{chequeo.nombre}</p>
                  <p className="text-xs text-muted-foreground">{chequeo.descripcion}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{chequeo.detalle}</p>
                </div>
                <Badge
                  variant={chequeo.resultado === "OK" ? "secondary" : "outline"}
                  className="shrink-0 gap-1 rounded-full"
                >
                  {chequeo.resultado === "OK" ? (
                    <CheckCircle2 className="size-3" />
                  ) : (
                    <XCircle className="size-3" />
                  )}
                  {chequeo.resultado}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof ShieldCheck;
}) {
  return (
    <Card className="border-border/70 bg-card/90">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-xl font-semibold text-foreground">{value}</p>
        </div>
        <Icon className="size-6 text-muted-foreground" />
      </CardContent>
    </Card>
  );
}

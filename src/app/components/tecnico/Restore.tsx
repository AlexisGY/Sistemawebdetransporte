import { useState } from "react";
import { AlertTriangle, CheckCircle2, History, RotateCcw } from "lucide-react";

import { PageHeader } from "../shared/PageHeader";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "../ui/utils";

// TEC-02 — Restore. Recuperación controlada desde copias de seguridad.

type PuntoRestauracion = {
  id: string;
  fecha: string;
  tipo: "Completo" | "Incremental";
  integridad: "Verificada" | "Pendiente";
};

const PUNTOS: PuntoRestauracion[] = [
  { id: "BK-0312", fecha: "30/06/2026 01:00", tipo: "Completo", integridad: "Verificada" },
  { id: "BK-0311", fecha: "29/06/2026 01:00", tipo: "Incremental", integridad: "Verificada" },
  { id: "BK-0309", fecha: "27/06/2026 01:00", tipo: "Completo", integridad: "Verificada" },
  { id: "BK-0305", fecha: "23/06/2026 01:00", tipo: "Completo", integridad: "Pendiente" },
];

type Estado = "idle" | "confirm" | "done";

export function Restore() {
  const [seleccion, setSeleccion] = useState<string>(PUNTOS[0].id);
  const [estado, setEstado] = useState<Estado>("idle");

  const punto = PUNTOS.find((p) => p.id === seleccion);

  return (
    <div className="min-h-full bg-background">
      <PageHeader
        title="Restore de base de datos"
        subtitle="Recuperación controlada de información desde copias de seguridad. Herramienta técnica/administrativa."
      />

      <div className="grid gap-6 p-6 lg:grid-cols-[1.4fr_1fr] lg:p-8">
        <Card className="border-border/70 bg-card/90">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="text-lg font-semibold">Puntos de restauración disponibles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-3">
            {PUNTOS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSeleccion(p.id);
                  setEstado("idle");
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                  p.id === seleccion ? "border-foreground/20 bg-muted/40" : "border-border/60 hover:bg-muted/20",
                )}
              >
                <div className="flex size-9 items-center justify-center rounded-lg border border-border/70 bg-background">
                  <History className="size-4 text-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {p.id} · {p.tipo}
                  </p>
                  <p className="text-xs text-muted-foreground">{p.fecha}</p>
                </div>
                <Badge
                  variant={p.integridad === "Verificada" ? "secondary" : "outline"}
                  className="rounded-full text-[10px]"
                >
                  {p.integridad}
                </Badge>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/90 h-fit">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="text-base font-semibold">Restauración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {estado === "done" ? (
              <div className="space-y-3 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-border/70 bg-background">
                  <CheckCircle2 className="size-7 text-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Restauración completada</h3>
                <p className="text-sm text-muted-foreground">
                  La base de datos fue restaurada al punto <strong>{punto?.id}</strong> ({punto?.fecha}).
                </p>
                <Button variant="outline" className="rounded-xl" onClick={() => setEstado("idle")}>
                  Volver
                </Button>
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-border/60 bg-muted/15 p-4 text-sm">
                  <p className="text-muted-foreground">Punto seleccionado</p>
                  <p className="mt-1 font-semibold text-foreground">
                    {punto?.id} · {punto?.tipo}
                  </p>
                  <p className="text-xs text-muted-foreground">{punto?.fecha}</p>
                </div>

                <div className="flex items-start gap-2 rounded-xl border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  La restauración reemplaza el estado actual de la base de datos. Operación reservada al perfil técnico.
                </div>

                {estado === "confirm" ? (
                  <div className="flex gap-2">
                    <Button variant="ghost" className="flex-1 rounded-xl" onClick={() => setEstado("idle")}>
                      Cancelar
                    </Button>
                    <Button className="flex-1 rounded-xl" onClick={() => setEstado("done")}>
                      Confirmar restore
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full rounded-xl" onClick={() => setEstado("confirm")}>
                    <RotateCcw className="size-4" />
                    Iniciar restauración
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Link } from "react-router";
import { ArrowRight, BarChart3, ShieldCheck, Truck, Users } from "lucide-react";

import { AuthShell } from "./AuthShell";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "../ui/utils";

const moduleCards = [
  {
    title: "Entorno gerencial",
    description: "Consultas, indicadores y seguimiento de información consolidada.",
    to: "/gerencial/dashboard",
    icon: BarChart3,
    points: ["Consultas", "Indicadores", "Parámetros"],
  },
  {
    title: "Entorno operativo",
    description: "Viajes, tickets, pagos y control diario de operación.",
    to: "/operativo/dashboard",
    icon: Truck,
    points: ["Viajes", "Tickets", "Pagos"],
  },
];

export function RoleSelection() {
  return (
    <AuthShell>
      <Card className="w-full max-w-[560px] border-border/70 bg-card/95 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur-sm">
        <CardHeader className="space-y-4 border-b border-border/60">
          <Badge
            variant="outline"
            className="w-fit rounded-full border-border/80 bg-muted/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]"
          >
            Acceso al sistema
          </Badge>

          <div>
            <CardTitle className="text-3xl font-semibold">
              Seleccione un entorno de trabajo
            </CardTitle>
            <CardDescription className="mt-2 text-sm leading-6">
              Continúe según la vista disponible para esta sesión.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-6">
          {moduleCards.map(({ title, description, to, icon: Icon, points }) => (
            <Link
              key={title}
              to={to}
              className={cn(
                "group block rounded-[28px] border border-border/80 bg-muted/25 p-5 transition-all",
                "hover:-translate-y-0.5 hover:border-foreground/25 hover:bg-background",
                "hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-14 items-center justify-center rounded-2xl border border-border/80 bg-background shadow-inner">
                  <Icon className="size-7 text-foreground" />
                </div>

                <ArrowRight className="mt-1 size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-foreground">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {points.map((point) => (
                  <Badge
                    key={point}
                    variant="secondary"
                    className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {point}
                  </Badge>
                ))}
              </div>
            </Link>
          ))}
        </CardContent>

        <CardFooter className="justify-between border-t border-border/60">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4" />
            Acceso disponible según configuración del sistema
          </div>

          <Button asChild variant="ghost" className="rounded-xl">
            <Link to="/login">
              <Users className="size-4" />
              Salir
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </AuthShell>
  );
}
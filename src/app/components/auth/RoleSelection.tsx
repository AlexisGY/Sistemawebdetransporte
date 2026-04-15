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
      <Card className="w-full max-w-[560px] border-white/10 bg-[#17181c] shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
        <CardHeader className="space-y-4 border-b border-white/10">
          <Badge
            variant="outline"
            className="w-fit rounded-full border-white/15 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400"
          >
            Acceso al sistema
          </Badge>

          <div>
            <CardTitle className="text-3xl font-semibold text-white">
              Seleccione un entorno de trabajo
            </CardTitle>
            <CardDescription className="mt-2 text-sm leading-6 text-zinc-400">
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
                "group block rounded-[28px] border border-white/10 bg-white/[0.03] p-5 transition-all",
                "hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07]",
                "hover:shadow-[0_18px_50px_rgba(0,0,0,0.35)]",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-inner">
                  <Icon className="size-7 text-zinc-300" />
                </div>

                <ArrowRight className="mt-1 size-5 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-zinc-300" />
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {points.map((point) => (
                  <Badge
                    key={point}
                    variant="secondary"
                    className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-medium text-zinc-400"
                  >
                    {point}
                  </Badge>
                ))}
              </div>
            </Link>
          ))}
        </CardContent>

        <CardFooter className="justify-between border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <ShieldCheck className="size-4" />
            Acceso disponible según configuración del sistema
          </div>

          <Button
            asChild
            variant="ghost"
            className="rounded-xl text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200"
          >
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
import { BarChart3, Clock3, Route, ShieldCheck, Truck } from "lucide-react";

import { Badge } from "../ui/badge";

const highlights = [
  {
    title: "Trazabilidad operativa",
    description: "Rutas, tickets y recursos conectados en una sola capa visual.",
    icon: Route,
  },
  {
    title: "Lectura ejecutiva",
    description: "Paneles y modulos con jerarquia clara para prototipado serio.",
    icon: BarChart3,
  },
  {
    title: "Acceso protegido",
    description: "Flujos de ingreso y recuperacion con lenguaje mas corporativo.",
    icon: ShieldCheck,
  },
];

const metrics = [
  { label: "Disponibilidad", value: "99.4%" },
  { label: "Tiempo de control", value: "< 3 min" },
  { label: "Cobertura", value: "24/7" },
];

interface AuthShellProps {
  children: React.ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="auth-backdrop min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1.08fr)_460px]">
          <section className="hero-grid relative overflow-hidden rounded-[32px] border border-white/8 bg-[#101114] px-6 py-8 text-white shadow-[0_32px_80px_rgba(15,23,42,0.24)] sm:px-8 sm:py-10 lg:px-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_32%),linear-gradient(160deg,rgba(255,255,255,0.06),transparent_55%)]" />
            <div className="relative flex h-full flex-col gap-10">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 shadow-inner shadow-white/5">
                  <Truck className="size-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
                    Sistema web
                  </p>
                  <p className="text-base font-semibold text-white">Plataforma de transporte</p>
                </div>
              </div>

              <div className="max-w-2xl">
                <Badge className="rounded-full border-white/10 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white shadow-none hover:bg-white/8">
                  UI prototipo
                </Badge>
                <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight text-white md:text-5xl">
                  Operacion sobria. Control visible.
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-white/72">
                  Un lenguaje visual mas serio para que el sistema se vea pensado para equipos
                  de operacion, no como una demo generica.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {highlights.map(({ title, description, icon: Icon }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm"
                  >
                    <div className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/8">
                      <Icon className="size-5 text-white" />
                    </div>
                    <h2 className="mt-4 text-base font-semibold text-white">{title}</h2>
                    <p className="mt-2 text-sm leading-6 text-white/62">{description}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="flex items-center gap-2 text-white/56">
                      <Clock3 className="size-4" />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                        {metric.label}
                      </span>
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="flex items-center justify-center">{children}</div>
        </div>
      </div>
    </div>
  );
}

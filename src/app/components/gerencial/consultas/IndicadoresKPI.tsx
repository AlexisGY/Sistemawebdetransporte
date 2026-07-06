import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  AlertTriangle,
  BarChart2,
  DollarSign,
  Package,
  Percent,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

import { PageHeader } from "../../shared/PageHeader";
import { KPICard } from "../../shared/KPICard";

// SEG/GER — Indicadores por Ruta y Horario (GER-07)
// Pantalla gerencial respaldada exclusivamente por la tabla COMP_KPI_RUTA_HORARIO,
// generada por el proceso batch de cierre de periodo.

type EstadoIndicador = "ÓPTIMO" | "REGULAR" | "CRÍTICO";

type CompKpiRutaHorario = {
  codCompKpi: string;
  periodo: string;
  codRuta: string;
  codHorario: string;
  totalCupos: number;
  totalVendidos: number;
  totalReservas: number;
  totalReservasVencidas: number;
  totalDescuadres: number;
  ingresoReal: number;
  ingresoPotencial: number;
  valorReservasVencidas: number;
  tasaDescuadre: number;   // ratio 0–1
  iarcp: number;           // ratio 0–1
  iprv: number;            // ratio 0–1
  ocupacionEfectiva: number; // ratio 0–1
  estadoIndicador: EstadoIndicador;
};

// Mock data con la misma forma de COMP_KPI_RUTA_HORARIO.
const MOCK_DATA: CompKpiRutaHorario[] = [
  // ── 2026-04 ──
  {
    codCompKpi: "KPI-001", periodo: "2026-04", codRuta: "RTA-LIM-AQP", codHorario: "HOR-08:00",
    totalCupos: 42, totalVendidos: 36, totalReservas: 4, totalReservasVencidas: 1, totalDescuadres: 0,
    ingresoReal: 3060, ingresoPotencial: 3570, valorReservasVencidas: 85,
    tasaDescuadre: 0.000, iarcp: 0.857, iprv: 0.250, ocupacionEfectiva: 0.857, estadoIndicador: "ÓPTIMO",
  },
  {
    codCompKpi: "KPI-002", periodo: "2026-04", codRuta: "RTA-LIM-AQP", codHorario: "HOR-20:00",
    totalCupos: 42, totalVendidos: 30, totalReservas: 6, totalReservasVencidas: 3, totalDescuadres: 1,
    ingresoReal: 2550, ingresoPotencial: 3570, valorReservasVencidas: 255,
    tasaDescuadre: 0.024, iarcp: 0.714, iprv: 0.500, ocupacionEfectiva: 0.714, estadoIndicador: "REGULAR",
  },
  {
    codCompKpi: "KPI-003", periodo: "2026-04", codRuta: "RTA-LIM-CUS", codHorario: "HOR-08:00",
    totalCupos: 38, totalVendidos: 34, totalReservas: 3, totalReservasVencidas: 1, totalDescuadres: 0,
    ingresoReal: 5100, ingresoPotencial: 5700, valorReservasVencidas: 150,
    tasaDescuadre: 0.000, iarcp: 0.895, iprv: 0.333, ocupacionEfectiva: 0.895, estadoIndicador: "ÓPTIMO",
  },
  {
    codCompKpi: "KPI-004", periodo: "2026-04", codRuta: "RTA-LIM-ICA", codHorario: "HOR-14:00",
    totalCupos: 36, totalVendidos: 22, totalReservas: 8, totalReservasVencidas: 5, totalDescuadres: 2,
    ingresoReal: 1320, ingresoPotencial: 2160, valorReservasVencidas: 300,
    tasaDescuadre: 0.056, iarcp: 0.611, iprv: 0.625, ocupacionEfectiva: 0.611, estadoIndicador: "CRÍTICO",
  },
  // ── 2026-05 ──
  {
    codCompKpi: "KPI-005", periodo: "2026-05", codRuta: "RTA-LIM-AQP", codHorario: "HOR-08:00",
    totalCupos: 42, totalVendidos: 38, totalReservas: 3, totalReservasVencidas: 1, totalDescuadres: 0,
    ingresoReal: 3230, ingresoPotencial: 3570, valorReservasVencidas: 85,
    tasaDescuadre: 0.000, iarcp: 0.905, iprv: 0.333, ocupacionEfectiva: 0.905, estadoIndicador: "ÓPTIMO",
  },
  {
    codCompKpi: "KPI-006", periodo: "2026-05", codRuta: "RTA-LIM-AQP", codHorario: "HOR-20:00",
    totalCupos: 42, totalVendidos: 32, totalReservas: 5, totalReservasVencidas: 2, totalDescuadres: 1,
    ingresoReal: 2720, ingresoPotencial: 3570, valorReservasVencidas: 170,
    tasaDescuadre: 0.024, iarcp: 0.762, iprv: 0.400, ocupacionEfectiva: 0.762, estadoIndicador: "REGULAR",
  },
  {
    codCompKpi: "KPI-007", periodo: "2026-05", codRuta: "RTA-LIM-CUS", codHorario: "HOR-08:00",
    totalCupos: 38, totalVendidos: 35, totalReservas: 2, totalReservasVencidas: 0, totalDescuadres: 0,
    ingresoReal: 5250, ingresoPotencial: 5700, valorReservasVencidas: 0,
    tasaDescuadre: 0.000, iarcp: 0.921, iprv: 0.000, ocupacionEfectiva: 0.921, estadoIndicador: "ÓPTIMO",
  },
  {
    codCompKpi: "KPI-008", periodo: "2026-05", codRuta: "RTA-LIM-ICA", codHorario: "HOR-14:00",
    totalCupos: 36, totalVendidos: 26, totalReservas: 6, totalReservasVencidas: 3, totalDescuadres: 1,
    ingresoReal: 1560, ingresoPotencial: 2160, valorReservasVencidas: 180,
    tasaDescuadre: 0.028, iarcp: 0.722, iprv: 0.500, ocupacionEfectiva: 0.722, estadoIndicador: "REGULAR",
  },
  // ── 2026-06 ──
  {
    codCompKpi: "KPI-009", periodo: "2026-06", codRuta: "RTA-LIM-AQP", codHorario: "HOR-08:00",
    totalCupos: 42, totalVendidos: 39, totalReservas: 2, totalReservasVencidas: 0, totalDescuadres: 0,
    ingresoReal: 3315, ingresoPotencial: 3570, valorReservasVencidas: 0,
    tasaDescuadre: 0.000, iarcp: 0.929, iprv: 0.000, ocupacionEfectiva: 0.929, estadoIndicador: "ÓPTIMO",
  },
  {
    codCompKpi: "KPI-010", periodo: "2026-06", codRuta: "RTA-LIM-AQP", codHorario: "HOR-20:00",
    totalCupos: 42, totalVendidos: 34, totalReservas: 5, totalReservasVencidas: 2, totalDescuadres: 1,
    ingresoReal: 2890, ingresoPotencial: 3570, valorReservasVencidas: 170,
    tasaDescuadre: 0.024, iarcp: 0.810, iprv: 0.400, ocupacionEfectiva: 0.810, estadoIndicador: "REGULAR",
  },
  {
    codCompKpi: "KPI-011", periodo: "2026-06", codRuta: "RTA-LIM-CUS", codHorario: "HOR-08:00",
    totalCupos: 38, totalVendidos: 37, totalReservas: 1, totalReservasVencidas: 0, totalDescuadres: 0,
    ingresoReal: 5550, ingresoPotencial: 5700, valorReservasVencidas: 0,
    tasaDescuadre: 0.000, iarcp: 0.974, iprv: 0.000, ocupacionEfectiva: 0.974, estadoIndicador: "ÓPTIMO",
  },
  {
    codCompKpi: "KPI-012", periodo: "2026-06", codRuta: "RTA-LIM-ICA", codHorario: "HOR-14:00",
    totalCupos: 36, totalVendidos: 28, totalReservas: 5, totalReservasVencidas: 2, totalDescuadres: 1,
    ingresoReal: 1680, ingresoPotencial: 2160, valorReservasVencidas: 120,
    tasaDescuadre: 0.028, iarcp: 0.778, iprv: 0.400, ocupacionEfectiva: 0.778, estadoIndicador: "REGULAR",
  },
];

// ── helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => n.toLocaleString("es-PE");
const fmtPct = (n: number) => `${(n * 100).toFixed(1)}%`;
const fmtSol = (n: number) => `S/ ${n.toLocaleString("es-PE")}`;

const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
    color: "var(--foreground)",
  },
  labelStyle: { color: "var(--foreground)", fontWeight: 600 as const },
  itemStyle: { color: "var(--foreground)", fontWeight: 500 as const },
};

const ESTADO_BADGE: Record<EstadoIndicador, string> = {
  "ÓPTIMO":  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "REGULAR": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "CRÍTICO": "bg-red-100  text-red-700   dark:bg-red-900/30   dark:text-red-400",
};

// ── component ─────────────────────────────────────────────────────────────────

export function IndicadoresKPI() {
  const [periodoFiltro, setPeriodoFiltro]   = useState("");
  const [rutaFiltro,    setRutaFiltro]      = useState("");
  const [horarioFiltro, setHorarioFiltro]   = useState("");
  const [estadoFiltro,  setEstadoFiltro]    = useState("");

  const periodos = useMemo(() => [...new Set(MOCK_DATA.map((r) => r.periodo))].sort(), []);
  const rutas    = useMemo(() => [...new Set(MOCK_DATA.map((r) => r.codRuta))].sort(), []);
  const horarios = useMemo(() => [...new Set(MOCK_DATA.map((r) => r.codHorario))].sort(), []);
  const estados: EstadoIndicador[] = ["ÓPTIMO", "REGULAR", "CRÍTICO"];

  const filtered = useMemo(
    () =>
      MOCK_DATA.filter(
        (r) =>
          (!periodoFiltro || r.periodo            === periodoFiltro) &&
          (!rutaFiltro    || r.codRuta            === rutaFiltro)    &&
          (!horarioFiltro || r.codHorario         === horarioFiltro) &&
          (!estadoFiltro  || r.estadoIndicador    === estadoFiltro),
      ),
    [periodoFiltro, rutaFiltro, horarioFiltro, estadoFiltro],
  );

  const kpis = useMemo(() => {
    if (filtered.length === 0) return null;
    const n = filtered.length;

    const sumCupos          = filtered.reduce((s, r) => s + r.totalCupos, 0);
    const sumVendidos       = filtered.reduce((s, r) => s + r.totalVendidos, 0);
    const sumReservas       = filtered.reduce((s, r) => s + r.totalReservas, 0);
    const sumVencidas       = filtered.reduce((s, r) => s + r.totalReservasVencidas, 0);
    const sumIngresoReal    = filtered.reduce((s, r) => s + r.ingresoReal, 0);
    const sumIngresoPot     = filtered.reduce((s, r) => s + r.ingresoPotencial, 0);
    const sumValorVencidas  = filtered.reduce((s, r) => s + r.valorReservasVencidas, 0);
    const avgOcupacion      = filtered.reduce((s, r) => s + r.ocupacionEfectiva, 0) / n;
    const avgDescuadre      = filtered.reduce((s, r) => s + r.tasaDescuadre, 0) / n;
    const avgIarcp          = filtered.reduce((s, r) => s + r.iarcp, 0) / n;
    const avgIprv           = filtered.reduce((s, r) => s + r.iprv, 0) / n;

    // derivados directos
    const cuposDisponibles  = sumCupos - sumVendidos - sumReservas;
    const brechaIngreso     = sumIngresoPot - sumIngresoReal;
    const ticketPromedio    = sumVendidos > 0 ? sumIngresoReal / sumVendidos : 0;
    const pctVencidas       = sumReservas > 0 ? (sumVencidas / sumReservas) * 100 : 0;

    return {
      sumCupos, sumVendidos, sumReservas, sumVencidas,
      sumIngresoReal, sumIngresoPot, sumValorVencidas,
      avgOcupacion, avgDescuadre, avgIarcp, avgIprv,
      cuposDisponibles, brechaIngreso, ticketPromedio, pctVencidas,
    };
  }, [filtered]);

  // datos para gráficos agrupados por periodo
  const periodChartData = useMemo(() => {
    type Acc = {
      periodo: string; ocupSum: number; cnt: number;
      ingresoReal: number; ingresoPot: number;
      reservas: number; vencidas: number;
    };
    const map = new Map<string, Acc>();
    for (const r of filtered) {
      const e = map.get(r.periodo) ?? {
        periodo: r.periodo, ocupSum: 0, cnt: 0,
        ingresoReal: 0, ingresoPot: 0, reservas: 0, vencidas: 0,
      };
      e.ocupSum     += r.ocupacionEfectiva;
      e.cnt         += 1;
      e.ingresoReal += r.ingresoReal;
      e.ingresoPot  += r.ingresoPotencial;
      e.reservas    += r.totalReservas;
      e.vencidas    += r.totalReservasVencidas;
      map.set(r.periodo, e);
    }
    return Array.from(map.values())
      .sort((a, b) => a.periodo.localeCompare(b.periodo))
      .map(({ periodo, ocupSum, cnt, ingresoReal, ingresoPot, reservas, vencidas }) => ({
        periodo,
        "Ocupación %":       Number(((ocupSum / cnt) * 100).toFixed(1)),
        "Ingreso real":      ingresoReal,
        "Ingreso potencial": ingresoPot,
        "Reservas":          reservas,
        "Vencidas":          vencidas,
      }));
  }, [filtered]);

  // datos para gráfico de ranking por ruta
  const rutaChartData = useMemo(() => {
    type Acc = { codRuta: string; valorVencidas: number; tasaSum: number; cnt: number };
    const map = new Map<string, Acc>();
    for (const r of filtered) {
      const e = map.get(r.codRuta) ?? { codRuta: r.codRuta, valorVencidas: 0, tasaSum: 0, cnt: 0 };
      e.valorVencidas += r.valorReservasVencidas;
      e.tasaSum       += r.tasaDescuadre;
      e.cnt           += 1;
      map.set(r.codRuta, e);
    }
    return Array.from(map.values())
      .sort((a, b) => b.valorVencidas - a.valorVencidas)
      .map(({ codRuta, valorVencidas, tasaSum, cnt }) => ({
        ruta:               codRuta.replace("RTA-", ""),
        "Valor vencidas":   valorVencidas,
        "Tasa descuadre %": Number(((tasaSum / cnt) * 100).toFixed(2)),
      }));
  }, [filtered]);

  const limpiarFiltros = () => {
    setPeriodoFiltro(""); setRutaFiltro(""); setHorarioFiltro(""); setEstadoFiltro("");
  };
  const hayFiltros = periodoFiltro || rutaFiltro || horarioFiltro || estadoFiltro;

  return (
    <div className="min-h-full bg-background">
      <PageHeader
        title="Indicadores por Ruta y Horario"
        subtitle="Consolidado batch de ocupación, ingresos, reservas vencidas y descuadres"
        actions={
          <span className="text-xs text-muted-foreground">
            Última actualización batch: 01/07/2026 03:45
          </span>
        }
      />

      <div className="space-y-6 p-6 lg:p-8">

        {/* ── Filtros ─────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Filtrar por:</span>

          {[
            { label: "Periodo",  value: periodoFiltro,  set: setPeriodoFiltro,  opts: periodos,                    placeholder: "Todos los periodos"  },
            { label: "Ruta",     value: rutaFiltro,     set: setRutaFiltro,     opts: rutas,                       placeholder: "Todas las rutas"     },
            { label: "Horario",  value: horarioFiltro,  set: setHorarioFiltro,  opts: horarios,                    placeholder: "Todos los horarios"  },
            { label: "Estado",   value: estadoFiltro,   set: setEstadoFiltro,   opts: estados as string[],         placeholder: "Todos los estados"   },
          ].map(({ label, value, set, opts, placeholder }) => (
            <select
              key={label}
              value={value}
              onChange={(e) => set(e.target.value)}
              className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">{placeholder}</option>
              {opts.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}

          {hayFiltros && (
            <button
              onClick={limpiarFiltros}
              className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Limpiar filtros
            </button>
          )}
          <span className="ml-auto text-xs text-muted-foreground">{filtered.length} registro(s)</span>
        </div>

        {!kpis ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Sin datos para los filtros seleccionados.
          </p>
        ) : (
          <>
            {/* ── KPIs: Capacidad y ventas ─────────────────────── */}
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Capacidad y ventas
              </h3>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <KPICard
                  title="Ocupación efectiva"
                  value={fmtPct(kpis.avgOcupacion)}
                  subtitle="Promedio del periodo"
                  icon={Users}
                  variant="secondary"
                />
                <KPICard
                  title="Cupos vendidos"
                  value={fmt(kpis.sumVendidos)}
                  subtitle={`de ${fmt(kpis.sumCupos)} cupos totales`}
                  icon={Package}
                  variant="secondary"
                />
                <KPICard
                  title="Cupos disponibles"
                  value={fmt(kpis.cuposDisponibles)}
                  subtitle="Cupos − Vendidos − Reservas"
                  icon={Package}
                  variant="secondary"
                />
                <KPICard
                  title="Reservas generadas"
                  value={fmt(kpis.sumReservas)}
                  subtitle={`${fmt(kpis.sumVencidas)} vencidas`}
                  icon={AlertTriangle}
                  variant="secondary"
                />
              </div>
            </div>

            {/* ── KPIs: Ingresos ───────────────────────────────── */}
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Ingresos
              </h3>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <KPICard
                  title="Ingreso real"
                  value={fmtSol(kpis.sumIngresoReal)}
                  icon={DollarSign}
                  variant="secondary"
                />
                <KPICard
                  title="Ingreso potencial"
                  value={fmtSol(kpis.sumIngresoPot)}
                  icon={TrendingUp}
                  variant="secondary"
                />
                <KPICard
                  title="Brecha de ingreso"
                  value={fmtSol(kpis.brechaIngreso)}
                  subtitle="Potencial − Real"
                  icon={TrendingDown}
                  variant="secondary"
                />
                <KPICard
                  title="Ticket promedio"
                  value={fmtSol(Math.round(kpis.ticketPromedio))}
                  subtitle="Ingreso real / Vendidos"
                  icon={DollarSign}
                  variant="secondary"
                />
              </div>
            </div>

            {/* ── KPIs: Reservas vencidas y descuadres ─────────── */}
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Reservas vencidas y descuadres
              </h3>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <KPICard
                  title="Reservas vencidas"
                  value={fmt(kpis.sumVencidas)}
                  icon={AlertTriangle}
                  variant="destructive"
                />
                <KPICard
                  title="Valor reservas vencidas"
                  value={fmtSol(kpis.sumValorVencidas)}
                  icon={TrendingDown}
                  variant="destructive"
                />
                <KPICard
                  title="% Reservas vencidas"
                  value={`${kpis.pctVencidas.toFixed(1)}%`}
                  subtitle="Vencidas / Generadas"
                  icon={Percent}
                  variant="secondary"
                />
                <KPICard
                  title="Tasa de descuadre"
                  value={fmtPct(kpis.avgDescuadre)}
                  subtitle="Promedio del periodo"
                  icon={BarChart2}
                  variant="secondary"
                />
              </div>
            </div>

            {/* ── Índices IARCP / IPRV / Estado ───────────────── */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-xl border border-border/70 bg-card/90 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">IARCP</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">
                  {(kpis.avgIarcp * 100).toFixed(1)}%
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Índice de Aprovechamiento de Capacidad con Reservas Potenciales
                </p>
              </div>

              <div className="rounded-xl border border-border/70 bg-card/90 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">IPRV</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">
                  {(kpis.avgIprv * 100).toFixed(1)}%
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Índice de Pérdida por Reservas Vencidas
                </p>
              </div>

              <div className="col-span-2 rounded-xl border border-border/70 bg-card/90 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Estado indicador — distribución
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {(["ÓPTIMO", "REGULAR", "CRÍTICO"] as EstadoIndicador[]).map((estado) => {
                    const count = filtered.filter((r) => r.estadoIndicador === estado).length;
                    return (
                      <span
                        key={estado}
                        className={`rounded-full px-3 py-1 text-sm font-medium ${ESTADO_BADGE[estado]}`}
                      >
                        {estado}: {count}
                      </span>
                    );
                  })}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Total de registros en la selección: {filtered.length}
                </p>
              </div>
            </div>

            {/* ── Gráficos ─────────────────────────────────────── */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Evolución de ocupación efectiva */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-foreground">
                  Evolución de ocupación efectiva por periodo
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={periodChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="periodo" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                    <YAxis domain={[0, 100]} unit="%" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                    <Tooltip
                      {...TOOLTIP_STYLE}
                      formatter={(v: number) => [`${v}%`, "Ocupación efectiva"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="Ocupación %"
                      stroke="var(--foreground)"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "var(--foreground)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Ingreso real vs potencial */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-foreground">
                  Ingreso real vs potencial por periodo
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={periodChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="periodo" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                    <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                    <Tooltip
                      {...TOOLTIP_STYLE}
                      formatter={(v: number) => [`S/ ${v.toLocaleString("es-PE")}`, ""]}
                    />
                    <Legend wrapperStyle={{ color: "var(--muted-foreground)", fontSize: 12 }} />
                    <Bar dataKey="Ingreso real"      fill="var(--foreground)" opacity={0.85} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Ingreso potencial" fill="#9ca3af"           opacity={0.50} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Reservas generadas vs vencidas */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-foreground">
                  Reservas generadas vs vencidas por periodo
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={periodChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="periodo" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                    <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Legend wrapperStyle={{ color: "var(--muted-foreground)", fontSize: 12 }} />
                    <Bar dataKey="Reservas" fill="var(--foreground)" opacity={0.80} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Vencidas" fill="#ef4444"           opacity={0.70} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Ranking por valor de reservas vencidas */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-foreground">
                  Ranking de rutas — valor reservas vencidas
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={rutaChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="ruta"
                      width={90}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    />
                    <Tooltip
                      {...TOOLTIP_STYLE}
                      formatter={(v: number) => [`S/ ${v.toLocaleString("es-PE")}`, "Valor vencidas"]}
                    />
                    <Bar dataKey="Valor vencidas" fill="#ef4444" opacity={0.70} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── Tabla COMP_KPI_RUTA_HORARIO ───────────────────── */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h3 className="font-semibold text-foreground">
                  Registros COMP_KPI_RUTA_HORARIO
                </h3>
                <span className="text-xs text-muted-foreground">{filtered.length} registros</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/35 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Periodo</th>
                      <th className="px-4 py-3 text-left font-semibold">Ruta</th>
                      <th className="px-4 py-3 text-left font-semibold">Horario</th>
                      <th className="px-4 py-3 text-right font-semibold">Cupos</th>
                      <th className="px-4 py-3 text-right font-semibold">Vendidos</th>
                      <th className="px-4 py-3 text-right font-semibold">Reservas</th>
                      <th className="px-4 py-3 text-right font-semibold">Vencidas</th>
                      <th className="px-4 py-3 text-right font-semibold">Ocupación</th>
                      <th className="px-4 py-3 text-right font-semibold">Ing. real</th>
                      <th className="px-4 py-3 text-right font-semibold">Ing. potencial</th>
                      <th className="px-4 py-3 text-right font-semibold">T. descuadre</th>
                      <th className="px-4 py-3 text-right font-semibold">IARCP</th>
                      <th className="px-4 py-3 text-right font-semibold">IPRV</th>
                      <th className="px-4 py-3 text-left font-semibold">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filtered.map((r) => (
                      <tr key={r.codCompKpi} className="hover:bg-muted/20">
                        <td className="px-4 py-3 text-foreground">{r.periodo}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{r.codRuta}</td>
                        <td className="px-4 py-3 text-muted-foreground">{r.codHorario}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-foreground">{r.totalCupos}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-foreground">{r.totalVendidos}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-foreground">{r.totalReservas}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-foreground">{r.totalReservasVencidas}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-foreground">{fmtPct(r.ocupacionEfectiva)}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-foreground">{fmtSol(r.ingresoReal)}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-foreground">{fmtSol(r.ingresoPotencial)}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-foreground">{fmtPct(r.tasaDescuadre)}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-foreground">{(r.iarcp * 100).toFixed(1)}%</td>
                        <td className="px-4 py-3 text-right tabular-nums text-foreground">{(r.iprv * 100).toFixed(1)}%</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTADO_BADGE[r.estadoIndicador]}`}>
                            {r.estadoIndicador}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

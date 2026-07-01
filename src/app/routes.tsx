import { createHashRouter, Navigate } from "react-router";
import { MainLayout } from "./components/layout/MainLayout";
import { Login } from "./components/auth/Login";
import { MetodosAcceso } from "./components/auth/MetodosAcceso";
import { PerfilesPermisos } from "./components/seguridad/PerfilesPermisos";
import { GestionUsuarios } from "./components/seguridad/GestionUsuarios";
import { DashboardGerencial } from "./components/gerencial/DashboardGerencial";
import { DashboardOperativo } from "./components/operativo/DashboardOperativo";
import { ParamsMaintenance } from "./components/gerencial/ParamsMaintenance";
import { DesempenoOperarios } from "./components/gerencial/consultas/DesempenoOperarios";
import { DesempenoVehicular } from "./components/gerencial/consultas/DesempenoVehicular";
import { Ingresos } from "./components/gerencial/consultas/Ingresos";
import { Incidencias } from "./components/gerencial/consultas/Incidencias";
import { DemandaOcupacion } from "./components/gerencial/consultas/DemandaOcupacion";
import { IndicadoresKPI } from "./components/gerencial/consultas/IndicadoresKPI";
import { AjusteOperativoViaje } from "./components/operativo/dataentry/AjusteOperativoViaje";
import { ReservaTickets } from "./components/operativo/dataentry/ReservaTickets";
import { Cotizacion } from "./components/operativo/dataentry/Cotizacion";
import { OrdenPago } from "./components/operativo/dataentry/OrdenPago";
import { CheckInEmbarque } from "./components/operativo/dataentry/CheckInEmbarque";
import { LlegadaCierre } from "./components/operativo/dataentry/LlegadaCierre";
import { TicketViaje } from "./components/operativo/reportes/TicketViaje";
import { ComprobantePago } from "./components/operativo/reportes/ComprobantePago";
import { ManifiestoViaje } from "./components/operativo/reportes/ManifiestoViaje";
import { CierreViaje } from "./components/operativo/reportes/CierreViaje";
import { SeguimientoViaje } from "./components/operativo/reportes/SeguimientoViaje";
import { BatchMonitor } from "./components/tecnico/BatchMonitor";
import { Backup } from "./components/tecnico/Backup";
import { Restore } from "./components/tecnico/Restore";
import { Verificacion } from "./components/tecnico/Verificacion";
import { getCurrentRole, ROLE_HOME } from "./store/session";

// Redirección de "/" al dashboard del rol activo (rol fijo por usuario).
function RootRedirect() {
  return <Navigate to={ROLE_HOME[getCurrentRole()]} replace />;
}

export const router = createHashRouter([
  // --- Seguridad (sin layout) ---
  { path: "/login", Component: Login }, // SEG-01
  { path: "/acceso-alternativo", Component: MetodosAcceso }, // SEG-02

  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: RootRedirect },

      // --- Seguridad ---
      { path: "seguridad/perfiles", Component: PerfilesPermisos }, // SEG-03
      { path: "seguridad/usuarios", Component: GestionUsuarios },  // SEG-04

      // --- Gerencial ---
      { path: "gerencial/dashboard", Component: DashboardGerencial }, // GER-01
      { path: "gerencial/parametros", Component: ParamsMaintenance }, // CAT-01..14
      { path: "gerencial/parametros/:category", Component: ParamsMaintenance },
      { path: "gerencial/consultas/desempeno-operarios", Component: DesempenoOperarios }, // GER-02
      { path: "gerencial/consultas/desempeno-vehicular", Component: DesempenoVehicular }, // GER-03
      { path: "gerencial/consultas/ingresos", Component: Ingresos }, // GER-04
      { path: "gerencial/consultas/incidencias", Component: Incidencias }, // GER-05
      { path: "gerencial/consultas/demanda-ocupacion", Component: DemandaOcupacion }, // GER-06
      { path: "gerencial/consultas/indicadores-kpi", Component: IndicadoresKPI }, // GER-07

      // --- Operativo (Data-Entry) ---
      { path: "operativo/dashboard", Component: DashboardOperativo }, // OPE-01
      { path: "operativo/ajuste-viaje", Component: AjusteOperativoViaje }, // OPE-02
      { path: "operativo/cotizacion", Component: Cotizacion }, // OPE-03
      { path: "operativo/reserva-tickets", Component: ReservaTickets }, // OPE-04
      { path: "operativo/orden-pago", Component: OrdenPago }, // OPE-05
      { path: "operativo/checkin-embarque", Component: CheckInEmbarque }, // OPE-06
      { path: "operativo/llegada-cierre", Component: LlegadaCierre }, // OPE-07

      // --- Reportes operativos ---
      { path: "operativo/reportes/ticket-viaje/:id", Component: TicketViaje }, // REP-01
      { path: "operativo/reportes/comprobante-pago/:id", Component: ComprobantePago }, // REP-02
      { path: "operativo/reportes/manifiesto-viaje/:id", Component: ManifiestoViaje }, // REP-03
      { path: "operativo/reportes/cierre-viaje/:id", Component: CierreViaje }, // REP-04
      { path: "operativo/reportes/seguimiento-viaje/:id", Component: SeguimientoViaje }, // REP-05

      // --- Técnico / Administrativo (gated por rol) ---
      { path: "tecnico/batch-monitor", Component: BatchMonitor }, // Monitor Batch Aplicativo (solo lectura)
      { path: "tecnico/backup", Component: Backup }, // TEC-01
      { path: "tecnico/restore", Component: Restore }, // TEC-02
      { path: "tecnico/verificacion", Component: Verificacion }, // TEC-03
    ],
  },

  // Cualquier ruta desconocida vuelve al inicio.
  { path: "*", element: <Navigate to="/" replace /> },
]);

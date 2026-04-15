import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/layout/MainLayout";
import { Login } from "./components/auth/Login";
import { Recovery } from "./components/auth/Recovery";
import { RoleSelection } from "./components/auth/RoleSelection";
import { DashboardGerencial } from "./components/gerencial/DashboardGerencial";
import { DashboardOperativo } from "./components/operativo/DashboardOperativo";
import { ParamsMaintenance } from "./components/gerencial/ParamsMaintenance";
import { DesempenoOperarios } from "./components/gerencial/consultas/DesempenoOperarios";
import { DesempenoVehicular } from "./components/gerencial/consultas/DesempenoVehicular";
import { Ingresos } from "./components/gerencial/consultas/Ingresos";
import { Incidencias } from "./components/gerencial/consultas/Incidencias";
import { DemandaOcupacion } from "./components/gerencial/consultas/DemandaOcupacion";
import { IndicadoresKPI } from "./components/gerencial/consultas/IndicadoresKPI";
import { RecursosViaje } from "./components/operativo/dataentry/RecursosViaje";
import { ReservaTickets } from "./components/operativo/dataentry/ReservaTickets";
import { Cotizacion } from "./components/operativo/dataentry/Cotizacion";
import { OrdenPago } from "./components/operativo/dataentry/OrdenPago";
import { EmisionTicket } from "./components/operativo/dataentry/EmisionTicket";
import { CheckInEmbarque } from "./components/operativo/dataentry/CheckInEmbarque";
import { LlegadaCierre } from "./components/operativo/dataentry/LlegadaCierre";
import { TicketViaje } from "./components/operativo/reportes/TicketViaje";
import { ComprobantePago } from "./components/operativo/reportes/ComprobantePago";
import { ManifiestoViaje } from "./components/operativo/reportes/ManifiestoViaje";
import { CierreViaje } from "./components/operativo/reportes/CierreViaje";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/recuperar",
    Component: Recovery,
  },
  {
    path: "/seleccionar-rol",
    Component: RoleSelection,
  },
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: RoleSelection,
      },
      // Gerencial
      {
        path: "gerencial/dashboard",
        Component: DashboardGerencial,
      },
      {
        path: "gerencial/parametros",
        Component: ParamsMaintenance,
      },
      {
        path: "gerencial/parametros/:category",
        Component: ParamsMaintenance,
      },
      {
        path: "gerencial/consultas/desempeno-operarios",
        Component: DesempenoOperarios,
      },
      {
        path: "gerencial/consultas/desempeno-vehicular",
        Component: DesempenoVehicular,
      },
      {
        path: "gerencial/consultas/ingresos",
        Component: Ingresos,
      },
      {
        path: "gerencial/consultas/incidencias",
        Component: Incidencias,
      },
      {
        path: "gerencial/consultas/demanda-ocupacion",
        Component: DemandaOcupacion,
      },
      {
        path: "gerencial/consultas/indicadores-kpi",
        Component: IndicadoresKPI,
      },
      // Operativo
      {
        path: "operativo/dashboard",
        Component: DashboardOperativo,
      },
      {
        path: "operativo/recursos-viaje",
        Component: RecursosViaje,
      },
      {
        path: "operativo/reserva-tickets",
        Component: ReservaTickets,
      },
      {
        path: "operativo/cotizacion",
        Component: Cotizacion,
      },
      {
        path: "operativo/orden-pago",
        Component: OrdenPago,
      },
      {
        path: "operativo/emision-ticket",
        Component: EmisionTicket,
      },
      {
        path: "operativo/checkin-embarque",
        Component: CheckInEmbarque,
      },
      {
        path: "operativo/llegada-cierre",
        Component: LlegadaCierre,
      },
      {
        path: "operativo/reportes/ticket-viaje/:id",
        Component: TicketViaje,
      },
      {
        path: "operativo/reportes/comprobante-pago/:id",
        Component: ComprobantePago,
      },
      {
        path: "operativo/reportes/manifiesto-viaje/:id",
        Component: ManifiestoViaje,
      },
      {
        path: "operativo/reportes/cierre-viaje/:id",
        Component: CierreViaje,
      },
    ],
  },
]);

import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router";
import { Download, Printer, QrCode, Send, ShieldCheck, Ticket } from "lucide-react";

import { PageHeader } from "../../shared/PageHeader";
import {
  addTickets,
  getCatalog,
  getCotizaciones,
  getOrdenesPago,
  getReservas,
  getTickets,
  getViajes,
  newId,
  setViajes,
  upsertReserva,
  type Ticket as TicketTx,
} from "../../../store/localDb";

export function EmisionTicket() {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const ordenIdFromUrl = search.get("ordenId") || "";

  const [tickets, setTickets] = useState<TicketTx[]>(() => getTickets());
  const ordenes = useMemo(() => getOrdenesPago(), []);
  const reservas = useMemo(() => getReservas(), []);
  const cotizaciones = useMemo(() => getCotizaciones(), []);
  const viajes = useMemo(() => getViajes(), []);
  const clientes = useMemo(() => getCatalog<any>("clientes", []), []);
  const vehiculos = useMemo(() => getCatalog<any>("vehiculos", []), []);

  const ordenesConfirmadas = ordenes.filter((op) => op.estado === "Pagado");
  const [ordenId, setOrdenId] = useState(ordenIdFromUrl || ordenesConfirmadas[0]?.id || "");
  const selectedOrden = ordenesConfirmadas.find((op) => op.id === ordenId) || ordenesConfirmadas[0];
  const reserva = reservas.find((r) => r.id === (selectedOrden?.referenciaId || selectedOrden?.reservaId));
  const cotizacion = !reserva
    ? cotizaciones.find((c) => c.id === (selectedOrden?.referenciaId || selectedOrden?.reservaId))
    : undefined;
  const clienteCotizacion = clientes.find((c) => c.idTipoCliente === cotizacion?.clienteId);
  const referenciaVentaId = reserva?.id || cotizacion?.id || "";
  const ticketsVenta = referenciaVentaId ? tickets.filter((x) => x.reservaId === referenciaVentaId) : [];
  const [ticketId, setTicketId] = useState(ticketsVenta[0]?.id || tickets[0]?.id || "");
  const t = tickets.find((x) => x.id === ticketId) || ticketsVenta[0] || tickets[0];
  const v = viajes.find((x) => x.id === t?.viajeId) || viajes.find((x) => x.id === (reserva?.viajeId || cotizacion?.viajeId));
  const veh = vehiculos.find((x) => x.idTipoVehiculo === v?.vehiculoId);
  const cuposConfirmados = reserva?.asientos?.length || (cotizacion ? 1 : 0);
  const pendientesPorEmitir = Math.max(0, cuposConfirmados - ticketsVenta.length);

  const handleEmitir = () => {
    if (!selectedOrden || selectedOrden.estado !== "Pagado") return;
    const viaje = viajes.find((x) => x.id === (reserva?.viajeId || cotizacion?.viajeId));
    if (!viaje) return;
    const existingSeats = new Set(ticketsVenta.map((x) => x.asiento));
    const asientosPendientes = reserva
      ? (reserva.asientos || []).filter((asiento) => !existingSeats.has(asiento))
      : (() => {
          for (let n = 1; n <= viaje.capacidad; n++) {
            if (!viaje.asientosOcupados.includes(n) && !existingSeats.has(n)) return [n];
          }
          return [];
        })();
    if (asientosPendientes.length === 0) return;

    const nuevosTickets: TicketTx[] = asientosPendientes.map((asiento, idx) => ({
      id: newId("tkt"),
      codigo: `TKT-${String(tickets.length + idx + 1).padStart(4, "0")}`,
      reservaId: referenciaVentaId,
      viajeId: viaje.id,
      pasajeroNombre: reserva?.pasajeroNombre || clienteCotizacion?.razonSocial || "Cliente",
      pasajeroDocumento: reserva?.pasajeroDocumento || clienteCotizacion?.doc || "Documento",
      asiento,
      precio: Number(reserva?.total || cotizacion?.total || selectedOrden.monto || 0) / Math.max(1, cuposConfirmados),
      estado: "Vendido",
      emitidoAt: new Date().toISOString(),
    }));

    addTickets(nuevosTickets);
    if (reserva) {
      upsertReserva({ ...reserva, estado: "TicketEmitido" });
    } else {
      const viajesNext = getViajes().map((x) =>
        x.id === viaje.id
          ? { ...x, asientosOcupados: Array.from(new Set([...(x.asientosOcupados || []), ...asientosPendientes])).sort((a, b) => a - b) }
          : x,
      );
      setViajes(viajesNext);
    }
    const nextTickets = getTickets();
    setTickets(nextTickets);
    setTicketId(nuevosTickets[0]?.id || ticketId);
  };

  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Emisión de ticket"
        subtitle="Genera el ticket desde una orden confirmada y deja el cupo en estado vendido."
      />

      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Orden confirmada</h3>
          <div className="grid grid-cols-3 gap-4 items-end">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Orden de pago</label>
              <select
                value={selectedOrden?.id || ""}
                onChange={(e) => {
                  setOrdenId(e.target.value);
                  const op = ordenesConfirmadas.find((x) => x.id === e.target.value);
                  const refId = op?.referenciaId || op?.reservaId || "";
                  const firstTicket = tickets.find((x) => x.reservaId === refId);
                  setTicketId(firstTicket?.id || "");
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
              >
                {ordenesConfirmadas.map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.codigo} - Confirmado - S/ {Number(op.monto || 0).toFixed(2)}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-600">
                Origen asociado: <span className="font-semibold">{reserva?.codigo || cotizacion?.codigo || "Sin origen asociado"}</span>
              </p>
            </div>

            <div className={`rounded-xl border p-4 ${pendientesPorEmitir > 0 ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50"}`}>
              <div className="flex items-start gap-2">
                <ShieldCheck className={`w-5 h-5 mt-0.5 ${pendientesPorEmitir > 0 ? "text-amber-700" : "text-emerald-700"}`} />
                <div>
                  <p className={`font-semibold ${pendientesPorEmitir > 0 ? "text-amber-900" : "text-emerald-900"}`}>Estado</p>
                  <p className={`text-sm ${pendientesPorEmitir > 0 ? "text-amber-800" : "text-emerald-800"}`}>
                    {pendientesPorEmitir > 0 ? "Confirmado / pendiente de emisión" : "Vendido"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm text-slate-700">
              <p>
                Cupos confirmados: <span className="font-semibold">{cuposConfirmados}</span>
              </p>
              <p>
                Tickets vendidos: <span className="font-semibold">{ticketsVenta.length}</span>
              </p>
            </div>
            <button
              onClick={handleEmitir}
              disabled={!referenciaVentaId || pendientesPorEmitir === 0}
              className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-600"
            >
              <Ticket className="w-4 h-4" />
              Emitir ticket
            </button>
          </div>

          {ticketsVenta.length > 0 && (
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Ticket vendido</label>
              <select
                value={ticketId || ticketsVenta[0]?.id || ""}
                onChange={(e) => setTicketId(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
              >
                {ticketsVenta.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.codigo} - {x.pasajeroDocumento} - Asiento {String(x.asiento).padStart(2, "0")} - Vendido
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">TICKET DE VIAJE</h2>
                <p className="text-slate-200">Sistema de Transporte</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-200">Código</p>
                <p className="text-2xl font-bold">{t?.codigo || "-"}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-600 mb-3">DATOS DEL PASAJERO</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500">Nombre completo</p>
                    <p className="font-semibold">{t?.pasajeroNombre || reserva?.pasajeroNombre || clienteCotizacion?.razonSocial || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Documento</p>
                    <p className="font-semibold">{t?.pasajeroDocumento || reserva?.pasajeroDocumento || clienteCotizacion?.doc || "-"}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-600 mb-3">ESTADO COMERCIAL</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500">Orden</p>
                    <p className="font-semibold">{selectedOrden?.codigo || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Estado del cupo</p>
                    <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800">
                      {t ? "Vendido" : "Pendiente de emisión"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 my-6" />

            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-600 mb-3">DETALLES DEL VIAJE</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500">Ruta</p>
                    <p className="font-semibold text-lg">{v?.ruta?.replace(" - ", " → ") || "-"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Fecha</p>
                      <p className="font-semibold">{v?.fechaISO || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Hora salida</p>
                      <p className="font-semibold">{v?.horaSalida || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-600 mb-3">INFORMACIÓN ADICIONAL</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500">Vehículo</p>
                    <p className="font-semibold">{veh ? `${veh.idTipoVehiculo} - ${veh.marca} ${veh.modelo}` : v?.vehiculoId || "-"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Asiento</p>
                      <p className="font-semibold text-xl text-slate-700">{t ? String(t.asiento).padStart(2, "0") : "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Precio</p>
                      <p className="font-semibold text-xl">S/ {Number(t?.precio ?? selectedOrden?.monto ?? 0).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 my-6" />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-600 mb-2">CONDICIONES</h4>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>Presentarse 30 minutos antes de la hora de salida</li>
                  <li>Documento de identidad obligatorio</li>
                  <li>Equipaje permitido: 25kg por pasajero</li>
                </ul>
              </div>
              <div className="w-32 h-32 bg-slate-100 border-2 border-slate-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="w-16 h-16 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500 mt-1">QR/Barcode</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border-t border-slate-200 px-8 py-4 flex items-center justify-between">
            <p className="text-xs text-slate-500">Emitido: {t ? new Date(t.emitidoAt).toLocaleString() : "-"}</p>
            <div className="flex items-center gap-4">
              <Link
                to={`/operativo/reportes/ticket-viaje/${t?.codigo || "TKT-000"}`}
                className="text-xs text-slate-600 hover:text-slate-700 font-medium"
              >
                Ver ticket de viaje →
              </Link>
              <Link
                to={`/operativo/reportes/manifiesto-viaje/${v?.codigo || "MAN-000"}`}
                className="text-xs text-slate-700 hover:text-slate-900 font-semibold"
              >
                Ver manifiesto de viaje →
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button className="flex items-center gap-2 px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors">
            <Printer className="w-5 h-5" />
            Imprimir
          </button>
          <button className="flex items-center gap-2 px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors">
            <Download className="w-5 h-5" />
            Descargar PDF
          </button>
          <button className="flex items-center gap-2 px-6 py-3 text-white bg-slate-700 rounded-lg font-medium hover:bg-slate-800 transition-colors">
            <Send className="w-5 h-5" />
            Enviar por Email
          </button>
        </div>
      </div>
    </div>
  );
}

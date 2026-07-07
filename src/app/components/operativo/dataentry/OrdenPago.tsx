import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { PageHeader } from "../../shared/PageHeader";
import { AlertTriangle, CheckCircle2, CreditCard, DollarSign, ShieldCheck } from "lucide-react";
import {
  addMovimientoTicket,
  getCatalog,
  getCotizaciones,
  getOrdenesPago,
  getReservas,
  getTickets,
  getViajes,
  newId,
  setOrdenesPago,
  setTickets,
  upsertReserva,
  type Cotizacion,
  type OrdenPago as OrdenPagoTx,
  type Reserva,
  type Ticket,
} from "../../../store/localDb";

function soles(value: number) {
  return `S/ ${Number(value || 0).toFixed(2)}`;
}

function reservaTipo(reserva?: Reserva) {
  return reserva?.tipoReserva || (reserva?.asientos?.length ? "Pasajeros" : "Carga");
}

export function OrdenPago() {
  const navigate = useNavigate();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const reservaIdFromUrl = search.get("reservaId") || "";

  const cotizaciones = useMemo(() => getCotizaciones(), []);
  const viajes = useMemo(() => getViajes(), []);
  const clientes = useMemo(() => getCatalog<any>("clientes", []), []);
  const servicios = useMemo(() => getCatalog<any>("servicios", []), []);
  const [reservas, setReservas] = useState<Reserva[]>(() => getReservas());
  const [ordenes, setOrdenes] = useState<OrdenPagoTx[]>(() => getOrdenesPago());
  const [metodoPago, setMetodoPago] = useState<"Tarjeta" | "Efectivo" | "Transferencia" | "Credito">("Tarjeta");

  const reservasPendientes = reservas.filter((r) => r.estado === "Reservada");
  const initialReservaId = reservasPendientes.some((r) => r.id === reservaIdFromUrl)
    ? reservaIdFromUrl
    : reservasPendientes[0]?.id || "";
  const [resId, setResId] = useState(initialReservaId);

  const reserva = reservasPendientes.find((r) => r.id === resId);
  const viaje = viajes.find((v) => v.id === reserva?.viajeId);
  const cotVinculada = (() => {
    if (!reserva) return undefined;
    return (
      cotizaciones.find((c) => c.id === reserva.cotizacionId) ||
      cotizaciones.find((c) => c.viajeId === reserva.viajeId && c.clienteId === reserva.clienteId) ||
      cotizaciones.find((c) => c.viajeId === reserva.viajeId)
    ) as Cotizacion | undefined;
  })();
  const cliente = (() => {
    if (reserva?.clienteId) return clientes.find((c) => c.idTipoCliente === reserva.clienteId);
    if (cotVinculada?.clienteId) return clientes.find((c) => c.idTipoCliente === cotVinculada.clienteId);
    const doc = reserva?.pasajeroDocumento;
    if (doc) return clientes.find((c) => String(c.doc || "").includes(String(doc).replace(/\s+/g, " ").trim()));
    return undefined;
  })();
  const servicioCodigo = cotVinculada?.servicioCodigo || (reservaTipo(reserva) === "Pasajeros" ? "SRV-001" : "SRV-002");
  const servicio = servicios.find((s: any) => s.codigo === servicioCodigo);

  const total = Number(reserva?.total ?? cotVinculada?.total ?? 0);
  const subtotal = Number(cotVinculada?.subtotal ?? total / 1.18);
  const igv = Number(cotVinculada?.igv ?? total - subtotal);
  const estadoPago = reserva?.estado === "Pagada" ? "Pagado" : "Pendiente";
  const esCorporativo = String(cliente?.categoriaPerfil || "").toLowerCase().includes("corporativo");
  const creditoHabilitado = esCorporativo && ["Si", "Sí", "SÃ­"].includes(String(cliente?.aplicaLineaCredito || "No"));
  const limite = Number(cliente?.limiteCreditoMax ?? 0);
  const creditoOk = total <= limite;
  const seleccionLabel = reserva
    ? `${reserva.codigo} - ${reservaTipo(reserva)} - ${cotVinculada?.codigo || "Sin cotizacion"} - ${viaje?.codigo || reserva.viajeId}`
    : "";
  const cupos = reserva?.asientos?.length
    ? `Asientos: ${reserva.asientos.map((n) => `AS-${String(n).padStart(2, "0")}`).join(", ")}`
    : `Espacios: ${(reserva?.espaciosCarga || []).map((n) => `SP-${String(n).padStart(3, "0")}`).join(", ") || "-"}`;

  const confirmarPago = () => {
    if (!reserva) return;
    if (metodoPago === "Credito" && (!creditoHabilitado || !creditoOk)) return;

    const op: OrdenPagoTx = {
      id: newId("op"),
      codigo: `OP-2026-${String(ordenes.length + 142).padStart(4, "0")}`,
      reservaId: reserva.id,
      origenTipo: "Reserva",
      referenciaId: reserva.id,
      metodo: metodoPago === "Credito" ? "Transferencia" : metodoPago,
      monto: total,
      estado: "Pagado",
      createdAt: new Date().toISOString(),
    };

    const ordenesNext = [...ordenes, op];
    setOrdenesPago(ordenesNext);
    setOrdenes(ordenesNext);

    const reservasNext = upsertReserva({ ...reserva, estado: "Pagada" });
    setReservas(reservasNext);

    // La venta ocurre aquí: los tickets ya creados en la reserva (estado RE) pasan a VE.
    // Si por alguna razón la reserva no tiene detalle de tickets (dato legado), se genera como respaldo.
    const existingTickets = getTickets();
    const cuposTicket = reserva.asientos.length ? reserva.asientos : reserva.espaciosCarga || [];
    const ticketsReserva = existingTickets.filter((t) => t.reservaId === reserva.id);
    const ticketsRespaldo: Ticket[] =
      ticketsReserva.length > 0
        ? []
        : cuposTicket.map((cupo, idx) => ({
            id: newId("tkt"),
            codigo: `TKT-2026-${String(existingTickets.length + idx + 1).padStart(4, "0")}`,
            reservaId: reserva.id,
            viajeId: reserva.viajeId,
            pasajeroNombre: reserva.pasajeroNombre,
            pasajeroDocumento: reserva.pasajeroDocumento,
            asiento: cupo,
            precio: total / Math.max(1, cuposTicket.length),
            estado: "RE",
            emitidoAt: new Date().toISOString(),
          }));

    const ticketsNext = [...existingTickets, ...ticketsRespaldo].map((t) =>
      t.reservaId === reserva.id ? { ...t, estado: "VE" as const } : t,
    );
    setTickets(ticketsNext);

    // Registrar el movimiento de venta: RE → VE, por confirmación de pago.
    ticketsNext
      .filter((t) => t.reservaId === reserva.id)
      .forEach((t) => {
        addMovimientoTicket({
          id: newId("mov"),
          ticketId: t.id,
          reservaId: reserva.id,
          estadoAnterior: "RE",
          estadoNuevo: "VE",
          motivo: "Confirmación de pago",
          createdAt: new Date().toISOString(),
        });
      });

    navigate(`/operativo/reportes/comprobante-pago/${encodeURIComponent(op.id)}`);
  };

  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Orden de Pago"
        subtitle="Registra el metodo de pago y confirma el monto asociado a una reserva pendiente."
      />

      <div className="p-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Metodo de pago</h3>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Reserva pendiente de pago</label>
                <select
                  value={resId}
                  onChange={(e) => setResId(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
                  disabled={reservasPendientes.length === 0}
                >
                  {reservasPendientes.length === 0 ? (
                    <option value="">Sin reservas pendientes</option>
                  ) : (
                    reservasPendientes.map((r) => {
                      const cot = cotizaciones.find((c) => c.id === r.cotizacionId) || cotizaciones.find((c) => c.viajeId === r.viajeId);
                      const v = viajes.find((x) => x.id === r.viajeId);
                      return (
                        <option key={r.id} value={r.id}>
                          {r.codigo} - {reservaTipo(r)} - {cot?.codigo || "Sin cotizacion"} - {v?.codigo || r.viajeId}
                        </option>
                      );
                    })
                  )}
                </select>
                {!reserva && (
                  <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
                    Seleccione una reserva pendiente para generar la orden de pago.
                  </p>
                )}
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Monto pendiente</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{soles(total)}</p>
                <p className="text-xs text-slate-600 mt-1">{seleccionLabel || "-"}</p>
                <span className="mt-3 inline-flex rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
                  {estadoPago}
                </span>
              </div>
            </div>

            <div className={`grid gap-3 mb-6 ${creditoHabilitado ? "grid-cols-4" : "grid-cols-3"}`}>
              <button onClick={() => setMetodoPago("Tarjeta")} className={`p-4 border-2 rounded-lg transition-all ${metodoPago === "Tarjeta" ? "border-slate-700 bg-slate-50" : "border-slate-200 hover:border-slate-300"}`}>
                <CreditCard className="w-6 h-6 mx-auto mb-2 text-slate-700" />
                <p className="text-sm font-medium">Tarjeta</p>
              </button>
              <button onClick={() => setMetodoPago("Efectivo")} className={`p-4 border-2 rounded-lg transition-all ${metodoPago === "Efectivo" ? "border-slate-700 bg-slate-50" : "border-slate-200 hover:border-slate-300"}`}>
                <DollarSign className="w-6 h-6 mx-auto mb-2 text-slate-700" />
                <p className="text-sm font-medium">Efectivo</p>
              </button>
              <button onClick={() => setMetodoPago("Transferencia")} className={`p-4 border-2 rounded-lg transition-all ${metodoPago === "Transferencia" ? "border-slate-700 bg-slate-50" : "border-slate-200 hover:border-slate-300"}`}>
                <svg className="w-6 h-6 mx-auto mb-2 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <p className="text-sm font-medium">Transferencia</p>
              </button>
              {creditoHabilitado && (
                <button onClick={() => setMetodoPago("Credito")} className={`p-4 border-2 rounded-lg transition-all ${metodoPago === "Credito" ? "border-slate-700 bg-slate-50" : "border-slate-200 hover:border-slate-300"}`}>
                  <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-slate-700" />
                  <p className="text-sm font-medium">A Credito</p>
                </button>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <p className="font-semibold text-slate-900 mb-2">Datos de la reserva</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">COD_RESERVA</p>
                  <p className="font-semibold">{reserva?.codigo || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">COD_COTIZACION</p>
                  <p className="font-semibold">{cotVinculada?.codigo || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Cliente</p>
                  <p className="font-semibold">{cliente ? `${cliente.idTipoCliente} - ${cliente.razonSocial || cliente.doc}` : reserva?.pasajeroNombre || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Viaje</p>
                  <p className="font-semibold">{viaje ? `${viaje.codigo} - ${viaje.ruta}` : "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Servicio</p>
                  <p className="font-semibold">{servicioCodigo} - {servicio?.descripcion || reservaTipo(reserva)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Tickets / espacios reservados</p>
                  <p className="font-semibold">{reserva ? cupos : "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Subtotal</p>
                  <p className="font-semibold">{soles(subtotal)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">IGV</p>
                  <p className="font-semibold">{soles(igv)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Total</p>
                  <p className="font-semibold">{soles(total)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Estado de pago</p>
                  <p className="font-semibold">{estadoPago}</p>
                </div>
              </div>
            </div>

            {metodoPago === "Credito" && creditoHabilitado && (
              <div className={`mt-4 rounded-xl border p-4 ${creditoOk ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
                <div className="flex items-start gap-3">
                  {creditoOk ? <CheckCircle2 className="w-5 h-5 text-emerald-700 mt-0.5" /> : <AlertTriangle className="w-5 h-5 text-rose-700 mt-0.5" />}
                  <div>
                    <p className={`font-semibold ${creditoOk ? "text-emerald-900" : "text-rose-900"}`}>Evaluacion Automatica de Credito</p>
                    <p className={`text-sm mt-1 ${creditoOk ? "text-emerald-800" : "text-rose-800"}`}>
                      Limite: S/ {limite.toLocaleString()} - Importe: {soles(total)} - {creditoOk ? "APROBADO" : "RECHAZADO"}
                    </p>
                    {!creditoOk && <p className="text-xs text-rose-700 mt-2 font-medium">Bloqueo: el total supera el limite de credito del cliente.</p>}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Evidencia del pago</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Medio</p>
                  <p className="font-semibold">{metodoPago}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Comprobante</p>
                  <p className="font-semibold">{metodoPago === "Transferencia" ? "OP-BAN-000884" : metodoPago === "Tarjeta" ? "VISA-AUTH-93421" : metodoPago === "Efectivo" ? "CAJA-001-REC-1022" : "CRD-APROB-7712"}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Monto</p>
                  <p className="font-semibold">{soles(total)}</p>
                </div>
              </div>
            </div>

            <button
              onClick={confirmarPago}
              className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 text-white bg-slate-700 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:bg-slate-400"
              disabled={!reserva || (metodoPago === "Credito" && (!creditoHabilitado || !creditoOk))}
            >
              <CheckCircle2 className="w-5 h-5" />
              Confirmar pago
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Resumen</h3>
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Reserva:</p>
                <p className="font-semibold">{reserva?.codigo || "-"}</p>
                <p className="text-xs text-slate-500 mt-1">{reservaTipo(reserva)}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Cotizacion:</p>
                <p className="font-semibold">{cotVinculada?.codigo || "-"}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Viaje:</p>
                <p className="font-semibold">{viaje ? `${viaje.codigo} - ${viaje.ruta}` : "-"}</p>
                <p className="text-xs text-slate-500 mt-1">{reserva ? cupos : "-"}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Condicion:</p>
                <p className="font-semibold">Pago inmediato</p>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-700">Subtotal:</span>
                  <span className="font-medium">{soles(subtotal)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-700">IGV:</span>
                  <span className="font-medium">{soles(igv)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-900">Total:</span>
                  <span className="text-2xl font-bold text-slate-700">{soles(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { PageHeader } from "../../shared/PageHeader";
import { CheckCircle2, CreditCard, DollarSign, ShieldCheck, AlertTriangle } from "lucide-react";
import {
  getCatalog,
  getCotizaciones,
  getOrdenesPago,
  getReservas,
  newId,
  setOrdenesPago,
  upsertCotizacion,
  upsertReserva,
  type Cotizacion,
  type OrdenPago as OrdenPagoTx,
  type Reserva,
} from "../../../store/localDb";

export function OrdenPago() {
  const navigate = useNavigate();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const reservaIdFromUrl = search.get("reservaId") || "";
  const cotizaciones = useMemo(() => getCotizaciones(), []);
  const reservas = useMemo(() => getReservas(), []);
  const clientes = useMemo(() => getCatalog<any>("clientes", []), []);
  const [ordenes, setOrdenes] = useState<OrdenPagoTx[]>(() => getOrdenesPago());
  const [modo, setModo] = useState<"Cotizacion" | "Reserva">(() => (reservaIdFromUrl ? "Reserva" : "Cotizacion"));
  const [cotId, setCotId] = useState(cotizaciones[0]?.id || "");
  const [resId, setResId] = useState(reservaIdFromUrl || reservas[0]?.id || "");
  const [metodoPago, setMetodoPago] = useState<"Tarjeta" | "Efectivo" | "Transferencia" | "Credito">("Tarjeta");

  const cot = cotizaciones.find((c) => c.id === cotId) as Cotizacion | undefined;
  const reserva = reservas.find((r) => r.id === resId) as Reserva | undefined;
  const cliente = (() => {
    const id = modo === "Reserva" ? reserva?.clienteId : cot?.clienteId;
    if (id) return clientes.find((c) => c.idTipoCliente === id);
    const doc = modo === "Reserva" ? reserva?.pasajeroDocumento : undefined;
    if (doc) return clientes.find((c) => String(c.doc || "").includes(String(doc).replace(/\s+/g, " ").trim()));
    return undefined;
  })();

  const esCorporativo = String(cliente?.categoriaPerfil || "").toLowerCase().includes("corporativo");
  const creditoHabilitado = esCorporativo && String(cliente?.aplicaLineaCredito || "No") === "Sí";
  const limite = Number(cliente?.limiteCreditoMax ?? 0);
  const total = Number((modo === "Reserva" ? reserva?.total : cot?.total) ?? 0);
  const creditoOk = total <= limite;

  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Orden de Pago"
        subtitle="Registra el pago y valida la línea de crédito"
      />

      <div className="p-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Método de Pago</h3>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Origen</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setModo("Reserva")}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold border ${
                      modo === "Reserva" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    Reserva
                  </button>
                  <button
                    onClick={() => setModo("Cotizacion")}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold border ${
                      modo === "Cotizacion" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    Cotización
                  </button>
                </div>

                {modo === "Reserva" ? (
                  <select
                    value={resId}
                    onChange={(e) => setResId(e.target.value)}
                    className="mt-2 w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
                  >
                    {reservas.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.codigo} — {r.tipoReserva || (r.asientos?.length ? "Pasajeros" : "Carga")} — Total S/ {Number(r.total || 0).toFixed(2)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={cotId}
                    onChange={(e) => setCotId(e.target.value)}
                    className="mt-2 w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
                  >
                    {cotizaciones.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.codigo} — {c.clienteId} — Total S/ {Number(c.total).toFixed(2)}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total a pagar</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">S/ {total.toFixed(2)}</p>
                <p className="text-xs text-slate-600 mt-1">
                  {modo === "Reserva"
                    ? `${reserva?.codigo || "-"} — ${reserva?.tipoReserva || "-"}`
                    : `${cot?.servicioCodigo || "-"} — ${cot?.bienId || "-"}`}
                </p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className={`grid gap-3 mb-6 ${creditoHabilitado ? "grid-cols-4" : "grid-cols-3"}`}>
              <button
                onClick={() => setMetodoPago("Tarjeta")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  metodoPago === "Tarjeta"
                    ? "border-slate-700 bg-slate-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <CreditCard className="w-6 h-6 mx-auto mb-2 text-slate-700" />
                <p className="text-sm font-medium">Tarjeta</p>
              </button>
              <button
                onClick={() => setMetodoPago("Efectivo")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  metodoPago === "Efectivo"
                    ? "border-slate-700 bg-slate-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <DollarSign className="w-6 h-6 mx-auto mb-2 text-slate-700" />
                <p className="text-sm font-medium">Efectivo</p>
              </button>
              <button
                onClick={() => setMetodoPago("Transferencia")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  metodoPago === "Transferencia"
                    ? "border-slate-700 bg-slate-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <svg className="w-6 h-6 mx-auto mb-2 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <p className="text-sm font-medium">Transferencia</p>
              </button>

              {creditoHabilitado && (
                <button
                  onClick={() => setMetodoPago("Credito")}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    metodoPago === "Credito"
                      ? "border-slate-700 bg-slate-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-slate-700" />
                  <p className="text-sm font-medium">A Crédito</p>
                </button>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <p className="font-semibold text-slate-900 mb-2">Resumen</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Cliente</p>
                  <p className="font-semibold">{cliente ? `${cliente.idTipoCliente} — ${cliente.razonSocial || cliente.doc}` : "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Cotización</p>
                  <p className="font-semibold">{cot?.codigo || "-"}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Servicio</p>
                  <p className="font-semibold">{cot?.servicioCodigo || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Bien</p>
                  <p className="font-semibold">{cot?.bienId || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Contenedor</p>
                  <p className="font-semibold">{cot?.contenedorId || "-"}</p>
                </div>
              </div>
            </div>

            {metodoPago === "Credito" && creditoHabilitado && (
              <div className={`mt-4 rounded-xl border p-4 ${creditoOk ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
                <div className="flex items-start gap-3">
                  {creditoOk ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-700 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-semibold ${creditoOk ? "text-emerald-900" : "text-rose-900"}`}>Evaluación Automática de Crédito</p>
                    <p className={`text-sm mt-1 ${creditoOk ? "text-emerald-800" : "text-rose-800"}`}>
                      Límite: S/ {limite.toLocaleString()} — Importe: S/ {total.toFixed(2)} —{" "}
                      {creditoOk ? "APROBADO" : "RECHAZADO"}
                    </p>
                    {!creditoOk && <p className="text-xs text-rose-700 mt-2 font-medium">Bloqueo: el total supera el límite de crédito del cliente.</p>}
                  </div>
                </div>
              </div>
            )}

            {/* sin tipeo libre: todo como selección/simulación */}
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Simulación de Evidencia</p>
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
                  <p className="font-semibold">S/ {total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (modo === "Cotizacion" && !cot) return;
                if (modo === "Reserva" && !reserva) return;
                if (metodoPago === "Credito" && (!creditoHabilitado || !creditoOk)) return;
                const op: OrdenPagoTx = {
                  id: newId("op"),
                  codigo: `OP-2026-${String(ordenes.length + 142).padStart(4, "0")}`,
                  reservaId: modo === "Reserva" ? reserva!.id : cot!.id, // referencia (reserva real o cotización legacy)
                  metodo: metodoPago === "Credito" ? "Transferencia" : metodoPago,
                  monto: total,
                  estado: "Pagado",
                  createdAt: new Date().toISOString(),
                };
                const next = [...ordenes, op];
                setOrdenesPago(next);
                setOrdenes(next);
                if (modo === "Cotizacion" && cot) upsertCotizacion({ ...cot, estado: "Convertido" });
                if (modo === "Reserva" && reserva) upsertReserva({ ...reserva, estado: "Pagada" });
                navigate(`/operativo/reportes/comprobante-pago/${op.codigo}`);
              }}
              className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 text-white bg-slate-700 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:bg-slate-400"
              disabled={(modo === "Cotizacion" ? !cot : !reserva) || (metodoPago === "Credito" && (!creditoHabilitado || !creditoOk))}
            >
              <CheckCircle2 className="w-5 h-5" />
              Confirmar Pago
            </button>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Resumen</h3>
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Cotización:</p>
                <p className="font-semibold">{cot?.codigo || "-"}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Viaje:</p>
                <p className="font-semibold">{cot?.viajeId ? "Viaje asociado (ver cotización)" : "-"}</p>
                <p className="text-sm text-slate-600">{cot?.servicioCodigo} — {cot?.bienId}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Condición:</p>
                <p className="font-semibold">{creditoHabilitado ? "Cliente corporativo (crédito disponible)" : "Pago inmediato"}</p>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-700">Subtotal:</span>
                  <span className="font-medium">S/ {Number(cot?.subtotal ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-700">IGV:</span>
                  <span className="font-medium">S/ {Number(cot?.igv ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-900">Total:</span>
                  <span className="text-2xl font-bold text-slate-700">S/ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

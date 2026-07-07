import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ArrowRight, CheckCircle2, CircleAlert, CreditCard, Search, Snowflake, Ticket } from "lucide-react";

import { PageHeader } from "../../shared/PageHeader";
import { DataTable } from "../../shared/DataTable";
import {
  addMovimientoTicket,
  addTickets,
  getCatalog,
  getCotizaciones,
  getReservas,
  getTickets,
  getViajes,
  newId,
  setViajes,
  upsertReserva,
  type Reserva,
  type Ticket as TicketTx,
  type Viaje,
} from "../../../store/localDb";

const SRV_PASAJEROS = "SRV-001";

function fmtFecha(iso: string) {
  const [y, m, d] = (iso || "").split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function buildCodigo(prefix: string, n: number) {
  return `${prefix}-${String(n).padStart(3, "0")}`;
}

const SERVICIO_LABEL: Record<string, string> = {
  "SRV-001": "Interprovincial de Pasajeros",
  "SRV-002": "Carga General",
  "SRV-003": "Carga Refrigerada",
  "SRV-004": "Ejecutivo VIP",
};

export function ReservaTickets() {
  const navigate = useNavigate();
  const location = useLocation();

  const viajes = useMemo(() => getViajes(), []);
  const clientes = useMemo(() => getCatalog<any>("clientes", []), []);
  const bienes = useMemo(() => getCatalog<any>("bienes", []), []);
  const contenedores = useMemo(() => getCatalog<any>("contenedores", []), []);
  const allCotizaciones = useMemo(() => getCotizaciones(), []);

  // Cotización recibida (única entrada válida a esta pantalla).
  const cotizacionId = new URLSearchParams(location.search).get("cotizacionId") || "";
  const cot = useMemo(
    () => allCotizaciones.find((c) => c.id === cotizacionId) || null,
    [allCotizaciones, cotizacionId],
  );

  const [reservas, setReservasState] = useState<Reserva[]>(() => getReservas());
  const [selectedAsientos, setSelectedAsientos] = useState<number[]>([]);
  const [selectedEspacios, setSelectedEspacios] = useState<number[]>([]);
  // Id de la reserva recién confirmada en esta pantalla (habilita "Continuar a orden de pago").
  const [confirmadaReservaId, setConfirmadaReservaId] = useState<string | null>(null);
  const confirmada = Boolean(confirmadaReservaId);

  // ── Estado sin cotización: la pantalla ya no busca viajes desde cero ──
  if (!cot) {
    return (
      <div className="min-h-full bg-slate-50">
        <PageHeader
          title="Asignación / reserva de tickets"
          subtitle="Bloquea cupos disponibles para la cotización seleccionada y registra la asignación temporal del ticket."
        />
        <div className="p-8 w-full max-w-[900px] mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-10 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-100">
              <Ticket className="w-6 h-6 text-slate-500" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">No hay cotización seleccionada</h3>
            <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
              La asignación de tickets parte de una cotización previa. Primero consulta disponibilidad,
              genera la cotización y continúa desde allí a esta pantalla.
            </p>
            <button
              onClick={() => navigate("/operativo/cotizacion")}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              <Search className="w-4 h-4" />
              Ir a Disponibilidad y cotización
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPasajeros = cot.servicioCodigo === SRV_PASAJEROS;
  const cuposSolicitados = Number(cot.cantidad || 0);

  const viaje: Viaje | undefined = viajes.find((v) => v.id === cot.viajeId);
  const cliente = clientes.find((c: any) => c.idTipoCliente === cot.clienteId);
  const bien = bienes.find((b: any) => b.idTipoBien === cot.bienId);
  const contenedor = contenedores.find(
    (c: any) => c.idTipoContenedor === (cot.contenedorId || viaje?.contenedorId),
  );

  // ── Disponibilidad de cupos ──────────────────────────────────────
  const occupiedAsientos = new Set<number>(viaje?.asientosOcupados || []);
  const capacidadAsientos = viaje?.capacidad || 0;
  const disponiblesAsientos = Math.max(0, capacidadAsientos - (viaje?.asientosOcupados?.length || 0));

  const capacidadCarga = viaje?.capacidadCargaEspacios ?? 40;
  const occupiedCarga = new Set<number>(viaje?.espaciosCargaOcupados || []);
  const disponiblesCarga = Math.max(0, capacidadCarga - (viaje?.espaciosCargaOcupados?.length || 0));

  const seats = Array.from({ length: capacidadAsientos }, (_, i) => i + 1);
  const espacios = Array.from({ length: capacidadCarga }, (_, i) => i + 1);

  const toggleAsiento = (n: number) => {
    if (occupiedAsientos.has(n)) return;
    setSelectedAsientos((prev) => {
      if (prev.includes(n)) return prev.filter((x) => x !== n);
      // No permitir seleccionar más asientos que los cupos cotizados.
      if (prev.length >= cuposSolicitados) return prev;
      return [...prev, n].sort((a, b) => a - b);
    });
  };
  const toggleEspacio = (n: number) => {
    if (occupiedCarga.has(n)) return;
    setSelectedEspacios((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n].sort((a, b) => a - b),
    );
  };

  // ── Validación de compatibilidad / disponibilidad ────────────────
  const validacion = (() => {
    if (!viaje) return { ok: false, title: "Viaje no encontrado", detail: "La cotización referencia un viaje inexistente." };
    if (isPasajeros) {
      if (selectedAsientos.length === 0)
        return { ok: false, title: "Selecciona los asientos", detail: `Debes elegir ${cuposSolicitados} asiento(s) según la cotización.` };
      if (selectedAsientos.length !== cuposSolicitados)
        return { ok: false, title: "Cantidad de asientos incompleta", detail: `Seleccionados ${selectedAsientos.length} de ${cuposSolicitados} cupos cotizados.` };
      const invalido = selectedAsientos.some((n) => occupiedAsientos.has(n) || n < 1 || n > capacidadAsientos);
      if (invalido) return { ok: false, title: "Asientos no disponibles", detail: "Hay asientos ya ocupados. Vuelve a seleccionar." };
      return { ok: true, title: "Asignación válida", detail: `${selectedAsientos.length} asiento(s) listos para bloquear (DI → RE).` };
    }
    // Carga
    if (!bien) return { ok: false, title: "Bien no encontrado", detail: "La cotización no tiene un bien de catálogo válido." };
    if (!contenedor) return { ok: false, title: "Viaje sin contenedor", detail: "El viaje no tiene contenedor asignado compatible." };
    if (selectedEspacios.length === 0)
      return { ok: false, title: "Selecciona espacio de bodega", detail: "Elige al menos un espacio SP disponible para la carga." };
    const invalido = selectedEspacios.some((n) => occupiedCarga.has(n) || n < 1 || n > capacidadCarga);
    if (invalido) return { ok: false, title: "Espacios no disponibles", detail: "Hay espacios ya ocupados. Vuelve a seleccionar." };
    if (String(bien.requiereCadenaFrio) === "Sí") {
      if (String(contenedor.nivelRefrigeracion) !== "Sí")
        return { ok: false, title: "Incompatible: sin refrigeración", detail: `El bien exige cadena de frío (${bien.temperaturaExigida}°C) y el contenedor "${contenedor.claseContenedor}" no refrigera.` };
      const tMin = Number(contenedor.temperaturaMinima);
      const req = Number(bien.temperaturaExigida);
      if (Number.isFinite(tMin) && Number.isFinite(req) && tMin > req)
        return { ok: false, title: "Incompatible: temperatura", detail: `Contenedor mínimo ${tMin}°C, la carga exige ${req}°C.` };
    }
    return { ok: true, title: "Asignación válida", detail: `${selectedEspacios.length} espacio(s) SP compatibles listos para bloquear (DI → RE).` };
  })();

  // ── Confirmar reserva: crea reserva + detalle de tickets (DI → RE) + movimiento ──
  const handleReservar = () => {
    if (!viaje || !cliente || !validacion.ok || confirmada) return;

    const nextCodigo = buildCodigo("RSV", reservas.length + 1);
    const reservaId = newId("reserva");
    const reserva: Reserva = {
      id: reservaId,
      codigo: nextCodigo,
      viajeId: viaje.id,
      cotizacionId: cot.id,
      clienteId: cliente.idTipoCliente,
      pasajeroNombre: cliente.razonSocial || "Cliente",
      pasajeroDocumento: cliente.doc || "DNI/RUC",
      telefono: "-",
      email: "-",
      asientos: isPasajeros ? [...selectedAsientos] : [],
      tipoReserva: isPasajeros ? "Pasajeros" : "Carga",
      espaciosCarga: isPasajeros ? undefined : [...selectedEspacios],
      bienId: isPasajeros ? undefined : cot.bienId,
      contenedorId: isPasajeros ? undefined : contenedor?.idTipoContenedor,
      cantidad: isPasajeros ? undefined : Number(cot.cantidad || 0),
      unidad: isPasajeros ? undefined : cot.unidad,
      temperaturaObjetivoC: !isPasajeros && Number.isFinite(Number(bien?.temperaturaExigida)) ? Number(bien?.temperaturaExigida) : null,
      total: Number(cot.total || 0),
      estado: "Reservada", // RE
      createdAt: new Date().toISOString(),
    };

    // 1) Crear la reserva.
    setReservasState(upsertReserva(reserva));

    // 2) Crear el detalle de tickets asignados a la reserva, en estado RE (bloqueado, no vendido).
    const cupos = isPasajeros ? [...selectedAsientos] : [...selectedEspacios];
    const existingTickets = getTickets();
    const nuevosTickets: TicketTx[] = cupos.map((cupo, idx) => ({
      id: newId("tkt"),
      codigo: `TKT-2026-${String(existingTickets.length + idx + 1).padStart(4, "0")}`,
      reservaId,
      viajeId: viaje.id,
      pasajeroNombre: reserva.pasajeroNombre,
      pasajeroDocumento: reserva.pasajeroDocumento,
      asiento: cupo,
      precio: Number(cot.total || 0) / Math.max(1, cupos.length),
      estado: "RE",
      emitidoAt: new Date().toISOString(),
    }));
    addTickets(nuevosTickets);

    // 3) Registrar el movimiento de cada ticket: DI → RE.
    nuevosTickets.forEach((t) => {
      addMovimientoTicket({
        id: newId("mov"),
        ticketId: t.id,
        reservaId,
        estadoAnterior: "DI",
        estadoNuevo: "RE",
        motivo: "Asignación de cupo en reserva",
        createdAt: new Date().toISOString(),
      });
    });

    // 4) Bloqueo conceptual de cupos en el viaje (DI → RE).
    const viajesNext = getViajes().map((v) => {
      if (v.id !== viaje.id) return v;
      if (isPasajeros) {
        const merged = Array.from(new Set([...(v.asientosOcupados || []), ...selectedAsientos])).sort((a, b) => a - b);
        return { ...v, asientosOcupados: merged };
      }
      const mergedCarga = Array.from(new Set([...(v.espaciosCargaOcupados || []), ...selectedEspacios])).sort((a, b) => a - b);
      return { ...v, espaciosCargaOcupados: mergedCarga, capacidadCargaEspacios: v.capacidadCargaEspacios ?? capacidadCarga };
    });
    setViajes(viajesNext);

    // 5) La reserva queda confirmada; se habilita continuar a orden de pago (no es una venta).
    setConfirmadaReservaId(reservaId);
  };

  const continuarAOrdenPago = () => {
    if (!confirmadaReservaId) return;
    navigate(`/operativo/orden-pago?reservaId=${encodeURIComponent(confirmadaReservaId)}&cotizacionId=${encodeURIComponent(cot.id)}`);
  };

  const sym = "S/";

  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Asignación / reserva de tickets"
        subtitle="Bloquea cupos disponibles para la cotización seleccionada y registra la asignación temporal del ticket."
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={handleReservar}
              disabled={!validacion.ok || confirmada}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                validacion.ok && !confirmada ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-200 text-slate-500 cursor-not-allowed"
              }`}
            >
              <Ticket className="w-4 h-4" />
              {confirmada ? "Reserva confirmada" : "Confirmar reserva"}
            </button>
            {confirmada && (
              <button
                onClick={continuarAOrdenPago}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-slate-700 hover:bg-slate-800 transition-colors"
              >
                Continuar a orden de pago
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        }
      />

      <div className="p-8 space-y-6">
        {/* ── Cabecera: cotización seleccionada ─────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Cotización seleccionada</h3>
            <span className={`inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-full border ${confirmada ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-sky-50 text-sky-700 border-sky-200"}`}>
              {confirmada ? "Estado: RE (Reservado)" : "Estado: DI (Disponible)"}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Código cotización</p>
              <p className="text-sm font-semibold text-slate-900">{cot.codigo}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Cliente</p>
              <p className="text-sm font-semibold text-slate-900 truncate">{cliente?.razonSocial || cot.clienteId}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Tipo de servicio</p>
              <p className="text-sm font-semibold text-slate-900">{SERVICIO_LABEL[cot.servicioCodigo] || cot.servicioCodigo}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Viaje seleccionado</p>
              <p className="text-sm font-semibold text-slate-900">{viaje ? `${viaje.codigo} — ${viaje.ruta}` : cot.viajeId}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Cupos solicitados</p>
              <p className="text-sm font-semibold text-slate-900">{cuposSolicitados} {isPasajeros ? "asiento(s)" : cot.unidad}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Total cotizado</p>
              <p className="text-sm font-semibold text-slate-900">{sym} {Number(cot.total).toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* ── Panel de asignación ─────────────────────────────── */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
              {isPasajeros ? "Asignación de asientos" : "Asignación de espacio de bodega"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Resumen del viaje */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Resumen del viaje</p>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Ruta</p>
                    <p className="text-sm font-semibold text-slate-900">{viaje?.ruta || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Salida</p>
                    <p className="text-sm font-semibold text-slate-900">{viaje ? `${fmtFecha(viaje.fechaISO)} ${viaje.horaSalida}` : "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Capacidad</p>
                    <p className="text-sm font-semibold text-slate-900">{isPasajeros ? `${capacidadAsientos} asientos` : `${capacidadCarga} espacios SP`}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Disponibles</p>
                    <p className="text-sm font-semibold text-emerald-700">{isPasajeros ? disponiblesAsientos : disponiblesCarga}</p>
                  </div>
                </div>
              </div>

              {/* Datos de la carga (solo lectura) o resumen pax */}
              {isPasajeros ? (
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold text-slate-900">Asientos seleccionados</p>
                  <p className="text-xs text-slate-600 mt-1">Elige exactamente {cuposSolicitados} asiento(s).</p>
                  <p className="mt-3 text-sm">
                    {selectedAsientos.length
                      ? <span className="font-semibold text-slate-900">{selectedAsientos.map((n) => `AS-${String(n).padStart(2, "0")}`).join(", ")}</span>
                      : <span className="text-slate-500">—</span>}
                  </p>
                  <p className="mt-2 text-xs text-slate-600">
                    {selectedAsientos.length}/{cuposSolicitados} seleccionados
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Carga a asignar (solo lectura)</p>
                  <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase">Bien</p>
                      <p className="font-semibold text-slate-900">{bien ? `${bien.idTipoBien} — ${bien.nombreComercial}` : "—"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase">Peso / cantidad</p>
                      <p className="font-semibold text-slate-900">{cot.cantidad} {cot.unidad}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase">Contenedor</p>
                      <p className="font-semibold text-slate-900">{contenedor ? `${contenedor.idTipoContenedor} — ${contenedor.claseContenedor}` : "—"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase">Cadena de frío</p>
                      <p className="font-semibold text-slate-900 inline-flex items-center gap-1">
                        {String(bien?.requiereCadenaFrio) === "Sí" ? <><Snowflake className="w-3.5 h-3.5 text-sky-700" /> Sí ({bien?.temperaturaExigida}°C)</> : "No"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-600">
                    Espacios SP: {selectedEspacios.length
                      ? <span className="font-semibold text-slate-900">{selectedEspacios.map((n) => `SP-${String(n).padStart(3, "0")}`).join(", ")}</span>
                      : <span className="text-slate-500">—</span>}
                  </p>
                </div>
              )}
            </div>

            {/* Validación */}
            <div className={`mt-4 rounded-xl border p-4 ${validacion.ok ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
              <div className="flex items-start gap-2">
                {validacion.ok
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5" />
                  : <CircleAlert className="w-4 h-4 text-rose-700 mt-0.5" />}
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold ${validacion.ok ? "text-emerald-800" : "text-rose-800"}`}>{validacion.title}</p>
                  <p className={`text-xs mt-0.5 ${validacion.ok ? "text-emerald-800/80" : "text-rose-800/80"}`}>{validacion.detail}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-[11px] text-slate-700/80">
                  Al confirmar: se crea la reserva, el detalle de tickets pasa de <span className="font-semibold">DI a RE</span> y se habilita la orden de pago.
                </p>
                {confirmada ? (
                  <button
                    onClick={continuarAOrdenPago}
                    className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-slate-700 hover:bg-slate-800 transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    Continuar a orden de pago
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleReservar}
                    disabled={!validacion.ok}
                    className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      validacion.ok ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-200 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <Ticket className="w-4 h-4" />
                    Confirmar reserva
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Mapa de asientos / bodega ───────────────────────── */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              {isPasajeros ? "Mapa de asientos" : "Espacios de bodega (SP)"}
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              {isPasajeros ? "Selecciona los asientos según los cupos cotizados." : "Selecciona el/los espacios compatibles con la carga."}
            </p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-4 text-xs text-slate-700 flex-wrap">
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded border border-emerald-200 bg-emerald-50" /> Disponible</span>
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded border border-amber-200 bg-amber-100" /> Ocupado</span>
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded border border-sky-200 bg-sky-50" /> Seleccionado</span>
              </div>
            </div>
            <div className="mt-4 max-h-[420px] overflow-auto pr-2 scrollbar-modern">
              {isPasajeros ? (
                <div className="grid grid-cols-6 gap-2">
                  {seats.map((n) => {
                    const isOcc = occupiedAsientos.has(n);
                    const isSel = selectedAsientos.includes(n);
                    return (
                      <button key={n} onClick={() => toggleAsiento(n)} disabled={isOcc}
                        className={`rounded-lg border px-2 py-2 text-xs font-semibold text-center transition-colors ${
                          isOcc ? "bg-amber-50 border-amber-200 text-amber-800 cursor-not-allowed"
                                : isSel ? "bg-sky-50 border-sky-200 text-sky-800 hover:bg-sky-100"
                                        : "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100"
                        }`}
                      >
                        <div>{`AS-${String(n).padStart(2, "0")}`}</div>
                        <div className="text-[10px] mt-0.5 font-medium">{isOcc ? "Reservado" : isSel ? "Elegido" : "Disponible"}</div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {espacios.map((n) => {
                    const isOcc = occupiedCarga.has(n);
                    const isSel = selectedEspacios.includes(n);
                    return (
                      <button key={n} onClick={() => toggleEspacio(n)} disabled={isOcc}
                        className={`rounded-lg border px-2 py-2 text-xs font-semibold text-center transition-colors ${
                          isOcc ? "bg-amber-50 border-amber-200 text-amber-800 cursor-not-allowed"
                                : isSel ? "bg-sky-50 border-sky-200 text-sky-800 hover:bg-sky-100"
                                        : "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100"
                        }`}
                      >
                        <div>{`SP-${String(n).padStart(3, "0")}`}</div>
                        <div className="text-[10px] mt-0.5 font-medium">{isOcc ? "Reservado" : isSel ? "Elegido" : "Disponible"}</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Reservas registradas ──────────────────────────────── */}
        <DataTable
          title="Reservas registradas"
          columns={[
            { key: "codigo", label: "Código", sortable: true },
            {
              key: "viajeId", label: "Viaje",
              render: (i: any) => {
                const v = viajes.find((x) => x.id === i.viajeId);
                return v ? `${v.codigo} — ${v.ruta} — ${fmtFecha(v.fechaISO)} ${v.horaSalida}` : i.viajeId;
              },
            },
            { key: "pasajeroNombre", label: "Cliente / Pasajero", sortable: true },
            { key: "tipoReserva", label: "Tipo", render: (i: any) => i.tipoReserva || (i.asientos?.length ? "Pasajeros" : "Carga") },
            {
              key: "detalle", label: "Detalle",
              render: (i: any) => {
                const tipo = i.tipoReserva || (i.asientos?.length ? "Pasajeros" : "Carga");
                if (tipo === "Pasajeros") return (i.asientos || []).map((n: number) => `AS-${String(n).padStart(2, "0")}`).join(", ");
                const sp = (i.espaciosCarga || []).map((n: number) => `SP-${String(n).padStart(3, "0")}`).join(", ");
                const cant = i.cantidad ? `${i.cantidad} ${i.unidad || "KG"}` : "-";
                return `${cant} | ${sp || "-"}`;
              },
            },
            { key: "total", label: "Total", sortable: true, render: (i: any) => `S/ ${Number(i.total || 0).toFixed(2)}` },
            {
              key: "estado", label: "Estado",
              render: (i: any) => (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-50 border border-slate-200 text-slate-700">{i.estado}</span>
              ),
            },
          ]}
          data={reservas}
          searchPlaceholder="Buscar reserva..."
          onExport={() => {}}
        />
      </div>
    </div>
  );
}

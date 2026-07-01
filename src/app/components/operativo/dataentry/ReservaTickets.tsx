import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { CheckCircle2, CircleAlert, CreditCard, PencilLine, Snowflake, Ticket } from "lucide-react";

import { PageHeader } from "../../shared/PageHeader";
import { DataTable } from "../../shared/DataTable";
import {
  getCatalog,
  getCotizaciones,
  getReservas,
  getViajes,
  newId,
  setViajes,
  upsertReserva,
  type Cotizacion as CotizacionTx,
  type Reserva,
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

export function ReservaTickets() {
  const navigate = useNavigate();
  const location = useLocation();

  const viajes      = useMemo(() => getViajes(), []);
  const clientes    = useMemo(() => getCatalog<any>("clientes", []), []);
  const bienes      = useMemo(() => getCatalog<any>("bienes", []), []);
  const contenedores = useMemo(() => getCatalog<any>("contenedores", []), []);
  const tarifarios  = useMemo(() => getCatalog<any>("tarifarios", []), []);
  const allCotizaciones = useMemo(() => getCotizaciones(), []);

  // Cotización proveniente de la URL
  const cotizacionId = new URLSearchParams(location.search).get("cotizacionId") || "";
  const cotFromUrl = useMemo(
    () => allCotizaciones.find((c) => c.id === cotizacionId) || null,
    [allCotizaciones, cotizacionId],
  );

  const [reservas, setReservasState] = useState<Reserva[]>(() => getReservas());

  const [form, setForm] = useState(() => {
    const tipoReserva: "Pasajeros" | "Carga" =
      cotFromUrl?.servicioCodigo === SRV_PASAJEROS ? "Pasajeros" : cotFromUrl ? "Carga" : "Pasajeros";
    return {
      viajeId:     cotFromUrl?.viajeId     || viajes[0]?.id || "",
      clienteId:   cotFromUrl?.clienteId   || clientes[2]?.idTipoCliente || clientes[0]?.idTipoCliente || "",
      tipoReserva,
      bienId:      cotFromUrl?.bienId      || bienes.find((b: any) => b.idTipoBien === "T-BI-004")?.idTipoBien || bienes[0]?.idTipoBien || "",
      cantidad:    cotFromUrl?.cantidad    || 120,
      temperaturaObjetivoC: null as number | null,
      contenedorId: cotFromUrl?.contenedorId || "",
    };
  });

  // Autocorrección cuando los catálogos restablecen seeds — solo cuando no hay cotización bloqueada
  useEffect(() => {
    if (cotFromUrl) return; // cotización bloqueada: no reemplazar los ids
    if (!viajes.length || !clientes.length) return;
    setForm((p) => {
      const viajeOk   = viajes.some((v) => v.id === p.viajeId);
      const clienteOk = clientes.some((c: any) => c.idTipoCliente === p.clienteId);
      const bienOk    = bienes.length ? bienes.some((b: any) => b.idTipoBien === p.bienId) : true;
      const contOk    = !p.contenedorId || contenedores.some((c: any) => c.idTipoContenedor === p.contenedorId);
      return {
        ...p,
        viajeId:     viajeOk   ? p.viajeId   : viajes[0].id,
        clienteId:   clienteOk ? p.clienteId : clientes[0].idTipoCliente,
        bienId:      bienOk    ? p.bienId    : (bienes[0]?.idTipoBien || ""),
        contenedorId: contOk   ? p.contenedorId : "",
      };
    });
  }, [viajes, clientes, bienes, contenedores, cotFromUrl]);

  const selectedViaje: Viaje | undefined   = viajes.find((v) => v.id === form.viajeId);
  const selectedCliente = clientes.find((c: any) => c.idTipoCliente === form.clienteId);
  const selectedBien    = bienes.find((b: any) => b.idTipoBien === form.bienId);
  const effectiveContenedorId = form.contenedorId || selectedViaje?.contenedorId || "";
  const selectedContenedor    = contenedores.find((c: any) => c.idTipoContenedor === effectiveContenedorId);

  const [selectedAsientos, setSelectedAsientos] = useState<number[]>([]);
  const [selectedEspacios, setSelectedEspacios] = useState<number[]>([]);

  const rutaLabel       = selectedViaje?.ruta || "Lima - Arequipa";
  const tarifaPasajero  = (() => {
    const t = tarifarios.find((x: any) => x.servicio === SRV_PASAJEROS && x.ruta === rutaLabel && x.unidadCobro === "Pasajero");
    return t?.precioBase ?? 85;
  })();

  const occupiedAsientos    = useMemo(() => new Set<number>(selectedViaje?.asientosOcupados || []), [selectedViaje?.asientosOcupados]);
  const capacidadAsientos   = selectedViaje?.capacidad || 0;
  const disponiblesAsientos = Math.max(0, capacidadAsientos - (selectedViaje?.asientosOcupados?.length || 0));

  const capacidadCarga    = selectedViaje?.capacidadCargaEspacios ?? 40;
  const occupiedCarga     = useMemo(() => new Set<number>(selectedViaje?.espaciosCargaOcupados || []), [selectedViaje?.espaciosCargaOcupados]);
  const disponiblesCarga  = Math.max(0, capacidadCarga - (selectedViaje?.espaciosCargaOcupados?.length || 0));

  const servicioCargaCodigo = selectedBien?.requiereCadenaFrio === "Sí" ? "SRV-003" : "SRV-002";
  const tarifaCargaKg = (() => {
    const t = tarifarios.find((x: any) => x.servicio === servicioCargaCodigo && x.ruta === rutaLabel && x.unidadCobro === "Kg");
    return t?.precioBase ?? 0.1;
  })();

  const unidadCarga    = selectedBien?.unidadMedidaBase || "KG";
  const tempObjetivo   = (() => {
    if (form.temperaturaObjetivoC !== null && form.temperaturaObjetivoC !== undefined) return Number(form.temperaturaObjetivoC);
    const req = selectedBien?.temperaturaExigida;
    const n   = Number(req);
    return Number.isFinite(n) ? n : NaN;
  })();

  const totalPasajeros = selectedAsientos.length * tarifaPasajero;
  const totalCarga     = Number(form.cantidad || 0) * tarifaCargaKg;
  const total          = form.tipoReserva === "Pasajeros" ? totalPasajeros : totalCarga;

  // Siempre avanza a Orden de pago
  const siguientePaso  = "Orden de pago";
  const continuarLabel = "Confirmar reserva";

  const firstDisponible = (cap: number, occ: Set<number>) => {
    for (let n = 1; n <= cap; n++) if (!occ.has(n)) return n;
    return undefined;
  };

  const validacion = (() => {
    if (!selectedViaje)   return { ok: false, title: "Selecciona un viaje",   detail: "Necesitas un viaje programado para reservar." };
    if (!selectedCliente) return { ok: false, title: "Selecciona un cliente", detail: "La reserva debe estar asociada a un cliente del catálogo." };
    if (form.tipoReserva === "Pasajeros") {
      if (selectedAsientos.length === 0) {
        const auto = firstDisponible(capacidadAsientos, occupiedAsientos);
        if (!auto) return { ok: false, title: "Sin asientos disponibles", detail: "No quedan asientos disponibles para este viaje." };
        return { ok: true, title: "Listo para reservar", detail: `Sin selección manual: se asignará automáticamente AS-${String(auto).padStart(2, "0")}.` };
      }
      const anyInvalid = selectedAsientos.some((n) => occupiedAsientos.has(n) || n < 1 || n > capacidadAsientos);
      if (anyInvalid) return { ok: false, title: "Asientos inválidos", detail: "Hay asientos que ya no están disponibles. Vuelve a seleccionar." };
      return { ok: true, title: "Reserva lista", detail: `Se reservarán ${selectedAsientos.length} asiento(s) por S/ ${tarifaPasajero.toFixed(2)} c/u.` };
    }
    // Carga
    if (!selectedBien)       return { ok: false, title: "Selecciona un bien", detail: "La carga debe invocar un tipo de bien del catálogo." };
    if (!selectedContenedor) return { ok: false, title: "Viaje sin contenedor", detail: "Este viaje no tiene contenedor asignado. Regularícelo en Ajuste operativo de viaje." };
    const cantidad = Number(form.cantidad || 0);
    if (!Number.isFinite(cantidad) || cantidad <= 0) return { ok: false, title: "Cantidad inválida", detail: "La cantidad debe ser mayor a 0." };
    if (selectedEspacios.length === 0) {
      const auto = firstDisponible(capacidadCarga, occupiedCarga);
      if (!auto) return { ok: false, title: "Sin espacios SP disponibles", detail: "No quedan espacios disponibles de bodega para este viaje." };
    }
    const anyInvalid = selectedEspacios.some((n) => occupiedCarga.has(n) || n < 1 || n > capacidadCarga);
    if (anyInvalid) return { ok: false, title: "Espacios inválidos", detail: "Hay espacios que ya no están disponibles. Vuelve a seleccionar." };
    if (selectedBien.requiereCadenaFrio === "Sí") {
      if (selectedContenedor.nivelRefrigeracion !== "Sí")
        return { ok: false, title: "Bloqueo: contenedor no refrigerado", detail: `El bien requiere cadena de frío (${selectedBien.temperaturaExigida}°C) pero el contenedor es "${selectedContenedor.claseContenedor}".` };
      const tMin = Number(selectedContenedor.temperaturaMinima);
      const req  = Number.isFinite(tempObjetivo) ? tempObjetivo : Number(selectedBien.temperaturaExigida);
      if (Number.isFinite(tMin) && Number.isFinite(req) && tMin > req)
        return { ok: false, title: "Bloqueo: temperatura mínima insuficiente", detail: `Contenedor soporta hasta ${tMin}°C, pero la temperatura objetivo es ${req}°C.` };
    }
    if (selectedEspacios.length === 0) {
      const auto = firstDisponible(capacidadCarga, occupiedCarga);
      return { ok: true, title: "Listo para reservar (Carga)", detail: `Sin selección manual: se asignará ${auto ? `SP-${String(auto).padStart(3, "0")}` : "un SP disponible"}.` };
    }
    return { ok: true, title: "Reserva lista (Carga)", detail: `Se reservarán ${selectedEspacios.length} espacio(s) SP para ${cantidad} ${unidadCarga} a S/ ${tarifaCargaKg.toFixed(2)}/KG.` };
  })();

  const toggleAsiento = (n: number) => {
    if (!selectedViaje || occupiedAsientos.has(n)) return;
    setSelectedAsientos((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n].sort((a, b) => a - b)));
  };
  const toggleEspacio = (n: number) => {
    if (!selectedViaje || occupiedCarga.has(n)) return;
    setSelectedEspacios((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n].sort((a, b) => a - b)));
  };

  const handleReservar = () => {
    const viaje   = selectedViaje || viajes[0];
    const cliente = selectedCliente || clientes[0];
    if (!viaje || !cliente) return;

    const asientosToReserve =
      form.tipoReserva === "Pasajeros"
        ? (selectedAsientos.length ? [...selectedAsientos] : (() => {
            for (let n = 1; n <= (viaje.capacidad || 0); n++) {
              if (!occupiedAsientos.has(n)) return [n];
            }
            return [];
          })())
        : [];

    const espaciosToReserve =
      form.tipoReserva === "Carga"
        ? (selectedEspacios.length ? [...selectedEspacios] : (() => {
            const cap = viaje.capacidadCargaEspacios ?? 40;
            for (let n = 1; n <= cap; n++) {
              if (!occupiedCarga.has(n)) return [n];
            }
            return [];
          })())
        : [];

    if (form.tipoReserva === "Pasajeros" && asientosToReserve.length === 0) return;
    if (form.tipoReserva === "Carga"     && espaciosToReserve.length === 0) return;
    if (!validacion.ok) return;

    const nextCodigo = buildCodigo("RSV", reservas.length + 1);
    const reserva: Reserva = {
      id:                newId("reserva"),
      codigo:            nextCodigo,
      viajeId:           viaje.id,
      cotizacionId:      cotizacionId || undefined,
      clienteId:         cliente.idTipoCliente,
      pasajeroNombre:    cliente.razonSocial || "Cliente",
      pasajeroDocumento: cliente.doc || "DNI/RUC",
      telefono:          "-",
      email:             "-",
      asientos:          form.tipoReserva === "Pasajeros" ? asientosToReserve : [],
      tipoReserva:       form.tipoReserva,
      espaciosCarga:     form.tipoReserva === "Carga" ? espaciosToReserve : undefined,
      bienId:            form.tipoReserva === "Carga" ? form.bienId : undefined,
      contenedorId:      form.tipoReserva === "Carga" ? effectiveContenedorId : undefined,
      cantidad:          form.tipoReserva === "Carga" ? Number(form.cantidad || 0) : undefined,
      unidad:            form.tipoReserva === "Carga" ? unidadCarga : undefined,
      temperaturaObjetivoC: form.tipoReserva === "Carga" && Number.isFinite(tempObjetivo) ? tempObjetivo : null,
      total,
      estado:            "Reservada",
      createdAt:         new Date().toISOString(),
    };

    const reservasNext = upsertReserva(reserva);
    setReservasState(reservasNext);

    const viajesCurrent = getViajes();
    const viajesNext    = viajesCurrent.map((v) => {
      if (v.id !== viaje.id) return v;
      if (form.tipoReserva === "Pasajeros") {
        const merged = Array.from(new Set([...(v.asientosOcupados || []), ...asientosToReserve])).sort((a, b) => a - b);
        return { ...v, asientosOcupados: merged };
      }
      const mergedCarga = Array.from(new Set([...(v.espaciosCargaOcupados || []), ...espaciosToReserve])).sort((a, b) => a - b);
      return { ...v, espaciosCargaOcupados: mergedCarga, capacidadCargaEspacios: v.capacidadCargaEspacios ?? capacidadCarga };
    });
    setViajes(viajesNext);

    setSelectedAsientos([]);
    setSelectedEspacios([]);

    // Siempre avanza a Orden de pago (flujo correcto: COTIZACIÓN → RESERVA → ORDEN DE PAGO)
    const cotParam = cotizacionId ? `&cotizacionId=${encodeURIComponent(cotizacionId)}` : "";
    navigate(`/operativo/orden-pago?reservaId=${encodeURIComponent(reserva.id)}${cotParam}`);
  };

  const seats    = useMemo(() => Array.from({ length: selectedViaje?.capacidad ?? 0 }, (_, i) => i + 1), [selectedViaje?.id, selectedViaje?.capacidad]);
  const espacios = useMemo(() => Array.from({ length: selectedViaje?.capacidadCargaEspacios ?? 40 }, (_, i) => i + 1), [selectedViaje?.id, selectedViaje?.capacidadCargaEspacios]);

  // Campos bloqueados cuando la cotizacion fue pasada por URL
  const bloqueado = Boolean(cotFromUrl);

  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Reserva de tickets / disponibilidad"
        subtitle="Selecciona y bloquea cupos para la cotización confirmada."
        actions={
          <button
            onClick={handleReservar}
            disabled={!validacion.ok}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              validacion.ok ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            <Ticket className="w-4 h-4" />
            {continuarLabel}
          </button>
        }
      />

      <div className="p-8 space-y-6">

        {/* ── Bloque de cotización seleccionada (readonly) ────── */}
        {cotFromUrl && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900">Cotización seleccionada</h3>
              <button
                onClick={() => navigate("/operativo/cotizacion")}
                className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 underline underline-offset-2"
              >
                <PencilLine className="w-3 h-3" />
                Editar cotización
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Código</p>
                <p className="text-sm font-semibold text-slate-900">{cotFromUrl.codigo}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Tipo</p>
                <p className="text-sm font-semibold text-slate-900">
                  {cotFromUrl.servicioCodigo === SRV_PASAJEROS ? "Pasajeros" : "Carga"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Cliente</p>
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {clientes.find((c: any) => c.idTipoCliente === cotFromUrl.clienteId)?.razonSocial || cotFromUrl.clienteId}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Viaje</p>
                <p className="text-sm font-semibold text-slate-900">
                  {viajes.find((v) => v.id === cotFromUrl.viajeId)?.codigo || cotFromUrl.viajeId}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Total cotizado</p>
                <p className="text-sm font-semibold text-slate-900">S/ {Number(cotFromUrl.total).toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
              {bloqueado ? "Viaje y disponibilidad (desde cotización)" : "Paso 1 — Selección de viaje y cliente"}
            </h3>

            <div className="grid grid-cols-3 gap-4">
              {/* Viaje */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Viaje</label>
                {bloqueado ? (
                  <div className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-700">
                    {viajes.find((v) => v.id === form.viajeId)?.codigo || form.viajeId} — {viajes.find((v) => v.id === form.viajeId)?.ruta}
                  </div>
                ) : (
                  <select
                    value={form.viajeId}
                    onChange={(e) => { setForm((p) => ({ ...p, viajeId: e.target.value })); setSelectedAsientos([]); setSelectedEspacios([]); }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
                  >
                    {viajes.map((v) => (
                      <option key={v.id} value={v.id}>{v.codigo} — {v.ruta} — {fmtFecha(v.fechaISO)} {v.horaSalida}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Tipo de reserva */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Tipo de reserva</label>
                {bloqueado ? (
                  <div className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-700">
                    {form.tipoReserva === "Pasajeros" ? "Pasajeros (Asientos)" : "Carga (Espacios SP)"}
                  </div>
                ) : (
                  <select
                    value={form.tipoReserva}
                    onChange={(e) => { setForm((p) => ({ ...p, tipoReserva: e.target.value as any })); setSelectedAsientos([]); setSelectedEspacios([]); }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
                  >
                    <option value="Pasajeros">Pasajeros (Asientos)</option>
                    <option value="Carga">Carga (Espacios SP)</option>
                  </select>
                )}
              </div>

              {/* Cliente */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Cliente</label>
                {bloqueado ? (
                  <div className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-700 truncate">
                    {clientes.find((c: any) => c.idTipoCliente === form.clienteId)?.razonSocial || form.clienteId}
                  </div>
                ) : (
                  <select
                    value={form.clienteId}
                    onChange={(e) => setForm((p) => ({ ...p, clienteId: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
                  >
                    {clientes.map((c: any) => (
                      <option key={c.idTipoCliente} value={c.idTipoCliente}>{c.razonSocial} — {c.doc}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Info del viaje + selección */}
            <div className="mt-5 grid grid-cols-3 gap-4">
              {/* Resumen del viaje */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Resumen del viaje</p>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Ruta</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedViaje?.ruta || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Salida</p>
                    <p className="text-sm font-semibold text-slate-900">{(selectedViaje?.fechaISO ? fmtFecha(selectedViaje.fechaISO) : "—") + " " + (selectedViaje?.horaSalida || "")}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Capacidad</p>
                    <p className="text-sm font-semibold text-slate-900">{form.tipoReserva === "Pasajeros" ? `${capacidadAsientos} asientos` : `${capacidadCarga} espacios SP`}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Disponibles</p>
                    <p className="text-sm font-semibold text-emerald-700">{form.tipoReserva === "Pasajeros" ? disponiblesAsientos : disponiblesCarga}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Siguiente paso</p>
                    <p className="text-sm font-semibold text-slate-900">{siguientePaso}</p>
                  </div>
                </div>
              </div>

              {/* Selección de cupos */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-900">
                  {form.tipoReserva === "Pasajeros" ? "Selección de asientos" : "Selección de carga"}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  {form.tipoReserva === "Pasajeros"
                    ? "Clic en verde para seleccionar. Ámbar = ocupado. Azul = seleccionado."
                    : "Elige bien y espacios SP disponibles."}
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Tarifa</p>
                    <p className="text-sm font-bold text-slate-900">
                      {form.tipoReserva === "Pasajeros"
                        ? `S/ ${Number(tarifaPasajero).toFixed(2)} / pasajero`
                        : `S/ ${tarifaCargaKg.toFixed(2)} / Kg (${servicioCargaCodigo})`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Total</p>
                    <p className="text-sm font-bold text-slate-900">S/ {total.toFixed(2)}</p>
                  </div>
                </div>

                {form.tipoReserva === "Pasajeros" ? (
                  <div className="mt-3 text-xs text-slate-700">
                    Seleccionados:{" "}
                    {selectedAsientos.length
                      ? <span className="font-semibold">{selectedAsientos.map((n) => `AS-${String(n).padStart(2, "0")}`).join(", ")}</span>
                      : <span className="text-slate-500">—</span>}
                  </div>
                ) : (
                  <div className="mt-3 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-semibold uppercase mb-1">Bien (catálogo)</label>
                        <select
                          value={form.bienId}
                          onChange={(e) => setForm((p) => ({ ...p, bienId: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
                        >
                          {bienes.map((b: any) => (
                            <option key={b.idTipoBien} value={b.idTipoBien}>{b.idTipoBien} — {b.nombreComercial}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-semibold uppercase mb-1">Cantidad</label>
                        <div className="flex gap-2">
                          <input
                            type="number" min={1} value={form.cantidad}
                            onChange={(e) => setForm((p) => ({ ...p, cantidad: Number(e.target.value || 0) }))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
                          />
                          <input readOnly value={unidadCarga} className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-semibold uppercase mb-1">Temperatura objetivo</label>
                        <select
                          value={form.temperaturaObjetivoC === null ? "" : String(form.temperaturaObjetivoC)}
                          onChange={(e) => setForm((p) => ({ ...p, temperaturaObjetivoC: e.target.value === "" ? null : Number(e.target.value) }))}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
                        >
                          <option value="">Heredar del Bien ({selectedBien?.temperaturaExigida !== "" ? `${selectedBien?.temperaturaExigida}°C` : "Ambiente"})</option>
                          {[-20, -18, -10, -5, 2, 8].map((t) => <option key={t} value={t}>{t}°C</option>)}
                        </select>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-3">
                        <p className="text-[10px] text-slate-500 font-semibold uppercase">Temp. usada</p>
                        <p className="text-sm font-semibold text-slate-900 mt-1">{Number.isFinite(tempObjetivo) ? `${tempObjetivo}°C` : "Ambiente"}</p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Contenedor mín.: {selectedContenedor?.temperaturaMinima !== "" && selectedContenedor?.temperaturaMinima !== undefined ? `${selectedContenedor.temperaturaMinima}°C` : "—"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 font-semibold uppercase mb-1">Contenedor</label>
                      <select
                        value={effectiveContenedorId}
                        onChange={(e) => setForm((p) => ({ ...p, contenedorId: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
                      >
                        {(selectedViaje?.contenedorId ? [selectedViaje.contenedorId] : [])
                          .concat(contenedores.map((c: any) => c.idTipoContenedor))
                          .filter((v, i, arr) => Boolean(v) && arr.indexOf(v) === i)
                          .map((id) => {
                            const c = contenedores.find((x: any) => x.idTipoContenedor === id);
                            return (
                              <option key={id} value={id}>
                                {id} — {c?.claseContenedor || "Contenedor"} — Ref: {c?.nivelRefrigeracion === "Sí" ? `Sí (${c?.temperaturaMinima}°C)` : "No"}
                              </option>
                            );
                          })}
                      </select>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-[10px] text-slate-500 font-semibold uppercase">Características de la carga (solo lectura)</p>
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[10px] text-slate-500 font-semibold uppercase">Cadena de frío</p>
                          <p className="text-sm font-semibold text-slate-900 inline-flex items-center gap-2">
                            {selectedBien?.requiereCadenaFrio === "Sí" ? <><Snowflake className="w-4 h-4 text-sky-700" /> Sí</> : "No"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-semibold uppercase">Temp. exigida</p>
                          <p className="text-sm font-semibold text-slate-900">{selectedBien?.temperaturaExigida !== "" && selectedBien?.temperaturaExigida !== undefined ? `${selectedBien.temperaturaExigida}°C` : "Ambiente"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-semibold uppercase">Peligrosidad</p>
                          <p className="text-sm font-semibold text-slate-900">{selectedBien?.nivelPeligrosidad || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-semibold uppercase">Contenedor del viaje</p>
                          <p className="text-sm font-semibold text-slate-900">{selectedContenedor ? `${selectedContenedor.idTipoContenedor} — ${selectedContenedor.claseContenedor}` : "—"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700">
                      Espacios SP seleccionados:{" "}
                      {selectedEspacios.length
                        ? <span className="font-semibold">{selectedEspacios.map((n) => `SP-${String(n).padStart(3, "0")}`).join(", ")}</span>
                        : <span className="text-slate-500">—</span>}
                    </div>
                  </div>
                )}
              </div>

              {/* Validación */}
              <div className={`rounded-xl border p-4 ${validacion.ok ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
                <p className="text-xs font-semibold text-slate-900">Validación de disponibilidad</p>
                <div className="mt-2 flex items-start gap-2">
                  {validacion.ok
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5" />
                    : <CircleAlert className="w-4 h-4 text-rose-700 mt-0.5" />}
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold ${validacion.ok ? "text-emerald-800" : "text-rose-800"}`}>{validacion.title}</p>
                    <p className={`text-xs mt-0.5 ${validacion.ok ? "text-emerald-800/80" : "text-rose-800/80"}`}>{validacion.detail}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-[11px] text-slate-700/80">
                    Siguiente: <span className="font-semibold">{siguientePaso}</span> (se genera al confirmar).
                  </p>
                  <button
                    onClick={handleReservar}
                    disabled={!validacion.ok}
                    className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      validacion.ok ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-200 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    {continuarLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mapa de asientos / espacios */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              {form.tipoReserva === "Pasajeros" ? "Mapa de asientos" : "Mapa de espacios de bodega (SP)"}
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              {form.tipoReserva === "Pasajeros" ? "Muestra cupos disponibles, reservados y seleccionados." : "Muestra espacios disponibles, reservados y seleccionados."}
            </p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-4 text-xs text-slate-700 flex-wrap">
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded border border-emerald-200 bg-emerald-50" /> Disponible</span>
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded border border-amber-200 bg-amber-100" /> Ocupado</span>
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded border border-sky-200 bg-sky-50" /> Seleccionado</span>
              </div>
            </div>
            <div className="mt-4 max-h-[420px] overflow-auto pr-2 scrollbar-modern">
              {form.tipoReserva === "Pasajeros" ? (
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

        {/* Tabla de reservas */}
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
            { key: "pasajeroDocumento", label: "Documento" },
            { key: "tipoReserva", label: "Tipo", render: (i: any) => i.tipoReserva || (i.asientos?.length ? "Pasajeros" : "Carga") },
            {
              key: "detalle", label: "Detalle",
              render: (i: any) => {
                const tipo = i.tipoReserva || (i.asientos?.length ? "Pasajeros" : "Carga");
                if (tipo === "Pasajeros") return (i.asientos || []).map((n: number) => `AS-${String(n).padStart(2, "0")}`).join(", ");
                const sp   = (i.espaciosCarga || []).map((n: number) => `SP-${String(n).padStart(3, "0")}`).join(", ");
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

import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, BadgeCheck, Calculator, CheckCircle2, FileText, Snowflake, Truck, Users } from "lucide-react";

import { PageHeader } from "../../shared/PageHeader";
import { DataTable } from "../../shared/DataTable";
import {
  getCatalog,
  getCotizaciones,
  getViajes,
  newId,
  upsertCotizacion,
  type Cotizacion as CotizacionTx,
} from "../../../store/localDb";

const SRV_PASAJEROS = "SRV-001";
const SELECT_CLS = "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600";
const LABEL_CLS = "block text-xs font-semibold text-slate-600 uppercase mb-2";

export function Cotizacion() {
  const navigate = useNavigate();
  const viajes     = useMemo(() => getViajes(), []);
  const clientes   = useMemo(() => getCatalog<any>("clientes", []), []);
  const bienes     = useMemo(() => getCatalog<any>("bienes", []), []);
  const contenedores = useMemo(() => getCatalog<any>("contenedores", []), []);
  const servicios  = useMemo(() => getCatalog<any>("servicios", []), []);
  const tarifarios = useMemo(() => getCatalog<any>("tarifarios", []), []);
  const vehiculos  = useMemo(() => getCatalog<any>("vehiculos", []), []);

  const [cotizaciones, setCotizacionesState] = useState<CotizacionTx[]>(() => getCotizaciones());

  const [form, setForm] = useState({
    tipoServicio: "Pasajeros" as "Pasajeros" | "Carga",
    viajeId:      viajes[0]?.id || "",
    clienteId:    clientes[0]?.idTipoCliente || "",
    // Pasajeros
    cantidadPasajeros: 2,
    // Carga
    servicioCodigo: servicios.find((s: any) => s.codigo !== SRV_PASAJEROS)?.codigo || servicios[0]?.codigo || "",
    bienId:       bienes.find((b: any) => b.idTipoBien === "T-BI-004")?.idTipoBien || bienes[0]?.idTipoBien || "",
    contenedorId: contenedores.find((c: any) => c.idTipoContenedor === "T-CO-002")?.idTipoContenedor || contenedores[0]?.idTipoContenedor || "",
    cantidad:     120,
    unidad:       "KG",
  });

  const isPasajeros = form.tipoServicio === "Pasajeros";

  const selectedViaje     = viajes.find((v) => v.id === form.viajeId);
  const selectedCliente   = clientes.find((c: any) => c.idTipoCliente === form.clienteId);
  const rutaLabel         = selectedViaje?.ruta || "Lima - Arequipa";

  // ── Pasajeros ──────────────────────────────────────────────────
  const tarifaPaxEntry = tarifarios.find(
    (x: any) => x.servicio === SRV_PASAJEROS && x.ruta === rutaLabel && x.unidadCobro === "Pasajero",
  ) || tarifarios.find((x: any) => x.servicio === SRV_PASAJEROS);
  const precioUnitPax  = Number(tarifaPaxEntry?.precioBase ?? 85);
  const subtotalPax    = Number((form.cantidadPasajeros * precioUnitPax).toFixed(2));
  const igvPax         = Number((subtotalPax * 0.18).toFixed(2));
  const totalPax       = Number((subtotalPax + igvPax).toFixed(2));

  // ── Carga ───────────────────────────────────────────────────────
  const selectedServicio  = servicios.find((s: any) => s.codigo === form.servicioCodigo);
  const selectedBien      = bienes.find((b: any) => b.idTipoBien === form.bienId);
  const selectedContenedor = contenedores.find((c: any) => c.idTipoContenedor === form.contenedorId);
  const selectedVehiculo  = vehiculos.find((v: any) => v.idTipoVehiculo === selectedViaje?.vehiculoId);
  const unidad            = selectedBien?.unidadMedidaBase || form.unidad;

  const tarifaCargaEntry = (() => {
    const t = tarifarios.find((x: any) => x.servicio === form.servicioCodigo && x.ruta === rutaLabel);
    return t || tarifarios.find((x: any) => x.servicio === form.servicioCodigo) || tarifarios[0];
  })();
  const precioUnitCarga = Number(tarifaCargaEntry?.precioBase ?? 0);
  const subtotalCarga   = Number((form.cantidad * precioUnitCarga).toFixed(2));
  const igvCarga        = Number((subtotalCarga * 0.18).toFixed(2));
  const totalCarga      = Number((subtotalCarga + igvCarga).toFixed(2));

  // automata cadena de frío
  const coldRequired = String(selectedBien?.requiereCadenaFrio || "No") === "Sí";
  const cargaTemp    = Number(selectedBien?.temperaturaExigida ?? NaN);
  const contRefrig   = String(selectedContenedor?.nivelRefrigeracion || "No") === "Sí";
  const contTempMin  = Number(selectedContenedor?.temperaturaMinima ?? NaN);
  const vehRefrig    = String(selectedVehiculo?.tieneRefrigeracion || "No") === "Sí";

  const automata = (() => {
    if (isPasajeros) return { ok: true, type: "ok" as const, title: "", detail: "" };
    if (!selectedBien || !selectedContenedor || !selectedVehiculo)
      return { ok: false, type: "warn" as const, title: "Pendiente", detail: "Selecciona bien, contenedor y viaje para validar." };
    if (coldRequired && (!contRefrig || !vehRefrig))
      return { ok: false, type: "error" as const, title: "Bloqueo de asignación", detail: "La carga exige cadena de frío y la asignación no garantiza refrigeración." };
    if (coldRequired && Number.isFinite(cargaTemp) && Number.isFinite(contTempMin) && contTempMin > cargaTemp)
      return { ok: false, type: "error" as const, title: "Bloqueo de asignación", detail: `Contenedor no cubre la temperatura exigida (${cargaTemp}°C). Mínimo: ${contTempMin}°C.` };
    return {
      ok: true, type: "ok" as const, title: "Asignación válida",
      detail: coldRequired
        ? `Combinación válida: Carga ${cargaTemp}°C / Contenedor ${contTempMin}°C. Refrigeración aprobada.`
        : "Combinación válida: Carga sin cadena de frío. Protocolo aprobado.",
    };
  })();

  // valores del lado activo
  const precioUnit = isPasajeros ? precioUnitPax : precioUnitCarga;
  const subtotal   = isPasajeros ? subtotalPax   : subtotalCarga;
  const igv        = isPasajeros ? igvPax        : igvCarga;
  const total      = isPasajeros ? totalPax      : totalCarga;
  const cantidad   = isPasajeros ? form.cantidadPasajeros : form.cantidad;

  const canCotizar = isPasajeros
    ? Boolean(selectedViaje && selectedCliente && form.cantidadPasajeros > 0)
    : Boolean(selectedViaje && selectedCliente && selectedServicio && selectedBien && selectedContenedor && automata.type !== "error");

  const handleCotizar = () => {
    if (!selectedViaje || !selectedCliente) return;
    if (!isPasajeros && (!selectedBien || !selectedContenedor || automata.type === "error")) return;

    const codigo = `COT-2026-${String(cotizaciones.length + 142).padStart(4, "0")}`;
    const c: CotizacionTx = {
      id:              newId("cot"),
      codigo,
      viajeId:         selectedViaje.id,
      clienteId:       selectedCliente.idTipoCliente,
      servicioCodigo:  isPasajeros ? SRV_PASAJEROS : (selectedServicio?.codigo || ""),
      bienId:          isPasajeros ? "" : (selectedBien?.idTipoBien || ""),
      contenedorId:    isPasajeros ? "" : (selectedContenedor?.idTipoContenedor || ""),
      cantidad,
      unidad:          isPasajeros ? "Pasajero" : unidad,
      subtotal,
      igv,
      total,
      estado:          "Cotizado",
      createdAt:       new Date().toISOString(),
    };
    upsertCotizacion(c);
    setCotizacionesState(getCotizaciones());
    navigate(`/operativo/reserva-tickets?cotizacionId=${encodeURIComponent(c.id)}`);
  };

  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Cotización"
        subtitle="Calcula el precio del servicio según viaje, cliente, tipo de servicio y tarifa aplicable."
      />

      <div className="p-8 w-full max-w-[1480px] mx-auto space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

          {/* ── Formulario principal ─────────────────────────── */}
          <div className="xl:col-span-9 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-5">Datos de la cotización</h3>

            {/* Selector de tipo de servicio */}
            <div className="mb-5">
              <label className={LABEL_CLS}>Tipo de servicio</label>
              <div className="flex gap-3">
                {(["Pasajeros", "Carga"] as const).map((tipo) => (
                  <button
                    key={tipo}
                    onClick={() => setForm((p) => ({ ...p, tipoServicio: tipo }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                      form.tipoServicio === tipo
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {tipo === "Pasajeros" ? <Users className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                    {tipo}
                  </button>
                ))}
              </div>
            </div>

            {/* Campos comunes: Viaje + Cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <div>
                <label className={LABEL_CLS}>Viaje</label>
                <select
                  value={form.viajeId}
                  onChange={(e) => setForm((p) => ({ ...p, viajeId: e.target.value }))}
                  className={SELECT_CLS}
                >
                  {viajes.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.codigo} — {v.ruta} — {v.fechaISO} {v.horaSalida}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL_CLS}>Cliente</label>
                <select
                  value={form.clienteId}
                  onChange={(e) => setForm((p) => ({ ...p, clienteId: e.target.value }))}
                  className={SELECT_CLS}
                >
                  {clientes.map((c: any) => (
                    <option key={c.idTipoCliente} value={c.idTipoCliente}>
                      {c.idTipoCliente} — {c.razonSocial || c.doc} ({c.categoriaPerfil})
                    </option>
                  ))}
                </select>
              </div>

              {/* Pasajeros */}
              {isPasajeros ? (
                <div>
                  <label className={LABEL_CLS}>Cantidad de pasajeros</label>
                  <select
                    value={String(form.cantidadPasajeros)}
                    onChange={(e) => setForm((p) => ({ ...p, cantidadPasajeros: Number(e.target.value) }))}
                    className={SELECT_CLS}
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((q) => (
                      <option key={q} value={q}>{q} {q === 1 ? "pasajero" : "pasajeros"}</option>
                    ))}
                  </select>
                </div>
              ) : (
                /* Carga */
                <>
                  <div>
                    <label className={LABEL_CLS}>Servicio de carga</label>
                    <select
                      value={form.servicioCodigo}
                      onChange={(e) => setForm((p) => ({ ...p, servicioCodigo: e.target.value }))}
                      className={SELECT_CLS}
                    >
                      {servicios
                        .filter((s: any) => s.codigo !== SRV_PASAJEROS)
                        .map((s: any) => (
                          <option key={s.codigo} value={s.codigo}>
                            {s.codigo} — {s.descripcion}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Tipo de bien / carga</label>
                    <select
                      value={form.bienId}
                      onChange={(e) => setForm((p) => ({ ...p, bienId: e.target.value }))}
                      className={SELECT_CLS}
                    >
                      {bienes.map((b: any) => (
                        <option key={b.idTipoBien} value={b.idTipoBien}>
                          {b.idTipoBien} — {b.nombreComercial || b.claseBienNaturaleza}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Contenedor</label>
                    <select
                      value={form.contenedorId}
                      onChange={(e) => setForm((p) => ({ ...p, contenedorId: e.target.value }))}
                      className={SELECT_CLS}
                    >
                      {contenedores.map((c: any) => (
                        <option key={c.idTipoContenedor} value={c.idTipoContenedor}>
                          {c.idTipoContenedor} — {c.claseContenedor}{String(c.nivelRefrigeracion) === "Sí" ? " (Frío)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Cantidad</label>
                    <select
                      value={String(form.cantidad)}
                      onChange={(e) => setForm((p) => ({ ...p, cantidad: Number(e.target.value) }))}
                      className={SELECT_CLS}
                    >
                      {[20, 50, 120, 200, 500].map((q) => (
                        <option key={q} value={q}>{q} {unidad}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Tarifa + botón */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
              <div className="text-sm text-slate-600 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Tarifa aplicada:{" "}
                <span className="font-semibold text-slate-900">
                  {isPasajeros
                    ? (tarifaPaxEntry?.codigoTarifa || `S/ ${precioUnitPax.toFixed(2)} / Pasajero`)
                    : (tarifaCargaEntry?.codigoTarifa || "-")}
                </span>
              </div>
              <button
                onClick={handleCotizar}
                disabled={!canCotizar}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                  canCotizar ? "bg-slate-700 hover:bg-slate-800" : "bg-slate-400 cursor-not-allowed"
                }`}
              >
                <Calculator className="w-4 h-4" />
                Continuar a reserva de tickets
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Panel lateral ────────────────────────────────── */}
          <div className="xl:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            {isPasajeros ? (
              <>
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Resumen del pasajero</h3>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm space-y-2">
                  <p><span className="text-slate-500">Viaje:</span> <span className="font-semibold">{selectedViaje?.codigo || "—"}</span></p>
                  <p><span className="text-slate-500">Ruta:</span> <span className="font-semibold">{rutaLabel}</span></p>
                  <p><span className="text-slate-500">Cliente:</span> <span className="font-semibold">{selectedCliente?.razonSocial || selectedCliente?.doc || "—"}</span></p>
                  <p><span className="text-slate-500">Pasajeros:</span> <span className="font-semibold">{form.cantidadPasajeros}</span></p>
                  <p><span className="text-slate-500">Tarifa / pasajero:</span> <span className="font-semibold">S/ {precioUnitPax.toFixed(2)}</span></p>
                </div>
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-900">Listo para continuar</p>
                      <p className="text-sm mt-1 text-emerald-800">Se creará la cotización y pasará a seleccionar asientos.</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Datos de la carga</h3>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm space-y-2">
                  <p className="font-semibold text-slate-900">
                    {selectedBien ? `${selectedBien.idTipoBien} — ${selectedBien.nombreComercial || selectedBien.claseBienNaturaleza}` : "-"}
                  </p>
                  <p><span className="text-slate-500">Peligrosidad:</span> <span className="font-semibold">{selectedBien?.nivelPeligrosidad ?? "-"}</span></p>
                  <p className="flex items-center gap-2">
                    <span className="text-slate-500">Cadena de frío:</span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 border text-[11px] font-semibold ${coldRequired ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                      <Snowflake className="w-3 h-3" />
                      {coldRequired ? "Sí" : "No"}
                    </span>
                  </p>
                  <p><span className="text-slate-500">Temperatura exigida:</span> <span className="font-semibold">{Number.isFinite(cargaTemp) ? `${cargaTemp}°C` : "-"}</span></p>
                  <p><span className="text-slate-500">Unidad base:</span> <span className="font-semibold">{unidad}</span></p>
                </div>
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm space-y-2">
                  <p className="font-semibold text-slate-900">Asignación evaluada</p>
                  <p><span className="text-slate-500">Vehículo:</span> {selectedVehiculo ? `${selectedVehiculo.idTipoVehiculo} — ${selectedVehiculo.marca} ${selectedVehiculo.modelo}` : "-"}</p>
                  <p><span className="text-slate-500">Contenedor:</span> {selectedContenedor ? `${selectedContenedor.idTipoContenedor} — ${selectedContenedor.claseContenedor}` : "-"}</p>
                  <p><span className="text-slate-500">Temp. contenedor:</span> <span className="font-semibold">{Number.isFinite(contTempMin) ? `${contTempMin}°C` : "-"}</span></p>
                </div>
                <div className={`mt-4 rounded-xl border p-4 ${automata.type === "ok" ? "bg-emerald-50 border-emerald-200" : automata.type === "error" ? "bg-rose-50 border-rose-200" : "bg-amber-50 border-amber-200"}`}>
                  <div className="flex items-start gap-3">
                    {automata.type === "ok"
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-700 mt-0.5" />
                      : automata.type === "error"
                        ? <BadgeCheck className="w-5 h-5 text-rose-700 mt-0.5" />
                        : <Truck className="w-5 h-5 text-amber-700 mt-0.5" />}
                    <div>
                      <p className={`font-semibold ${automata.type === "ok" ? "text-emerald-900" : automata.type === "error" ? "text-rose-900" : "text-amber-900"}`}>{automata.title}</p>
                      <p className={`text-sm mt-1 ${automata.type === "ok" ? "text-emerald-800" : automata.type === "error" ? "text-rose-800" : "text-amber-800"}`}>{automata.detail}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Cálculo ──────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Cálculo del servicio</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">Precio unit.</p>
              <p className="mt-1 text-xl font-bold text-slate-900">S/ {precioUnit.toFixed(2)}</p>
              <p className="text-xs text-slate-600 mt-1">{isPasajeros ? "por pasajero" : unidad === "KG" ? "por Kg" : "por unidad"}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">Subtotal</p>
              <p className="mt-1 text-xl font-bold text-slate-900">S/ {subtotal.toFixed(2)}</p>
              <p className="text-xs text-slate-600 mt-1">{cantidad} {isPasajeros ? "pasajero(s)" : unidad}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">IGV (18%)</p>
              <p className="mt-1 text-xl font-bold text-slate-900">S/ {igv.toFixed(2)}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-white">
              <p className="text-xs font-semibold uppercase text-white/70">Total</p>
              <p className="mt-1 text-2xl font-bold">S/ {total.toFixed(2)}</p>
              <p className="text-xs text-white/70 mt-1">{isPasajeros ? "Transporte de pasajeros" : selectedServicio?.codigo}</p>
            </div>
          </div>
        </div>

        {/* ── Tabla de cotizaciones ────────────────────────────── */}
        <DataTable
          title="Cotizaciones registradas"
          columns={[
            { key: "codigo", label: "Código", sortable: true },
            {
              key: "tipo",
              label: "Tipo",
              render: (i: any) => (
                <span className={`px-2 py-1 text-xs rounded-full border font-medium ${i.servicioCodigo === SRV_PASAJEROS ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                  {i.servicioCodigo === SRV_PASAJEROS ? "Pasajeros" : "Carga"}
                </span>
              ),
            },
            {
              key: "clienteId",
              label: "Cliente",
              render: (i: any) => {
                const c = clientes.find((x: any) => x.idTipoCliente === i.clienteId);
                return c ? `${c.idTipoCliente} — ${c.razonSocial || c.doc}` : i.clienteId;
              },
            },
            {
              key: "viajeId",
              label: "Viaje",
              render: (i: any) => {
                const v = viajes.find((x) => x.id === i.viajeId);
                return v ? `${v.codigo} — ${v.ruta}` : i.viajeId;
              },
            },
            { key: "total", label: "Total", sortable: true, render: (i: any) => `S/ ${Number(i.total).toFixed(2)}` },
            { key: "estado", label: "Estado", render: (i: any) => <span className="px-2 py-1 text-xs rounded-full bg-slate-100 border border-slate-200">{i.estado}</span> },
            {
              key: "accion",
              label: "Continuar",
              render: (i: any) => (
                <button
                  onClick={() => navigate(`/operativo/reserva-tickets?cotizacionId=${encodeURIComponent(i.id)}`)}
                  className="flex items-center gap-1 px-3 py-1 text-xs rounded-lg bg-slate-900 text-white hover:bg-slate-700 transition-colors"
                >
                  <ArrowRight className="w-3 h-3" />
                  Reserva
                </button>
              ),
            },
          ]}
          data={cotizaciones}
          searchPlaceholder="Buscar cotización..."
          onExport={() => {}}
        />
      </div>
    </div>
  );
}

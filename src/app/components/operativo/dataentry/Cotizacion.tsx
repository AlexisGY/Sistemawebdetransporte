import { useMemo, useState } from "react";
import { PageHeader } from "../../shared/PageHeader";
import { DataTable } from "../../shared/DataTable";
import { BadgeCheck, Calculator, CheckCircle2, FileText, Snowflake, Truck } from "lucide-react";
import { getCatalog, getCotizaciones, getViajes, newId, upsertCotizacion, type Cotizacion as CotizacionTx } from "../../../store/localDb";

export function Cotizacion() {
  const viajes = useMemo(() => getViajes(), []);
  const clientes = useMemo(() => getCatalog<any>("clientes", []), []);
  const bienes = useMemo(() => getCatalog<any>("bienes", []), []);
  const contenedores = useMemo(() => getCatalog<any>("contenedores", []), []);
  const servicios = useMemo(() => getCatalog<any>("servicios", []), []);
  const tarifarios = useMemo(() => getCatalog<any>("tarifarios", []), []);
  const vehiculos = useMemo(() => getCatalog<any>("vehiculos", []), []);

  const [cotizaciones, setCotizacionesState] = useState<CotizacionTx[]>(() => getCotizaciones());
  const defaultViajeId = viajes[0]?.id || "";

  const [form, setForm] = useState({
    viajeId: defaultViajeId,
    clienteId: clientes[0]?.idTipoCliente || "",
    servicioCodigo: servicios[2]?.codigo || servicios[0]?.codigo || "SRV-003",
    bienId: bienes.find((b) => b.idTipoBien === "T-BI-004")?.idTipoBien || bienes[0]?.idTipoBien || "",
    contenedorId: contenedores.find((c) => c.idTipoContenedor === "T-CO-002")?.idTipoContenedor || contenedores[0]?.idTipoContenedor || "",
    cantidad: 120,
    unidad: "KG",
  });

  const selectedViaje = viajes.find((v) => v.id === form.viajeId);
  const selectedCliente = clientes.find((c) => c.idTipoCliente === form.clienteId);
  const selectedServicio = servicios.find((s) => s.codigo === form.servicioCodigo);
  const selectedBien = bienes.find((b) => b.idTipoBien === form.bienId);
  const selectedContenedor = contenedores.find((c) => c.idTipoContenedor === form.contenedorId);
  const selectedVehiculo = vehiculos.find((v) => v.idTipoVehiculo === selectedViaje?.vehiculoId);

  const unidad = selectedBien?.unidadMedidaBase || form.unidad;
  const rutaLabel = selectedViaje?.ruta || "Lima - Arequipa";

  const tarifa = (() => {
    const t = tarifarios.find((x) => x.servicio === form.servicioCodigo && x.ruta === rutaLabel);
    if (t) return t;
    return tarifarios.find((x) => x.servicio === form.servicioCodigo) || tarifarios[0];
  })();

  const precioUnit = Number(tarifa?.precioBase ?? 0);
  const subtotal = Number((form.cantidad * precioUnit).toFixed(2));
  const igv = Number((subtotal * 0.18).toFixed(2));
  const total = Number((subtotal + igv).toFixed(2));

  const coldRequired = String(selectedBien?.requiereCadenaFrio || "No") === "Sí";
  const cargaTemp = Number(selectedBien?.temperaturaExigida ?? NaN);
  const contRefrig = String(selectedContenedor?.nivelRefrigeracion || "No") === "Sí";
  const contTempMin = Number(selectedContenedor?.temperaturaMinima ?? NaN);
  const vehRefrig = String(selectedVehiculo?.tieneRefrigeracion || "No") === "Sí";

  const automata = (() => {
    if (!selectedBien || !selectedContenedor || !selectedVehiculo) {
      return { ok: false, type: "warn" as const, title: "Pendiente", detail: "Selecciona bien, contenedor y viaje para validar." };
    }
    if (coldRequired && (!contRefrig || !vehRefrig)) {
      return {
        ok: false,
        type: "error" as const,
        title: "Bloqueo de asignación",
        detail: "La carga exige cadena de frío y la asignación no garantiza refrigeración (contenedor/vehículo).",
      };
    }
    if (coldRequired && Number.isFinite(cargaTemp) && Number.isFinite(contTempMin) && contTempMin > cargaTemp) {
      return {
        ok: false,
        type: "error" as const,
        title: "Bloqueo de asignación",
        detail: `El contenedor no cubre la temperatura exigida (${cargaTemp}°C). Mínimo del contenedor: ${contTempMin}°C.`,
      };
    }
    return {
      ok: true,
      type: "ok" as const,
      title: "Asignación válida",
      detail: coldRequired
        ? `Combinación válida: Carga ${cargaTemp}°C y contenedor ${contTempMin}°C. Refrigeración aprobada.`
        : "Combinación válida: Carga sin cadena de frío. Protocolo aprobado.",
    };
  })();

  const handleCotizar = () => {
    if (!selectedViaje || !selectedCliente || !selectedServicio || !selectedBien || !selectedContenedor) return;
    if (!automata.ok && automata.type === "error") return;
    const codigo = `COT-2026-${String(cotizaciones.length + 142).padStart(4, "0")}`;
    const c: CotizacionTx = {
      id: newId("cot"),
      codigo,
      viajeId: selectedViaje.id,
      clienteId: selectedCliente.idTipoCliente,
      servicioCodigo: selectedServicio.codigo,
      bienId: selectedBien.idTipoBien,
      contenedorId: selectedContenedor.idTipoContenedor,
      cantidad: form.cantidad,
      unidad,
      subtotal,
      igv,
      total,
      estado: "Cotizado",
      createdAt: new Date().toISOString(),
    };
    upsertCotizacion(c);
    setCotizacionesState(getCotizaciones());
  };

  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Cotización"
        subtitle="Registra la cotización con datos del viaje y la carga"
      />

      <div className="p-8 w-full max-w-[1480px] mx-auto space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-9 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Formulario de cotización</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Viaje</label>
                <select
                  value={form.viajeId}
                  onChange={(e) => setForm((p) => ({ ...p, viajeId: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
                >
                  {viajes.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.codigo} — {v.ruta} — {v.fechaISO} {v.horaSalida}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Cliente</label>
                <select
                  value={form.clienteId}
                  onChange={(e) => setForm((p) => ({ ...p, clienteId: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
                >
                  {clientes.map((c) => (
                    <option key={c.idTipoCliente} value={c.idTipoCliente}>
                      {c.idTipoCliente} — {c.razonSocial || c.doc} ({c.categoriaPerfil})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Servicio</label>
                <select
                  value={form.servicioCodigo}
                  onChange={(e) => setForm((p) => ({ ...p, servicioCodigo: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
                >
                  {servicios.map((s) => (
                    <option key={s.codigo} value={s.codigo}>
                      {s.codigo} — {s.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Tipo de Bien / Carga</label>
                <select
                  value={form.bienId}
                  onChange={(e) => setForm((p) => ({ ...p, bienId: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
                >
                  {bienes.map((b) => (
                    <option key={b.idTipoBien} value={b.idTipoBien}>
                      {b.idTipoBien} — {b.nombreComercial || b.claseBienNaturaleza}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Contenedor</label>
                <select
                  value={form.contenedorId}
                  onChange={(e) => setForm((p) => ({ ...p, contenedorId: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
                >
                  {contenedores.map((c) => (
                    <option key={c.idTipoContenedor} value={c.idTipoContenedor}>
                      {c.idTipoContenedor} — {c.claseContenedor} {String(c.nivelRefrigeracion) === "Sí" ? "(Frío)" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Cantidad</label>
                <select
                  value={String(form.cantidad)}
                  onChange={(e) => setForm((p) => ({ ...p, cantidad: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
                >
                  {[20, 50, 120, 200, 500].map((q) => (
                    <option key={q} value={q}>{q} {unidad}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
              <div className="text-sm text-slate-600 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Tarifa aplicada: <span className="font-semibold text-slate-900">{tarifa?.codigoTarifa || "-"}</span>
              </div>
              <button
                onClick={handleCotizar}
                disabled={!automata.ok && automata.type === "error"}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white ${
                  !automata.ok && automata.type === "error" ? "bg-slate-400 cursor-not-allowed" : "bg-slate-700 hover:bg-slate-800"
                }`}
              >
                <Calculator className="w-4 h-4" />
                Cotizar
              </button>
            </div>
          </div>

          <div className="xl:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Datos de la carga</h3>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm space-y-2">
              <p className="font-semibold text-slate-900">
                {selectedBien ? `${selectedBien.idTipoBien} — ${selectedBien.nombreComercial || selectedBien.claseBienNaturaleza}` : "-"}
              </p>
              <p><span className="text-slate-500">Peligrosidad:</span> <span className="font-semibold">{selectedBien?.nivelPeligrosidad ?? "-"}</span></p>
              <p className="flex items-center gap-2">
                <span className="text-slate-500">Cadena de Frío:</span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 border text-[11px] font-semibold ${
                  coldRequired ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"
                }`}>
                  <Snowflake className="w-3 h-3" />
                  {coldRequired ? "Sí" : "No"}
                </span>
              </p>
              <p><span className="text-slate-500">Temperatura exigida:</span> <span className="font-semibold">{Number.isFinite(cargaTemp) ? `${cargaTemp}°C` : "-"}</span></p>
              <p><span className="text-slate-500">Unidad base:</span> <span className="font-semibold">{unidad}</span></p>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm space-y-2">
              <p className="font-semibold text-slate-900">Asignación sugerida</p>
              <p><span className="text-slate-500">Vehículo:</span> {selectedVehiculo ? `${selectedVehiculo.idTipoVehiculo} — ${selectedVehiculo.marca} ${selectedVehiculo.modelo}` : "-"}</p>
              <p><span className="text-slate-500">Contenedor:</span> {selectedContenedor ? `${selectedContenedor.idTipoContenedor} — ${selectedContenedor.claseContenedor}` : "-"}</p>
              <p><span className="text-slate-500">Temp. contenedor:</span> <span className="font-semibold">{Number.isFinite(contTempMin) ? `${contTempMin}°C` : "-"}</span></p>
            </div>

            <div className={`mt-4 rounded-xl border p-4 ${
              automata.type === "ok" ? "bg-emerald-50 border-emerald-200" : automata.type === "error" ? "bg-rose-50 border-rose-200" : "bg-amber-50 border-amber-200"
            }`}>
              <div className="flex items-start gap-3">
                {automata.type === "ok" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 mt-0.5" />
                ) : automata.type === "error" ? (
                  <BadgeCheck className="w-5 h-5 text-rose-700 mt-0.5" />
                ) : (
                  <Truck className="w-5 h-5 text-amber-700 mt-0.5" />
                )}
                <div>
                  <p className={`font-semibold ${automata.type === "ok" ? "text-emerald-900" : automata.type === "error" ? "text-rose-900" : "text-amber-900"}`}>{automata.title}</p>
                  <p className={`text-sm mt-1 ${automata.type === "ok" ? "text-emerald-800" : automata.type === "error" ? "text-rose-800" : "text-amber-800"}`}>{automata.detail}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Cálculo del servicio</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">Precio Unit.</p>
              <p className="mt-1 text-xl font-bold text-slate-900">S/ {precioUnit.toFixed(2)}</p>
              <p className="text-xs text-slate-600 mt-1">{unidad === "KG" ? "por Kg" : "por unidad"}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">Subtotal</p>
              <p className="mt-1 text-xl font-bold text-slate-900">S/ {subtotal.toFixed(2)}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">IGV (18%)</p>
              <p className="mt-1 text-xl font-bold text-slate-900">S/ {igv.toFixed(2)}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-white">
              <p className="text-xs font-semibold uppercase text-white/70">Total</p>
              <p className="mt-1 text-2xl font-bold">S/ {total.toFixed(2)}</p>
              <p className="text-xs text-white/70 mt-1">{selectedServicio?.codigo}</p>
            </div>
          </div>
        </div>

        <DataTable
          title="Cotizaciones Registradas"
          columns={[
            { key: "codigo", label: "Código", sortable: true },
            {
              key: "clienteId",
              label: "Cliente",
              render: (i: any) => {
                const c = clientes.find((x) => x.idTipoCliente === i.clienteId);
                return c ? `${c.idTipoCliente} — ${c.razonSocial || c.doc}` : i.clienteId;
              },
            },
            {
              key: "viajeId",
              label: "Viaje",
              render: (i: any) => {
                const v = viajes.find((x) => x.id === i.viajeId);
                return v ? `${v.codigo} — ${v.ruta} — ${v.fechaISO} ${v.horaSalida}` : i.viajeId;
              },
            },
            { key: "servicioCodigo", label: "Servicio" },
            { key: "bienId", label: "Bien" },
            { key: "contenedorId", label: "Contenedor" },
            { key: "total", label: "Total", sortable: true, render: (i: any) => `S/ ${Number(i.total).toFixed(2)}` },
            { key: "estado", label: "Estado", render: (i: any) => <span className="px-2 py-1 text-xs rounded-full bg-slate-100 border border-slate-200">{i.estado}</span> },
          ]}
          data={cotizaciones}
          searchPlaceholder="Buscar cotización..."
          onExport={() => {}}
        />
      </div>
    </div>
  );
}

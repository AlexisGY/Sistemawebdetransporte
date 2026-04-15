import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../../shared/PageHeader";
import { DataTable } from "../../shared/DataTable";
import { AlertTriangle, CheckCircle2, MapPin, Plus, Snowflake, Truck, Users, X } from "lucide-react";
import { addViaje, getCatalog, getViajes, newId, type Viaje } from "../../../store/localDb";

export function RecursosViaje() {
  const [showModal, setShowModal] = useState(false);
  const [viajes, setViajesState] = useState<Viaje[]>([]);

  const vehiculos = useMemo(() => getCatalog<any>("vehiculos", []), []);
  const operarios = useMemo(() => getCatalog<any>("operarios", []), []);
  const rutas = useMemo(() => getCatalog<any>("rutas", []), []);
  const contenedores = useMemo(() => getCatalog<any>("contenedores", []), []);

  const conductores = operarios.filter((o) => String(o.rolFuncion || "").toLowerCase().includes("conductor"));
  const copilotos = operarios.filter((o) => String(o.rolFuncion || "").toLowerCase().includes("copiloto"));
  const observacionOptions = [
    "Salida programada desde Terminal Principal",
    "Salida con control aduanero",
    "Requiere verificación de cadena de frío",
    "Embarque prioritario",
  ];

  const [form, setForm] = useState({
    ruta: "",
    fechaISO: new Date().toISOString().slice(0, 10),
    horaSalida: "08:00",
    horaLlegadaEstimada: "16:00",
    vehiculoId: "",
    contenedorId: "",
    conductorOperarioId: "",
    copilotoOperarioId: "",
    observacion: observacionOptions[0],
  });

  useEffect(() => {
    setViajesState(getViajes());
  }, []);

  useEffect(() => {
    if (!form.ruta && rutas.length) setForm((p) => ({ ...p, ruta: rutas[0]?.origen && rutas[0]?.destino ? `${rutas[0].origen} - ${rutas[0].destino}` : "Ruta" }));
    if (!form.vehiculoId && vehiculos.length) setForm((p) => ({ ...p, vehiculoId: vehiculos[0]?.idTipoVehiculo || "" }));
    if (!form.contenedorId && contenedores.length) setForm((p) => ({ ...p, contenedorId: contenedores[0]?.idTipoContenedor || "" }));
    if (!form.conductorOperarioId && conductores.length) setForm((p) => ({ ...p, conductorOperarioId: conductores[0]?.idTipoOperario || "" }));
  }, [rutas.length, vehiculos.length, contenedores.length, conductores.length]);

  const vehiculoById = (id: string) => vehiculos.find((v) => v.idTipoVehiculo === id);
  const operarioById = (id: string) => operarios.find((o) => o.idTipoOperario === id);
  const contenedorById = (id: string) => contenedores.find((c) => c.idTipoContenedor === id);
  const rutaByLabel = (label: string) =>
    rutas.find((r) => (r.origen && r.destino ? `${r.origen} - ${r.destino}` : "") === label);

  const selectedVehiculo = vehiculoById(form.vehiculoId);
  const selectedContenedor = contenedorById(form.contenedorId);
  const selectedRuta = rutaByLabel(form.ruta);

  const vehiculoRefrig = String(selectedVehiculo?.tieneRefrigeracion || "No") === "Sí";
  const contenedorRefrig = String(selectedContenedor?.nivelRefrigeracion || "No") === "Sí";
  const vehiculoTempMin = Number(selectedVehiculo?.temperaturaMinima ?? NaN);
  const contenedorTempMin = Number(selectedContenedor?.temperaturaMinima ?? NaN);

  const automata = (() => {
    if (!selectedVehiculo || !selectedContenedor) {
      return { status: "warn" as const, title: "Pendiente de configuración", detail: "Selecciona vehículo y contenedor para validar la asignación." };
    }
    if (contenedorRefrig && !vehiculoRefrig) {
      return {
        status: "error" as const,
        title: "Bloqueo del Autómata",
        detail: "El contenedor requiere refrigeración, pero el vehículo seleccionado no la soporta.",
      };
    }
    if (contenedorRefrig && vehiculoRefrig && Number.isFinite(contenedorTempMin) && Number.isFinite(vehiculoTempMin) && vehiculoTempMin > contenedorTempMin) {
      return {
        status: "error" as const,
        title: "Bloqueo del Autómata",
        detail: `La temperatura mínima del vehículo (${vehiculoTempMin}°C) no cubre la del contenedor (${contenedorTempMin}°C).`,
      };
    }
    return {
      status: "ok" as const,
      title: "Asignación válida",
      detail: contenedorRefrig
        ? `Combinación válida: el vehículo soporta refrigeración y cubre la temperatura mínima del contenedor (${contenedorTempMin}°C).`
        : "La combinación de vehículo y contenedor es compatible.",
    };
  })();

  const handleCreate = () => {
    const vehiculo = vehiculoById(form.vehiculoId);
    const capacidad = Number(vehiculo?.capacidadPasajeros ?? 0) || 0;
    const codigo = `VJ-${String(viajes.length + 1).padStart(3, "0")}`;
    if (automata.status === "error") return;
    const v: Viaje = {
      id: newId("viaje"),
      codigo,
      ruta: form.ruta || "-",
      fechaISO: form.fechaISO,
      horaSalida: form.horaSalida,
      horaLlegadaEstimada: form.horaLlegadaEstimada,
      vehiculoId: form.vehiculoId,
      contenedorId: form.contenedorId || undefined,
      conductorOperarioId: form.conductorOperarioId,
      copilotoOperarioId: form.copilotoOperarioId || undefined,
      capacidad,
      asientosOcupados: [],
      estado: "Confirmado",
      observaciones: form.observacion || undefined,
      createdAt: new Date().toISOString(),
    };
    const next = addViaje(v);
    setViajesState(next);
    setShowModal(false);
  };

  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Recursos de Viaje"
        subtitle="Asigna vehículo, contenedor y personal por viaje"
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Programar nuevo viaje
          </button>
        }
      />

      <div className="p-8">
        {/* Panel institucional de herencia */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Datos de referencia del viaje</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Vehículo</p>
                <p className="mt-1 font-semibold text-slate-900">{selectedVehiculo ? `${selectedVehiculo.idTipoVehiculo} — ${selectedVehiculo.marca} ${selectedVehiculo.modelo}` : "-"}</p>
                <div className="mt-3 space-y-1 text-xs text-slate-700">
                  <p><span className="text-slate-500">Capacidad de pasajeros:</span> {selectedVehiculo?.capacidadPasajeros ?? "-"}</p>
                  <p><span className="text-slate-500">Peso máximo (kg):</span> {selectedVehiculo?.pesoMaxCargaKg ?? "-"}</p>
                  <p><span className="text-slate-500">Volumen máximo (m³):</span> {selectedVehiculo?.volumenMaxBodegaM3 ?? "-"}</p>
                  <p className="flex items-center gap-2">
                    <span className="text-slate-500">Refrigeración:</span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 border text-[11px] font-semibold ${vehiculoRefrig ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                      <Snowflake className="w-3 h-3" /> {vehiculoRefrig ? "Sí" : "No"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Contenedor</p>
                <p className="mt-1 font-semibold text-slate-900">{selectedContenedor ? `${selectedContenedor.idTipoContenedor} — ${selectedContenedor.claseContenedor}` : "-"}</p>
                <div className="mt-3 space-y-1 text-xs text-slate-700">
                  <p><span className="text-slate-500">Volumen Máx (m³):</span> {selectedContenedor?.capacidadVolumenMaxM3 ?? "-"}</p>
                  <p><span className="text-slate-500">Peso Máx (Ton):</span> {selectedContenedor?.capacidadPesoMaxTon ?? "-"}</p>
                  <p className="flex items-center gap-2">
                    <span className="text-slate-500">Refrigeración:</span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 border text-[11px] font-semibold ${contenedorRefrig ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                      <Snowflake className="w-3 h-3" /> {contenedorRefrig ? "Sí" : "No"}
                    </span>
                  </p>
                  <p><span className="text-slate-500">Temp. mínima:</span> {Number.isFinite(contenedorTempMin) ? `${contenedorTempMin}°C` : "-"}</p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ruta</p>
                <p className="mt-1 font-semibold text-slate-900">{selectedRuta ? `${selectedRuta.origen} → ${selectedRuta.destino}` : (form.ruta || "-")}</p>
                <div className="mt-3 space-y-1 text-xs text-slate-700">
                  <p><span className="text-slate-500">Distancia:</span> {selectedRuta?.distanciaKm ? `${selectedRuta.distanciaKm} km` : "-"}</p>
                  <p><span className="text-slate-500">Restricciones:</span> {selectedRuta?.restricciones ?? "-"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Validación de asignación</h3>
            <div className={`rounded-xl border p-4 ${automata.status === "ok" ? "bg-emerald-50 border-emerald-200" : automata.status === "error" ? "bg-rose-50 border-rose-200" : "bg-amber-50 border-amber-200"}`}>
              <div className="flex items-start gap-3">
                {automata.status === "ok" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 mt-0.5" />
                ) : automata.status === "error" ? (
                  <AlertTriangle className="w-5 h-5 text-rose-700 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-700 mt-0.5" />
                )}
                <div>
                  <p className={`font-semibold ${automata.status === "ok" ? "text-emerald-900" : automata.status === "error" ? "text-rose-900" : "text-amber-900"}`}>
                    {automata.title}
                  </p>
                  <p className={`text-sm mt-1 ${automata.status === "ok" ? "text-emerald-800" : automata.status === "error" ? "text-rose-800" : "text-amber-800"}`}>
                    {automata.detail}
                  </p>
                  {automata.status === "error" && (
                    <p className="text-xs text-rose-700 mt-2 font-medium">Acción bloqueada: no se puede confirmar la asignación con esta combinación.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DataTable
          columns={[
            { key: "codigo", label: "Código", sortable: true },
            {
              key: "ruta",
              label: "Ruta",
              sortable: true,
              render: (item: any) => (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{item.ruta}</span>
                </div>
              ),
            },
            {
              key: "fecha",
              label: "Fecha/Hora",
              render: (item: any) => (
                <div>
                  <p className="font-medium">{item.fecha}</p>
                  <p className="text-sm text-slate-600">{item.hora}</p>
                </div>
              ),
            },
            {
              key: "vehiculoId",
              label: "Vehículo",
              render: (item: any) => {
                const v = vehiculoById(item.vehiculoId);
                return v ? `${v.idTipoVehiculo} - ${v.marca} ${v.modelo}` : item.vehiculoId;
              },
            },
            {
              key: "contenedorId",
              label: "Contenedor",
              render: (item: any) => {
                if (!item.contenedorId) return "-";
                const c = contenedorById(item.contenedorId);
                return c ? `${c.idTipoContenedor} - ${c.claseContenedor}` : item.contenedorId;
              },
            },
            {
              key: "conductorOperarioId",
              label: "Conductor",
              render: (item: any) => {
                const o = operarioById(item.conductorOperarioId);
                return o ? `${o.idTipoOperario} - ${o.rolFuncion}` : item.conductorOperarioId;
              },
            },
            {
              key: "copilotoOperarioId",
              label: "Copiloto",
              render: (item: any) => {
                if (!item.copilotoOperarioId) return "-";
                const o = operarioById(item.copilotoOperarioId);
                return o ? `${o.idTipoOperario} - ${o.rolFuncion}` : item.copilotoOperarioId;
              },
            },
            {
              key: "estado",
              label: "Estado",
              render: (item: any) => (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.estado === "Confirmado"
                      ? "bg-slate-100 text-slate-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {item.estado}
                </span>
              ),
            },
          ]}
          data={viajes.map((v) => ({
            ...v,
            fecha: v.fechaISO,
            hora: v.horaSalida,
          }))}
          searchPlaceholder="Buscar viaje..."
          onExport={() => console.log("Export")}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl">
            <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Programar Nuevo Viaje</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ruta
                  </label>
                  <select
                    value={form.ruta}
                    onChange={(e) => setForm((p) => ({ ...p, ruta: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                  >
                    {rutas.length === 0 ? (
                      <option value="">(Sin rutas en catálogo)</option>
                    ) : (
                      rutas.map((r, idx) => {
                        const label = r.origen && r.destino ? `${r.origen} - ${r.destino}` : `Ruta ${idx + 1}`;
                        return (
                          <option key={`${label}-${idx}`} value={label}>
                            {label}
                          </option>
                        );
                      })
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                    value={form.fechaISO}
                    onChange={(e) => setForm((p) => ({ ...p, fechaISO: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hora de Salida
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                    value={form.horaSalida}
                    onChange={(e) => setForm((p) => ({ ...p, horaSalida: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hora de Llegada Estimada
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                    value={form.horaLlegadaEstimada}
                    onChange={(e) => setForm((p) => ({ ...p, horaLlegadaEstimada: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Vehículo Asignado
                </label>
                <select
                  value={form.vehiculoId}
                  onChange={(e) => setForm((p) => ({ ...p, vehiculoId: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                >
                  {vehiculos.length === 0 ? (
                    <option value="">(Sin vehículos en catálogo)</option>
                  ) : (
                    vehiculos.map((v) => (
                      <option key={v.idTipoVehiculo} value={v.idTipoVehiculo}>
                        {v.idTipoVehiculo} - {v.marca} {v.modelo} (Cap: {v.capacidadPasajeros})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contenedor Asignado
                </label>
                <select
                  value={form.contenedorId}
                  onChange={(e) => setForm((p) => ({ ...p, contenedorId: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                >
                  {contenedores.length === 0 ? (
                    <option value="">(Sin contenedores en catálogo)</option>
                  ) : (
                    contenedores.map((c) => (
                      <option key={c.idTipoContenedor} value={c.idTipoContenedor}>
                        {c.idTipoContenedor} - {c.claseContenedor} {String(c.nivelRefrigeracion) === "Sí" ? "(Frío)" : ""}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Conductor Principal
                  </label>
                  <select
                    value={form.conductorOperarioId}
                    onChange={(e) => setForm((p) => ({ ...p, conductorOperarioId: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                  >
                    {conductores.length === 0 ? (
                      <option value="">(Sin conductores en catálogo)</option>
                    ) : (
                      conductores.map((o) => (
                        <option key={o.idTipoOperario} value={o.idTipoOperario}>
                          {o.idTipoOperario} - {o.rolFuncion} ({o.licenciaRequerida})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Copiloto (Opcional)
                  </label>
                  <select
                    value={form.copilotoOperarioId}
                    onChange={(e) => setForm((p) => ({ ...p, copilotoOperarioId: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                  >
                    <option value="">Sin copiloto</option>
                    {copilotos.map((o) => (
                      <option key={o.idTipoOperario} value={o.idTipoOperario}>
                        {o.idTipoOperario} - {o.rolFuncion} ({o.licenciaRequerida})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Observación operativa
                </label>
                <select
                  value={form.observacion}
                  onChange={(e) => setForm((p) => ({ ...p, observacion: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                >
                  {observacionOptions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={automata.status === "error"}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                  automata.status === "error" ? "bg-slate-400 cursor-not-allowed" : "bg-slate-700 hover:bg-slate-800"
                }`}
              >
                <Truck className="w-4 h-4" />
                Confirmar Asignación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

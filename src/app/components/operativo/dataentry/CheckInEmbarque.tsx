import { useMemo, useState } from "react";
import { PageHeader } from "../../shared/PageHeader";
import { AlertTriangle, CheckCircle2, QrCode, ShieldCheck, User } from "lucide-react";
import { getCatalog, getCotizaciones, getTickets, getViajes } from "../../../store/localDb";

export function CheckInEmbarque() {
  const tickets = useMemo(() => getTickets(), []);
  const viajes = useMemo(() => getViajes(), []);
  const cotizaciones = useMemo(() => getCotizaciones(), []);
  const bienes = useMemo(() => getCatalog<any>("bienes", []), []);
  const contenedores = useMemo(() => getCatalog<any>("contenedores", []), []);
  const vehiculos = useMemo(() => getCatalog<any>("vehiculos", []), []);

  const [selectedTicketId, setSelectedTicketId] = useState(tickets[0]?.id || "");
  const [scenario, setScenario] = useState<"ok" | "error">("ok");

  const t = tickets.find((x) => x.id === selectedTicketId) || tickets[0];
  const v = viajes.find((x) => x.id === t?.viajeId) || viajes[0];
  const veh = vehiculos.find((x) => x.idTipoVehiculo === v?.vehiculoId);

  // Para la validación de protocolo usamos la cotización de vacunas como "guía/carga"
  const cot = cotizaciones.find((c) => c.bienId === "T-BI-004") || cotizaciones[0];
  const bien = bienes.find((b) => b.idTipoBien === cot?.bienId);
  const cont = contenedores.find((c) => c.idTipoContenedor === cot?.contenedorId);

  const cargaTemp = Number(bien?.temperaturaExigida ?? NaN);
  const contTemp = Number(cont?.temperaturaMinima ?? NaN);
  const contRefrig = String(cont?.nivelRefrigeracion || "No") === "Sí";
  const vehRefrig = scenario === "error" ? false : String(veh?.tieneRefrigeracion || "No") === "Sí";

  const validation = (() => {
    if (scenario === "error") {
      return {
        type: "error" as const,
        title: "Error de Regla de Negocio",
        detail:
          "Vehículo no soporta refrigeración requerida por el bien. Protocolo bloquea embarque (autómata).",
      };
    }
    return {
      type: "ok" as const,
      title: "Match Exitoso",
      detail: `Temperatura de carga (${Number.isFinite(cargaTemp) ? `${cargaTemp}°C` : "-"}) coincide con contenedor (${Number.isFinite(contTemp) ? `${contTemp}°C` : "-"}) — Abordaje Autorizado.`,
    };
  })();

  const pasajeros = tickets
    .filter((x) => x.viajeId === v?.id)
    .map((x, idx) => ({
      id: x.id,
      nombre: x.pasajeroNombre,
      dni: x.pasajeroDocumento,
      asiento: x.asiento,
      ticket: x.codigo,
      estado: idx === 0 ? "Pendiente" : idx === 1 ? "Check-in" : "Embarcado",
    }));

  const stats = {
    total: pasajeros.length,
    checkIn: pasajeros.filter((p) => p.estado === "Check-in").length,
    embarcados: pasajeros.filter((p) => p.estado === "Embarcado").length,
    pendientes: pasajeros.filter((p) => p.estado === "Pendiente").length,
  };

  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Check-in y Embarque"
        subtitle="Match del autómata y control operativo (simulación en vivo)"
      />

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <User className="w-8 h-8 text-slate-600" />
              <span className="text-2xl font-bold text-slate-700">{stats.total}</span>
            </div>
            <p className="text-sm font-medium text-slate-600">Total Pasajeros</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-8 h-8 text-slate-600" />
              <span className="text-2xl font-bold text-slate-700">{stats.checkIn}</span>
            </div>
            <p className="text-sm font-medium text-slate-600">Check-in Realizado</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-8 h-8 text-slate-600" />
              <span className="text-2xl font-bold text-slate-700">{stats.embarcados}</span>
            </div>
            <p className="text-sm font-medium text-slate-600">Embarcados</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-slate-600" />
              <span className="text-2xl font-bold text-slate-700">{stats.pendientes}</span>
            </div>
            <p className="text-sm font-medium text-slate-600">Pendientes</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Scanner */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Terminal de Escaneo (Catálogo)</h3>
            <div className="mb-4">
              <div className="w-full aspect-square bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-24 h-24 text-slate-400" />
              </div>
              <p className="text-sm text-slate-600 text-center mb-4">
                Seleccione un ticket emitido para simular el escaneo
              </p>
              <select
                value={selectedTicketId}
                onChange={(e) => setSelectedTicketId(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
              >
                {tickets.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.codigo} — {x.pasajeroDocumento} — Asiento {String(x.asiento).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setScenario("ok")}
                className={`px-4 py-3 rounded-lg font-medium transition-colors border ${
                  scenario === "ok" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Caso Verde
              </button>
              <button
                onClick={() => setScenario("error")}
                className={`px-4 py-3 rounded-lg font-medium transition-colors border ${
                  scenario === "error" ? "bg-rose-50 border-rose-200 text-rose-800" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Caso Rojo
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <p className="font-semibold text-slate-900 mb-2">Contexto (Readonly)</p>
              <p><span className="text-slate-500">Viaje:</span> {v ? `${v.codigo} — ${v.ruta} — ${v.fechaISO} ${v.horaSalida}` : "-"}</p>
              <p><span className="text-slate-500">Vehículo:</span> {veh ? `${veh.idTipoVehiculo} — ${veh.marca} ${veh.modelo}` : "-"}</p>
              <p><span className="text-slate-500">Carga (Guía):</span> {bien ? `${bien.idTipoBien} — ${bien.nombreComercial || bien.claseBienNaturaleza}` : "-"}</p>
              <p><span className="text-slate-500">Contenedor:</span> {cont ? `${cont.idTipoContenedor} — ${cont.claseContenedor}` : "-"}</p>
            </div>
          </div>

          {/* Passenger List */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Lista de Pasajeros</h3>
              <p className="text-sm text-slate-600">{v ? `Viaje ${v.codigo}: ${v.ruta} | ${v.fechaISO} ${v.horaSalida}` : "-"}</p>
            </div>

            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Validación de Protocolo (Autómata)</h3>
              <div
                className={`mt-3 rounded-xl border p-4 ${
                  validation.type === "ok" ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {validation.type === "ok" ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-700 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-rose-700 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-semibold ${validation.type === "ok" ? "text-emerald-900" : "text-rose-900"}`}>{validation.title}</p>
                    <p className={`text-sm mt-1 ${validation.type === "ok" ? "text-emerald-800" : "text-rose-800"}`}>{validation.detail}</p>
                    {validation.type === "ok" ? (
                      <p className="text-xs text-emerald-700 mt-2 font-medium">Abordaje Autorizado.</p>
                    ) : (
                      <p className="text-xs text-rose-700 mt-2 font-medium">Proceso Bloqueado. Reasigne recursos en “Recursos de Viaje”.</p>
                    )}
                    <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                      <div className="rounded-lg border border-slate-200 bg-white/60 p-3">
                        <p className="text-slate-500">Temp. carga</p>
                        <p className="font-semibold">{Number.isFinite(cargaTemp) ? `${cargaTemp}°C` : "-"}</p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-white/60 p-3">
                        <p className="text-slate-500">Temp. contenedor</p>
                        <p className="font-semibold">{Number.isFinite(contTemp) ? `${contTemp}°C` : "-"}</p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-white/60 p-3">
                        <p className="text-slate-500">Refrigeración veh.</p>
                        <p className="font-semibold">{vehRefrig ? "Sí" : "No"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {pasajeros.map((pasajero) => (
                <div key={pasajero.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold text-slate-700">{pasajero.asiento}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{pasajero.nombre}</p>
                        <p className="text-sm text-slate-600">DNI: {pasajero.dni} • {pasajero.ticket}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          pasajero.estado === "Embarcado"
                            ? "bg-slate-100 text-slate-700"
                            : pasajero.estado === "Check-in"
                            ? "bg-slate-100 text-slate-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {pasajero.estado}
                      </span>

                      <button
                        disabled={validation.type === "error"}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          validation.type === "error"
                            ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                            : "bg-slate-700 text-white hover:bg-slate-800"
                        }`}
                      >
                        {pasajero.estado === "Pendiente" ? "Check-in" : pasajero.estado === "Check-in" ? "Embarcar" : "OK"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

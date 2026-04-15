import { useMemo, useState } from "react";
import { PageHeader } from "../../shared/PageHeader";
import { MapPin, Clock, CheckCircle2, FileText, Flag, PackageCheck } from "lucide-react";
import { Link } from "react-router";
import { getIncidencias, getTickets, getViajes, newId, setIncidencias, setViajes } from "../../../store/localDb";

export function LlegadaCierre() {
  const viajes = useMemo(() => getViajes(), []);
  const tickets = useMemo(() => getTickets(), []);
  const [horaLlegada, setHoraLlegada] = useState("16:05");
  const [viajeId, setViajeId] = useState(viajes[0]?.id || "");
  const [incTipo, setIncTipo] = useState("Retraso");
  const [incGravedad, setIncGravedad] = useState("Media");

  const v = viajes.find((x) => x.id === viajeId) || viajes[0];
  const ticketsViaje = tickets.filter((t) => t.viajeId === v?.id);

  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Llegada y Cierre de Viaje"
        subtitle="Finalización y cierre operativo"
      />

      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Selección de Viaje (Solo catálogo)</h3>
          <select
            value={viajeId}
            onChange={(e) => setViajeId(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
          >
            {viajes.map((x) => (
              <option key={x.id} value={x.id}>
                {x.codigo} — {x.ruta} — {x.fechaISO} {x.horaSalida} (Estado: {x.estado})
              </option>
            ))}
          </select>
        </div>

        {/* Trip Info */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Viaje {v?.codigo}</h3>
              <p className="text-slate-600">{v?.ruta}</p>
            </div>
            <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold">
              {v?.estado || "En Ruta"}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-slate-600 mb-1">Fecha</p>
              <p className="font-semibold">{v?.fechaISO}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Hora Salida</p>
              <p className="font-semibold">{v?.horaSalida}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Llegada Estimada</p>
              <p className="font-semibold">{v?.horaLlegadaEstimada || "16:00"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Vehículo</p>
              <p className="font-semibold">{v?.vehiculoId}</p>
            </div>
          </div>
        </div>

        {/* Arrival */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Registro de Llegada</h3>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Hora Real de Llegada
              </label>
              <input
                type="time"
                value={horaLlegada}
                onChange={(e) => setHoraLlegada(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Diferencia
              </label>
              <div className="px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg">
                <p className="text-slate-700 font-semibold">+5 minutos (retraso)</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Observación (Solo catálogo)
            </label>
            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600">
              <option>Arribo sin novedades</option>
              <option>Arribo con retraso por congestión</option>
              <option>Arribo con inspección aduanera</option>
              <option>Arribo con control de temperatura</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <PackageCheck className="w-6 h-6 text-slate-600" />
              </div>
              <h4 className="font-semibold text-slate-900">Tickets</h4>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{ticketsViaje.length}</p>
            <p className="text-sm text-slate-600">Asignados a este viaje</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-slate-600" />
              </div>
              <h4 className="font-semibold text-slate-900">Distancia</h4>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">1,030</p>
            <p className="text-sm text-slate-600">Kilómetros recorridos</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-slate-600" />
              </div>
              <h4 className="font-semibold text-slate-900">Duración</h4>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">8h 05m</p>
            <p className="text-sm text-slate-600">Tiempo total</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Entregas del Viaje</h3>
              <p className="text-sm text-slate-600">Acciones rápidas: Entregado / Incidencia</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={incTipo}
                onChange={(e) => setIncTipo(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
              >
                <option>Retraso</option>
                <option>Falla Mecánica</option>
                <option>Daño de Carga</option>
                <option>Queja Cliente</option>
                <option>Otros</option>
              </select>
              <select
                value={incGravedad}
                onChange={(e) => setIncGravedad(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
              >
                <option>Baja</option>
                <option>Media</option>
                <option>Alta</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {ticketsViaje.map((t) => (
              <div key={t.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-slate-700">{String(t.asiento).padStart(2, "0")}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{t.pasajeroNombre}</p>
                      <p className="text-sm text-slate-600">{t.codigo} • {t.pasajeroDocumento}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
                      Entregado
                    </button>
                    <button
                      onClick={() => {
                        const current = getIncidencias();
                        const next = [
                          ...current,
                          {
                            id: newId("inc"),
                            codigo: `INC-2026-${String(current.length + 11).padStart(3, "0")}`,
                            viajeId: v?.id || "",
                            ticketId: t.id,
                            tipo: incTipo,
                            gravedad: incGravedad,
                            estado: "En Proceso",
                            detalle: `Incidencia registrada en cierre: ${incTipo} (${incGravedad}).`,
                            createdAt: new Date().toISOString(),
                          },
                        ];
                        setIncidencias(next as any);
                      }}
                      className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Incidencia
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Verificación de Cierre</h3>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="checkbox" className="w-5 h-5 text-slate-600 rounded" defaultChecked />
              <span className="flex-1 font-medium text-slate-900">Todos los pasajeros descendieron</span>
              <CheckCircle2 className="w-5 h-5 text-slate-600" />
            </label>

            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="checkbox" className="w-5 h-5 text-slate-600 rounded" defaultChecked />
              <span className="flex-1 font-medium text-slate-900">Vehículo inspeccionado</span>
              <CheckCircle2 className="w-5 h-5 text-slate-600" />
            </label>

            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="checkbox" className="w-5 h-5 text-slate-600 rounded" defaultChecked />
              <span className="flex-1 font-medium text-slate-900">Sin incidencias reportadas</span>
              <CheckCircle2 className="w-5 h-5 text-slate-600" />
            </label>

            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="checkbox" className="w-5 h-5 text-slate-600 rounded" />
              <span className="flex-1 font-medium text-slate-900">Manifiesto firmado</span>
            </label>

            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="checkbox" className="w-5 h-5 text-slate-600 rounded" />
              <span className="flex-1 font-medium text-slate-900">Documentación completa</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <Link
            to={`/operativo/reportes/cierre-viaje/${v?.codigo || "VJ-000"}`}
            className="flex items-center gap-2 px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            <FileText className="w-5 h-5" />
            Vista Previa Reporte
          </Link>
          <button
            onClick={() => {
              if (!v) return;
              const next = viajes.map((x) => (x.id === v.id ? { ...x, estado: "Cerrado" as const } : x));
              setViajes(next);
            }}
            className="flex items-center gap-2 px-6 py-3 text-white bg-slate-700 rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            <Flag className="w-5 h-5" />
            Cerrar Viaje
          </button>
        </div>
      </div>
    </div>
  );
}

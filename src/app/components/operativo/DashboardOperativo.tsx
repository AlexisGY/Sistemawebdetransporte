import { PageHeader } from "../shared/PageHeader";
import { Truck, Ticket, CreditCard, CheckSquare, Clock, AlertCircle, Users, MapPin } from "lucide-react";
import { Link } from "react-router";

const viajesHoy = [
  { id: "VJ-001", ruta: "Lima - Arequipa", hora: "08:00", conductor: "Carlos Mendoza", placa: "ABC-123", estado: "En Ruta", ocupacion: 18, capacidad: 20 },
  { id: "VJ-002", ruta: "Lima - Cusco", hora: "09:30", conductor: "Luis Torres", placa: "XYZ-789", estado: "Check-in", ocupacion: 42, capacidad: 45 },
  { id: "VJ-003", ruta: "Lima - Trujillo", hora: "10:00", conductor: "Ana García", placa: "GHI-321", estado: "Programado", ocupacion: 35, capacidad: 48 },
  { id: "VJ-004", ruta: "Arequipa - Cusco", hora: "14:00", conductor: "María Santos", placa: "JKL-654", estado: "Programado", ocupacion: 12, capacidad: 18 },
];

const accionesRapidas = [
  { title: "Reservar Ticket", icon: Ticket, color: "slate", path: "/operativo/reserva-tickets" },
  { title: "Emitir Ticket", icon: CheckSquare, color: "slate", path: "/operativo/emision-ticket" },
  { title: "Cotización", icon: CreditCard, color: "slate", path: "/operativo/cotizacion" },
  { title: "Check-in", icon: Users, color: "slate", path: "/operativo/checkin-embarque" },
];

export function DashboardOperativo() {
  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Panel operativo"
        subtitle="Control de operaciones diarias"
      />

      <div className="p-8 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Truck className="w-10 h-10 text-slate-600" />
              <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                Hoy
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">12</p>
            <p className="text-sm text-slate-600">Viajes Activos</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Ticket className="w-10 h-10 text-slate-600" />
              <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                Vendidos
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">87</p>
            <p className="text-sm text-slate-600">Tickets del Día</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckSquare className="w-10 h-10 text-slate-600" />
              <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                Proceso
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">45</p>
            <p className="text-sm text-slate-600">Check-ins Realizados</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className="w-10 h-10 text-slate-600" />
              <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                Alertas
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">3</p>
            <p className="text-sm text-slate-600">Pendientes de Atención</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-4 gap-4">
            {accionesRapidas.map((accion, index) => {
              const Icon = accion.icon;
              const colorClasses = {
                slate: "bg-slate-700 hover:bg-slate-800",
              };
              return (
                <Link
                  key={index}
                  to={accion.path}
                  className={`${colorClasses[accion.color as keyof typeof colorClasses]} rounded-xl p-6 text-white shadow-sm transition-all hover:shadow-md group border border-slate-600`}
                >
                  <Icon className="w-10 h-10 mb-3 opacity-90 group-hover:scale-110 transition-transform" />
                  <p className="font-semibold">{accion.title}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Viajes de Hoy */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Viajes Programados Hoy</h3>
                <p className="text-sm text-slate-600">14 de Abril, 2026</p>
              </div>
              <Link
                to="/operativo/recursos-viaje"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Ver todos
              </Link>
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {viajesHoy.map((viaje) => {
              const ocupacionPorcentaje = (viaje.ocupacion / viaje.capacidad) * 100;
              return (
                <div key={viaje.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Truck className="w-6 h-6 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{viaje.id}</p>
                          <p className="text-sm text-slate-600">{viaje.placa}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-900">{viaje.ruta}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{viaje.hora}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{viaje.conductor}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-600">Ocupación</p>
                        <p className="font-bold text-slate-900">
                          {viaje.ocupacion}/{viaje.capacidad}
                        </p>
                      </div>
                      <div className="w-32">
                        <div className="bg-slate-200 rounded-full h-2 mb-1">
                          <div
                            className="h-2 rounded-full bg-slate-600"
                            style={{ width: `${ocupacionPorcentaje}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-600 text-right">{ocupacionPorcentaje.toFixed(0)}%</p>
                      </div>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                        {viaje.estado}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-slate-600" />
              </div>
              <h4 className="font-semibold text-slate-900">Próxima salida</h4>
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">08:00</p>
            <p className="text-sm text-slate-600">Lima - Arequipa (VJ-001)</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-slate-600" />
              </div>
              <h4 className="font-semibold text-slate-900">Ingresos hoy</h4>
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">S/ 7,395</p>
            <p className="text-sm text-slate-600">87 tickets vendidos</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-slate-600" />
              </div>
              <h4 className="font-semibold text-slate-900">Flota disponible</h4>
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">38</p>
            <p className="text-sm text-slate-600">De 50 vehículos totales</p>
          </div>
        </div>
      </div>
    </div>
  );
}

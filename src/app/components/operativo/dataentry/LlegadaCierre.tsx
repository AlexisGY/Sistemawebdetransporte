import { useState } from "react";
import { PageHeader } from "../../shared/PageHeader";
import { MapPin, Clock, CheckCircle, AlertTriangle, FileText } from "lucide-react";
import { Link } from "react-router";

export function LlegadaCierre() {
  const [horaLlegada, setHoraLlegada] = useState("16:05");

  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Llegada y Cierre de Viaje"
        subtitle="Finalización y cierre operativo"
      />

      <div className="p-8 max-w-5xl mx-auto space-y-6">
        {/* Trip Info */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Viaje VJ-001</h3>
              <p className="text-slate-600">Lima - Arequipa</p>
            </div>
            <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold">
              En Ruta
            </span>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-slate-600 mb-1">Fecha</p>
              <p className="font-semibold">15/04/2026</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Hora Salida</p>
              <p className="font-semibold">08:00</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Llegada Estimada</p>
              <p className="font-semibold">16:00</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Vehículo</p>
              <p className="font-semibold">ABC-123</p>
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
              Observaciones de Llegada
            </label>
            <textarea
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
              rows={3}
              placeholder="Condiciones del viaje, incidencias, etc."
            ></textarea>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-slate-600" />
              </div>
              <h4 className="font-semibold text-slate-900">Pasajeros</h4>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">18</p>
            <p className="text-sm text-slate-600">Embarcados / 20 capacidad</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-slate-600" />
              </div>
              <h4 className="font-semibold text-slate-900">Distancia</h4>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">1,018</p>
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

        {/* Checklist */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Verificación de Cierre</h3>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="checkbox" className="w-5 h-5 text-slate-600 rounded" defaultChecked />
              <span className="flex-1 font-medium text-slate-900">Todos los pasajeros descendieron</span>
              <CheckCircle className="w-5 h-5 text-slate-600" />
            </label>

            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="checkbox" className="w-5 h-5 text-slate-600 rounded" defaultChecked />
              <span className="flex-1 font-medium text-slate-900">Vehículo inspeccionado</span>
              <CheckCircle className="w-5 h-5 text-slate-600" />
            </label>

            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="checkbox" className="w-5 h-5 text-slate-600 rounded" defaultChecked />
              <span className="flex-1 font-medium text-slate-900">Sin incidencias reportadas</span>
              <CheckCircle className="w-5 h-5 text-slate-600" />
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
            to="/operativo/reportes/cierre-viaje/VJ-001"
            className="flex items-center gap-2 px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            <FileText className="w-5 h-5" />
            Vista Previa Reporte
          </Link>
          <button className="flex items-center gap-2 px-6 py-3 text-white bg-slate-700 rounded-lg font-medium hover:bg-slate-800 transition-colors">
            <CheckCircle className="w-5 h-5" />
            Cerrar Viaje
          </button>
        </div>
      </div>
    </div>
  );
}

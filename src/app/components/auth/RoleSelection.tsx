import { Link } from "react-router";
import { BarChart3, Truck, ArrowRight, TrendingUp, Users } from "lucide-react";

export function RoleSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Bienvenido al Sistema</h1>
          <p className="text-lg text-slate-600">Selecciona el módulo para comenzar</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Gerencial */}
          <Link
            to="/gerencial/dashboard"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border-2 border-transparent hover:border-indigo-600"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <BarChart3 className="w-9 h-9 text-white" />
              </div>
              <ArrowRight className="w-6 h-6 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">Módulo Gerencial</h2>
            <p className="text-slate-600 mb-6">
              Accede a reportes, análisis de desempeño y configuración del sistema
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-3 h-3 text-indigo-600" />
                </div>
                <span>Consultas gerenciales y KPIs</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span>Mantenimiento de parámetros</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-3 h-3 text-indigo-600" />
                </div>
                <span>Análisis de ingresos y desempeño</span>
              </div>
            </div>
          </Link>

          {/* Operativo */}
          <Link
            to="/operativo/dashboard"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border-2 border-transparent hover:border-emerald-600"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Truck className="w-9 h-9 text-white" />
              </div>
              <ArrowRight className="w-6 h-6 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">Módulo Operativo</h2>
            <p className="text-slate-600 mb-6">
              Gestiona viajes, tickets, pagos y operaciones diarias del negocio
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="w-5 h-5 bg-emerald-100 rounded flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <span>Gestión de viajes y tickets</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="w-5 h-5 bg-emerald-100 rounded flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span>Cotizaciones y órdenes de pago</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="w-5 h-5 bg-emerald-100 rounded flex items-center justify-center flex-shrink-0">
                  <Users className="w-3 h-3 text-emerald-600" />
                </div>
                <span>Check-in, embarque y cierre</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="text-sm text-slate-600 hover:text-slate-900 font-medium"
          >
            Cerrar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

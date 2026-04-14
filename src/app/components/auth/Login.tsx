import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Truck, QrCode, Fingerprint, Eye, EyeOff, Scan } from "lucide-react";

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"password" | "qr" | "biometric">("password");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/seleccionar-rol");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Truck className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">TransporteSaaS</h1>
              <p className="text-slate-600">Sistema Empresarial de Gestión</p>
            </div>
          </div>

          <div className="space-y-4 pt-8">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Gestión Integral</h3>
                <p className="text-sm text-slate-600">Control completo de flotas, rutas y operarios</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Analytics en Tiempo Real</h3>
                <p className="text-sm text-slate-600">KPIs e indicadores de desempeño actualizados</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Seguridad Avanzada</h3>
                <p className="text-sm text-slate-600">Autenticación multifactor y cifrado de datos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Iniciar Sesión</h2>
            <p className="text-slate-600 mt-1">Accede a tu cuenta empresarial</p>
          </div>

          {/* Login Method Selector */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setLoginMethod("password")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                loginMethod === "password"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Contraseña
            </button>
            <button
              onClick={() => setLoginMethod("qr")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                loginMethod === "qr"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <QrCode className="w-4 h-4" />
              QR
            </button>
            <button
              onClick={() => setLoginMethod("biometric")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                loginMethod === "biometric"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Fingerprint className="w-4 h-4" />
              Biométrico
            </button>
          </div>

          {/* Password Login */}
          {loginMethod === "password" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Usuario o Email
                </label>
                <input
                  type="text"
                  placeholder="usuario@empresa.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  defaultValue="admin@transportesaas.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    defaultValue="admin123"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
                  <span className="text-sm text-slate-600">Recordar sesión</span>
                </label>
                <Link to="/recuperar" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
              >
                Iniciar Sesión
              </button>
            </form>
          )}

          {/* QR Login */}
          {loginMethod === "qr" && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-8 flex flex-col items-center justify-center">
                <div className="w-48 h-48 bg-white border-4 border-indigo-600 rounded-lg flex items-center justify-center mb-4">
                  <QrCode className="w-32 h-32 text-slate-300" />
                </div>
                <p className="text-sm text-slate-600 text-center mb-2">
                  Escanea el código QR con tu dispositivo móvil
                </p>
                <button
                  onClick={handleLogin}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
                >
                  <Scan className="w-4 h-4" />
                  Simular escaneo
                </button>
              </div>
            </div>
          )}

          {/* Biometric Login */}
          {loginMethod === "biometric" && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-lg p-8 flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Fingerprint className="w-16 h-16 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Autenticación Biométrica</h3>
                <p className="text-sm text-slate-600 text-center mb-4">
                  Coloca tu dedo en el sensor o mira a la cámara
                </p>
                <button
                  onClick={handleLogin}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Iniciar Escaneo
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-600">
              ¿Necesitas ayuda?{" "}
              <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Contacta soporte técnico
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

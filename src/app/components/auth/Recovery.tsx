import { useState } from "react";
import { Link } from "react-router";
import { Truck, Mail, Phone, ArrowLeft, CheckCircle } from "lucide-react";

export function Recovery() {
  const [step, setStep] = useState<"method" | "code" | "success">("method");
  const [method, setMethod] = useState<"email" | "phone">("email");

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("code");
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Truck className="w-9 h-9 text-white" />
            </div>
          </div>

          {step === "method" && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Recuperar Acceso</h2>
                <p className="text-slate-600 mt-2">
                  Selecciona el método para recuperar tu contraseña
                </p>
              </div>

              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setMethod("email")}
                    className={`w-full p-4 border-2 rounded-lg flex items-center gap-4 transition-all ${
                      method === "email"
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      method === "email" ? "bg-indigo-600" : "bg-slate-100"
                    }`}>
                      <Mail className={`w-5 h-5 ${method === "email" ? "text-white" : "text-slate-600"}`} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-slate-900">Correo Electrónico</p>
                      <p className="text-sm text-slate-600">Enviar código a admin@*****.com</p>
                    </div>
                    {method === "email" && (
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod("phone")}
                    className={`w-full p-4 border-2 rounded-lg flex items-center gap-4 transition-all ${
                      method === "phone"
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      method === "phone" ? "bg-indigo-600" : "bg-slate-100"
                    }`}>
                      <Phone className={`w-5 h-5 ${method === "phone" ? "text-white" : "text-slate-600"}`} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-slate-900">Mensaje SMS</p>
                      <p className="text-sm text-slate-600">Enviar código a +51 ***-***-789</p>
                    </div>
                    {method === "phone" && (
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl mt-6"
                >
                  Enviar Código de Verificación
                </button>
              </form>
            </>
          )}

          {step === "code" && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Verificar Código</h2>
                <p className="text-slate-600 mt-2">
                  Ingresa el código de 6 dígitos que enviamos a tu {method === "email" ? "correo" : "teléfono"}
                </p>
              </div>

              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div className="flex gap-2 justify-center">
                  {[...Array(6)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      defaultValue={i === 0 ? "1" : i === 1 ? "2" : i === 2 ? "3" : i === 3 ? "4" : i === 4 ? "5" : i === 5 ? "6" : ""}
                    />
                  ))}
                </div>

                <div className="text-center">
                  <p className="text-sm text-slate-600">
                    ¿No recibiste el código?{" "}
                    <button type="button" className="text-indigo-600 hover:text-indigo-700 font-medium">
                      Reenviar
                    </button>
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Verificar Código
                </button>
              </form>
            </>
          )}

          {step === "success" && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">¡Código Verificado!</h2>
                <p className="text-slate-600 mt-2">
                  Ahora puedes crear una nueva contraseña
                </p>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <Link
                  to="/login"
                  className="block w-full bg-gradient-to-r from-indigo-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl text-center"
                >
                  Restablecer Contraseña
                </Link>
              </form>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-slate-200">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

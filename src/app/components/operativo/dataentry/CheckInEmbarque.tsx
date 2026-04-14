import { useState } from "react";
import { PageHeader } from "../../shared/PageHeader";
import { QrCode, CheckCircle, AlertCircle, User } from "lucide-react";

const pasajerosMock = [
  { id: 1, nombre: "Juan Pérez", dni: "12345678", asiento: 5, ticket: "TKT-142", estado: "Pendiente" },
  { id: 2, nombre: "María García", dni: "87654321", asiento: 6, ticket: "TKT-143", estado: "Check-in" },
  { id: 3, nombre: "Carlos López", dni: "45678912", asiento: 8, ticket: "TKT-144", estado: "Embarcado" },
];

export function CheckInEmbarque() {
  const [pasajeros, setPasajeros] = useState(pasajerosMock);
  const [scanInput, setScanInput] = useState("");

  const handleCheckIn = (id: number) => {
    setPasajeros(pasajeros.map(p => 
      p.id === id ? { ...p, estado: "Check-in" } : p
    ));
  };

  const handleEmbarque = (id: number) => {
    setPasajeros(pasajeros.map(p => 
      p.id === id ? { ...p, estado: "Embarcado" } : p
    ));
  };

  const stats = {
    total: pasajeros.length,
    checkIn: pasajeros.filter(p => p.estado === "Check-in").length,
    embarcados: pasajeros.filter(p => p.estado === "Embarcado").length,
    pendientes: pasajeros.filter(p => p.estado === "Pendiente").length,
  };

  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Check-in y Embarque"
        subtitle="Control de pasajeros"
      />

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <User className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl font-bold text-indigo-600">{stats.total}</span>
            </div>
            <p className="text-sm font-medium text-slate-600">Total Pasajeros</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-600">{stats.checkIn}</span>
            </div>
            <p className="text-sm font-medium text-slate-600">Check-in Realizado</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{stats.embarcados}</span>
            </div>
            <p className="text-sm font-medium text-slate-600">Embarcados</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 text-amber-600" />
              <span className="text-2xl font-bold text-amber-600">{stats.pendientes}</span>
            </div>
            <p className="text-sm font-medium text-slate-600">Pendientes</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Scanner */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Escanear Ticket</h3>
            <div className="mb-4">
              <div className="w-full aspect-square bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-24 h-24 text-slate-400" />
              </div>
              <p className="text-sm text-slate-600 text-center mb-4">
                Escanee el código QR del ticket o ingrese manualmente
              </p>
              <input
                type="text"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                placeholder="Código de ticket"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
              Buscar Ticket
            </button>
          </div>

          {/* Passenger List */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Lista de Pasajeros</h3>
              <p className="text-sm text-slate-600">Viaje VJ-001: Lima - Arequipa | 15/04/2026 08:00</p>
            </div>

            <div className="divide-y divide-slate-200">
              {pasajeros.map((pasajero) => (
                <div key={pasajero.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold text-indigo-600">{pasajero.asiento}</span>
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
                            ? "bg-purple-100 text-purple-700"
                            : pasajero.estado === "Check-in"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {pasajero.estado}
                      </span>
                      
                      {pasajero.estado === "Pendiente" && (
                        <button
                          onClick={() => handleCheckIn(pasajero.id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          Check-in
                        </button>
                      )}
                      
                      {pasajero.estado === "Check-in" && (
                        <button
                          onClick={() => handleEmbarque(pasajero.id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Embarcar
                        </button>
                      )}
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

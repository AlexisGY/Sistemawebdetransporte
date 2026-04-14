import { useState } from "react";
import { PageHeader } from "../../shared/PageHeader";
import { MapPin, Calendar, Users, CreditCard, CheckCircle } from "lucide-react";

const steps = [
  { id: 1, name: "Seleccionar Viaje", icon: MapPin },
  { id: 2, name: "Datos del Pasajero", icon: Users },
  { id: 3, name: "Asientos", icon: CheckCircle },
  { id: 4, name: "Confirmación", icon: CreditCard },
];

const viajesDisponibles = [
  { id: 1, codigo: "VJ-001", ruta: "Lima - Arequipa", fecha: "15/04/2026", hora: "08:00", precio: 85, disponibles: 8 },
  { id: 2, codigo: "VJ-002", ruta: "Lima - Arequipa", fecha: "15/04/2026", hora: "14:00", precio: 75, disponibles: 15 },
  { id: 3, codigo: "VJ-005", ruta: "Lima - Arequipa", fecha: "15/04/2026", hora: "22:00", precio: 80, disponibles: 12 },
];

export function ReservaTickets() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedViaje, setSelectedViaje] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const handleSeatClick = (seatNumber: number) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const renderSeatMap = () => {
    const seats = Array.from({ length: 20 }, (_, i) => i + 1);
    const occupiedSeats = [3, 7, 11, 15]; // Mock occupied seats

    return (
      <div className="max-w-md mx-auto">
        <div className="bg-slate-100 rounded-t-3xl p-4 mb-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-slate-300 rounded"></div>
            <span className="text-sm font-medium text-slate-600">Conductor</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 p-4">
          {seats.map((seat) => {
            const isOccupied = occupiedSeats.includes(seat);
            const isSelected = selectedSeats.includes(seat);
            return (
              <button
                key={seat}
                onClick={() => !isOccupied && handleSeatClick(seat)}
                disabled={isOccupied}
                className={`aspect-square rounded-lg flex items-center justify-center font-semibold text-sm transition-all ${
                  isOccupied
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                    : isSelected
                    ? "bg-emerald-600 text-white scale-105 shadow-lg"
                    : "bg-white border-2 border-slate-300 hover:border-emerald-500 hover:scale-105"
                }`}
              >
                {seat}
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white border-2 border-slate-300 rounded"></div>
            <span className="text-sm text-slate-600">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-600 rounded"></div>
            <span className="text-sm text-slate-600">Seleccionado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-300 rounded"></div>
            <span className="text-sm text-slate-600">Ocupado</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Reserva de Tickets"
        subtitle="Proceso de reserva de asientos"
      />

      <div className="p-8">
        {/* Stepper */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-emerald-600 text-white"
                          : isActive
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium mt-2 ${
                        isActive ? "text-indigo-600" : "text-slate-600"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded ${
                        isCompleted ? "bg-emerald-600" : "bg-slate-200"
                      }`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {/* Step 1: Select Trip */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Selecciona tu viaje</h3>
              <div className="space-y-3">
                {viajesDisponibles.map((viaje) => (
                  <button
                    key={viaje.id}
                    onClick={() => setSelectedViaje(viaje)}
                    className={`w-full p-6 border-2 rounded-xl transition-all ${
                      selectedViaje?.id === viaje.id
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-bold text-lg text-slate-900">{viaje.ruta}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-slate-600 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {viaje.fecha}
                            </span>
                            <span className="text-sm text-slate-600">{viaje.hora}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-600">S/ {viaje.precio}</p>
                        <p className="text-sm text-slate-600">{viaje.disponibles} asientos disponibles</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Passenger Info */}
          {currentStep === 2 && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Datos del Pasajero</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombres
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Juan Carlos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Apellidos
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Pérez García"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo de Documento
                  </label>
                  <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>DNI</option>
                    <option>Pasaporte</option>
                    <option>Carnet de Extranjería</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Número de Documento
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="12345678"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="+51 999 888 777"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Seat Selection */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">
                Selecciona tus asientos
              </h3>
              {renderSeatMap()}
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg max-w-md mx-auto">
                <p className="text-sm font-medium text-emerald-900">
                  Asientos seleccionados: {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Ninguno"}
                </p>
                <p className="text-lg font-bold text-emerald-700 mt-2">
                  Total: S/ {(selectedSeats.length * (selectedViaje?.precio || 0)).toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Resumen de Reserva</h3>
                <p className="text-slate-600">Verifica los datos antes de confirmar</p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-4">Detalles del Viaje</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Ruta:</span>
                      <span className="font-medium">{selectedViaje?.ruta}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Fecha:</span>
                      <span className="font-medium">{selectedViaje?.fecha}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Hora:</span>
                      <span className="font-medium">{selectedViaje?.hora}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Asientos:</span>
                      <span className="font-medium">{selectedSeats.join(", ")}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-lg p-6 border-2 border-emerald-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-slate-900">Total a Pagar:</span>
                    <span className="text-3xl font-bold text-emerald-600">
                      S/ {(selectedSeats.length * (selectedViaje?.precio || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={() => {
                if (currentStep === 4) {
                  alert("¡Reserva confirmada!");
                } else {
                  setCurrentStep(Math.min(4, currentStep + 1));
                }
              }}
              className="px-6 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {currentStep === 4 ? "Confirmar Reserva" : "Siguiente"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { PageHeader } from "../../shared/PageHeader";
import { Download, Printer, QrCode, Send, ShieldCheck, Ticket } from "lucide-react";
import { Link } from "react-router";
import { getCatalog, getTickets, getViajes } from "../../../store/localDb";

export function EmisionTicket() {
  const tickets = useMemo(() => getTickets(), []);
  const viajes = useMemo(() => getViajes(), []);
  const vehiculos = useMemo(() => getCatalog<any>("vehiculos", []), []);

  const [ticketId, setTicketId] = useState(tickets[0]?.id || "");
  const t = tickets.find((x) => x.id === ticketId) || tickets[0];
  const v = viajes.find((x) => x.id === t?.viajeId);
  const veh = vehiculos.find((x) => x.idTipoVehiculo === v?.vehiculoId);

  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Emisión de Ticket"
        subtitle="Cierre comercial (ticket/guía emitida y asignada)"
      />

      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Selección de Ticket (Solo catálogo)</h3>
          <div className="grid grid-cols-3 gap-4 items-end">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Ticket emitible</label>
              <select
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
              >
                {tickets.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.codigo} — {x.pasajeroDocumento} — Asiento {String(x.asiento).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-900">Estado</p>
                  <p className="text-sm text-emerald-800">Emitido / Asignado</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Preview */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">TICKET DE VIAJE</h2>
                <p className="text-slate-200">Sistema de Transporte y Logística</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-200">Código</p>
                <p className="text-2xl font-bold">{t?.codigo || "-"}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Passenger Info */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-600 mb-3">DATOS DEL PASAJERO</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500">Nombre Completo</p>
                    <p className="font-semibold">{t?.pasajeroNombre || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">DNI</p>
                    <p className="font-semibold">{t?.pasajeroDocumento || "-"}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-600 mb-3">CONTACTO</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500">Teléfono</p>
                    <p className="font-semibold">+51 999 888 777</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="font-semibold">juan.perez@correo.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 my-6"></div>

            {/* Trip Info */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-600 mb-3">DETALLES DEL VIAJE</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500">Ruta</p>
                    <p className="font-semibold text-lg">{v?.ruta?.replace(" - ", " → ") || "-"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Fecha</p>
                      <p className="font-semibold">{v?.fechaISO || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Hora Salida</p>
                      <p className="font-semibold">{v?.horaSalida || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-600 mb-3">INFORMACIÓN ADICIONAL</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500">Vehículo</p>
                    <p className="font-semibold">{veh ? `${veh.idTipoVehiculo} — ${veh.marca} ${veh.modelo}` : v?.vehiculoId || "-"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Asiento</p>
                      <p className="font-semibold text-xl text-slate-700">{String(t?.asiento ?? "-").padStart(2, "0")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Precio</p>
                      <p className="font-semibold text-xl">S/ {Number(t?.precio ?? 0).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 my-6"></div>

            {/* QR Code */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-600 mb-2">CONDICIONES</h4>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Presentarse 30 minutos antes de la hora de salida</li>
                  <li>• Documento de identidad obligatorio</li>
                  <li>• Equipaje permitido: 25kg por pasajero</li>
                </ul>
              </div>
              <div className="w-32 h-32 bg-slate-100 border-2 border-slate-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="w-16 h-16 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500 mt-1">QR/Barcode</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border-t border-slate-200 px-8 py-4 flex items-center justify-between">
            <p className="text-xs text-slate-500">Emitido: {new Date(t?.emitidoAt || Date.now()).toLocaleString()}</p>
            <Link
              to={`/operativo/reportes/ticket-viaje/${t?.codigo || "TKT-000"}`}
              className="text-xs text-slate-600 hover:text-slate-700 font-medium"
            >
              Ver reporte completo →
            </Link>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button className="flex items-center gap-2 px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors">
            <Printer className="w-5 h-5" />
            Imprimir
          </button>
          <button className="flex items-center gap-2 px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors">
            <Download className="w-5 h-5" />
            Descargar PDF
          </button>
          <button className="flex items-center gap-2 px-6 py-3 text-white bg-slate-700 rounded-lg font-medium hover:bg-slate-800 transition-colors">
            <Send className="w-5 h-5" />
            Enviar por Email
          </button>
        </div>
      </div>
    </div>
  );
}

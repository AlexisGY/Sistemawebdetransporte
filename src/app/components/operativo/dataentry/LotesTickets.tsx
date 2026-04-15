import { useMemo, useState } from "react";
import { PageHeader } from "../../shared/PageHeader";
import { DataTable } from "../../shared/DataTable";
import { Boxes, CheckCircle2, CircleAlert, Plus, Ticket } from "lucide-react";
import { getLotes, getViajes, newId, setLotes, type LoteCapacidad } from "../../../store/localDb";

function fmtFecha(iso: string) {
  // yyyy-mm-dd -> dd/mm/yyyy
  const [y, m, d] = (iso || "").split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function LotesTickets() {
  const viajes = useMemo(() => getViajes(), []);
  const [lotes, setLotesState] = useState<LoteCapacidad[]>(() => getLotes());
  const [selectedViajeId, setSelectedViajeId] = useState(viajes[0]?.id || "");
  const [tipo, setTipo] = useState<"Pasajeros" | "Carga">("Pasajeros");
  const [cuposApertura, setCuposApertura] = useState<number>(40);

  const selectedViaje = viajes.find((v) => v.id === selectedViajeId);

  const buildCodigo = () => `LOT-${String(lotes.length + 1).padStart(3, "0")}`;

  const ocupados = selectedViaje?.asientosOcupados?.length || 0;
  const capacidadTotalViaje = selectedViaje?.capacidad || 0;
  const disponiblesViaje = Math.max(0, capacidadTotalViaje - ocupados);

  const yaExisteLote = useMemo(() => {
    if (!selectedViaje) return false;
    return lotes.some((l) => l.viajeId === selectedViaje.id && l.tipo === tipo && l.estado !== "Anulado");
  }, [lotes, selectedViaje, tipo]);

  const validacion = (() => {
    if (!selectedViaje) return { ok: false, title: "Selecciona un viaje", detail: "Necesitas un viaje programado para abrir cupos." };
    if (yaExisteLote)
      return {
        ok: false,
        title: "Ya existe un lote para este viaje",
        detail: `Ya se generó un lote de tipo "${tipo}" para ${selectedViaje.codigo}. Evita duplicar la apertura.`,
      };
    if (tipo === "Pasajeros") {
      if (disponiblesViaje <= 0)
        return { ok: false, title: "Sin cupos disponibles", detail: "Todos los asientos están ocupados para este viaje." };
      return { ok: true, title: "Listo para abrir asientos", detail: `Se habilitarán ${disponiblesViaje} asientos como "Disponible".` };
    }
    // Carga
    const slots = Math.max(1, Math.min(200, Math.floor(cuposApertura || 0)));
    if (slots <= 0) return { ok: false, title: "Define cuántos espacios abrir", detail: "Indica el número de espacios de bodega a abrir (ej. 40)." };
    return { ok: true, title: "Listo para abrir espacios de carga", detail: `Se generará un lote con ${slots} espacios de bodega.` };
  })();

  const handleGenerar = () => {
    if (!selectedViaje) return;
    if (!validacion.ok) return;
    const capacidadTotal = tipo === "Pasajeros" ? selectedViaje.capacidad : Math.max(1, Math.min(200, Math.floor(cuposApertura || 0)));
    const disponibles = tipo === "Pasajeros" ? disponiblesViaje : capacidadTotal;

    const lote: LoteCapacidad = {
      id: newId("lote"),
      codigo: buildCodigo(),
      viajeId: selectedViaje.id,
      tipo,
      capacidadTotal,
      disponibles,
      estado: "Disponible",
      createdAt: new Date().toISOString(),
    };
    const next = [...lotes, lote];
    setLotes(next);
    setLotesState(next);
  };

  const gridPreview = (() => {
    if (!selectedViaje) return [];
    if (tipo === "Pasajeros") {
      const total = selectedViaje.capacidad;
      const occupied = new Set<number>(selectedViaje.asientosOcupados);
      // Representación tipo "mapa" (máximo 80 para vista rápida)
      return Array.from({ length: total }, (_, i) => i + 1).slice(0, 80).map((n) => ({
        id: n,
        cupo: `AS-${String(n).padStart(2, "0")}`,
        estado: occupied.has(n) ? "Ocupado" : "Disponible",
      }));
    }
    // Carga: slots por peso/volumen
    const n = Math.max(8, Math.min(80, Math.floor(cuposApertura || 0) || 40));
    return Array.from({ length: n }, (_, i) => ({
      id: i + 1,
      cupo: `SP-${String(i + 1).padStart(3, "0")}`,
      estado: "Disponible",
    }));
  })();

  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Lotes de Tickets (Apertura de Capacidad)"
        subtitle="Abre cupos listos para Cotización → Orden de Pago → Emisión"
        actions={
          <button
            onClick={handleGenerar}
            disabled={!validacion.ok}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              validacion.ok ? "bg-slate-700 text-white hover:bg-slate-800" : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            <Plus className="w-4 h-4" />
            Generar Lote
          </button>
        }
      />

      <div className="p-8 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Flujo Operativo</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">
                1) Recursos de Viaje <span className="text-slate-400">→</span> <span className="text-slate-900">2) Lotes</span>{" "}
                <span className="text-slate-400">→</span> 3) Cotización <span className="text-slate-400">→</span> 4) Orden de Pago{" "}
                <span className="text-slate-400">→</span> 5) Emisión
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Aquí el operario <span className="font-semibold">abre capacidad</span> en estado <span className="font-semibold">Disponible</span> para su venta posterior.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Apertura Masiva
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Paso 1 — Selección (Invoca Catálogo de Viajes)</h3>
            <div className="grid grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Viaje Programado</label>
                <select
                  value={selectedViajeId}
                  onChange={(e) => setSelectedViajeId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
                >
                  {viajes.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.codigo} — {v.ruta} — {fmtFecha(v.fechaISO)} {v.horaSalida}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Tipo de Lote</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
                >
                  <option value="Pasajeros">Pasajeros (Asientos)</option>
                  <option value="Carga">Carga (Espacios)</option>
                </select>
              </div>
              {tipo === "Carga" ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Espacios a Abrir (Bodega)</label>
                  <input
                    type="number"
                    min={8}
                    max={200}
                    value={cuposApertura}
                    onChange={(e) => setCuposApertura(Number(e.target.value || 0))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Ejemplo realista: 40 espacios (SP-001…SP-040).</p>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">KPIs del Viaje</p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-white border border-slate-200 px-3 py-2">
                      <p className="text-[10px] text-slate-500 font-semibold uppercase">Capacidad</p>
                      <p className="text-sm font-bold text-slate-900">{capacidadTotalViaje}</p>
                    </div>
                    <div className="rounded-lg bg-white border border-slate-200 px-3 py-2">
                      <p className="text-[10px] text-slate-500 font-semibold uppercase">Ocupados</p>
                      <p className="text-sm font-bold text-slate-900">{ocupados}</p>
                    </div>
                    <div className="rounded-lg bg-white border border-slate-200 px-3 py-2">
                      <p className="text-[10px] text-slate-500 font-semibold uppercase">Disponibles</p>
                      <p className="text-sm font-bold text-emerald-700">{disponiblesViaje}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-700">Paso 2 — Contexto heredado (solo lectura)</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] text-slate-500 font-semibold uppercase">Viaje</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedViaje?.codigo || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-semibold uppercase">Ruta</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedViaje?.ruta || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-semibold uppercase">Salida</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {(selectedViaje?.fechaISO ? fmtFecha(selectedViaje.fechaISO) : "—") + " " + (selectedViaje?.horaSalida || "")}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-semibold uppercase">Estado</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedViaje?.estado || "Programado"}</p>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-xl border p-4 ${
                  validacion.ok ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"
                }`}
              >
                <p className="text-xs font-semibold text-slate-700">Paso 3 — Validación (Autómata)</p>
                <div className="mt-2 flex items-start gap-2">
                  {validacion.ok ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5" />
                  ) : (
                    <CircleAlert className="w-4 h-4 text-rose-700 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold ${validacion.ok ? "text-emerald-800" : "text-rose-800"}`}>{validacion.title}</p>
                    <p className={`text-xs mt-0.5 ${validacion.ok ? "text-emerald-800/80" : "text-rose-800/80"}`}>{validacion.detail}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-[11px] text-slate-700/80">
                    Acción: <span className="font-semibold">Generar Lote</span> crea un registro de apertura en estado{" "}
                    <span className="font-semibold">Disponible</span>.
                  </p>
                  <button
                    onClick={handleGenerar}
                    disabled={!validacion.ok}
                    className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      validacion.ok ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-200 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    Generar ahora
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Paso 4 — Vista Previa (ReadOnly)</h3>
            <p className="text-xs text-slate-600 mb-4">
              {tipo === "Pasajeros"
                ? "Mapa rápido: verde = disponible, gris = ocupado (ejemplo realista)."
                : "Espacios de bodega (SP) listos para cotizar y vender."}
            </p>
            <div className={`grid gap-2 ${tipo === "Pasajeros" ? "grid-cols-8" : "grid-cols-4"}`}>
              {gridPreview.map((c: any) => (
                <div
                  key={c.id}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold text-center ${
                    c.estado === "Disponible"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-slate-100 border-slate-200 text-slate-500"
                  }`}
                >
                  <div>{c.cupo}</div>
                  <div className="text-[10px] mt-0.5 font-medium">{c.estado}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Vista previa representativa (no muestra el 100% para no saturar la pantalla).
            </p>
          </div>
        </div>

        <DataTable
          title="Lotes Generados"
          columns={[
            { key: "codigo", label: "Código", sortable: true },
            {
              key: "tipo",
              label: "Tipo",
              render: (i: any) => (
                <span className="inline-flex items-center gap-2">
                  {i.tipo === "Pasajeros" ? <Ticket className="w-4 h-4 text-slate-500" /> : <Boxes className="w-4 h-4 text-slate-500" />}
                  {i.tipo}
                </span>
              ),
            },
            {
              key: "viajeId",
              label: "Viaje",
              render: (i: any) => {
                const v = viajes.find((x) => x.id === i.viajeId);
                return v ? `${v.codigo} — ${v.ruta} — ${fmtFecha(v.fechaISO)} ${v.horaSalida}` : i.viajeId;
              },
            },
            { key: "capacidadTotal", label: "Capacidad Total", sortable: true },
            { key: "disponibles", label: "Disponibles", sortable: true },
            {
              key: "estado",
              label: "Estado",
              render: (i: any) => (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                  {i.estado}
                </span>
              ),
            },
          ]}
          data={lotes}
          searchPlaceholder="Buscar lote..."
          onExport={() => {}}
        />
      </div>
    </div>
  );
}


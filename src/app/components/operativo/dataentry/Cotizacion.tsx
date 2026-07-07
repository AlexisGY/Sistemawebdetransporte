import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  MapPin,
  Search,
  Snowflake,
  Truck,
  Users,
} from "lucide-react";

import { PageHeader } from "../../shared/PageHeader";
import {
  getCatalog,
  getCotizaciones,
  getViajes,
  newId,
  upsertCotizacion,
  type Cotizacion as CotizacionTx,
  type Viaje,
} from "../../../store/localDb";

const SRV_PASAJEROS = "SRV-001";
const IGV_RATE = 0.18;
const SELECT_CLS =
  "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-600";
const INPUT_CLS = SELECT_CLS;
const LABEL_CLS = "block text-xs font-semibold text-slate-600 uppercase mb-2";

type Modo = "Pasajeros" | "Carga";

// Presenta un símbolo legible según la moneda de la tarifa aplicable.
function monedaSimbolo(moneda?: string) {
  if (moneda === "USD") return "$";
  return "S/";
}

// La ruta de un viaje se guarda como "Origen - Destino"; de ahí derivamos filtros.
function splitRuta(ruta: string): { origen: string; destino: string } {
  const [origen = "", destino = ""] = (ruta || "").split(" - ").map((s) => s.trim());
  return { origen, destino };
}

export function Cotizacion() {
  const navigate = useNavigate();
  const viajes = useMemo(() => getViajes(), []);
  const rutas = useMemo(() => getCatalog<any>("rutas", []), []);
  const clientes = useMemo(() => getCatalog<any>("clientes", []), []);
  const bienes = useMemo(() => getCatalog<any>("bienes", []), []);
  const contenedores = useMemo(() => getCatalog<any>("contenedores", []), []);
  const tarifarios = useMemo(() => getCatalog<any>("tarifarios", []), []);

  const [cotizaciones, setCotizacionesState] = useState<CotizacionTx[]>(() => getCotizaciones());

  // Modo activo: la consulta de disponibilidad es idéntica en lógica para ambos.
  const [modo, setModo] = useState<Modo>("Pasajeros");

  // Opciones de orígenes/destinos derivadas del catálogo de rutas.
  const origenes = useMemo(
    () => Array.from(new Set(rutas.map((r: any) => r.origen).filter(Boolean))) as string[],
    [rutas],
  );
  const destinos = useMemo(
    () => Array.from(new Set(rutas.map((r: any) => r.destino).filter(Boolean))) as string[],
    [rutas],
  );

  // ── Filtros de búsqueda (Pasajeros) ──────────────────────────────
  const [filtrosPax, setFiltrosPax] = useState({
    origen: origenes[0] || "Lima",
    destino: destinos[0] || "Arequipa",
    fecha: "",
    cantidadPasajeros: 2,
    tipoServicio: "SRV-001",
  });

  // ── Filtros de búsqueda (Carga) ──────────────────────────────────
  const [filtrosCarga, setFiltrosCarga] = useState({
    origen: origenes[0] || "Lima",
    destino: destinos[0] || "Arequipa",
    fecha: "",
    bienId: bienes[0]?.idTipoBien || "",
    cantidad: 120,
    volumen: "" as string,
    contenedorId: "" as string,
  });

  // Resultados de la consulta crítica online + cotización activa.
  const [resultados, setResultados] = useState<Viaje[] | null>(null);
  const [cotizacionActiva, setCotizacionActiva] = useState<{
    viaje: Viaje;
    precioUnit: number;
    moneda: string;
    cantidad: number;
    subtotal: number;
    igv: number;
    total: number;
    unidad: string;
  } | null>(null);

  const isPasajeros = modo === "Pasajeros";

  // Bien seleccionado en Carga → datos heredados de solo lectura.
  const bienSel = bienes.find((b: any) => b.idTipoBien === filtrosCarga.bienId);
  const coldRequired = String(bienSel?.requiereCadenaFrio || "No") === "Sí";
  // Rango general permitido para el tipo de bien (catálogo). El bien real transportado
  // puede exigir un valor específico dentro de este rango (temperaturaExigida).
  const tempMin = bienSel?.tempMin;
  const tempMax = bienSel?.tempMax;

  // ── Tarifas ──────────────────────────────────────────────────────
  const tarifaPasajero = (rutaLabel: string) => {
    const t =
      tarifarios.find(
        (x: any) => x.servicio === SRV_PASAJEROS && x.ruta === rutaLabel && x.unidadCobro === "Pasajero",
      ) || tarifarios.find((x: any) => x.servicio === SRV_PASAJEROS);
    return { precio: Number(t?.precioBase ?? 85), moneda: String(t?.moneda ?? "PEN") };
  };
  const tarifaCarga = (rutaLabel: string) => {
    const servicioCodigo = coldRequired ? "SRV-003" : "SRV-002";
    const t =
      tarifarios.find((x: any) => x.servicio === servicioCodigo && x.ruta === rutaLabel) ||
      tarifarios.find((x: any) => x.servicio === servicioCodigo) ||
      tarifarios[0];
    return { precio: Number(t?.precioBase ?? 0.1), moneda: String(t?.moneda ?? "PEN") };
  };

  // ── Búsqueda de disponibilidad (consulta crítica online) ─────────
  const buscarDisponibilidad = () => {
    const f = isPasajeros ? filtrosPax : filtrosCarga;
    const found = viajes.filter((v) => {
      const { origen, destino } = splitRuta(v.ruta);
      const okOrigen = !f.origen || origen === f.origen;
      const okDestino = !f.destino || destino === f.destino;
      const okFecha = !f.fecha || v.fechaISO === f.fecha;
      return okOrigen && okDestino && okFecha;
    });
    setResultados(found);
    setCotizacionActiva(null);
  };

  // ── Cupos disponibles por viaje según modo ───────────────────────
  const cuposDisponibles = (v: Viaje) => {
    if (isPasajeros) return Math.max(0, (v.capacidad || 0) - (v.asientosOcupados?.length || 0));
    const cap = v.capacidadCargaEspacios ?? 40;
    return Math.max(0, cap - (v.espaciosCargaOcupados?.length || 0));
  };

  // Contenedor asignado al viaje (para compatibilidad de carga).
  const contenedorViaje = (v: Viaje) =>
    contenedores.find((c: any) => c.idTipoContenedor === v.contenedorId);

  // ── Generar cotización desde un resultado ────────────────────────
  const cotizar = (v: Viaje) => {
    if (isPasajeros) {
      const { precio, moneda } = tarifaPasajero(v.ruta);
      const cantidad = filtrosPax.cantidadPasajeros;
      const subtotal = Number((precio * cantidad).toFixed(2));
      const igv = Number((subtotal * IGV_RATE).toFixed(2));
      setCotizacionActiva({ viaje: v, precioUnit: precio, moneda, cantidad, subtotal, igv, total: Number((subtotal + igv).toFixed(2)), unidad: "Pasajero" });
    } else {
      const { precio, moneda } = tarifaCarga(v.ruta);
      const cantidad = filtrosCarga.cantidad;
      const unidad = bienSel?.unidadMedidaBase || "KG";
      const subtotal = Number((precio * cantidad).toFixed(2));
      const igv = Number((subtotal * IGV_RATE).toFixed(2));
      setCotizacionActiva({ viaje: v, precioUnit: precio, moneda, cantidad, subtotal, igv, total: Number((subtotal + igv).toFixed(2)), unidad });
    }
    // Lleva la vista al bloque de cálculo.
    setTimeout(() => document.getElementById("bloque-calculo")?.scrollIntoView({ behavior: "smooth", block: "center" }), 0);
  };

  // ── Continuar a reserva (persiste la cotización y navega) ────────
  const continuarAReserva = () => {
    if (!cotizacionActiva) return;
    const cliente = clientes[0];
    const codigo = `COT-2026-${String(cotizaciones.length + 142).padStart(4, "0")}`;
    const c: CotizacionTx = {
      id: newId("cot"),
      codigo,
      viajeId: cotizacionActiva.viaje.id,
      clienteId: cliente?.idTipoCliente || "",
      servicioCodigo: isPasajeros
        ? SRV_PASAJEROS
        : coldRequired
          ? "SRV-003"
          : "SRV-002",
      bienId: isPasajeros ? "" : filtrosCarga.bienId,
      contenedorId: isPasajeros ? "" : filtrosCarga.contenedorId || cotizacionActiva.viaje.contenedorId || "",
      cantidad: cotizacionActiva.cantidad,
      unidad: cotizacionActiva.unidad,
      subtotal: cotizacionActiva.subtotal,
      igv: cotizacionActiva.igv,
      total: cotizacionActiva.total,
      estado: "Cotizado",
      createdAt: new Date().toISOString(),
    };
    upsertCotizacion(c);
    setCotizacionesState(getCotizaciones());
    navigate(`/operativo/reserva-tickets?cotizacionId=${encodeURIComponent(c.id)}`);
  };

  const sym = cotizacionActiva ? monedaSimbolo(cotizacionActiva.moneda) : "S/";

  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Disponibilidad y cotización"
        subtitle="Consulta viajes disponibles según origen, destino, fecha y condiciones del servicio."
      />

      <div className="p-8 w-full max-w-[1480px] mx-auto space-y-6">
        {/* ── Selector de modo ──────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <label className={LABEL_CLS}>Modo de servicio</label>
          <div className="flex gap-3">
            {(["Pasajeros", "Carga"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setModo(m);
                  setResultados(null);
                  setCotizacionActiva(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                  modo === m
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-300 hover:border-slate-500"
                }`}
              >
                {m === "Pasajeros" ? <Users className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* ── Búsqueda ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className={`${isPasajeros ? "xl:col-span-12" : "xl:col-span-8"} bg-white rounded-xl shadow-sm border border-slate-200 p-6`}>
            <div className="flex items-center gap-2 mb-5">
              <Search className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-900">Búsqueda de disponibilidad</h3>
            </div>

            {isPasajeros ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                <div>
                  <label className={LABEL_CLS}>Origen</label>
                  <select value={filtrosPax.origen} onChange={(e) => setFiltrosPax((p) => ({ ...p, origen: e.target.value }))} className={SELECT_CLS}>
                    {origenes.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>Destino</label>
                  <select value={filtrosPax.destino} onChange={(e) => setFiltrosPax((p) => ({ ...p, destino: e.target.value }))} className={SELECT_CLS}>
                    {destinos.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>Fecha de viaje</label>
                  <input type="date" value={filtrosPax.fecha} onChange={(e) => setFiltrosPax((p) => ({ ...p, fecha: e.target.value }))} className={INPUT_CLS} />
                </div>
                <div>
                  <label className={LABEL_CLS}>Cantidad de pasajeros</label>
                  <select value={String(filtrosPax.cantidadPasajeros)} onChange={(e) => setFiltrosPax((p) => ({ ...p, cantidadPasajeros: Number(e.target.value) }))} className={SELECT_CLS}>
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((q) => <option key={q} value={q}>{q} {q === 1 ? "pasajero" : "pasajeros"}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>Tipo de servicio</label>
                  <select value={filtrosPax.tipoServicio} onChange={(e) => setFiltrosPax((p) => ({ ...p, tipoServicio: e.target.value }))} className={SELECT_CLS}>
                    <option value="SRV-001">Interprovincial</option>
                    <option value="SRV-004">Ejecutivo VIP</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div>
                  <label className={LABEL_CLS}>Origen</label>
                  <select value={filtrosCarga.origen} onChange={(e) => setFiltrosCarga((p) => ({ ...p, origen: e.target.value }))} className={SELECT_CLS}>
                    {origenes.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>Destino</label>
                  <select value={filtrosCarga.destino} onChange={(e) => setFiltrosCarga((p) => ({ ...p, destino: e.target.value }))} className={SELECT_CLS}>
                    {destinos.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>Fecha de viaje</label>
                  <input type="date" value={filtrosCarga.fecha} onChange={(e) => setFiltrosCarga((p) => ({ ...p, fecha: e.target.value }))} className={INPUT_CLS} />
                </div>
                <div>
                  <label className={LABEL_CLS}>Tipo de bien / carga</label>
                  <select value={filtrosCarga.bienId} onChange={(e) => setFiltrosCarga((p) => ({ ...p, bienId: e.target.value }))} className={SELECT_CLS}>
                    {bienes.map((b: any) => (
                      <option key={b.idTipoBien} value={b.idTipoBien}>{b.idTipoBien} — {b.nombreComercial || b.claseBienNaturaleza}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>Cantidad / peso ({bienSel?.unidadMedidaBase || "KG"})</label>
                  <input type="number" min={1} value={filtrosCarga.cantidad} onChange={(e) => setFiltrosCarga((p) => ({ ...p, cantidad: Number(e.target.value || 0) }))} className={INPUT_CLS} />
                </div>
                <div>
                  <label className={LABEL_CLS}>Volumen (m³) — si aplica</label>
                  <input type="number" min={0} step="0.5" value={filtrosCarga.volumen} placeholder="Opcional" onChange={(e) => setFiltrosCarga((p) => ({ ...p, volumen: e.target.value }))} className={INPUT_CLS} />
                </div>
                <div>
                  <label className={LABEL_CLS}>Contenedor compatible — si aplica</label>
                  <select value={filtrosCarga.contenedorId} onChange={(e) => setFiltrosCarga((p) => ({ ...p, contenedorId: e.target.value }))} className={SELECT_CLS}>
                    <option value="">Cualquiera compatible</option>
                    {contenedores
                      .filter((c: any) => (coldRequired ? String(c.nivelRefrigeracion) === "Sí" : true))
                      .map((c: any) => (
                        <option key={c.idTipoContenedor} value={c.idTipoContenedor}>
                          {c.idTipoContenedor} — {c.claseContenedor}{String(c.nivelRefrigeracion) === "Sí" ? " (Frío)" : ""}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end border-t border-slate-200 pt-4">
              <button
                onClick={buscarDisponibilidad}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors"
              >
                <Search className="w-4 h-4" />
                Buscar disponibilidad
              </button>
            </div>
          </div>

          {/* ── Panel lateral: datos heredados del catálogo (Carga) ── */}
          {!isPasajeros && (
            <div className="xl:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Datos heredados del catálogo</h3>
              <p className="text-xs text-slate-500 mb-4">Valores de solo lectura del tipo de bien seleccionado.</p>
              {bienSel ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm space-y-2">
                  <p className="font-semibold text-slate-900">{bienSel.idTipoBien} — {bienSel.nombreComercial || bienSel.claseBienNaturaleza}</p>
                  <p className="flex items-center gap-2">
                    <span className="text-slate-500">Requiere frío:</span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 border text-[11px] font-semibold ${coldRequired ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                      <Snowflake className="w-3 h-3" />
                      {coldRequired ? "Sí" : "No"}
                    </span>
                  </p>
                  <p><span className="text-slate-500">Temperatura mínima:</span> <span className="font-semibold">{coldRequired && tempMin !== "" && tempMin !== undefined ? `${tempMin}°C` : "—"}</span></p>
                  <p><span className="text-slate-500">Temperatura máxima:</span> <span className="font-semibold">{coldRequired && tempMax !== "" && tempMax !== undefined ? `${tempMax}°C` : "—"}</span></p>
                  <p><span className="text-slate-500">Peligrosidad:</span> <span className="font-semibold">{bienSel.nivelPeligrosidad || "—"}</span></p>
                  <p><span className="text-slate-500">Unidad base:</span> <span className="font-semibold">{bienSel.unidadMedidaBase || "KG"}</span></p>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                  Selecciona un tipo de bien para ver sus condiciones heredadas.
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Resultados de disponibilidad ──────────────────────── */}
        {resultados && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-900">
                Resultados de disponibilidad ({resultados.length})
              </h3>
            </div>
            {resultados.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 text-center">
                No hay viajes disponibles para los filtros seleccionados.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] font-semibold uppercase text-slate-500 border-b border-slate-200">
                      <th className="py-2 pr-3">Código</th>
                      <th className="py-2 pr-3">Ruta</th>
                      <th className="py-2 pr-3">Fecha</th>
                      <th className="py-2 pr-3">Salida</th>
                      {isPasajeros ? <th className="py-2 pr-3">Llegada est.</th> : <th className="py-2 pr-3">Contenedor</th>}
                      <th className="py-2 pr-3">{isPasajeros ? "Cupos" : "Capacidad"}</th>
                      <th className="py-2 pr-3">{isPasajeros ? "Precio unit." : "Tarifa / unidad"}</th>
                      <th className="py-2 pr-3">Moneda</th>
                      {!isPasajeros && <th className="py-2 pr-3">Precio estimado</th>}
                      <th className="py-2 pr-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.map((v) => {
                      const tarifa = isPasajeros ? tarifaPasajero(v.ruta) : tarifaCarga(v.ruta);
                      const cont = contenedorViaje(v);
                      const cupos = cuposDisponibles(v);
                      const estimado = isPasajeros
                        ? tarifa.precio * filtrosPax.cantidadPasajeros
                        : tarifa.precio * filtrosCarga.cantidad;
                      const sinCupos = cupos <= 0;
                      return (
                        <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 pr-3 font-semibold text-slate-900">{v.codigo}</td>
                          <td className="py-3 pr-3 text-slate-700">{v.ruta}</td>
                          <td className="py-3 pr-3 text-slate-700">{v.fechaISO}</td>
                          <td className="py-3 pr-3 text-slate-700">{v.horaSalida}</td>
                          {isPasajeros ? (
                            <td className="py-3 pr-3 text-slate-700">{v.horaLlegadaEstimada || "—"}</td>
                          ) : (
                            <td className="py-3 pr-3 text-slate-700">{cont ? cont.claseContenedor : "—"}</td>
                          )}
                          <td className="py-3 pr-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${sinCupos ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
                              {cupos}
                            </span>
                          </td>
                          <td className="py-3 pr-3 text-slate-900 font-semibold">{monedaSimbolo(tarifa.moneda)} {tarifa.precio.toFixed(2)}</td>
                          <td className="py-3 pr-3 text-slate-700">{tarifa.moneda}</td>
                          {!isPasajeros && <td className="py-3 pr-3 text-slate-900 font-semibold">{monedaSimbolo(tarifa.moneda)} {estimado.toFixed(2)}</td>}
                          <td className="py-3 pr-3 text-right">
                            <button
                              onClick={() => cotizar(v)}
                              disabled={sinCupos}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg font-semibold transition-colors ${sinCupos ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-slate-700"}`}
                            >
                              <Calculator className="w-3 h-3" />
                              Cotizar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Cálculo de la cotización activa ───────────────────── */}
        {cotizacionActiva && (
          <div id="bloque-calculo" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Cotización — {cotizacionActiva.viaje.codigo} · {cotizacionActiva.viaje.ruta}
              </h3>
              <span className="text-xs text-slate-500">{cotizacionActiva.viaje.fechaISO} {cotizacionActiva.viaje.horaSalida}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Precio unitario</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{sym} {cotizacionActiva.precioUnit.toFixed(2)}</p>
                <p className="text-xs text-slate-600 mt-1">por {isPasajeros ? "pasajero" : cotizacionActiva.unidad}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Cantidad</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{cotizacionActiva.cantidad}</p>
                <p className="text-xs text-slate-600 mt-1">{isPasajeros ? "pasajero(s)" : cotizacionActiva.unidad}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Subtotal</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{sym} {cotizacionActiva.subtotal.toFixed(2)}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">IGV (18%)</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{sym} {cotizacionActiva.igv.toFixed(2)}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-white">
                <p className="text-xs font-semibold uppercase text-white/70">Total</p>
                <p className="mt-1 text-2xl font-bold">{sym} {cotizacionActiva.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
              <div className="flex items-center gap-2 text-sm text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Cotización lista. Al continuar se registra y pasa a asignación de cupos.
              </div>
              <button
                onClick={continuarAReserva}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-slate-700 hover:bg-slate-800 transition-colors"
              >
                Continuar a reserva
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── Cotizaciones registradas ──────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Cotizaciones registradas</h3>
          {cotizaciones.length === 0 ? (
            <p className="text-sm text-slate-500">Aún no hay cotizaciones registradas en esta sesión.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] font-semibold uppercase text-slate-500 border-b border-slate-200">
                    <th className="py-2 pr-3">Código</th>
                    <th className="py-2 pr-3">Tipo</th>
                    <th className="py-2 pr-3">Viaje</th>
                    <th className="py-2 pr-3">Total</th>
                    <th className="py-2 pr-3">Estado</th>
                    <th className="py-2 pr-3 text-right">Continuar</th>
                  </tr>
                </thead>
                <tbody>
                  {cotizaciones.map((c) => {
                    const v = viajes.find((x) => x.id === c.viajeId);
                    const esPax = c.servicioCodigo === SRV_PASAJEROS;
                    return (
                      <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 pr-3 font-semibold text-slate-900">{c.codigo}</td>
                        <td className="py-3 pr-3">
                          <span className={`px-2 py-1 text-xs rounded-full border font-medium ${esPax ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                            {esPax ? "Pasajeros" : "Carga"}
                          </span>
                        </td>
                        <td className="py-3 pr-3 text-slate-700">{v ? `${v.codigo} — ${v.ruta}` : c.viajeId}</td>
                        <td className="py-3 pr-3 font-semibold text-slate-900">S/ {Number(c.total).toFixed(2)}</td>
                        <td className="py-3 pr-3"><span className="px-2 py-1 text-xs rounded-full bg-slate-100 border border-slate-200">{c.estado}</span></td>
                        <td className="py-3 pr-3 text-right">
                          <button
                            onClick={() => navigate(`/operativo/reserva-tickets?cotizacionId=${encodeURIComponent(c.id)}`)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-lg bg-slate-900 text-white hover:bg-slate-700 transition-colors"
                          >
                            <ArrowRight className="w-3 h-3" />
                            Reserva
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

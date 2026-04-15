export type CatalogId =
  | "vehiculos"
  | "operarios"
  | "sedes"
  | "contenedores"
  | "bienes"
  | "unidades"
  | "clientes"
  | "servicios"
  | "rutas"
  | "horarios"
  | "tarifarios"
  | "politicas"
  | "reglas"
  | "protocolos";

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

const STORAGE_PREFIX = "swtransporte:";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: Json) {
  localStorage.setItem(key, JSON.stringify(value));
}

function catalogKey(id: CatalogId) {
  return `${STORAGE_PREFIX}catalog:${id}`;
}

export function getCatalog<T = any>(id: CatalogId, fallback: T[] = []): T[] {
  return readJson<T[]>(catalogKey(id), fallback);
}

export function setCatalog<T = any>(id: CatalogId, items: T[]) {
  writeJson(catalogKey(id), items as unknown as Json);
}

export function upsertCatalogItem<T extends { id?: string | number }>(id: CatalogId, item: T) {
  const current = getCatalog<T>(id, []);
  const next = (() => {
    if (item.id === undefined || item.id === null) return [...current, item];
    const idx = current.findIndex((x) => x.id === item.id);
    if (idx === -1) return [...current, item];
    return current.map((x) => (x.id === item.id ? item : x));
  })();
  setCatalog(id, next);
  return next;
}

export type Viaje = {
  id: string;
  codigo: string;
  ruta: string;
  fechaISO: string; // yyyy-mm-dd
  horaSalida: string; // HH:mm
  horaLlegadaEstimada?: string; // HH:mm
  vehiculoId: string; // idTipoVehiculo
  contenedorId?: string; // idTipoContenedor
  conductorOperarioId: string; // idTipoOperario
  copilotoOperarioId?: string;
  capacidad: number;
  asientosOcupados: number[];
  // Online (Carga): espacios de bodega por viaje
  capacidadCargaEspacios?: number; // e.g. 40
  espaciosCargaOcupados?: number[]; // e.g. [1,2,3]
  estado: "Pendiente" | "Confirmado" | "En Ruta" | "Cerrado";
  observaciones?: string;
  createdAt: string;
};

export type Reserva = {
  id: string;
  codigo: string;
  viajeId: string;
  clienteId?: string; // idTipoCliente (vínculo a catálogo)
  pasajeroNombre: string;
  pasajeroDocumento: string;
  telefono?: string;
  email?: string;
  // Pasajeros
  asientos: number[];
  // Carga (opcional)
  tipoReserva?: "Pasajeros" | "Carga";
  espaciosCarga?: number[]; // SP-001.. -> [1..]
  bienId?: string; // idTipoBien
  contenedorId?: string; // idTipoContenedor
  cantidad?: number;
  unidad?: string; // e.g. KG
  temperaturaObjetivoC?: number | null; // selección por combo (si aplica)
  total: number;
  estado: "Reservada" | "Pagada" | "TicketEmitido" | "Cancelada";
  createdAt: string;
};

export type OrdenPago = {
  id: string;
  codigo: string;
  reservaId: string;
  metodo: "Tarjeta" | "Efectivo" | "Transferencia";
  monto: number;
  estado: "Pendiente" | "Pagado" | "Rechazado";
  createdAt: string;
};

export type Ticket = {
  id: string;
  codigo: string;
  reservaId: string;
  viajeId: string;
  pasajeroNombre: string;
  pasajeroDocumento: string;
  asiento: number;
  precio: number;
  emitidoAt: string;
};

export type Cotizacion = {
  id: string;
  codigo: string;
  viajeId: string;
  clienteId: string; // idTipoCliente
  servicioCodigo: string; // SRV-xxx
  bienId: string; // idTipoBien
  contenedorId: string; // idTipoContenedor
  cantidad: number;
  unidad: string; // e.g. KG
  subtotal: number;
  igv: number;
  total: number;
  estado: "Borrador" | "Cotizado" | "Convertido";
  createdAt: string;
};

export type LoteCapacidad = {
  id: string;
  codigo: string;
  viajeId: string;
  tipo: "Pasajeros" | "Carga";
  capacidadTotal: number;
  disponibles: number;
  estado: "Disponible" | "Cerrado";
  createdAt: string;
};

export type Incidencia = {
  id: string;
  codigo: string;
  viajeId: string;
  ticketId?: string;
  tipo: "Retraso" | "Falla Mecánica" | "Temperatura" | "Daño de Carga" | "Queja Cliente" | "Otros";
  gravedad: "Baja" | "Media" | "Alta";
  estado: "En Proceso" | "Resuelta";
  detalle: string;
  createdAt: string;
};

function txKey(name: string) {
  return `${STORAGE_PREFIX}tx:${name}`;
}

export function getViajes(): Viaje[] {
  return readJson<Viaje[]>(txKey("viajes"), []);
}
export function setViajes(items: Viaje[]) {
  writeJson(txKey("viajes"), items as unknown as Json);
}
export function addViaje(v: Viaje) {
  const next = [...getViajes(), v];
  setViajes(next);
  return next;
}

export function getReservas(): Reserva[] {
  return readJson<Reserva[]>(txKey("reservas"), []);
}
export function setReservas(items: Reserva[]) {
  writeJson(txKey("reservas"), items as unknown as Json);
}
export function upsertReserva(r: Reserva) {
  const current = getReservas();
  const idx = current.findIndex((x) => x.id === r.id);
  const next = idx === -1 ? [...current, r] : current.map((x) => (x.id === r.id ? r : x));
  setReservas(next);
  return next;
}

export function getOrdenesPago(): OrdenPago[] {
  return readJson<OrdenPago[]>(txKey("ordenesPago"), []);
}
export function setOrdenesPago(items: OrdenPago[]) {
  writeJson(txKey("ordenesPago"), items as unknown as Json);
}
export function upsertOrdenPago(op: OrdenPago) {
  const current = getOrdenesPago();
  const idx = current.findIndex((x) => x.id === op.id);
  const next = idx === -1 ? [...current, op] : current.map((x) => (x.id === op.id ? op : x));
  setOrdenesPago(next);
  return next;
}

export function getTickets(): Ticket[] {
  return readJson<Ticket[]>(txKey("tickets"), []);
}
export function setTickets(items: Ticket[]) {
  writeJson(txKey("tickets"), items as unknown as Json);
}
export function addTickets(newTickets: Ticket[]) {
  const next = [...getTickets(), ...newTickets];
  setTickets(next);
  return next;
}

export function getCotizaciones(): Cotizacion[] {
  return readJson<Cotizacion[]>(txKey("cotizaciones"), []);
}
export function setCotizaciones(items: Cotizacion[]) {
  writeJson(txKey("cotizaciones"), items as unknown as Json);
}
export function upsertCotizacion(c: Cotizacion) {
  const current = getCotizaciones();
  const idx = current.findIndex((x) => x.id === c.id);
  const next = idx === -1 ? [...current, c] : current.map((x) => (x.id === c.id ? c : x));
  setCotizaciones(next);
  return next;
}

export function getLotes(): LoteCapacidad[] {
  return readJson<LoteCapacidad[]>(txKey("lotes"), []);
}
export function setLotes(items: LoteCapacidad[]) {
  writeJson(txKey("lotes"), items as unknown as Json);
}

export function getIncidencias(): Incidencia[] {
  return readJson<Incidencia[]>(txKey("incidencias"), []);
}
export function setIncidencias(items: Incidencia[]) {
  writeJson(txKey("incidencias"), items as unknown as Json);
}

export function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}


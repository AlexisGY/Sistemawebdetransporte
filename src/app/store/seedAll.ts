import {
  addViaje,
  getCatalog,
  getCotizaciones,
  getLotes,
  getOrdenesPago,
  getReservas,
  getTickets,
  getViajes,
  newId,
  setCatalog,
  setCotizaciones,
  setIncidencias,
  setLotes,
  setOrdenesPago,
  setReservas,
  setTickets,
  setViajes,
  type Cotizacion,
  type Incidencia,
  type LoteCapacidad,
  type OrdenPago,
  type Reserva,
  type Ticket,
  type Viaje,
} from "./localDb";

function isEmptyCatalog(id: any) {
  return getCatalog(id, []).length === 0;
}

export function seedAllIfEmpty() {
  // --- Catalogs ---
  if (isEmptyCatalog("servicios")) {
    setCatalog("servicios", [
      { id: 1, codigo: "SRV-001", descripcion: "Transporte Interprovincial de Pasajeros", condicionesEspeciales: "No", estado: "Activo" },
      { id: 2, codigo: "SRV-002", descripcion: "Transporte de Carga General", condicionesEspeciales: "No", estado: "Activo" },
      { id: 3, codigo: "SRV-003", descripcion: "Transporte de Carga Refrigerada", condicionesEspeciales: "Sí", estado: "Activo" },
      { id: 4, codigo: "SRV-004", descripcion: "Transporte Ejecutivo VIP", condicionesEspeciales: "No", estado: "Activo" },
    ]);
  }

  if (isEmptyCatalog("rutas")) {
    setCatalog("rutas", [
      { id: 1, origen: "Lima", destino: "Arequipa", puntosIntermedios: "Ica, Nazca", restricciones: "Carga máx. 20t", distanciaKm: 1030, estado: "Activo" },
      { id: 2, origen: "Lima", destino: "Cusco", puntosIntermedios: "Abancay", restricciones: "Sin carga peligrosa", distanciaKm: 1107, estado: "Activo" },
      { id: 3, origen: "Lima", destino: "Trujillo", puntosIntermedios: "Chimbote", restricciones: "-", distanciaKm: 557, estado: "Activo" },
      { id: 4, origen: "Lima", destino: "Piura", puntosIntermedios: "Trujillo, Chiclayo", restricciones: "Carga máx. 15t", distanciaKm: 983, estado: "Activo" },
    ]);
  }

  if (isEmptyCatalog("horarios")) {
    setCatalog("horarios", [
      { id: 1, codigoHorario: "HOR-001", codigoServicio: "SRV-001", codigoRuta: "RUT-001", diasOperacion: "LU, MI, VI", horaSalida: "08:00", frecuencia: "Semanal", capacidad: 45, estado: "Activo" },
      { id: 2, codigoHorario: "HOR-002", codigoServicio: "SRV-001", codigoRuta: "RUT-001", diasOperacion: "MA, JU, SA", horaSalida: "14:00", frecuencia: "Semanal", capacidad: 45, estado: "Activo" },
      { id: 3, codigoHorario: "HOR-003", codigoServicio: "SRV-003", codigoRuta: "RUT-001", diasOperacion: "LU a SA", horaSalida: "22:00", frecuencia: "Diaria", capacidad: 15, estado: "Activo" },
    ]);
  }

  if (isEmptyCatalog("tarifarios")) {
    setCatalog("tarifarios", [
      { id: 1, codigoTarifa: "TAR-001", servicio: "SRV-001", ruta: "Lima - Arequipa", tipoCarga: "Pasajero", precioBase: 85, moneda: "PEN", unidadCobro: "Pasajero", recargos: "Temporada alta: +15%", descuentos: "Estudiante: -10%", estado: "Activo" },
      { id: 2, codigoTarifa: "TAR-002", servicio: "SRV-003", ruta: "Lima - Arequipa", tipoCarga: "Refrigerada", precioBase: 0.18, moneda: "PEN", unidadCobro: "Kg", recargos: "Cadena de frío: +20%", descuentos: "-", estado: "Activo" },
      { id: 3, codigoTarifa: "TAR-003", servicio: "SRV-002", ruta: "Lima - Trujillo", tipoCarga: "Carga Gral.", precioBase: 0.08, moneda: "PEN", unidadCobro: "Kg", recargos: "Volumen > 3m³: +S/50", descuentos: "Contrato anual: -5%", estado: "Activo" },
    ]);
  }

  // Ensure some contenedores/bienes have refrigeration match scenario
  if (isEmptyCatalog("contenedores")) {
    setCatalog("contenedores", [
      { id: 1, idTipoContenedor: "T-CO-001", claseContenedor: "Bodega Estándar (Bus)", capacidadVolumenMaxM3: 10.0, capacidadPesoMaxTon: 2.5, nivelPeligrosidadSoportada: "Carga General", nivelRefrigeracion: "No", temperaturaMinima: "", materialRevestimiento: "Aluminio Estándar", estadoCatalogo: "DISPONIBLE" },
      { id: 2, idTipoContenedor: "T-CO-002", claseContenedor: "Contenedor Frigorífico", capacidadVolumenMaxM3: 8.5, capacidadPesoMaxTon: 1.8, nivelPeligrosidadSoportada: "000-BIO (Biológico)", nivelRefrigeracion: "Sí", temperaturaMinima: -20, materialRevestimiento: "Poliuretano Aislante", estadoCatalogo: "DISPONIBLE" },
      { id: 3, idTipoContenedor: "T-CO-003", claseContenedor: "Cisterna", capacidadVolumenMaxM3: 12.0, capacidadPesoMaxTon: 3.0, nivelPeligrosidadSoportada: "322-W (Químico/Inflamable)", nivelRefrigeracion: "No", temperaturaMinima: "", materialRevestimiento: "Acero inoxidable", estadoCatalogo: "DISPONIBLE" },
    ]);
  }

  if (isEmptyCatalog("bienes")) {
    setCatalog("bienes", [
      { id: 1, idTipoBien: "T-BI-004", claseBienNaturaleza: "Perecible", unidadMedidaBase: "KG", nivelPeligrosidad: "000-BIO", requiereCadenaFrio: "Sí", temperaturaExigida: -18, esCargaValorada: "Sí", requiereEstibaEspecial: "Sí", aplicaSeguroObligatorio: "Sí", estadoCatalogo: "DISPONIBLE", nombreComercial: "Vacunas Biológicas (Cadena de Frío)" },
      { id: 2, idTipoBien: "T-BI-005", claseBienNaturaleza: "Carga General", unidadMedidaBase: "KG", nivelPeligrosidad: "NULO", requiereCadenaFrio: "No", temperaturaExigida: "", esCargaValorada: "No", requiereEstibaEspecial: "No", aplicaSeguroObligatorio: "No", estadoCatalogo: "DISPONIBLE", nombreComercial: "Repuestos Automotrices" },
      { id: 3, idTipoBien: "T-BI-006", claseBienNaturaleza: "Peligrosa", unidadMedidaBase: "KG", nivelPeligrosidad: "322-W", requiereCadenaFrio: "No", temperaturaExigida: "", esCargaValorada: "No", requiereEstibaEspecial: "Sí", aplicaSeguroObligatorio: "Sí", estadoCatalogo: "DISPONIBLE", nombreComercial: "Pinturas Inflamables" },
    ]);
  }

  if (isEmptyCatalog("clientes")) {
    setCatalog("clientes", [
      { id: 1, idTipoCliente: "T-CL-001", categoriaPerfil: "VIP", origenAfiliacion: "Orgánico", segmentoSocioeconomico: "A", lugarResidencia: "Nacional", aplicaLineaCredito: "Sí", limiteCreditoMax: 5000, rangoMontoComprasMin: 10000, rangoAntiguedadMesesMin: 24, estadoCatalogo: "DISPONIBLE", razonSocial: "Clínica San Gabriel S.A.C.", doc: "RUC 20502133456" },
      { id: 2, idTipoCliente: "T-CL-002", categoriaPerfil: "Corporativo", origenAfiliacion: "Convenio", segmentoSocioeconomico: "B", lugarResidencia: "Nacional", aplicaLineaCredito: "Sí", limiteCreditoMax: 50000, rangoMontoComprasMin: 50000, rangoAntiguedadMesesMin: 60, estadoCatalogo: "DISPONIBLE", razonSocial: "AgroExport Andina S.A.", doc: "RUC 20100199887" },
      { id: 3, idTipoCliente: "T-CL-003", categoriaPerfil: "Normal", origenAfiliacion: "Campaña A", segmentoSocioeconomico: "C", lugarResidencia: "Extranjero", aplicaLineaCredito: "No", limiteCreditoMax: 0, rangoMontoComprasMin: 0, rangoAntiguedadMesesMin: 0, estadoCatalogo: "DISPONIBLE", razonSocial: "Juan Carlos Pérez García", doc: "DNI 45879632" },
    ]);
  }

  // --- Transactions ---
  if (getViajes().length === 0) {
    const viajes: Viaje[] = [
      {
        id: newId("viaje"),
        codigo: "VJ-001",
        ruta: "Lima - Arequipa",
        fechaISO: "2026-04-15",
        horaSalida: "08:00",
        horaLlegadaEstimada: "16:00",
        vehiculoId: "T-VE-001",
        contenedorId: "T-CO-002",
        conductorOperarioId: "T-OP-001",
        copilotoOperarioId: "T-OP-002",
        capacidad: 45,
        asientosOcupados: [3, 7, 11, 15],
        estado: "Confirmado",
        observaciones: "Salida desde Terminal Principal (Hub).",
        createdAt: new Date().toISOString(),
      },
      {
        id: newId("viaje"),
        codigo: "VJ-002",
        ruta: "Lima - Arequipa",
        fechaISO: "2026-04-15",
        horaSalida: "14:00",
        horaLlegadaEstimada: "22:00",
        vehiculoId: "T-VE-002",
        contenedorId: "T-CO-001",
        conductorOperarioId: "T-OP-001",
        capacidad: 20,
        asientosOcupados: [5, 6],
        estado: "Pendiente",
        createdAt: new Date().toISOString(),
      },
    ];
    setViajes(viajes);
  }

  if (getLotes().length === 0) {
    const v = getViajes()[0];
    const lotes: LoteCapacidad[] = [
      {
        id: newId("lote"),
        codigo: "LOT-001",
        viajeId: v?.id || "",
        tipo: "Pasajeros",
        capacidadTotal: v?.capacidad ?? 45,
        disponibles: (v?.capacidad ?? 45) - (v?.asientosOcupados?.length ?? 0),
        estado: "Disponible",
        createdAt: new Date().toISOString(),
      },
      {
        id: newId("lote"),
        codigo: "LOT-002",
        viajeId: v?.id || "",
        tipo: "Carga",
        capacidadTotal: 1800,
        disponibles: 1400,
        estado: "Disponible",
        createdAt: new Date().toISOString(),
      },
    ];
    setLotes(lotes);
  }

  if (getCotizaciones().length === 0) {
    const v = getViajes()[0];
    const cot: Cotizacion = {
      id: newId("cot"),
      codigo: "COT-2026-0142",
      viajeId: v?.id || "",
      clienteId: "T-CL-001",
      servicioCodigo: "SRV-003",
      bienId: "T-BI-004",
      contenedorId: "T-CO-002",
      cantidad: 120,
      unidad: "KG",
      subtotal: 120 * 0.18,
      igv: 120 * 0.18 * 0.18,
      total: 120 * 0.18 * 1.18,
      estado: "Cotizado",
      createdAt: new Date().toISOString(),
    };
    setCotizaciones([cot]);
  }

  if (getReservas().length === 0) {
    const v = getViajes()[0];
    const res: Reserva = {
      id: newId("res"),
      codigo: "RES-2026-0142",
      viajeId: v?.id || "",
      pasajeroNombre: "Juan Carlos Pérez García",
      pasajeroDocumento: "DNI 45879632",
      telefono: "+51 999 888 777",
      email: "juan.perez@correo.com",
      asientos: [5, 6],
      total: 170.0,
      estado: "Reservada",
      createdAt: new Date().toISOString(),
    };
    setReservas([res]);
  }

  if (getOrdenesPago().length === 0) {
    const res = getReservas()[0];
    const op: OrdenPago = {
      id: newId("op"),
      codigo: "OP-2026-0142",
      reservaId: res?.id || "",
      metodo: "Tarjeta",
      monto: res?.total ?? 170,
      estado: "Pendiente",
      createdAt: new Date().toISOString(),
    };
    setOrdenesPago([op]);
  }

  if (getTickets().length === 0) {
    const res = getReservas()[0];
    const v = getViajes().find((x) => x.id === res?.viajeId);
    const t: Ticket[] = (res?.asientos ?? []).map((asiento, idx) => ({
      id: newId("tkt"),
      codigo: `TKT-20${142 + idx}`,
      reservaId: res?.id || "",
      viajeId: v?.id || "",
      pasajeroNombre: res?.pasajeroNombre || "-",
      pasajeroDocumento: res?.pasajeroDocumento || "-",
      asiento,
      precio: (res?.total ?? 0) / Math.max(1, (res?.asientos?.length ?? 1)),
      emitidoAt: new Date().toISOString(),
    }));
    setTickets(t);
  }

  // Incidencias demo
  const incid: Incidencia[] = [
    {
      id: newId("inc"),
      codigo: "INC-2026-010",
      viajeId: getViajes()[0]?.id || "",
      tipo: "Temperatura",
      gravedad: "Media",
      estado: "En Proceso",
      detalle: "Validación de cadena de frío en punto de control (sensor).",
      createdAt: new Date().toISOString(),
    },
  ];
  setIncidencias(incid);
}


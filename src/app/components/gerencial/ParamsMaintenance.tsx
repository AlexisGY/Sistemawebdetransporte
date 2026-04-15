import { useState } from "react";
import { PageHeader } from "../shared/PageHeader";
import { DataTable } from "../shared/DataTable";
import {
  Truck,
  Users,
  Building,
  Package,
  Box,
  Ruler,
  UserCircle,
  Briefcase,
  Map,
  Clock,
  DollarSign,
  FileText,
  Shield,
  ScrollText,
  X,
  Save,
  Plus,
  Trash2,
} from "lucide-react";

const categories = [
  { id: "vehiculos",  name: "Vehículos",            icon: Truck,       color: "indigo" },
  { id: "operarios",  name: "Operarios",             icon: Users,       color: "emerald" },
  { id: "sedes",      name: "Sedes",                 icon: Building,    color: "purple" },
  { id: "contenedores", name: "Contenedores",        icon: Package,     color: "blue" },
  { id: "bienes",     name: "Bienes",                icon: Box,         color: "amber" },
  { id: "unidades",   name: "Unidades de Medida",    icon: Ruler,       color: "rose" },
  { id: "clientes",   name: "Clientes",              icon: UserCircle,  color: "cyan" },
  { id: "servicios",  name: "Servicios",             icon: Briefcase,   color: "teal" },
  { id: "rutas",      name: "Rutas y Coberturas",    icon: Map,         color: "indigo" },
  { id: "horarios",   name: "Horarios",              icon: Clock,       color: "emerald" },
  { id: "tarifarios", name: "Tarifarios",            icon: DollarSign,  color: "purple" },
  { id: "politicas",  name: "Políticas de Negocio",  icon: FileText,    color: "blue" },
  { id: "reglas",     name: "Reglas de Negocio",     icon: Shield,      color: "amber" },
  { id: "protocolos", name: "Protocolos",            icon: ScrollText,  color: "rose" },
];

const estadoCatalogoOptions = ["DISPONIBLE", "NO DISPONIBLE"];

const vehiculosSelects = {
  claseVehiculo: ["Minibús", "Autobús", "Automóvil", "SUV 4x4", "Camión Frigorífico"],
  tipoInsumo: ["95 Octanos", "Electricidad", "Gas", "Diésel", "Petróleo"],
  terrenoSoportado: ["Plano", "Montañoso", "Trocha", "Asfaltado"],
  nivelBlindaje: ["NA", "RB nivel 3", "RB nivel 4", "RB nivel 5", "RB nivel 6", "RB nivel 7"],
};

const operariosSelects = {
  rolFuncion: ["Conductor", "Cargador/Descargador", "Copiloto", "Ayudante", "Terrazoza"],
  tipoAsignacion: ["Transporte V.", "Pesado", "Troncal", "Ligero", "Apoyo logístico"],
  especialidad: ["Manejo", "Cargador", "Atención al Pasajero"],
  categoriaContractual: ["Contratado", "Temporal", "Autónomo", "Tercerizado"],
  licenciaRequerida: ["NA", "A-IIIA", "A-IIIB", "A-IIIC"],
  alcanceRuta: ["Urbano", "Ruta Nacional", "Ruta Internacional"],
  modalidadCosteo: ["Sueldo Fijo", "Pago por Viaje", "Pago por Km", "Pago por Horas"],
};

const sedesSelects = {
  claseSede: ["Terminal Terrestre", "Almacén Logístico", "Agencia Mixta", "Punto de Venta"],
  categoriaPlaza: ["Sede Principal (Hub)", "Sede Regional", "Agencia de Paso", "Sucursal Fronteriza"],
  paisOperacion: ["Perú", "Chile", "Argentina", "Bolivia", "Ecuador", "Colombia"],
  regionCiudad: ["Lima", "Arequipa", "Santiago", "Buenos Aires", "La Paz", "Zaguayquil"],
  nivelSeguridadAduana: ["Básico", "Alta Seguridad (Bóveda)", "Control Aduanero"],
};

const contenedoresSelects = {
  claseContenedor: ["Bodega Estándar (Bus)", "Tolva", "Contenedor Frigorífico", "Cisterna", "Jaula (Carga Viva)"],
  nivelPeligrosidadSoportada: [
    "NULO",
    "Carga General",
    "041-CRYO (Criogénico)",
    "000-BIO (Biológico)",
    "322-W (Químico/Inflamable)",
  ],
  materialRevestimiento: ["Aluminio Estándar", "Acero inoxidable", "Poliuretano Aislante"],
};

const bienesSelects = {
  claseBienNaturaleza: ["Carga General", "Perecible", "Frágil", "Carga Viva", "Valorada", "Peligrosa"],
  unidadMedidaBase: ["KG", "M3", "TN", "LIBRAS", "UNIDAD"],
  nivelPeligrosidad: ["NULO", "041-CRYO", "000-BIO", "322-W", "EXPLOSIVO"],
};

const unidadesSelects = {
  magnitudFisica: ["Peso/Masa", "Volumen", "Longitud/Distancia", "Tiempo", "Cantidad/Unidad"],
};

const clientesSelects = {
  categoriaPerfil: ["VIP", "Normal", "Corporativo", "Potencial", "Deficiente"],
  origenAfiliacion: ["Campaña A", "Campaña B", "Orgánico", "Convenio"],
  segmentoSocioeconomico: ["A", "B", "C", "D", "E"],
  lugarResidencia: ["Nacional", "Extranjero"],
  limiteCreditoMax: ["0", "1000", "5000", "50000"],
  rangoMontoComprasMin: ["0", "10000", "50000"],
  rangoAntiguedadMesesMin: ["0", "12", "24", "60"],
};

const vehiculosData = [
  {
    id: 1,
    idTipoVehiculo: "T-VE-001",
    claseVehiculo: "Autobús",
    marca: "Volvo",
    modelo: "Volvo 9700",
    capacidadPasajeros: 45,
    pesoMaxCargaKg: 2000,
    volumenMaxBodegaM3: 20,
    tipoInsumo: "Diésel",
    capacidadTanque: 70,
    rendimientoConsumo: "4 L/100km",
    terrenoSoportado: "Asfaltado",
    tieneRefrigeracion: "No",
    temperaturaMinima: "",
    nivelBlindaje: "NA",
    estadoCatalogo: "DISPONIBLE",
  },
  {
    id: 2,
    idTipoVehiculo: "T-VE-002",
    claseVehiculo: "Minibús",
    marca: "Mercedes-Benz",
    modelo: "Sprinter",
    capacidadPasajeros: 20,
    pesoMaxCargaKg: 1000,
    volumenMaxBodegaM3: 15,
    tipoInsumo: "95 Octanos",
    capacidadTanque: 70,
    rendimientoConsumo: "10 Km/L",
    terrenoSoportado: "Plano",
    tieneRefrigeracion: "No",
    temperaturaMinima: "",
    nivelBlindaje: "NA",
    estadoCatalogo: "DISPONIBLE",
  },
  {
    id: 3,
    idTipoVehiculo: "T-VE-003",
    claseVehiculo: "Camión Frigorífico",
    marca: "Iveco",
    modelo: "Daily",
    capacidadPasajeros: 2,
    pesoMaxCargaKg: 10000,
    volumenMaxBodegaM3: 30,
    tipoInsumo: "Diésel",
    capacidadTanque: 70,
    rendimientoConsumo: "4 L/100km",
    terrenoSoportado: "Trocha",
    tieneRefrigeracion: "Sí",
    temperaturaMinima: -18,
    nivelBlindaje: "NA",
    estadoCatalogo: "NO DISPONIBLE",
  },
];

const operariosData = [
  {
    id: 1,
    idTipoOperario: "T-OP-001",
    rolFuncion: "Conductor",
    tipoAsignacion: "Pesado",
    especialidad: "Manejo",
    categoriaContractual: "Contratado",
    licenciaRequerida: "A-IIIC",
    habilitadoCargaPeligrosa: "Sí",
    habilitadoCargaValorada: "Sí",
    alcanceRuta: "Ruta Nacional",
    modalidadCosteo: "Sueldo Fijo",
    estadoCatalogo: "DISPONIBLE",
  },
  {
    id: 2,
    idTipoOperario: "T-OP-002",
    rolFuncion: "Copiloto",
    tipoAsignacion: "Ligero",
    especialidad: "Atención al Pasajero",
    categoriaContractual: "Temporal",
    licenciaRequerida: "NA",
    habilitadoCargaPeligrosa: "No",
    habilitadoCargaValorada: "No",
    alcanceRuta: "Urbano",
    modalidadCosteo: "Pago por Viaje",
    estadoCatalogo: "DISPONIBLE",
  },
  {
    id: 3,
    idTipoOperario: "T-OP-003",
    rolFuncion: "Cargador/Descargador",
    tipoAsignacion: "Troncal",
    especialidad: "Cargador",
    categoriaContractual: "Tercerizado",
    licenciaRequerida: "NA",
    habilitadoCargaPeligrosa: "Sí",
    habilitadoCargaValorada: "No",
    alcanceRuta: "Ruta Internacional",
    modalidadCosteo: "Pago por Horas",
    estadoCatalogo: "NO DISPONIBLE",
  },
];

const sedesData = [
  { id: 1, idTipoSede: "T-SE-001", claseSede: "Terminal Terrestre", categoriaPlaza: "Sede Principal (Hub)", paisOperacion: "Perú", regionCiudad: "Lima", estadoCatalogo: "DISPONIBLE" },
  { id: 2, idTipoSede: "T-SE-002", claseSede: "Agencia Mixta", categoriaPlaza: "Sede Regional", paisOperacion: "Perú", regionCiudad: "Arequipa", estadoCatalogo: "DISPONIBLE" },
  { id: 3, idTipoSede: "T-SE-003", claseSede: "Almacén Logístico", categoriaPlaza: "Agencia de Paso", paisOperacion: "Chile", regionCiudad: "Santiago", estadoCatalogo: "NO DISPONIBLE" },
];

const contenedoresData = [
  { id: 1, idTipoContenedor: "T-CO-001", claseContenedor: "Bodega Estándar (Bus)", capacidadVolumenMaxM3: 10.2, capacidadPesoMaxTon: 2.5, nivelPeligrosidadSoportada: "Carga General", nivelRefrigeracion: "No", estadoCatalogo: "DISPONIBLE" },
  { id: 2, idTipoContenedor: "T-CO-002", claseContenedor: "Contenedor Frigorífico", capacidadVolumenMaxM3: 8.5, capacidadPesoMaxTon: 1.8, nivelPeligrosidadSoportada: "000-BIO (Biológico)", nivelRefrigeracion: "Sí", estadoCatalogo: "DISPONIBLE" },
  { id: 3, idTipoContenedor: "T-CO-003", claseContenedor: "Cisterna", capacidadVolumenMaxM3: 12.0, capacidadPesoMaxTon: 3.0, nivelPeligrosidadSoportada: "322-W (Químico/Inflamable)", nivelRefrigeracion: "No", estadoCatalogo: "NO DISPONIBLE" },
];

const bienesData = [
  { id: 1, idTipoBien: "T-BI-001", claseBienNaturaleza: "Carga General", unidadMedidaBase: "KG", nivelPeligrosidad: "NULO", requiereCadenaFrio: "No", estadoCatalogo: "DISPONIBLE" },
  { id: 2, idTipoBien: "T-BI-002", claseBienNaturaleza: "Perecible", unidadMedidaBase: "KG", nivelPeligrosidad: "NULO", requiereCadenaFrio: "Sí", estadoCatalogo: "DISPONIBLE" },
  { id: 3, idTipoBien: "T-BI-003", claseBienNaturaleza: "Peligrosa", unidadMedidaBase: "UNIDAD", nivelPeligrosidad: "322-W", requiereCadenaFrio: "No", estadoCatalogo: "NO DISPONIBLE" },
];

const unidadesData = [
  { id: 1, idUnidadMedida: "T-UM-001", magnitudFisica: "Peso/Masa", nombreUnidad: "Gramo", abreviatura: "G", esUnidadBase: "No", factorConversionBase: 0.001, estadoCatalogo: "DISPONIBLE" },
  { id: 2, idUnidadMedida: "T-UM-013", magnitudFisica: "Peso/Masa", nombreUnidad: "Kilogramo", abreviatura: "KG", esUnidadBase: "Sí", factorConversionBase: 1, estadoCatalogo: "DISPONIBLE" },
  { id: 3, idUnidadMedida: "T-UM-043", magnitudFisica: "Volumen", nombreUnidad: "Metro Cúbico", abreviatura: "M3", esUnidadBase: "Sí", factorConversionBase: 1, estadoCatalogo: "DISPONIBLE" },
];

const clientesData = [
  {
    id: 1,
    idTipoCliente: "T-CL-001",
    categoriaPerfil: "VIP",
    origenAfiliacion: "Campaña A",
    segmentoSocioeconomico: "A",
    lugarResidencia: "Nacional",
    aplicaLineaCredito: "Sí",
    limiteCreditoMax: 50000,
    rangoMontoComprasMin: 50000,
    rangoAntiguedadMesesMin: 24,
    estadoCatalogo: "DISPONIBLE",
  },
  {
    id: 2,
    idTipoCliente: "T-CL-002",
    categoriaPerfil: "Normal",
    origenAfiliacion: "Orgánico",
    segmentoSocioeconomico: "C",
    lugarResidencia: "Nacional",
    aplicaLineaCredito: "No",
    limiteCreditoMax: 0,
    rangoMontoComprasMin: 0,
    rangoAntiguedadMesesMin: 0,
    estadoCatalogo: "DISPONIBLE",
  },
  {
    id: 3,
    idTipoCliente: "T-CL-003",
    categoriaPerfil: "Corporativo",
    origenAfiliacion: "Convenio",
    segmentoSocioeconomico: "B",
    lugarResidencia: "Extranjero",
    aplicaLineaCredito: "Sí",
    limiteCreditoMax: 5000,
    rangoMontoComprasMin: 10000,
    rangoAntiguedadMesesMin: 60,
    estadoCatalogo: "NO DISPONIBLE",
  },
];

const serviciosData = [
  { id: 1, codigo: "SRV-001", descripcion: "Transporte Interprovincial de Pasajeros", condicionesEspeciales: "No", estado: "Activo"   },
  { id: 2, codigo: "SRV-002", descripcion: "Transporte de Carga General",             condicionesEspeciales: "No", estado: "Activo"   },
  { id: 3, codigo: "SRV-003", descripcion: "Transporte de Carga Refrigerada",         condicionesEspeciales: "Sí", estado: "Activo"   },
  { id: 4, codigo: "SRV-004", descripcion: "Transporte Ejecutivo VIP",                condicionesEspeciales: "No", estado: "Activo"   },
  { id: 5, codigo: "SRV-005", descripcion: "Transporte de Materiales Peligrosos",     condicionesEspeciales: "Sí", estado: "Inactivo" },
];

const rutasData = [
  { id: 1, origen: "Lima",     destino: "Arequipa", puntosIntermedios: "Nazca, Ica",         restricciones: "Carga máx. 20t",             distanciaKm: 1030, estado: "Activo"   },
  { id: 2, origen: "Lima",     destino: "Cusco",    puntosIntermedios: "Abancay",            restricciones: "Sin carga peligrosa",        distanciaKm: 1107, estado: "Activo"   },
  { id: 3, origen: "Lima",     destino: "Trujillo", puntosIntermedios: "Chimbote",           restricciones: "-",                          distanciaKm: 557,  estado: "Activo"   },
  { id: 4, origen: "Arequipa", destino: "Cusco",    puntosIntermedios: "-",                  restricciones: "Clima andino: verificar",    distanciaKm: 521,  estado: "Activo"   },
  { id: 5, origen: "Lima",     destino: "Piura",    puntosIntermedios: "Trujillo, Chiclayo", restricciones: "Carga máx. 15t",             distanciaKm: 983,  estado: "Activo"   },
  { id: 6, origen: "Lima",     destino: "Puno",     puntosIntermedios: "Arequipa",           restricciones: "Altitud: equipo especial",   distanciaKm: 1348, estado: "Inactivo" },
];

const horariosData = [
  { id: 1, codigoHorario: "HOR-001", codigoServicio: "SRV-001", codigoRuta: "RUT-001", diasOperacion: "LU, MI, VI",    horaSalida: "08:00", frecuencia: "Semanal",  capacidad: 45, estado: "Activo"   },
  { id: 2, codigoHorario: "HOR-002", codigoServicio: "SRV-001", codigoRuta: "RUT-001", diasOperacion: "MA, JU, SA",    horaSalida: "20:00", frecuencia: "Semanal",  capacidad: 45, estado: "Activo"   },
  { id: 3, codigoHorario: "HOR-003", codigoServicio: "SRV-001", codigoRuta: "RUT-002", diasOperacion: "LU, VI",        horaSalida: "06:00", frecuencia: "Semanal",  capacidad: 40, estado: "Activo"   },
  { id: 4, codigoHorario: "HOR-004", codigoServicio: "SRV-002", codigoRuta: "RUT-003", diasOperacion: "LU a SA",       horaSalida: "10:00", frecuencia: "Diaria",   capacidad: 20, estado: "Activo"   },
  { id: 5, codigoHorario: "HOR-005", codigoServicio: "SRV-004", codigoRuta: "RUT-001", diasOperacion: "VI, SA, DO",    horaSalida: "09:00", frecuencia: "Fin de semana", capacidad: 18, estado: "Activo"   },
  { id: 6, codigoHorario: "HOR-006", codigoServicio: "SRV-003", codigoRuta: "RUT-004", diasOperacion: "MI",            horaSalida: "14:00", frecuencia: "Semanal",  capacidad: 15, estado: "Inactivo" },
];

const tarifasData = [
  { id: 1, codigoTarifa: "TAR-001", servicio: "SRV-001", ruta: "Lima - Arequipa",   tipoCarga: "Pasajero",   precioBase: 95.00,  moneda: "PEN", unidadCobro: "Pasajero", recargos: "Equipaje > 20kg: +S/10", descuentos: "Tercera edad: -20%",    estado: "Activo"   },
  { id: 2, codigoTarifa: "TAR-002", servicio: "SRV-001", ruta: "Lima - Cusco",      tipoCarga: "Pasajero",   precioBase: 130.00, moneda: "PEN", unidadCobro: "Pasajero", recargos: "Temporada alta: +15%",   descuentos: "Estudiante: -10%",      estado: "Activo"   },
  { id: 3, codigoTarifa: "TAR-003", servicio: "SRV-002", ruta: "Lima - Trujillo",   tipoCarga: "Carga Gral.",precioBase: 0.08,   moneda: "PEN", unidadCobro: "Kg",        recargos: "Volumen > 3m³: +S/50",   descuentos: "Contrato anual: -5%",   estado: "Activo"   },
  { id: 4, codigoTarifa: "TAR-004", servicio: "SRV-003", ruta: "Lima - Arequipa",   tipoCarga: "Refrigerada",precioBase: 0.18,   moneda: "PEN", unidadCobro: "Kg",        recargos: "Mantenimiento frío: +20%",descuentos: "-",                     estado: "Activo"   },
  { id: 5, codigoTarifa: "TAR-005", servicio: "SRV-004", ruta: "Lima - Arequipa",   tipoCarga: "Pasajero",   precioBase: 250.00, moneda: "PEN", unidadCobro: "Pasajero", recargos: "Servicio VIP incluido",  descuentos: "Corporativo: -15%",     estado: "Activo"   },
  { id: 6, codigoTarifa: "TAR-006", servicio: "SRV-005", ruta: "Lima - Piura",      tipoCarga: "Mat. Pelig.",precioBase: 0.35,   moneda: "PEN", unidadCobro: "Kg",        recargos: "Seguro especial: +30%",  descuentos: "-",                     estado: "Inactivo" },
];

const politicasData = [
  { id: 1, codigoPolitica: "POL-001", nombre: "Medios de Pago Aceptados",         tipoPolitica: "Pago",         variableControlada: "Instrumento de pago", valorPermitido: "Efectivo, VISA, Mastercard", codigoServicio: "-",      canal: "Todos",       estado: "Activo"   },
  { id: 2, codigoPolitica: "POL-002", nombre: "Canal de Atención VIP",            tipoPolitica: "Canal",        variableControlada: "Canal de venta",      valorPermitido: "Presencial, Web",           codigoServicio: "SRV-004", canal: "Presencial",  estado: "Activo"   },
  { id: 3, codigoPolitica: "POL-003", nombre: "Restricción Carga Peligrosa",      tipoPolitica: "Operativa",    variableControlada: "Tipo de carga",       valorPermitido: "Solo SRV-005",              codigoServicio: "SRV-005", canal: "-",           estado: "Activo"   },
  { id: 4, codigoPolitica: "POL-004", nombre: "Política de Cancelación",          tipoPolitica: "Comercial",    variableControlada: "Tiempo de cancelación",valorPermitido: "> 24h antes del viaje",    codigoServicio: "SRV-001", canal: "Todos",       estado: "Activo"   },
  { id: 5, codigoPolitica: "POL-005", nombre: "Pago Anticipado Carga",            tipoPolitica: "Pago",         variableControlada: "Momento de pago",     valorPermitido: "100% al reservar",          codigoServicio: "SRV-002", canal: "Web",         estado: "Activo"   },
  { id: 6, codigoPolitica: "POL-006", nombre: "Capacidad Máxima Embarque",        tipoPolitica: "Operativa",    variableControlada: "Ocupación",           valorPermitido: "Máximo 100% capacidad",     codigoServicio: "-",       canal: "-",           estado: "Activo"   },
];

const reglasData = [
  { id: 1, codigoRegla: "RGL-001", nombre: "Descuento por Volumen",       evento: "Cierre de venta",    variable: "Total compra (S/)",    operador: "GT",  valorComparacion: "500",  accion: "Aplicar descuento",        valorAccion: "10%",    prioridad: 1, estado: "Activo"   },
  { id: 2, codigoRegla: "RGL-002", nombre: "Recargo Temporada Alta",      evento: "Reserva de ticket",  variable: "Fecha de viaje",       operador: "IN",  valorComparacion: "Jul, Dic, Ene", accion: "Aplicar recargo",   valorAccion: "15%",    prioridad: 2, estado: "Activo"   },
  { id: 3, codigoRegla: "RGL-003", nombre: "Descuento Tercera Edad",      evento: "Emisión de ticket",  variable: "Edad del pasajero",    operador: "GTE", valorComparacion: "65",   accion: "Aplicar descuento",        valorAccion: "20%",    prioridad: 1, estado: "Activo"   },
  { id: 4, codigoRegla: "RGL-004", nombre: "Alerta Baja Ocupación",       evento: "Programación viaje", variable: "% Ocupación",          operador: "LT",  valorComparacion: "30",   accion: "Generar alerta",           valorAccion: "Notif. gerencial", prioridad: 3, estado: "Activo"   },
  { id: 5, codigoRegla: "RGL-005", nombre: "Bloqueo Sobrepeso",           evento: "Check-in embarque",  variable: "Peso equipaje (kg)",   operador: "GT",  valorComparacion: "30",   accion: "Bloquear embarque",        valorAccion: "Error + cobro extra", prioridad: 1, estado: "Activo" },
  { id: 6, codigoRegla: "RGL-006", nombre: "Descuento Estudiante",        evento: "Reserva de ticket",  variable: "Tipo de pasajero",     operador: "EQ",  valorComparacion: "Estudiante", accion: "Aplicar descuento",   valorAccion: "10%",    prioridad: 2, estado: "Activo"   },
  { id: 7, codigoRegla: "RGL-007", nombre: "Recargo Equipaje Extra",      evento: "Check-in embarque",  variable: "Peso equipaje (kg)",   operador: "GT",  valorComparacion: "20",   accion: "Cobrar recargo",           valorAccion: "S/10 por kg extra", prioridad: 1, estado: "Activo" },
];

const protocolosData = [
  { id: 1, codigoProtocolo: "PRO-001", nombre: "Viaje Interprovincial Pasajeros", codigoServicio: "SRV-001", secuencia: 1, transaccion: "Reserva de Ticket",    descripcion: "Cliente selecciona fecha, ruta y asiento",             esObligatorio: "Sí", permiteSalto: "No",  estado: "Activo" },
  { id: 2, codigoProtocolo: "PRO-002", nombre: "Viaje Interprovincial Pasajeros", codigoServicio: "SRV-001", secuencia: 2, transaccion: "Orden de Pago",         descripcion: "Se genera la orden y se confirma medio de pago",        esObligatorio: "Sí", permiteSalto: "No",  estado: "Activo" },
  { id: 3, codigoProtocolo: "PRO-003", nombre: "Viaje Interprovincial Pasajeros", codigoServicio: "SRV-001", secuencia: 3, transaccion: "Emisión de Ticket",     descripcion: "Se emite el ticket físico o electrónico al pasajero",   esObligatorio: "Sí", permiteSalto: "No",  estado: "Activo" },
  { id: 4, codigoProtocolo: "PRO-004", nombre: "Viaje Interprovincial Pasajeros", codigoServicio: "SRV-001", secuencia: 4, transaccion: "Check-in y Embarque",   descripcion: "Validación de ticket y abordaje al vehículo",           esObligatorio: "Sí", permiteSalto: "No",  estado: "Activo" },
  { id: 5, codigoProtocolo: "PRO-005", nombre: "Viaje Interprovincial Pasajeros", codigoServicio: "SRV-001", secuencia: 5, transaccion: "Llegada y Cierre",      descripcion: "Confirmación de llegada y cierre del viaje",            esObligatorio: "Sí", permiteSalto: "No",  estado: "Activo" },
  { id: 6, codigoProtocolo: "PRO-006", nombre: "Transporte de Carga General",     codigoServicio: "SRV-002", secuencia: 1, transaccion: "Cotización",            descripcion: "Cliente solicita cotización por peso/volumen",          esObligatorio: "Sí", permiteSalto: "No",  estado: "Activo" },
  { id: 7, codigoProtocolo: "PRO-007", nombre: "Transporte de Carga General",     codigoServicio: "SRV-002", secuencia: 2, transaccion: "Recursos de Viaje",    descripcion: "Asignación de vehículo y conductores",                  esObligatorio: "Sí", permiteSalto: "No",  estado: "Activo" },
  { id: 8, codigoProtocolo: "PRO-008", nombre: "Transporte de Carga General",     codigoServicio: "SRV-002", secuencia: 3, transaccion: "Orden de Pago",         descripcion: "Pago total o parcial según política",                   esObligatorio: "Sí", permiteSalto: "Sí",  estado: "Activo" },
  { id: 9, codigoProtocolo: "PRO-009", nombre: "Transporte de Carga General",     codigoServicio: "SRV-002", secuencia: 4, transaccion: "Llegada y Cierre",      descripcion: "Confirmación de entrega y cierre del servicio",         esObligatorio: "Sí", permiteSalto: "No",  estado: "Activo" },
];




const estadoBadge = (estado: string) => (
  <span
    className={`px-2 py-1 text-xs font-medium rounded-full ${
      estado === "Activo"
        ? "bg-emerald-100 text-emerald-700"
        : estado === "Inactivo"
        ? "bg-slate-100 text-slate-500"
        : "bg-amber-100 text-amber-700"
    }`}
  >
    {estado}
  </span>
);

const siNoBadge = (val: string) => (
  <span
    className={`px-2 py-1 text-xs font-medium rounded-full ${
      val === "Sí" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"
    }`}
  >
    {val}
  </span>
);

interface FormField {
  key: string;
  label: string;
  type: "text" | "select" | "number" | "textarea";
  options?: string[];
  allowCustom?: boolean;
  optional?: boolean;
  placeholder?: string;
}



function getCategoryColumns(cat: string): any[] {
  switch (cat) {
    case "vehiculos":
      return [
        { key: "idTipoVehiculo",     label: "Código", sortable: true },
        { key: "claseVehiculo",      label: "Clase" },
        { key: "marca",              label: "Marca" },
        { key: "modelo",             label: "Modelo", sortable: true },
        { key: "capacidadPasajeros", label: "Cap. Pasajeros", sortable: true },
        { key: "pesoMaxCargaKg",     label: "Peso Máx (Kg)", sortable: true },
        { key: "volumenMaxBodegaM3", label: "Volumen Máx (m³)", sortable: true },
        { key: "tipoInsumo",         label: "Tipo Insumo" },
        { key: "terrenoSoportado",   label: "Terreno" },
        { key: "tieneRefrigeracion", label: "Refrigeración", render: (i: any) => siNoBadge(i.tieneRefrigeracion) },
        { key: "estadoCatalogo",     label: "Estado", render: (i: any) => <span className="font-medium">{i.estadoCatalogo}</span> },
      ];
    case "operarios":
      return [
        { key: "idTipoOperario",           label: "Código", sortable: true },
        { key: "rolFuncion",              label: "Rol/Función", sortable: true },
        { key: "tipoAsignacion",          label: "Asignación" },
        { key: "categoriaContractual",    label: "Contrato" },
        { key: "licenciaRequerida",       label: "Licencia" },
        { key: "habilitadoCargaPeligrosa",label: "Carga Peligrosa", render: (i: any) => siNoBadge(i.habilitadoCargaPeligrosa) },
        { key: "habilitadoCargaValorada", label: "Carga Valorada", render: (i: any) => siNoBadge(i.habilitadoCargaValorada) },
        { key: "alcanceRuta",             label: "Alcance" },
        { key: "modalidadCosteo",         label: "Costeo" },
        { key: "estadoCatalogo",          label: "Estado", render: (i: any) => <span className="font-medium">{i.estadoCatalogo}</span> },
      ];
    case "sedes":
      return [
        { key: "idTipoSede",     label: "Código", sortable: true },
        { key: "claseSede",      label: "Clase" },
        { key: "categoriaPlaza", label: "Categoría" },
        { key: "paisOperacion",  label: "País" },
        { key: "regionCiudad",   label: "Región/Ciudad" },
        { key: "estadoCatalogo", label: "Estado", render: (i: any) => <span className="font-medium">{i.estadoCatalogo}</span> },
      ];
    case "contenedores":
      return [
        { key: "idTipoContenedor",          label: "Código", sortable: true },
        { key: "claseContenedor",          label: "Clase" },
        { key: "capacidadVolumenMaxM3",    label: "Volumen Máx (m³)", sortable: true },
        { key: "capacidadPesoMaxTon",      label: "Peso Máx (Ton)", sortable: true },
        { key: "nivelPeligrosidadSoportada",label: "Peligrosidad" },
        { key: "nivelRefrigeracion",       label: "Refrigeración", render: (i: any) => siNoBadge(i.nivelRefrigeracion) },
        { key: "estadoCatalogo",           label: "Estado", render: (i: any) => <span className="font-medium">{i.estadoCatalogo}</span> },
      ];
    case "bienes":
      return [
        { key: "idTipoBien",        label: "Código", sortable: true },
        { key: "claseBienNaturaleza",label: "Clase" },
        { key: "unidadMedidaBase",  label: "UM Base" },
        { key: "nivelPeligrosidad", label: "Peligrosidad" },
        { key: "requiereCadenaFrio",label: "Cadena Frío", render: (i: any) => siNoBadge(i.requiereCadenaFrio) },
        { key: "estadoCatalogo",    label: "Estado", render: (i: any) => <span className="font-medium">{i.estadoCatalogo}</span> },
      ];
    case "unidades":
      return [
        { key: "idUnidadMedida",      label: "Código", sortable: true },
        { key: "magnitudFisica",      label: "Magnitud" },
        { key: "nombreUnidad",        label: "Nombre" },
        { key: "abreviatura",         label: "Abrev." },
        { key: "esUnidadBase",        label: "Unidad Base", render: (i: any) => siNoBadge(i.esUnidadBase) },
        { key: "factorConversionBase",label: "Factor", sortable: true },
        { key: "estadoCatalogo",      label: "Estado", render: (i: any) => <span className="font-medium">{i.estadoCatalogo}</span> },
      ];
    case "clientes":
      return [
        { key: "idTipoCliente",           label: "Código", sortable: true },
        { key: "categoriaPerfil",         label: "Perfil", sortable: true },
        { key: "origenAfiliacion",        label: "Origen Afiliación" },
        { key: "segmentoSocioeconomico",  label: "Segmento" },
        { key: "lugarResidencia",         label: "Residencia" },
        { key: "aplicaLineaCredito",      label: "Línea Crédito", render: (i: any) => siNoBadge(i.aplicaLineaCredito) },
        { key: "limiteCreditoMax",        label: "Límite Crédito Máx", sortable: true },
        { key: "rangoMontoComprasMin",    label: "Monto Compras Min", sortable: true },
        { key: "rangoAntiguedadMesesMin", label: "Antigüedad Min (meses)", sortable: true },
        { key: "estadoCatalogo",          label: "Estado", render: (i: any) => <span className="font-medium">{i.estadoCatalogo}</span> },
      ];
    case "servicios":
      return [
        { key: "codigo",                label: "Código",      sortable: true },
        { key: "descripcion",           label: "Descripción", sortable: true },
        { key: "condicionesEspeciales", label: "Cond. Especiales", render: (i: any) => siNoBadge(i.condicionesEspeciales) },
        { key: "estado",                label: "Estado",      render: (i: any) => estadoBadge(i.estado) },
      ];
    case "rutas":
      return [
        { key: "origen",           label: "Origen",      sortable: true },
        { key: "destino",          label: "Destino",     sortable: true },
        { key: "puntosIntermedios",label: "Puntos Intermedios" },
        { key: "restricciones",    label: "Restricciones" },
        { key: "distanciaKm",      label: "Distancia (km)", sortable: true },
        { key: "estado",           label: "Estado",      render: (i: any) => estadoBadge(i.estado) },
      ];
    case "horarios":
      return [
        { key: "codigoHorario",   label: "Código Horario" },
        { key: "codigoServicio",  label: "Servicio" },
        { key: "codigoRuta",      label: "Ruta" },
        { key: "diasOperacion",   label: "Días" },
        { key: "horaSalida",      label: "Hora Salida", sortable: true },
        { key: "frecuencia",      label: "Frecuencia" },
        { key: "capacidad",       label: "Capacidad" },
        { key: "estado",          label: "Estado", render: (i: any) => estadoBadge(i.estado) },
      ];
    case "tarifarios":
      return [
        { key: "codigoTarifa", label: "Código" },
        { key: "servicio",     label: "Servicio" },
        { key: "ruta",         label: "Ruta" },
        { key: "tipoCarga",    label: "Tipo Carga" },
        { key: "precioBase",   label: "Precio Base", sortable: true, render: (i: any) => `${i.moneda} ${Number(i.precioBase).toFixed(2)}` },
        { key: "unidadCobro",  label: "Unidad Cobro" },
        { key: "descuentos",   label: "Descuentos" },
        { key: "estado",       label: "Estado", render: (i: any) => estadoBadge(i.estado) },
      ];
    case "politicas":
      return [
        { key: "codigoPolitica",    label: "Código" },
        { key: "nombre",            label: "Nombre",    sortable: true },
        { key: "tipoPolitica",      label: "Tipo" },
        { key: "variableControlada",label: "Variable" },
        { key: "valorPermitido",    label: "Valor Permitido" },
        { key: "canal",             label: "Canal" },
        { key: "estado",            label: "Estado", render: (i: any) => estadoBadge(i.estado) },
      ];
    case "reglas":
      return [
        { key: "codigoRegla", label: "Código" },
        { key: "nombre",      label: "Nombre",   sortable: true },
        { key: "evento",      label: "Evento" },
        { key: "variable",    label: "Variable" },
        { key: "operador",    label: "Operador", render: (i: any) => <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">{i.operador}</span> },
        { key: "valorComparacion", label: "Valor" },
        { key: "accion",      label: "Acción" },
        { key: "prioridad",   label: "Prioridad", sortable: true },
        { key: "estado",      label: "Estado", render: (i: any) => estadoBadge(i.estado) },
      ];
    case "protocolos":
      return [
        { key: "codigoProtocolo", label: "Código" },
        { key: "nombre",          label: "Protocolo",  sortable: true },
        { key: "codigoServicio",  label: "Servicio" },
        { key: "secuencia",       label: "Sec.", sortable: true },
        { key: "transaccion",     label: "Transacción / Etapa" },
        { key: "descripcion",     label: "Descripción" },
        { key: "esObligatorio",   label: "Obligatorio", render: (i: any) => siNoBadge(i.esObligatorio) },
        { key: "permiteSalto",    label: "Permite Salto", render: (i: any) => siNoBadge(i.permiteSalto) },
        { key: "estado",          label: "Estado", render: (i: any) => estadoBadge(i.estado) },
      ];
    default:
      return [];
  }
}

function getCategoryData(cat: string): any[] {
  switch (cat) {
    case "vehiculos":   return vehiculosData;
    case "operarios":   return operariosData;
    case "sedes":       return sedesData;
    case "contenedores":return contenedoresData;
    case "bienes":      return bienesData;
    case "unidades":    return unidadesData;
    case "clientes":    return clientesData;
    case "servicios":   return serviciosData;
    case "rutas":       return rutasData;
    case "horarios":    return horariosData;
    case "tarifarios":  return tarifasData;
    case "politicas":   return politicasData;
    case "reglas":      return reglasData;
    case "protocolos":  return protocolosData;
    default:            return [];
  }
}

function getCategoryFormFields(cat: string): FormField[] {
  switch (cat) {
    case "vehiculos":
      return [
        { key: "idTipoVehiculo",      label: "ID Tipo Vehículo",         type: "text",   placeholder: "Ej: T-VE-001" },
        { key: "claseVehiculo",       label: "Clase Vehículo",           type: "select", options: vehiculosSelects.claseVehiculo, allowCustom: true },
        { key: "marca",               label: "Marca",                    type: "text",   placeholder: "Ej: Volvo" },
        { key: "modelo",              label: "Modelo",                   type: "text",   placeholder: "Ej: Scania 1800" },
        { key: "capacidadPasajeros",  label: "Capacidad Pasajeros",      type: "number", placeholder: "Ej: 40" },
        { key: "pesoMaxCargaKg",      label: "Peso Máx. Carga (Kg)",     type: "number", placeholder: "Ej: 1000" },
        { key: "volumenMaxBodegaM3",  label: "Volumen Máx. Bodega (m³)", type: "number", placeholder: "Ej: 15" },
        { key: "tipoInsumo",          label: "Tipo Insumo",              type: "select", options: vehiculosSelects.tipoInsumo, allowCustom: true },
        { key: "capacidadTanque",     label: "Capacidad Tanque",         type: "number", placeholder: "Ej: 70" },
        { key: "rendimientoConsumo",  label: "Rendimiento Consumo",      type: "text",   placeholder: "Ej: 4 L/100km" },
        { key: "terrenoSoportado",    label: "Terreno Soportado",        type: "select", options: vehiculosSelects.terrenoSoportado, allowCustom: true },
        { key: "tieneRefrigeracion",  label: "Tiene Refrigeración",      type: "select", options: ["Sí","No"] },
        { key: "temperaturaMinima",   label: "Temperatura Mínima (°C)",  type: "number", optional: true, placeholder: "Ej: -18" },
        { key: "nivelBlindaje",       label: "Nivel Blindaje",           type: "select", options: vehiculosSelects.nivelBlindaje, optional: true },
        { key: "estadoCatalogo",      label: "Estado Catálogo",          type: "select", options: estadoCatalogoOptions },
      ];
    case "operarios":
      return [
        { key: "idTipoOperario",           label: "ID Tipo Operario",            type: "text",   placeholder: "Ej: T-OP-001" },
        { key: "rolFuncion",              label: "Rol/Función",                  type: "select", options: operariosSelects.rolFuncion, allowCustom: true },
        { key: "tipoAsignacion",          label: "Tipo Asignación",              type: "select", options: operariosSelects.tipoAsignacion, allowCustom: true },
        { key: "especialidad",            label: "Especialidad",                 type: "select", options: operariosSelects.especialidad, allowCustom: true, optional: true },
        { key: "categoriaContractual",    label: "Categoría Contractual",        type: "select", options: operariosSelects.categoriaContractual, allowCustom: true },
        { key: "licenciaRequerida",       label: "Licencia Requerida",           type: "select", options: operariosSelects.licenciaRequerida },
        { key: "habilitadoCargaPeligrosa",label: "Habilitado Carga Peligrosa",   type: "select", options: ["Sí","No"] },
        { key: "habilitadoCargaValorada", label: "Habilitado Carga Valorada",    type: "select", options: ["Sí","No"] },
        { key: "alcanceRuta",             label: "Alcance Ruta",                 type: "select", options: operariosSelects.alcanceRuta, allowCustom: true },
        { key: "modalidadCosteo",         label: "Modalidad Costeo",             type: "select", options: operariosSelects.modalidadCosteo, allowCustom: true },
        { key: "estadoCatalogo",          label: "Estado Catálogo",              type: "select", options: estadoCatalogoOptions },
      ];
    case "sedes":
      return [
        { key: "idTipoSede",             label: "ID Tipo Sede",                 type: "text",   placeholder: "Ej: T-SE-001" },
        { key: "claseSede",              label: "Clase Sede",                   type: "select", options: sedesSelects.claseSede, allowCustom: true },
        { key: "categoriaPlaza",         label: "Categoría Plaza",              type: "select", options: sedesSelects.categoriaPlaza, allowCustom: true },
        { key: "paisOperacion",          label: "País Operación",               type: "select", options: sedesSelects.paisOperacion, allowCustom: true },
        { key: "regionCiudad",           label: "Región/Ciudad",                type: "select", options: sedesSelects.regionCiudad, allowCustom: true },
        { key: "tieneEmbarquePasajeros", label: "Tiene Embarque Pasajeros",     type: "select", options: ["Sí","No"] },
        { key: "tienePatioCarga",        label: "Tiene Patio Carga",            type: "select", options: ["Sí","No"] },
        { key: "tieneAlmacenFrio",       label: "Tiene Almacén Frío",           type: "select", options: ["Sí","No"] },
        { key: "nivelSeguridadAduana",   label: "Nivel Seguridad Aduana",       type: "select", options: sedesSelects.nivelSeguridadAduana, allowCustom: true },
        { key: "capacidadFlotaVehicular",label: "Capacidad Flota Vehicular",    type: "number", placeholder: "Ej: 15" },
        { key: "estadoCatalogo",         label: "Estado Catálogo",              type: "select", options: estadoCatalogoOptions },
      ];
    case "contenedores":
      return [
        { key: "idTipoContenedor",           label: "ID Tipo Contenedor",           type: "text",   placeholder: "Ej: T-CO-001" },
        { key: "claseContenedor",           label: "Clase Contenedor",             type: "select", options: contenedoresSelects.claseContenedor, allowCustom: true },
        { key: "capacidadVolumenMaxM3",     label: "Capacidad Volumen Máx (m³)",   type: "number", placeholder: "Ej: 10.2" },
        { key: "capacidadPesoMaxTon",       label: "Capacidad Peso Máx (Ton)",     type: "number", placeholder: "Ej: 2.5" },
        { key: "nivelPeligrosidadSoportada",label: "Nivel Peligrosidad Soportada", type: "select", options: contenedoresSelects.nivelPeligrosidadSoportada, allowCustom: true },
        { key: "nivelRefrigeracion",        label: "Nivel Refrigeración",          type: "select", options: ["Sí","No"] },
        { key: "temperaturaMinima",         label: "Temperatura Mínima (°C)",      type: "number", optional: true, placeholder: "Ej: -10" },
        { key: "materialRevestimiento",     label: "Material Revestimiento",      type: "select", options: contenedoresSelects.materialRevestimiento, allowCustom: true },
        { key: "estadoCatalogo",            label: "Estado Catálogo",              type: "select", options: estadoCatalogoOptions },
      ];
    case "bienes":
      return [
        { key: "idTipoBien",             label: "ID Tipo Bien",             type: "text",   placeholder: "Ej: T-BI-001" },
        { key: "claseBienNaturaleza",    label: "Clase Bien / Naturaleza",  type: "select", options: bienesSelects.claseBienNaturaleza, allowCustom: true },
        { key: "unidadMedidaBase",       label: "Unidad Medida Base",       type: "select", options: bienesSelects.unidadMedidaBase, allowCustom: true },
        { key: "nivelPeligrosidad",      label: "Nivel Peligrosidad",       type: "select", options: bienesSelects.nivelPeligrosidad, allowCustom: true },
        { key: "requiereCadenaFrio",     label: "Requiere Cadena Frío",     type: "select", options: ["Sí","No"] },
        { key: "temperaturaExigida",     label: "Temperatura Exigida (°C)", type: "number", optional: true, placeholder: "Ej: -18" },
        { key: "esCargaValorada",        label: "Es Carga Valorada",        type: "select", options: ["Sí","No"] },
        { key: "requiereEstibaEspecial", label: "Requiere Estiba Especial", type: "select", options: ["Sí","No"] },
        { key: "aplicaSeguroObligatorio",label: "Aplica Seguro Obligatorio",type: "select", options: ["Sí","No"] },
        { key: "estadoCatalogo",         label: "Estado Catálogo",          type: "select", options: estadoCatalogoOptions },
      ];
    case "unidades":
      return [
        { key: "idUnidadMedida",        label: "ID Unidad Medida",       type: "text",   placeholder: "Ej: T-UM-001" },
        { key: "magnitudFisica",        label: "Magnitud Física",        type: "select", options: unidadesSelects.magnitudFisica, allowCustom: true },
        { key: "nombreUnidad",          label: "Nombre Unidad",          type: "text",   placeholder: "Ej: Kilogramo" },
        { key: "abreviatura",           label: "Abreviatura",            type: "text",   placeholder: "Ej: KG" },
        { key: "esUnidadBase",          label: "Es Unidad Base",         type: "select", options: ["Sí","No"] },
        { key: "factorConversionBase",  label: "Factor Conversión Base", type: "number", placeholder: "Ej: 1" },
        { key: "estadoCatalogo",        label: "Estado Catálogo",        type: "select", options: estadoCatalogoOptions },
      ];
    case "clientes":
      return [
        { key: "idTipoCliente",           label: "ID Tipo Cliente",           type: "text",   placeholder: "Ej: T-CL-001" },
        { key: "categoriaPerfil",         label: "Categoría Perfil",         type: "select", options: clientesSelects.categoriaPerfil, allowCustom: true },
        { key: "origenAfiliacion",        label: "Origen Afiliación",        type: "select", options: clientesSelects.origenAfiliacion, allowCustom: true },
        { key: "segmentoSocioeconomico",  label: "Segmento Socioeconómico",  type: "select", options: clientesSelects.segmentoSocioeconomico },
        { key: "lugarResidencia",         label: "Lugar Residencia",         type: "select", options: clientesSelects.lugarResidencia, allowCustom: true },
        { key: "aplicaLineaCredito",      label: "Aplica Línea Crédito",     type: "select", options: ["Sí","No"] },
        { key: "limiteCreditoMax",        label: "Límite Crédito Máx",       type: "select", options: clientesSelects.limiteCreditoMax },
        { key: "rangoMontoComprasMin",    label: "Rango Monto Compras Min",  type: "select", options: clientesSelects.rangoMontoComprasMin },
        { key: "rangoAntiguedadMesesMin", label: "Rango Antigüedad Min (meses)", type: "select", options: clientesSelects.rangoAntiguedadMesesMin },
        { key: "estadoCatalogo",          label: "Estado Catálogo",          type: "select", options: estadoCatalogoOptions },
      ];
    case "servicios":
      return [
        { key: "codigo",                label: "Código de Servicio",           type: "text",   optional: true,  placeholder: "Ej: SRV-006" },
        { key: "descripcion",           label: "Descripción",                  type: "text",   placeholder: "Ej: Transporte de Encomiendas" },
        { key: "condicionesEspeciales", label: "Requiere Condiciones Especiales", type: "select", options: ["No", "Sí"] },
        { key: "estado",                label: "Estado",                       type: "select", options: ["Activo", "Inactivo"] },
      ];
    case "rutas":
      return [
        { key: "origen",            label: "Origen",                   type: "text",     placeholder: "Ciudad de origen" },
        { key: "destino",           label: "Destino",                  type: "text",     placeholder: "Ciudad de destino" },
        { key: "puntosIntermedios", label: "Puntos Intermedios",       type: "text",     optional: true, placeholder: "Ej: Nazca, Ica" },
        { key: "restricciones",     label: "Restricciones",            type: "textarea", optional: true, placeholder: "Ej: Carga máx. 20t, sin materiales peligrosos" },
        { key: "distanciaKm",       label: "Distancia (km)",           type: "number",   placeholder: "0" },
        { key: "estado",            label: "Estado",                   type: "select",   options: ["Activo", "Inactivo"] },
      ];
    case "horarios":
      return [
        { key: "codigoHorario",  label: "Código de Horario",   type: "text",   placeholder: "Ej: HOR-007" },
        { key: "codigoServicio", label: "Código de Servicio",  type: "select", options: ["SRV-001","SRV-002","SRV-003","SRV-004","SRV-005"] },
        { key: "codigoRuta",     label: "Código de Ruta",      type: "select", options: ["RUT-001","RUT-002","RUT-003","RUT-004","RUT-005","RUT-006"] },
        { key: "diasOperacion",  label: "Día(s) de Operación", type: "text",   placeholder: "Ej: LU, MI, VI" },
        { key: "horaSalida",     label: "Hora de Salida",      type: "text",   placeholder: "Ej: 08:00" },
        { key: "frecuencia",     label: "Frecuencia",          type: "select", options: ["Diaria","Semanal","Interdiaria","Fin de semana"], optional: true },
        { key: "capacidad",      label: "Capacidad",           type: "number", optional: true, placeholder: "Nro. pasajeros o toneladas" },
        { key: "estado",         label: "Estado",              type: "select", options: ["Activo","Inactivo"] },
      ];
    case "tarifarios":
      return [
        { key: "codigoTarifa", label: "Código de Tarifa",         type: "text",   placeholder: "Ej: TAR-007" },
        { key: "servicio",     label: "Servicio Asociado",        type: "select", options: ["SRV-001","SRV-002","SRV-003","SRV-004","SRV-005"] },
        { key: "ruta",         label: "Ruta / Zona Asociada",     type: "text",   placeholder: "Ej: Lima - Arequipa" },
        { key: "tipoCarga",    label: "Tipo de Carga",            type: "select", options: ["Pasajero","Carga Gral.","Refrigerada","Mat. Pelig.","Encomienda"], optional: true },
        { key: "precioBase",   label: "Precio Base",              type: "number", placeholder: "0.00" },
        { key: "moneda",       label: "Moneda",                   type: "select", options: ["PEN","USD","EUR"] },
        { key: "unidadCobro",  label: "Unidad de Cobro",         type: "select", options: ["Pasajero","Kg","Volumen (m³)","Unidad"] },
        { key: "recargos",     label: "Recargos Configurables",   type: "textarea", optional: true, placeholder: "Ej: Temporada alta: +15%" },
        { key: "descuentos",   label: "Descuentos Configurables", type: "textarea", optional: true, placeholder: "Ej: Tercera edad: -20%" },
        { key: "estado",       label: "Estado",                   type: "select", options: ["Activo","Inactivo"] },
      ];
    case "politicas":
      return [
        { key: "codigoPolitica",    label: "Código de Política",      type: "text",   placeholder: "Ej: POL-007" },
        { key: "nombre",            label: "Nombre",                   type: "text",   placeholder: "Nombre descriptivo" },
        { key: "tipoPolitica",      label: "Tipo de Política",         type: "select", options: ["Pago","Canal","Operativa","Comercial","Seguridad"] },
        { key: "variableControlada",label: "Variable Controlada",      type: "text",   placeholder: "Ej: Instrumento de pago" },
        { key: "valorPermitido",    label: "Valor Permitido / Restringido", type: "textarea", placeholder: "Ej: Solo VISA y Efectivo" },
        { key: "codigoServicio",    label: "Código de Servicio",       type: "select", options: ["-","SRV-001","SRV-002","SRV-003","SRV-004","SRV-005"], optional: true },
        { key: "canal",             label: "Canal",                    type: "select", options: ["Todos","Presencial","Web","App móvil"], optional: true },
        { key: "estado",            label: "Estado",                   type: "select", options: ["Activo","Inactivo"] },
      ];
    case "reglas":
      return [
        { key: "codigoRegla",     label: "Código de Regla",       type: "text",   placeholder: "Ej: RGL-008" },
        { key: "nombre",          label: "Nombre",                 type: "text",   placeholder: "Nombre descriptivo" },
        { key: "evento",          label: "Evento",                 type: "select", options: ["Reserva de ticket","Emisión de ticket","Cierre de venta","Check-in embarque","Programación viaje","Llegada y cierre"] },
        { key: "variable",        label: "Variable",               type: "text",   placeholder: "Ej: Total compra (S/)" },
        { key: "operador",        label: "Operador Lógico",        type: "select", options: ["GT (Mayor que)","GTE (Mayor o igual)","LT (Menor que)","LTE (Menor o igual)","EQ (Igual a)","NEQ (Distinto de)","IN (Contenido en)"] },
        { key: "valorComparacion",label: "Valor de Comparación",   type: "text",   placeholder: "Ej: 500" },
        { key: "accion",          label: "Acción",                 type: "select", options: ["Aplicar descuento","Aplicar recargo","Bloquear embarque","Generar alerta","Cobrar recargo","Notificar"] },
        { key: "valorAccion",     label: "Valor de Acción",        type: "text",   placeholder: "Ej: 10% o S/50" },
        { key: "prioridad",       label: "Prioridad",              type: "number", placeholder: "1 = mayor prioridad" },
        { key: "estado",          label: "Estado",                 type: "select", options: ["Activo","Inactivo"] },
      ];
    case "protocolos":
      return [
        { key: "codigoProtocolo", label: "Código de Protocolo",      type: "text",   placeholder: "Ej: PRO-010" },
        { key: "nombre",          label: "Nombre del Protocolo",      type: "text",   placeholder: "Ej: Viaje Interprovincial" },
        { key: "codigoServicio",  label: "Código de Servicio",        type: "select", options: ["-","SRV-001","SRV-002","SRV-003","SRV-004","SRV-005"], optional: true },
        { key: "secuencia",       label: "Secuencia (Orden)",         type: "number", placeholder: "Ej: 1" },
        { key: "transaccion",     label: "Transacción / Etapa",       type: "select", options: ["Cotización","Reserva de Ticket","Recursos de Viaje","Orden de Pago","Emisión de Ticket","Check-in y Embarque","Llegada y Cierre"] },
        { key: "descripcion",     label: "Descripción",               type: "textarea",placeholder: "Descripción de la etapa" },
        { key: "esObligatorio",   label: "Es Obligatorio",            type: "select", options: ["Sí","No"] },
        { key: "permiteSalto",    label: "Permite Salto",             type: "select", options: ["No","Sí"] },
        { key: "estado",          label: "Estado",                    type: "select", options: ["Activo","Inactivo"] },
      ];
    default:
      return [];
  }
}


interface ModalProps {
  category: string;
  editingItem: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

function CatalogModal({ category, editingItem, onClose, onSave }: ModalProps) {
  const fields = getCategoryFormFields(category);
  const cat = categories.find((c) => c.id === category);

  const initialState: Record<string, any> = {};
  fields.forEach((f) => {
    initialState[f.key] = editingItem ? editingItem[f.key] : (f.type === "select" && f.options ? f.options[0] : "");
  });

  const [form, setForm] = useState<Record<string, any>>(initialState);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSave({ ...form, id: editingItem?.id || Date.now() });
  };

  if (fields.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {editingItem ? "Editar" : "Nuevo"} — {cat?.name}
            </h3>
            <p className="text-sm text-slate-500">Complete los campos del registro</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {field.label}
                {field.optional && <span className="ml-1 text-slate-400 font-normal"></span>}
              </label>

              {field.type === "select" ? (
                field.allowCustom ? (
                  <>
                    <input
                      list={`${category}-${field.key}-list`}
                      value={form[field.key] ?? ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <datalist id={`${category}-${field.key}-list`}>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt} />
                      ))}
                    </datalist>
                  </>
                ) : (
                  <select
                    value={form[field.key] ?? ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )
              ) : field.type === "textarea" ? (
                <textarea
                  value={form[field.key] ?? ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              ) : (
                <input
                  type={field.type}
                  value={form[field.key] ?? ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            {editingItem ? "Guardar Cambios" : "Registrar"}
          </button>
        </div>
      </div>
    </div>
  );
}



function EmptyState({ catName, onAdd }: { catName: string; onAdd: () => void }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
        <Plus className="w-8 h-8 text-slate-400" />
      </div>
      <div className="text-center">
        <p className="text-slate-700 font-semibold">No hay registros en {catName}</p>
        <p className="text-slate-500 text-sm mt-1">Agrega el primer elemento para comenzar.</p>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Agregar Registro
      </button>
    </div>
  );
}





export function ParamsMaintenance() {
  const [selectedCategory, setSelectedCategory] = useState("vehiculos");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [localData, setLocalData] = useState<Record<string, any[]>>({});

  const selectedCat = categories.find((c) => c.id === selectedCategory)!;
  const IconComponent = selectedCat.icon;

  const colorMap: Record<string, string> = {
    indigo:  "bg-indigo-50 text-indigo-700 border-indigo-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    purple:  "bg-purple-50 text-purple-700 border-purple-200",
    blue:    "bg-blue-50 text-blue-700 border-blue-200",
    amber:   "bg-amber-50 text-amber-700 border-amber-200",
    rose:    "bg-rose-50 text-rose-700 border-rose-200",
    cyan:    "bg-cyan-50 text-cyan-700 border-cyan-200",
    teal:    "bg-teal-50 text-teal-700 border-teal-200",
  };

  const getData = () => {
    const base = getCategoryData(selectedCategory);
    const extra = localData[selectedCategory] || [];
    return [...base, ...extra];
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSave = (data: any) => {
    setLocalData((prev) => {
      const existing = prev[selectedCategory] || [];
      if (editingItem) {
        return { ...prev, [selectedCategory]: existing.map((i) => (i.id === data.id ? data : i)) };
      }
      return { ...prev, [selectedCategory]: [...existing, data] };
    });
    setShowModal(false);
  };

  const columns = getCategoryColumns(selectedCategory);
  const data = getData();
  const hasForm = getCategoryFormFields(selectedCategory).length > 0;

  const menuSections = [
    { label: "Recursos", ids: ["vehiculos","operarios","sedes","contenedores","bienes","unidades","clientes"] },
    { label: "Comerciales",   ids: ["servicios","rutas","horarios","tarifarios"] },
    { label: "Normativos",    ids: ["politicas","reglas","protocolos"] },
  ];

  return (
    <div className="min-h-full bg-background">
      <PageHeader
        title="Mantenimiento de Parámetros"
        subtitle="Configure los catálogos maestros del sistema"
      />

      <div className="flex gap-6 p-8">
        <div className="w-60 flex-shrink-0 space-y-4">
          {menuSections.map((section) => (
            <div key={section.label}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.ids.map((id) => {
                  const cat = categories.find((c) => c.id === id)!;
                  const Icon = cat.icon;
                  const isActive = selectedCategory === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedCategory(id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? `${colorMap[cat.color]} border`
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-left">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          <div className={`flex items-center gap-3 mb-4 px-4 py-3 rounded-xl border ${colorMap[selectedCat.color]}`}>
            <div className="w-8 h-8 flex items-center justify-center">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">{selectedCat.name}</h2>
              <p className="text-xs opacity-70">{data.length} registro(s)</p>
            </div>
          </div>

          {columns.length === 0 ? (
            <EmptyState catName={selectedCat.name} onAdd={handleAdd} />
          ) : data.length === 0 ? (
            <EmptyState catName={selectedCat.name} onAdd={handleAdd} />
          ) : (
            <DataTable
              columns={columns}
              data={data}
              onRowClick={hasForm ? handleEdit : undefined}
              onAdd={hasForm ? handleAdd : undefined}
              onExport={() => {}}
              searchPlaceholder={`Buscar en ${selectedCat.name}...`}
              title={selectedCat.name}
            />
          )}
        </div>
      </div>

      {showModal && (
        <CatalogModal
          category={selectedCategory}
          editingItem={editingItem}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

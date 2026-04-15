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

const vehiculosData = [
  { id: 1, placa: "ABC-123", modelo: "Mercedes-Benz Sprinter", capacidad: 20, estado: "Activo",       ultimoMant: "10/04/2026" },
  { id: 2, placa: "XYZ-789", modelo: "Volvo 9700",             capacidad: 45, estado: "Activo",       ultimoMant: "05/04/2026" },
  { id: 3, placa: "DEF-456", modelo: "Scania K410",            capacidad: 52, estado: "Mantenimiento",ultimoMant: "01/04/2026" },
  { id: 4, placa: "GHI-321", modelo: "Mercedes-Benz O500",     capacidad: 48, estado: "Activo",       ultimoMant: "12/04/2026" },
  { id: 5, placa: "JKL-654", modelo: "Iveco Daily",            capacidad: 18, estado: "Activo",       ultimoMant: "08/04/2026" },
];

const operariosData = [
  { id: 1, nombre: "Carlos Mendoza",  dni: "12345678", cargo: "Conductor",  licencia: "A-IIIc", estado: "Activo"    },
  { id: 2, nombre: "Ana García",      dni: "87654321", cargo: "Copiloto",   licencia: "A-I",    estado: "Activo"    },
  { id: 3, nombre: "Luis Torres",     dni: "45678912", cargo: "Conductor",  licencia: "A-IIIb", estado: "Vacaciones"},
  { id: 4, nombre: "María Santos",    dni: "78912345", cargo: "Supervisor", licencia: "-",      estado: "Activo"    },
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
  optional?: boolean;
  placeholder?: string;
}



function getCategoryColumns(cat: string): any[] {
  switch (cat) {
    case "vehiculos":
      return [
        { key: "placa",      label: "Placa",    sortable: true },
        { key: "modelo",     label: "Modelo",   sortable: true },
        { key: "capacidad",  label: "Capacidad" },
        { key: "estado",     label: "Estado",   render: (i: any) => estadoBadge(i.estado) },
        { key: "ultimoMant", label: "Último Mantenimiento" },
      ];
    case "operarios":
      return [
        { key: "nombre",   label: "Nombre",   sortable: true },
        { key: "dni",      label: "DNI" },
        { key: "cargo",    label: "Cargo" },
        { key: "licencia", label: "Licencia" },
        { key: "estado",   label: "Estado",   render: (i: any) => estadoBadge(i.estado) },
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
                <select
                  value={form[field.key] ?? ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
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

import { useState } from "react";
import { PageHeader } from "../shared/PageHeader";
import {
  Shield,
  Users,
  Key,
  ClipboardList,
  Plus,
  X,
  Save,
  Check,
  Minus,
  Eye,
  FilePen,
  Search,
  Lock,
  Unlock,
  UserCircle,
  Clock,
  AlertCircle,
  CheckCircle2,
  Info,
  Ban,
  Zap,
  Download,
  PenLine,
  BookOpen,
  PlusCircle,
} from "lucide-react";

type Accion = "consultar" | "registrar" | "modificar" | "anular" | "ejecutar" | "exportar";

interface Permiso {
  consultar: boolean;
  registrar: boolean;
  modificar: boolean;
  anular: boolean;
  ejecutar: boolean;
  exportar: boolean;
}

const ACCION_META: Record<Accion, { label: string; icon: React.ReactNode; color: string }> = {
  consultar: { label: "Consultar", icon: <BookOpen   className="w-3.5 h-3.5" />, color: "text-blue-600"   },
  registrar: { label: "Registrar", icon: <PlusCircle className="w-3.5 h-3.5" />, color: "text-emerald-600"},
  modificar: { label: "Modificar", icon: <PenLine    className="w-3.5 h-3.5" />, color: "text-amber-600"  },
  anular:    { label: "Anular",    icon: <Ban        className="w-3.5 h-3.5" />, color: "text-red-500"    },
  ejecutar:  { label: "Ejecutar",  icon: <Zap        className="w-3.5 h-3.5" />, color: "text-purple-600" },
  exportar:  { label: "Exportar",  icon: <Download   className="w-3.5 h-3.5" />, color: "text-slate-500"  },
};

const ACCIONES_POR_MODULO: Record<string, Accion[]> = {
  "Dashboard Gerencial":     ["consultar", "exportar"],
  "Parámetros del Sistema":  ["consultar", "modificar"],
  "Desempeño Operarios":     ["consultar", "exportar"],
  "Desempeño Vehicular":     ["consultar", "exportar"],
  "Ingresos":                ["consultar", "exportar"],
  "Incidencias":             ["consultar", "registrar", "exportar"],
  "Indicadores KPI":         ["consultar", "exportar"],

  "Dashboard Operativo":     ["consultar", "exportar"],
  "Recursos de Viaje":       ["consultar", "registrar", "modificar", "anular"],
  "Reserva de Tickets":      ["consultar", "registrar", "modificar", "anular"],
  "Cotización":              ["consultar", "registrar", "modificar", "anular"],
  "Orden de Pago":           ["consultar", "registrar", "anular"],
  "Emisión de Ticket":       ["consultar", "registrar", "anular", "ejecutar"],

  "Check-in y Embarque":     ["consultar", "ejecutar", "anular"],
  "Llegada y Cierre":        ["consultar", "ejecutar", "modificar"],

  "Usuarios":                ["consultar", "registrar", "modificar", "anular"],
  "Roles y Permisos":        ["consultar", "registrar", "modificar", "anular"],
  "Auditoría":               ["consultar", "exportar"],
};

const TODAS_ACCIONES: Accion[] = ["consultar", "registrar", "modificar", "anular", "ejecutar", "exportar"];


const MODULOS_SISTEMA = [
  { grupo: "Gerencial",  items: ["Dashboard Gerencial", "Parámetros del Sistema", "Desempeño Operarios", "Desempeño Vehicular", "Ingresos", "Incidencias", "Indicadores KPI"] },
  { grupo: "Operativo",  items: ["Dashboard Operativo", "Recursos de Viaje", "Reserva de Tickets", "Cotización", "Orden de Pago", "Emisión de Ticket", "Check-in y Embarque", "Llegada y Cierre"] },
  { grupo: "Seguridad",  items: ["Usuarios", "Roles y Permisos", "Auditoría"] },
];
const TODOS_MODULOS = MODULOS_SISTEMA.flatMap((g) => g.items);


const pNone  = (): Permiso => ({ consultar: false, registrar: false, modificar: false, anular: false, ejecutar: false, exportar: false });
const pFull  = (): Permiso => ({ consultar: true,  registrar: true,  modificar: true,  anular: true,  ejecutar: true,  exportar: true  });

const pConsultar = (): Permiso => ({ ...pNone(), consultar: true });

const pLectura = (): Permiso => ({ ...pNone(), consultar: true, exportar: true });

const pVenta = (): Permiso => ({ ...pNone(), consultar: true, registrar: true, anular: true });

const pGestion = (): Permiso => ({ ...pNone(), consultar: true, registrar: true, modificar: true, anular: true });

const pCampo = (): Permiso => ({ ...pNone(), consultar: true, ejecutar: true });

function sanitize(mod: string, p: Permiso): Permiso {
  const aplicables = ACCIONES_POR_MODULO[mod] || [];
  const clean = { ...pNone() };
  for (const acc of aplicables) clean[acc] = p[acc];
  return clean;
}

function makePermisos(fn: (mod: string) => Permiso): Record<string, Permiso> {
  return Object.fromEntries(TODOS_MODULOS.map((m) => [m, sanitize(m, fn(m))]));
}


interface Rol {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  color: string;
  usuariosAsignados: number;
  estado: "Activo" | "Inactivo";
  permisos: Record<string, Permiso>;
}

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  username: string;
  rolId: number;
  estado: "Activo" | "Bloqueado" | "Inactivo";
  ultimoAcceso: string;
  creadoEn: string;
}

interface AuditLog {
  id: number;
  fecha: string;
  hora: string;
  usuario: string;
  accion: string;
  modulo: string;
  detalle: string;
  ip: string;
  resultado: "Exitoso" | "Fallido" | "Advertencia";
}


const rolesIniciales: Rol[] = [
  {
    id: 1, codigo: "ROL-001", nombre: "Administrador del Sistema", color: "red",
    descripcion: "Acceso total al sistema. Gestiona usuarios, roles, parámetros y toda la operación.",
    usuariosAsignados: 2, estado: "Activo",
    permisos: makePermisos(() => pFull()),
  },
  {
    id: 2, codigo: "ROL-002", nombre: "Gerente General", color: "indigo",
    descripcion: "Consulta y exportación de todos los módulos gerenciales y operativos. Sin acceso a configuración ni seguridad.",
    usuariosAsignados: 1, estado: "Activo",
    permisos: makePermisos((m) => {
      if (m === "Usuarios" || m === "Roles y Permisos") return pNone();
      if (m === "Parámetros del Sistema") return pConsultar();
      return pLectura();
    }),
  },
  {
    id: 3, codigo: "ROL-003", nombre: "Supervisor Operativo", color: "emerald",
    descripcion: "Gestión completa del módulo operativo: registra, modifica y anula transacciones. Consulta reportes gerenciales.",
    usuariosAsignados: 3, estado: "Activo",
    permisos: makePermisos((m) => {
      const operTx = ["Recursos de Viaje", "Reserva de Tickets", "Cotización", "Orden de Pago", "Emisión de Ticket", "Check-in y Embarque", "Llegada y Cierre"];
      if (operTx.includes(m)) return pGestion();
      if (m === "Dashboard Operativo") return pLectura();
      if (m === "Usuarios" || m === "Roles y Permisos") return pNone();
      return pLectura(); // gerencial
    }),
  },
  {
    id: 4, codigo: "ROL-004", nombre: "Agente de Ventas / Cajero", color: "amber",
    descripcion: "Registra y anula transacciones de venta: reservas, cotizaciones, órdenes de pago y emisión de tickets.",
    usuariosAsignados: 5, estado: "Activo",
    permisos: makePermisos((m) => {
      const ventas = ["Reserva de Tickets", "Cotización", "Orden de Pago", "Emisión de Ticket"];
      if (ventas.includes(m)) return pVenta();
      if (m === "Dashboard Operativo") return pConsultar();
      return pNone();
    }),
  },
  {
    id: 5, codigo: "ROL-005", nombre: "Operador de Embarque", color: "teal",
    descripcion: "Ejecuta operaciones de campo: check-in, embarque y llegada/cierre de viajes. Sin acceso a módulos de venta.",
    usuariosAsignados: 4, estado: "Activo",
    permisos: makePermisos((m) => {
      if (m === "Check-in y Embarque" || m === "Llegada y Cierre") return pCampo();
      if (m === "Dashboard Operativo") return pConsultar();
      return pNone();
    }),
  },
  {
    id: 6, codigo: "ROL-006", nombre: "Auditor Interno", color: "purple",
    descripcion: "Solo lectura y exportación en todos los módulos. Acceso completo al log de auditoría.",
    usuariosAsignados: 1, estado: "Activo",
    permisos: makePermisos((m) => {
      if (m === "Auditoría") return pFull();
      return pLectura();
    }),
  },
  {
    id: 7, codigo: "ROL-007", nombre: "Rol Temporal / Pruebas", color: "slate",
    descripcion: "Rol inactivo usado para pruebas de integración. No asignado a usuarios reales.",
    usuariosAsignados: 0, estado: "Inactivo",
    permisos: makePermisos((m) => {
      if (m === "Dashboard Operativo" || m === "Reserva de Tickets") return pConsultar();
      return pNone();
    }),
  },
];


const usuariosIniciales: Usuario[] = [
  { id: 1,  nombre: "Roberto",  apellido: "Quispe Mamani",    dni: "10234567", email: "r.quispe@transporte.pe",    username: "rquispe",    rolId: 1, estado: "Activo",    ultimoAcceso: "15/04/2026 08:42", creadoEn: "01/01/2025" },
  { id: 2,  nombre: "Sandra",   apellido: "Flores Castillo",  dni: "20345678", email: "s.flores@transporte.pe",    username: "sflores",    rolId: 1, estado: "Activo",    ultimoAcceso: "14/04/2026 17:10", creadoEn: "01/01/2025" },
  { id: 3,  nombre: "Miguel",   apellido: "Paredes Tapia",    dni: "30456789", email: "m.paredes@transporte.pe",   username: "mparedes",   rolId: 2, estado: "Activo",    ultimoAcceso: "15/04/2026 09:05", creadoEn: "15/02/2025" },
  { id: 4,  nombre: "Lucía",    apellido: "Mamani Huanca",    dni: "40567890", email: "l.mamani@transporte.pe",    username: "lmamani",    rolId: 3, estado: "Activo",    ultimoAcceso: "15/04/2026 07:55", creadoEn: "10/03/2025" },
  { id: 5,  nombre: "Jorge",    apellido: "Condori Ticona",   dni: "50678901", email: "j.condori@transporte.pe",   username: "jcondori",   rolId: 3, estado: "Activo",    ultimoAcceso: "14/04/2026 22:30", creadoEn: "10/03/2025" },
  { id: 6,  nombre: "Patricia", apellido: "Vargas Luna",      dni: "60789012", email: "p.vargas@transporte.pe",    username: "pvargas",    rolId: 3, estado: "Bloqueado", ultimoAcceso: "10/04/2026 14:00", creadoEn: "10/03/2025" },
  { id: 7,  nombre: "Carlos",   apellido: "Mendoza Rivas",    dni: "70890123", email: "c.mendoza@transporte.pe",   username: "cmendoza",   rolId: 4, estado: "Activo",    ultimoAcceso: "15/04/2026 08:00", creadoEn: "01/04/2025" },
  { id: 8,  nombre: "Ana",      apellido: "García Soto",      dni: "80901234", email: "a.garcia@transporte.pe",    username: "agarcia",    rolId: 4, estado: "Activo",    ultimoAcceso: "15/04/2026 08:10", creadoEn: "01/04/2025" },
  { id: 9,  nombre: "Luis",     apellido: "Torres Pinto",     dni: "90123456", email: "l.torres@transporte.pe",    username: "ltorres",    rolId: 4, estado: "Activo",    ultimoAcceso: "13/04/2026 18:45", creadoEn: "01/04/2025" },
  { id: 10, nombre: "María",    apellido: "Santos Ccama",     dni: "11234567", email: "m.santos@transporte.pe",    username: "msantos",    rolId: 4, estado: "Activo",    ultimoAcceso: "15/04/2026 09:20", creadoEn: "01/04/2025" },
  { id: 11, nombre: "Pedro",    apellido: "Ramos Huillca",    dni: "21345678", email: "p.ramos@transporte.pe",     username: "pramos",     rolId: 4, estado: "Inactivo",  ultimoAcceso: "01/03/2026 10:00", creadoEn: "01/04/2025" },
  { id: 12, nombre: "Elena",    apellido: "Cáceres Apaza",    dni: "31456789", email: "e.caceres@transporte.pe",   username: "ecaceres",   rolId: 5, estado: "Activo",    ultimoAcceso: "15/04/2026 06:30", creadoEn: "15/04/2025" },
  { id: 13, nombre: "Juan",     apellido: "Quispe Palomino",  dni: "41567890", email: "j.quispe@transporte.pe",    username: "jquispe",    rolId: 5, estado: "Activo",    ultimoAcceso: "15/04/2026 06:45", creadoEn: "15/04/2025" },
  { id: 14, nombre: "Rosa",     apellido: "Medina Callata",   dni: "51678901", email: "r.medina@transporte.pe",    username: "rmedina",    rolId: 5, estado: "Activo",    ultimoAcceso: "14/04/2026 23:10", creadoEn: "15/04/2025" },
  { id: 15, nombre: "Felipe",   apellido: "Chávez Quispe",    dni: "61789012", email: "f.chavez@transporte.pe",    username: "fchavez",    rolId: 5, estado: "Activo",    ultimoAcceso: "15/04/2026 07:00", creadoEn: "15/04/2025" },
  { id: 16, nombre: "Carmen",   apellido: "Benavides Lipa",   dni: "71890123", email: "c.benavides@transporte.pe", username: "cbenavides", rolId: 6, estado: "Activo",    ultimoAcceso: "15/04/2026 09:00", creadoEn: "01/06/2025" },
];


const auditLogs: AuditLog[] = [
  { id: 1,  fecha: "15/04/2026", hora: "09:20", usuario: "msantos",    accion: "REGISTRAR", modulo: "Reserva de Tickets",    detalle: "Reserva ticket #T-2026-0412 — Lima/Arequipa",        ip: "192.168.1.14", resultado: "Exitoso"     },
  { id: 2,  fecha: "15/04/2026", hora: "09:05", usuario: "mparedes",   accion: "CONSULTAR", modulo: "Dashboard Gerencial",   detalle: "Acceso al dashboard gerencial",                       ip: "192.168.1.3",  resultado: "Exitoso"     },
  { id: 3,  fecha: "15/04/2026", hora: "09:00", usuario: "cbenavides", accion: "EXPORTAR",  modulo: "Auditoría",             detalle: "Exportación log período 01-15/04/2026",               ip: "192.168.1.16", resultado: "Exitoso"     },
  { id: 4,  fecha: "15/04/2026", hora: "08:42", usuario: "rquispe",    accion: "MODIFICAR", modulo: "Roles y Permisos",      detalle: "Modificó permisos ROL-004: añadió 'modificar' en Cotización", ip: "192.168.1.1", resultado: "Exitoso" },
  { id: 5,  fecha: "15/04/2026", hora: "08:10", usuario: "agarcia",    accion: "REGISTRAR", modulo: "Orden de Pago",         detalle: "Orden #OP-2026-0089 — S/ 285.00",                    ip: "192.168.1.8",  resultado: "Exitoso"     },
  { id: 6,  fecha: "15/04/2026", hora: "08:00", usuario: "cmendoza",   accion: "REGISTRAR", modulo: "Reserva de Tickets",    detalle: "Reserva ticket #T-2026-0411 — Lima/Cusco",            ip: "192.168.1.7",  resultado: "Exitoso"     },
  { id: 7,  fecha: "15/04/2026", hora: "07:55", usuario: "lmamani",    accion: "MODIFICAR", modulo: "Recursos de Viaje",     detalle: "Asignó vehículo XYZ-789 al viaje VJ-2026-0055",       ip: "192.168.1.4",  resultado: "Exitoso"     },
  { id: 8,  fecha: "15/04/2026", hora: "07:00", usuario: "fchavez",    accion: "EJECUTAR",  modulo: "Check-in y Embarque",   detalle: "Check-in viaje VJ-2026-0054 — 43 pasajeros",          ip: "192.168.1.15", resultado: "Exitoso"     },
  { id: 9,  fecha: "15/04/2026", hora: "06:45", usuario: "jquispe",    accion: "EJECUTAR",  modulo: "Llegada y Cierre",      detalle: "Cierre viaje VJ-2026-0053 — Lima/Trujillo",           ip: "192.168.1.13", resultado: "Exitoso"     },
  { id: 10, fecha: "15/04/2026", hora: "06:30", usuario: "ecaceres",   accion: "EJECUTAR",  modulo: "Check-in y Embarque",   detalle: "Check-in viaje VJ-2026-0055 — 38 pasajeros",          ip: "192.168.1.12", resultado: "Exitoso"     },
  { id: 11, fecha: "14/04/2026", hora: "22:30", usuario: "jcondori",   accion: "CONSULTAR", modulo: "Dashboard Operativo",   detalle: "Acceso fuera de horario habitual",                    ip: "192.168.1.5",  resultado: "Advertencia" },
  { id: 12, fecha: "14/04/2026", hora: "17:10", usuario: "sflores",    accion: "ANULAR",    modulo: "Parámetros del Sistema", detalle: "Anuló horario HOR-006 (estado Inactivo)",            ip: "192.168.1.2",  resultado: "Exitoso"     },
  { id: 13, fecha: "14/04/2026", hora: "14:00", usuario: "pvargas",    accion: "LOGIN",     modulo: "Autenticación",         detalle: "Intento de inicio de sesión — cuenta bloqueada",      ip: "192.168.1.6",  resultado: "Fallido"     },
  { id: 14, fecha: "14/04/2026", hora: "13:58", usuario: "pvargas",    accion: "LOGIN",     modulo: "Autenticación",         detalle: "Contraseña incorrecta (intento 3/3)",                  ip: "192.168.1.6",  resultado: "Fallido"     },
  { id: 15, fecha: "14/04/2026", hora: "13:55", usuario: "pvargas",    accion: "LOGIN",     modulo: "Autenticación",         detalle: "Contraseña incorrecta (intento 2/3)",                  ip: "192.168.1.6",  resultado: "Fallido"     },
  { id: 16, fecha: "14/04/2026", hora: "10:00", usuario: "rquispe",    accion: "REGISTRAR", modulo: "Usuarios",              detalle: "Nuevo usuario creado: fchavez — ROL-005",             ip: "192.168.1.1",  resultado: "Exitoso"     },
  { id: 17, fecha: "13/04/2026", hora: "18:45", usuario: "ltorres",    accion: "REGISTRAR", modulo: "Cotización",            detalle: "Cotización #COT-2026-0201 — Carga Lima/Piura",        ip: "192.168.1.9",  resultado: "Exitoso"     },
  { id: 18, fecha: "13/04/2026", hora: "16:20", usuario: "rquispe",    accion: "MODIFICAR", modulo: "Usuarios",              detalle: "Bloqueó cuenta de usuario: pvargas",                  ip: "192.168.1.1",  resultado: "Exitoso"     },
];


const colorMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  red:     { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",    dot: "bg-red-500"    },
  indigo:  { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", dot: "bg-indigo-500" },
  emerald: { bg: "bg-emerald-50",text: "text-emerald-700",border: "border-emerald-200",dot: "bg-emerald-500"},
  amber:   { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500"  },
  teal:    { bg: "bg-teal-50",   text: "text-teal-700",   border: "border-teal-200",   dot: "bg-teal-500"   },
  purple:  { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
  slate:   { bg: "bg-slate-50",  text: "text-slate-600",  border: "border-slate-200",  dot: "bg-slate-400"  },
};


function EstadoBadge({ estado }: { estado: string }) {
  const cls =
    estado === "Activo"    ? "bg-emerald-100 text-emerald-700" :
    estado === "Bloqueado" ? "bg-red-100 text-red-700" :
                             "bg-slate-100 text-slate-500";
  const Icon = estado === "Activo" ? Unlock : Lock;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${cls}`}>
      <Icon className="w-3 h-3" />
      {estado}
    </span>
  );
}

function ResultadoBadge({ resultado }: { resultado: string }) {
  if (resultado === "Exitoso")
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 className="w-3 h-3"/>Exitoso</span>;
  if (resultado === "Fallido")
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700"><AlertCircle className="w-3 h-3"/>Fallido</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700"><Info className="w-3 h-3"/>Advertencia</span>;
}

const ACCION_BADGE_COLORS: Record<string, string> = {
  REGISTRAR: "bg-blue-100 text-blue-700",
  MODIFICAR: "bg-amber-100 text-amber-700",
  ANULAR:    "bg-red-100 text-red-700",
  CONSULTAR: "bg-slate-100 text-slate-600",
  EXPORTAR:  "bg-slate-100 text-slate-500",
  EJECUTAR:  "bg-purple-100 text-purple-700",
  LOGIN:     "bg-indigo-100 text-indigo-700",
};

function AccionBadge({ accion }: { accion: string }) {
  return (
    <span className={`px-2 py-0.5 text-xs font-mono font-medium rounded ${ACCION_BADGE_COLORS[accion] || "bg-slate-100 text-slate-600"}`}>
      {accion}
    </span>
  );
}


function PermCell({
  value, editable, aplica, onChange,
}: {
  value: boolean; editable: boolean; aplica: boolean; onChange?: () => void;
}) {
  if (!aplica)
    return <td className="px-3 py-2 text-center"><span className="text-slate-200 select-none">—</span></td>;

  if (!editable)
    return (
      <td className="px-3 py-2 text-center">
        {value
          ? <span className="flex justify-center"><Check className="w-4 h-4 text-emerald-500" /></span>
          : <span className="flex justify-center"><Minus className="w-4 h-4 text-slate-300" /></span>}
      </td>
    );

  return (
    <td className="px-3 py-2 text-center">
      <button onClick={onChange} className="flex justify-center w-full group">
        {value
          ? <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
              <Check className="w-3 h-3 text-white" />
            </div>
          : <div className="w-5 h-5 rounded border-2 border-slate-300 group-hover:border-slate-400 transition-colors" />}
      </button>
    </td>
  );
}


function MatrizPermisos({
  permisos, editable, onChange, onToggleAll,
}: {
  permisos: Record<string, Permiso>;
  editable: boolean;
  onChange?: (mod: string, acc: Accion) => void;
  onToggleAll?: (mod: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-2.5 text-left font-semibold text-slate-600 w-52 text-xs">Módulo</th>
            {TODAS_ACCIONES.map((acc) => {
              const meta = ACCION_META[acc];
              return (
                <th key={acc} className="px-3 py-2.5 text-center w-24">
                  <div className={`flex flex-col items-center gap-0.5 ${meta.color}`}>
                    {meta.icon}
                    <span className="text-[10px] font-semibold uppercase tracking-wide">{meta.label}</span>
                  </div>
                </th>
              );
            })}
            {editable && <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-500 w-16">Todos</th>}
          </tr>
        </thead>
        <tbody>
          {MODULOS_SISTEMA.map((grupo) => (
            <>
              <tr key={grupo.grupo} className="bg-slate-100/80">
                <td colSpan={editable ? 8 : 7} className="px-4 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {grupo.grupo}
                </td>
              </tr>
              {grupo.items.map((mod, i) => {
                const p = permisos[mod] || pNone();
                const aplicables = ACCIONES_POR_MODULO[mod] || [];
                const tieneAlgo = aplicables.some((a) => p[a]);
                return (
                  <tr key={mod} className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"} ${!tieneAlgo ? "opacity-50" : ""}`}>
                    <td className="px-4 py-2 text-xs text-slate-700 font-medium">{mod}</td>
                    {TODAS_ACCIONES.map((acc) => (
                      <PermCell
                        key={acc}
                        value={p[acc]}
                        editable={editable}
                        aplica={aplicables.includes(acc)}
                        onChange={() => onChange?.(mod, acc)}
                      />
                    ))}
                    {editable && (
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => onToggleAll?.(mod)}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                          {aplicables.every((a) => p[a]) ? "Quitar" : "Todos"}
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}


function UsuarioModal({
  item, roles, onClose, onSave,
}: { item: Usuario | null; roles: Rol[]; onClose: () => void; onSave: (u: any) => void }) {
  const [form, setForm] = useState({
    nombre:   item?.nombre   || "",
    apellido: item?.apellido || "",
    dni:      item?.dni      || "",
    email:    item?.email    || "",
    username: item?.username || "",
    rolId:    item?.rolId    || roles[0]?.id || 1,
    estado:   item?.estado   || "Activo",
  });
  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{item ? "Editar Usuario" : "Nuevo Usuario"}</h3>
            <p className="text-sm text-slate-500">Complete los datos del usuario del sistema</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
        </div>

        <div className="px-6 py-4 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {([ ["nombre","Nombre","Ej: Carlos"], ["apellido","Apellido","Ej: Mendoza Rivas"] ] as const).map(([k, l, p]) => (
              <div key={k}>
                <label className="block text-sm font-medium text-slate-700 mb-1">{l}</label>
                <input value={(form as any)[k]} onChange={(e) => set(k, e.target.value)} placeholder={p}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            ))}
          </div>
          {([ ["dni","DNI","Ej: 12345678"], ["email","Correo Electrónico","usuario@empresa.pe"], ["username","Nombre de Usuario","Ej: cmendoza"] ] as const).map(([k, l, p]) => (
            <div key={k}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{l}</label>
              <input value={(form as any)[k]} onChange={(e) => set(k, e.target.value)} placeholder={p}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rol Asignado</label>
            <select value={form.rolId} onChange={(e) => set("rolId", Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {roles.filter((r) => r.estado === "Activo").map((r) => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
            <select value={form.estado} onChange={(e) => set("estado", e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {["Activo", "Bloqueado", "Inactivo"].map((e) => <option key={e}>{e}</option>)}
            </select>
          </div>
          {!item && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700">
              Se generará una contraseña temporal y será enviada al correo del usuario.
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancelar</button>
          <button
            onClick={() => onSave({ ...form, id: item?.id || Date.now(), ultimoAcceso: "-", creadoEn: new Date().toLocaleDateString("es-PE") })}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
            <Save className="w-4 h-4" />{item ? "Guardar Cambios" : "Crear Usuario"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RolModal({
  item, onClose, onSave,
}: { item: Rol | null; onClose: () => void; onSave: (r: any) => void }) {
  const [form, setForm] = useState({
    codigo:      item?.codigo      || "",
    nombre:      item?.nombre      || "",
    descripcion: item?.descripcion || "",
    color:       item?.color       || "indigo",
    estado:      item?.estado      || "Activo",
  });
  const [permisos, setPermisos] = useState<Record<string, Permiso>>(
    item?.permisos || makePermisos(() => pNone())
  );

  const toggle = (mod: string, acc: Accion) => {
    const aplicables = ACCIONES_POR_MODULO[mod] || [];
    if (!aplicables.includes(acc)) return; // no permitir cambiar acciones que no aplican
    setPermisos((p) => ({ ...p, [mod]: { ...p[mod], [acc]: !p[mod][acc] } }));
  };

  const toggleAll = (mod: string) => {
    const aplicables = ACCIONES_POR_MODULO[mod] || [];
    const allActive = aplicables.every((a) => permisos[mod]?.[a]);
    setPermisos((p) => {
      const next = { ...pNone() };
      if (!allActive) for (const a of aplicables) next[a] = true;
      return { ...p, [mod]: next };
    });
  };

  const COLORS = ["red", "indigo", "emerald", "amber", "teal", "purple", "slate"];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{item ? "Editar Rol" : "Nuevo Rol"}</h3>
            <p className="text-sm text-slate-500">Define el rol y configura la matriz de permisos</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="px-6 py-4 grid grid-cols-2 gap-4 border-b border-slate-100">
            {([ ["codigo","Código","Ej: ROL-008"], ["nombre","Nombre del Rol","Ej: Coordinador de Flota"] ] as const).map(([k, l, p]) => (
              <div key={k}>
                <label className="block text-sm font-medium text-slate-700 mb-1">{l}</label>
                <input value={(form as any)[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} placeholder={p}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            ))}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
              <textarea value={form.descripcion} onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))} rows={2}
                placeholder="Descripción del alcance y propósito del rol"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Color identificador</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((c) => (
                  <button key={c} onClick={() => setForm((f) => ({ ...f, color: c }))}
                    className={`w-7 h-7 rounded-full ${colorMap[c].dot} border-2 ${form.color === c ? "border-slate-800 scale-110" : "border-transparent"} transition-all`} />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
              <select value={form.estado} onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value as any }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Activo</option><option>Inactivo</option>
              </select>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="flex items-center gap-2 mb-3">
              <Key className="w-4 h-4 text-indigo-600" />
              <h4 className="font-semibold text-slate-900 text-sm">Matriz de Permisos</h4>
              <span className="ml-2 text-xs text-slate-400">— Las celdas con "—" indican que esa acción no aplica al módulo</span>
            </div>
            <MatrizPermisos
              permisos={permisos}
              editable
              onChange={toggle}
              onToggleAll={toggleAll}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancelar</button>
          <button
            onClick={() => onSave({ ...form, id: item?.id || Date.now(), usuariosAsignados: item?.usuariosAsignados || 0, permisos })}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
            <Save className="w-4 h-4" />{item ? "Guardar Cambios" : "Crear Rol"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TabUsuarios({ usuarios, roles, onUpdate }: { usuarios: Usuario[]; roles: Rol[]; onUpdate: (u: Usuario[]) => void }) {
  const [search, setSearch] = useState("");
  const [filterRol, setFilterRol] = useState("todos");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Usuario | null>(null);

  const getRolNombre = (id: number) => roles.find((r) => r.id === id)?.nombre || "-";
  const getRolColor  = (id: number) => roles.find((r) => r.id === id)?.color  || "slate";

  const filtered = usuarios.filter((u) => {
    const q = search.toLowerCase();
    const matchQ = !q || `${u.nombre} ${u.apellido} ${u.username} ${u.dni} ${u.email}`.toLowerCase().includes(q);
    const matchR = filterRol === "todos" || u.rolId === Number(filterRol);
    const matchE = filterEstado === "todos" || u.estado === filterEstado;
    return matchQ && matchR && matchE;
  });

  const handleSave = (data: any) => {
    onUpdate(editing ? usuarios.map((u) => (u.id === data.id ? data : u)) : [...usuarios, data]);
    setShowModal(false);
  };

  const stats = [
    { label: "Total usuarios", value: usuarios.length,                                  color: "indigo"  },
    { label: "Activos",        value: usuarios.filter((u) => u.estado === "Activo").length,    color: "emerald" },
    { label: "Bloqueados",     value: usuarios.filter((u) => u.estado === "Bloqueado").length, color: "red"     },
    { label: "Inactivos",      value: usuarios.filter((u) => u.estado === "Inactivo").length,  color: "slate"   },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              s.color === "indigo" ? "bg-indigo-100" : s.color === "emerald" ? "bg-emerald-100" : s.color === "red" ? "bg-red-100" : "bg-slate-100"
            }`}>
              <UserCircle className={`w-5 h-5 ${
                s.color === "indigo" ? "text-indigo-600" : s.color === "emerald" ? "text-emerald-600" : s.color === "red" ? "text-red-600" : "text-slate-500"
              }`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre, usuario, DNI..."
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <select value={filterRol} onChange={(e) => setFilterRol(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="todos">Todos los roles</option>
          {roles.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
        </select>
        <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="todos">Todos los estados</option>
          {["Activo", "Bloqueado", "Inactivo"].map((e) => <option key={e}>{e}</option>)}
        </select>
        <button onClick={() => { setEditing(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 ml-auto">
          <Plus className="w-4 h-4" />Nuevo Usuario
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {["Usuario", "DNI", "Correo", "Rol", "Último Acceso", "Estado", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((u) => {
              const c = colorMap[getRolColor(u.rolId)];
              return (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${c.dot} flex items-center justify-center`}>
                        <span className="text-xs font-bold text-white">{u.nombre[0]}{u.apellido[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{u.nombre} {u.apellido}</p>
                        <p className="text-xs text-slate-400">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600 font-mono text-xs">{u.dni}</td>
                  <td className="px-5 py-3 text-slate-600 text-xs">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${c.bg} ${c.text} ${c.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                      {getRolNombre(u.rolId)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />{u.ultimoAcceso}
                    </div>
                  </td>
                  <td className="px-5 py-3"><EstadoBadge estado={u.estado} /></td>
                  <td className="px-5 py-3">
                    <button onClick={() => { setEditing(u); setShowModal(true); }}
                      className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-indigo-600">
                      <FilePen className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
          Mostrando {filtered.length} de {usuarios.length} usuarios
        </div>
      </div>

      {showModal && <UsuarioModal item={editing} roles={roles} onClose={() => setShowModal(false)} onSave={handleSave} />}
    </div>
  );
}


function TabRoles({ roles, onUpdate }: { roles: Rol[]; onUpdate: (r: Rol[]) => void }) {
  const [selected, setSelected] = useState<Rol | null>(roles[0]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Rol | null>(null);

  const handleSave = (data: any) => {
    if (editing) {
      const updated = roles.map((r) => (r.id === data.id ? data : r));
      onUpdate(updated);
      setSelected(data);
    } else {
      onUpdate([...roles, data]);
    }
    setShowModal(false);
  };

  return (
    <div className="flex gap-5">
      {/* Lista de roles */}
      <div className="w-72 flex-shrink-0 space-y-2">
        <button onClick={() => { setEditing(null); setShowModal(true); }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 mb-3">
          <Plus className="w-4 h-4" />Nuevo Rol
        </button>
        {roles.map((rol) => {
          const c = colorMap[rol.color];
          const isActive = selected?.id === rol.id;
          return (
            <button key={rol.id} onClick={() => setSelected(rol)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                isActive ? `${c.bg} ${c.border} border-2` : "bg-white border-slate-200 hover:border-slate-300"
              }`}>
              <div className="flex items-start gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${c.dot}`} />
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${isActive ? c.text : "text-slate-800"}`}>{rol.nombre}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{rol.codigo} · {rol.usuariosAsignados} usuario{rol.usuariosAsignados !== 1 ? "s" : ""}</p>
                  {rol.estado === "Inactivo" && (
                    <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded mt-1 inline-block">Inactivo</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selected ? (
        <div className="flex-1 min-w-0 space-y-4">
          <div className={`rounded-xl border-2 p-5 ${colorMap[selected.color].bg} ${colorMap[selected.color].border}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[selected.color].dot}`}>
                  <Key className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${colorMap[selected.color].text}`}>{selected.nombre}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{selected.descripcion}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span className="font-mono">{selected.codigo}</span>
                    <span>·</span>
                    <span>{selected.usuariosAsignados} usuario(s) asignado(s)</span>
                    <span>·</span>
                    <EstadoBadge estado={selected.estado} />
                  </div>
                </div>
              </div>
              <button onClick={() => { setEditing(selected); setShowModal(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 shadow-sm">
                <FilePen className="w-3.5 h-3.5" />Editar
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              <h4 className="font-semibold text-slate-800 text-sm">Matriz de Permisos</h4>
              <span className="ml-auto text-xs text-slate-400">Las celdas con "—" no aplican al módulo</span>
            </div>
            <div className="p-4">
              <MatrizPermisos permisos={selected.permisos} editable={false} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Selecciona un rol para ver sus permisos
        </div>
      )}

      {showModal && <RolModal item={editing} onClose={() => setShowModal(false)} onSave={handleSave} />}
    </div>
  );
}


function TabAuditoria() {
  const [search, setSearch] = useState("");
  const [filterResultado, setFilterResultado] = useState("todos");
  const [filterAccion, setFilterAccion] = useState("todos");

  const accionesPresentes = [...new Set(auditLogs.map((l) => l.accion))].sort();

  const filtered = auditLogs.filter((l) => {
    const q = search.toLowerCase();
    const matchQ = !q || `${l.usuario} ${l.modulo} ${l.detalle}`.toLowerCase().includes(q);
    const matchR = filterResultado === "todos" || l.resultado === filterResultado;
    const matchA = filterAccion === "todos" || l.accion === filterAccion;
    return matchQ && matchR && matchA;
  });

  const stats = [
    { label: "Total eventos",  value: auditLogs.length,                                          color: "slate"   },
    { label: "Exitosos",       value: auditLogs.filter((l) => l.resultado === "Exitoso").length,     color: "emerald" },
    { label: "Fallidos",       value: auditLogs.filter((l) => l.resultado === "Fallido").length,     color: "red"     },
    { label: "Advertencias",   value: auditLogs.filter((l) => l.resultado === "Advertencia").length, color: "amber"   },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => {
          const cls = s.color === "emerald" ? "bg-emerald-100 text-emerald-600"
            : s.color === "red"    ? "bg-red-100 text-red-600"
            : s.color === "amber"  ? "bg-amber-100 text-amber-600"
            : "bg-slate-100 text-slate-500";
          return (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cls}`}>
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por usuario, módulo, detalle..."
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <select value={filterAccion} onChange={(e) => setFilterAccion(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="todos">Todas las acciones</option>
          {accionesPresentes.map((a) => <option key={a}>{a}</option>)}
        </select>
        <select value={filterResultado} onChange={(e) => setFilterResultado(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="todos">Todos los resultados</option>
          {["Exitoso", "Fallido", "Advertencia"].map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {["Fecha / Hora", "Usuario", "Acción", "Módulo", "Detalle", "IP", "Resultado"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((log) => (
              <tr key={log.id} className={`hover:bg-slate-50 transition-colors ${
                log.resultado === "Fallido" ? "bg-red-50/30" : log.resultado === "Advertencia" ? "bg-amber-50/30" : ""
              }`}>
                <td className="px-4 py-2.5">
                  <p className="font-medium text-slate-800 text-xs">{log.fecha}</p>
                  <p className="text-slate-400 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{log.hora}</p>
                </td>
                <td className="px-4 py-2.5">
                  <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">@{log.usuario}</span>
                </td>
                <td className="px-4 py-2.5"><AccionBadge accion={log.accion} /></td>
                <td className="px-4 py-2.5 text-xs text-slate-600">{log.modulo}</td>
                <td className="px-4 py-2.5 text-xs text-slate-500 max-w-xs">{log.detalle}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-slate-400">{log.ip}</td>
                <td className="px-4 py-2.5"><ResultadoBadge resultado={log.resultado} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
          Mostrando {filtered.length} de {auditLogs.length} eventos
        </div>
      </div>
    </div>
  );
}


export function SecurityModule() {
  const [tab, setTab] = useState<"usuarios" | "roles" | "auditoria">("usuarios");
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciales);
  const [roles, setRoles]       = useState<Rol[]>(rolesIniciales);

  const TABS = [
    { id: "usuarios",  label: "Usuarios",        icon: Users       },
    { id: "roles",     label: "Roles y Permisos", icon: Key         },
    { id: "auditoria", label: "Auditoría",        icon: ClipboardList },
  ] as const;

  return (
    <div className="min-h-full bg-slate-50">
      <PageHeader
        title="Seguridad del Sistema"
        subtitle="Administración de usuarios, roles, permisos y trazabilidad de accesos"
      />

      <div className="p-8 space-y-6">
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === id ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}>
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {tab === "usuarios"  && <TabUsuarios  usuarios={usuarios} roles={roles} onUpdate={setUsuarios} />}
        {tab === "roles"     && <TabRoles     roles={roles}       onUpdate={setRoles} />}
        {tab === "auditoria" && <TabAuditoria />}
      </div>
    </div>
  );
}
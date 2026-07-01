import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  AlertTriangle,
  BarChart3,
  Calculator,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  ClipboardEdit,
  CreditCard,
  Database,
  DollarSign,
  FileText,
  HardDriveDownload,
  LayoutDashboard,
  LogOut,
  PieChart,
  Route,
  RotateCcw,
  ScanLine,
  Settings,
  ShieldCheck,
  Target,
  Ticket,
  Truck,
  Users,
} from "lucide-react";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { cn } from "../ui/utils";
import { type ModuleKey, ROLE_LABEL, useCurrentRole, canAccess } from "../../store/session";

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

interface MenuBlock extends MenuItem {
  module: ModuleKey;
}

// Id de viaje de muestra para abrir reportes desde la navegación del prototipo.
const DEMO_REPORTE_ID = "VJ-001";

const menuBlocks: MenuBlock[] = [
  {
    module: "seguridad",
    title: "Seguridad",
    icon: <ShieldCheck className="size-4" />,
    children: [
      { title: "Perfiles y permisos", icon: <ShieldCheck className="size-4" />, path: "/seguridad/perfiles" },
      { title: "Gestión de usuarios", icon: <Users className="size-4" />, path: "/seguridad/usuarios" },
    ],
  },
  {
    module: "gerencial",
    title: "Gerencial",
    icon: <BarChart3 className="size-4" />,
    children: [
      { title: "Dashboard", icon: <LayoutDashboard className="size-4" />, path: "/gerencial/dashboard" },
      {
        title: "Mantenimiento parámetros",
        icon: <Settings className="size-4" />,
        children: [
          { title: "Vehículos", icon: <Truck className="size-4" />, path: "/gerencial/parametros/vehiculos" },
          { title: "Operarios", icon: <Users className="size-4" />, path: "/gerencial/parametros/operarios" },
          { title: "Sedes", icon: <FileText className="size-4" />, path: "/gerencial/parametros/sedes" },
          { title: "Contenedores", icon: <FileText className="size-4" />, path: "/gerencial/parametros/contenedores" },
          { title: "Bienes", icon: <FileText className="size-4" />, path: "/gerencial/parametros/bienes" },
          { title: "Unidades de Medida", icon: <FileText className="size-4" />, path: "/gerencial/parametros/unidades" },
          { title: "Clientes", icon: <Users className="size-4" />, path: "/gerencial/parametros/clientes" },
          { title: "Servicios", icon: <FileText className="size-4" />, path: "/gerencial/parametros/servicios" },
          { title: "Rutas y Coberturas", icon: <Route className="size-4" />, path: "/gerencial/parametros/rutas" },
          { title: "Horarios", icon: <FileText className="size-4" />, path: "/gerencial/parametros/horarios" },
          { title: "Tarifarios", icon: <DollarSign className="size-4" />, path: "/gerencial/parametros/tarifarios" },
          { title: "Políticas", icon: <FileText className="size-4" />, path: "/gerencial/parametros/politicas" },
          { title: "Reglas", icon: <FileText className="size-4" />, path: "/gerencial/parametros/reglas" },
          { title: "Protocolos", icon: <FileText className="size-4" />, path: "/gerencial/parametros/protocolos" },
        ],
      },
      {
        title: "Consultas",
        icon: <BarChart3 className="size-4" />,
        children: [
          { title: "Desempeño operarios", icon: <Users className="size-4" />, path: "/gerencial/consultas/desempeno-operarios" },
          { title: "Desempeño vehicular", icon: <Truck className="size-4" />, path: "/gerencial/consultas/desempeno-vehicular" },
          { title: "Ingresos", icon: <DollarSign className="size-4" />, path: "/gerencial/consultas/ingresos" },
          { title: "Incidencias", icon: <AlertTriangle className="size-4" />, path: "/gerencial/consultas/incidencias" },
          { title: "Demanda y ocupación", icon: <PieChart className="size-4" />, path: "/gerencial/consultas/demanda-ocupacion" },
          { title: "Indicadores KPI", icon: <Target className="size-4" />, path: "/gerencial/consultas/indicadores-kpi" },
        ],
      },
    ],
  },
  {
    module: "operativo",
    title: "Operativo",
    icon: <Truck className="size-4" />,
    children: [
      { title: "Dashboard", icon: <LayoutDashboard className="size-4" />, path: "/operativo/dashboard" },
      {
        title: "Flujo operativo",
        icon: <FileText className="size-4" />,
        children: [
          { title: "Cotización", icon: <Calculator className="size-4" />, path: "/operativo/cotizacion" },
          { title: "Reserva de tickets", icon: <Ticket className="size-4" />, path: "/operativo/reserva-tickets" },
          { title: "Orden de pago", icon: <CreditCard className="size-4" />, path: "/operativo/orden-pago" },
          { title: "Check-in y embarque", icon: <CheckSquare className="size-4" />, path: "/operativo/checkin-embarque" },
          { title: "Llegada y cierre", icon: <LogOut className="size-4" />, path: "/operativo/llegada-cierre" },
        ],
      },
      { title: "Ajuste operativo de viaje", icon: <ClipboardEdit className="size-4" />, path: "/operativo/ajuste-viaje" },
    ],
  },
  {
    module: "reportes",
    title: "Reportes",
    icon: <FileText className="size-4" />,
    children: [
      { title: "Ticket de viaje", icon: <Ticket className="size-4" />, path: `/operativo/reportes/ticket-viaje/${DEMO_REPORTE_ID}` },
      { title: "Comprobante de pago", icon: <CreditCard className="size-4" />, path: `/operativo/reportes/comprobante-pago/${DEMO_REPORTE_ID}` },
      { title: "Manifiesto de viaje", icon: <FileText className="size-4" />, path: `/operativo/reportes/manifiesto-viaje/${DEMO_REPORTE_ID}` },
      { title: "Cierre de viaje", icon: <CheckSquare className="size-4" />, path: `/operativo/reportes/cierre-viaje/${DEMO_REPORTE_ID}` },
      { title: "Seguimiento de viaje", icon: <Route className="size-4" />, path: `/operativo/reportes/seguimiento-viaje/${DEMO_REPORTE_ID}` },
    ],
  },
  {
    module: "tecnico",
    title: "Técnico / Administrativo",
    icon: <Database className="size-4" />,
    children: [
      { title: "Monitor Batch", icon: <BarChart3 className="size-4" />, path: "/tecnico/batch-monitor" },
      { title: "Backup", icon: <HardDriveDownload className="size-4" />, path: "/tecnico/backup" },
      { title: "Restore", icon: <RotateCcw className="size-4" />, path: "/tecnico/restore" },
      { title: "Verificación de integridad", icon: <ScanLine className="size-4" />, path: "/tecnico/verificacion" },
    ],
  },
];

function containsPath(item: MenuItem, pathname: string): boolean {
  if (item.path === pathname) return true;
  return item.children?.some((child) => containsPath(child, pathname)) ?? false;
}

function MenuItemComponent({ item, level = 0 }: { item: MenuItem; level?: number }) {
  const location = useLocation();
  const hasChildren = Boolean(item.children?.length);
  const isActive = item.path === location.pathname;
  const isOpenBranch = containsPath(item, location.pathname);
  const [isOpen, setIsOpen] = useState(level === 0 || isOpenBranch);

  useEffect(() => {
    if (isOpenBranch) setIsOpen(true);
  }, [isOpenBranch]);

  const indentStyle = level > 0 ? { paddingLeft: `${16 + level * 12}px` } : undefined;

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen((current) => !current)}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
            level === 0
              ? "text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400 hover:bg-white/[0.05]"
              : "text-sm text-zinc-300 hover:bg-white/[0.05] hover:text-white",
            isOpenBranch && level > 0 && "bg-white/[0.06] text-white",
          )}
          style={indentStyle}
        >
          {item.icon}
          <span className="flex-1">{item.title}</span>
          {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
        </button>
        {isOpen && (
          <div className="space-y-1">
            {item.children?.map((child) => (
              <MenuItemComponent key={`${item.title}-${child.title}`} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.path || "#"}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
        isActive
          ? "bg-white/[0.1] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
          : "text-zinc-300 hover:bg-white/[0.05] hover:text-white",
      )}
      style={indentStyle}
    >
      {item.icon}
      <span>{item.title}</span>
    </Link>
  );
}

export function Sidebar() {
  const role = useCurrentRole();
  const visibleBlocks = menuBlocks.filter((block) => canAccess(block.module, role));

  return (
    <aside className="hidden w-[304px] border-r border-white/10 bg-[#101114] text-zinc-100 lg:flex lg:flex-col">
      <div className="p-4">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8">
              <Truck className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-white">Sistema de Transporte</h1>
              <p className="text-xs text-zinc-500">Perfil: {ROLE_LABEL[role]}</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="scrollbar-modern flex-1 space-y-3 overflow-y-auto px-3 pb-4">
        {visibleBlocks.map((block) => (
          <MenuItemComponent key={block.title} item={block} />
        ))}
      </nav>

      <div className="p-4">
        <Separator className="mb-4 bg-white/10" />
        <Button
          asChild
          variant="ghost"
          className="w-full justify-start rounded-xl px-3 text-zinc-300 hover:bg-white/[0.06] hover:text-white"
        >
          <Link to="/login">
            <LogOut className="size-4" />
            Cerrar sesión
          </Link>
        </Button>
      </div>
    </aside>
  );
}

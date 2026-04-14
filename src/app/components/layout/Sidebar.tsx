import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Settings,
  BarChart3,
  Users,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  PieChart,
  Target,
  Truck,
  Ticket,
  Calculator,
  CreditCard,
  CheckSquare,
  LogOut,
  FileText,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  section?: "gerencial" | "operativo";
}

const menuItems: MenuItem[] = [
  {
    title: "Gerencial",
    icon: <BarChart3 className="w-5 h-5" />,
    section: "gerencial",
    children: [
      {
        title: "Dashboard",
        icon: <LayoutDashboard className="w-4 h-4" />,
        path: "/gerencial/dashboard",
      },
      {
        title: "Mantenimiento Parámetros",
        icon: <Settings className="w-4 h-4" />,
        path: "/gerencial/parametros",
      },
      {
        title: "Consultas",
        icon: <BarChart3 className="w-4 h-4" />,
        children: [
          {
            title: "Desempeño Operarios",
            icon: <Users className="w-4 h-4" />,
            path: "/gerencial/consultas/desempeno-operarios",
          },
          {
            title: "Desempeño Vehicular",
            icon: <Truck className="w-4 h-4" />,
            path: "/gerencial/consultas/desempeno-vehicular",
          },
          {
            title: "Ingresos",
            icon: <DollarSign className="w-4 h-4" />,
            path: "/gerencial/consultas/ingresos",
          },
          {
            title: "Incidencias",
            icon: <AlertTriangle className="w-4 h-4" />,
            path: "/gerencial/consultas/incidencias",
          },
          {
            title: "Demanda y Ocupación",
            icon: <PieChart className="w-4 h-4" />,
            path: "/gerencial/consultas/demanda-ocupacion",
          },
          {
            title: "Indicadores KPI",
            icon: <Target className="w-4 h-4" />,
            path: "/gerencial/consultas/indicadores-kpi",
          },
        ],
      },
    ],
  },
  {
    title: "Operativo",
    icon: <Truck className="w-5 h-5" />,
    section: "operativo",
    children: [
      {
        title: "Dashboard",
        icon: <LayoutDashboard className="w-4 h-4" />,
        path: "/operativo/dashboard",
      },
      {
        title: "Transacciones",
        icon: <FileText className="w-4 h-4" />,
        children: [
          {
            title: "Recursos de Viaje",
            icon: <Truck className="w-4 h-4" />,
            path: "/operativo/recursos-viaje",
          },
          {
            title: "Reserva de Tickets",
            icon: <Ticket className="w-4 h-4" />,
            path: "/operativo/reserva-tickets",
          },
          {
            title: "Cotización",
            icon: <Calculator className="w-4 h-4" />,
            path: "/operativo/cotizacion",
          },
          {
            title: "Orden de Pago",
            icon: <CreditCard className="w-4 h-4" />,
            path: "/operativo/orden-pago",
          },
          {
            title: "Emisión de Ticket",
            icon: <Ticket className="w-4 h-4" />,
            path: "/operativo/emision-ticket",
          },
          {
            title: "Check-in y Embarque",
            icon: <CheckSquare className="w-4 h-4" />,
            path: "/operativo/checkin-embarque",
          },
          {
            title: "Llegada y Cierre",
            icon: <LogOut className="w-4 h-4" />,
            path: "/operativo/llegada-cierre",
          },
        ],
      },
    ],
  },
];

function MenuItemComponent({ item, level = 0 }: { item: MenuItem; level?: number }) {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const isActive = item.path === location.pathname;
  const hasChildren = item.children && item.children.length > 0;

  const sectionColors = {
    gerencial: "text-indigo-600 bg-indigo-50 border-indigo-600",
    operativo: "text-emerald-600 bg-emerald-50 border-emerald-600",
  };

  const sectionHoverColors = {
    gerencial: "hover:bg-indigo-50 hover:text-indigo-700",
    operativo: "hover:bg-emerald-50 hover:text-emerald-700",
  };

  const activeClass = isActive
    ? item.section
      ? sectionColors[item.section]
      : "bg-slate-100 text-slate-900 border-l-4"
    : "";

  const hoverClass = item.section
    ? sectionHoverColors[item.section]
    : "hover:bg-slate-100";

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${hoverClass} ${
            level === 0 ? "font-semibold" : "font-medium"
          }`}
          style={{ paddingLeft: `${(level + 1) * 16}px` }}
        >
          {item.icon}
          <span className="flex-1 text-left">{item.title}</span>
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        {isOpen && (
          <div>
            {item.children?.map((child, idx) => (
              <MenuItemComponent key={idx} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.path || "#"}
      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors border-l-4 border-transparent ${activeClass} ${hoverClass} ${
        level === 0 ? "font-semibold" : "font-medium"
      }`}
      style={{ paddingLeft: `${(level + 1) * 16}px` }}
    >
      {item.icon}
      <span>{item.title}</span>
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-emerald-600 rounded-lg flex items-center justify-center">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">TransporteSaaS</h1>
            <p className="text-xs text-slate-500">Sistema Empresarial</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item, idx) => (
          <MenuItemComponent key={idx} item={item} />
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <Link
          to="/login"
          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </Link>
      </div>
    </aside>
  );
}

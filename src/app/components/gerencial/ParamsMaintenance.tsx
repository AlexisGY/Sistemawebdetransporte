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
} from "lucide-react";

const categories = [
  { id: "vehiculos", name: "Vehículos", icon: Truck, color: "indigo" },
  { id: "operarios", name: "Operarios", icon: Users, color: "emerald" },
  { id: "sedes", name: "Sedes", icon: Building, color: "purple" },
  { id: "contenedores", name: "Contenedores", icon: Package, color: "blue" },
  { id: "bienes", name: "Bienes", icon: Box, color: "amber" },
  { id: "unidades", name: "Unidades de Medida", icon: Ruler, color: "rose" },
  { id: "clientes", name: "Clientes", icon: UserCircle, color: "cyan" },
  { id: "servicios", name: "Servicios", icon: Briefcase, color: "teal" },
  { id: "rutas", name: "Rutas y Coberturas", icon: Map, color: "indigo" },
  { id: "horarios", name: "Horarios", icon: Clock, color: "emerald" },
  { id: "tarifarios", name: "Tarifarios", icon: DollarSign, color: "purple" },
  { id: "politicas", name: "Políticas de Negocio", icon: FileText, color: "blue" },
  { id: "reglas", name: "Reglas de Negocio", icon: Shield, color: "amber" },
  { id: "protocolos", name: "Protocolos", icon: ScrollText, color: "rose" },
];

// Mock data for vehicles
const vehiculosData = [
  { id: 1, placa: "ABC-123", modelo: "Mercedes-Benz Sprinter", capacidad: 20, estado: "Activo", ultimoMant: "10/04/2026" },
  { id: 2, placa: "XYZ-789", modelo: "Volvo 9700", capacidad: 45, estado: "Activo", ultimoMant: "05/04/2026" },
  { id: 3, placa: "DEF-456", modelo: "Scania K410", capacidad: 52, estado: "Mantenimiento", ultimoMant: "01/04/2026" },
  { id: 4, placa: "GHI-321", modelo: "Mercedes-Benz O500", capacidad: 48, estado: "Activo", ultimoMant: "12/04/2026" },
  { id: 5, placa: "JKL-654", modelo: "Iveco Daily", capacidad: 18, estado: "Activo", ultimoMant: "08/04/2026" },
];

const operariosData = [
  { id: 1, nombre: "Carlos Mendoza", dni: "12345678", cargo: "Conductor", licencia: "A-IIIc", estado: "Activo" },
  { id: 2, nombre: "Ana García", dni: "87654321", cargo: "Copiloto", licencia: "A-I", estado: "Activo" },
  { id: 3, nombre: "Luis Torres", dni: "45678912", cargo: "Conductor", licencia: "A-IIIb", estado: "Vacaciones" },
  { id: 4, nombre: "María Santos", dni: "78912345", cargo: "Supervisor", licencia: "-", estado: "Activo" },
];

export function ParamsMaintenance() {
  const [selectedCategory, setSelectedCategory] = useState("vehiculos");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const getCategoryData = () => {
    switch (selectedCategory) {
      case "vehiculos":
        return vehiculosData;
      case "operarios":
        return operariosData;
      default:
        return [];
    }
  };

  const getCategoryColumns = () => {
    switch (selectedCategory) {
      case "vehiculos":
        return [
          { key: "placa", label: "Placa", sortable: true },
          { key: "modelo", label: "Modelo", sortable: true },
          { key: "capacidad", label: "Capacidad", sortable: true },
          {
            key: "estado",
            label: "Estado",
            render: (item: any) => (
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  item.estado === "Activo"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {item.estado}
              </span>
            ),
          },
          { key: "ultimoMant", label: "Último Mantenimiento" },
        ];
      case "operarios":
        return [
          { key: "nombre", label: "Nombre", sortable: true },
          { key: "dni", label: "DNI" },
          { key: "cargo", label: "Cargo" },
          { key: "licencia", label: "Licencia" },
          {
            key: "estado",
            label: "Estado",
            render: (item: any) => (
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  item.estado === "Activo"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {item.estado}
              </span>
            ),
          },
        ];
      default:
        return [];
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const selectedCat = categories.find((c) => c.id === selectedCategory);
  const IconComponent = selectedCat?.icon || Truck;

  return (
    <div className="min-h-full bg-background">
      <PageHeader
        title="Mantenimiento de Parámetros"
        subtitle="Configuración maestra del sistema"
      />

      <div className="p-8">
        <div className="grid grid-cols-5 gap-6">
          {/* Categories Sidebar */}
          <div className="col-span-1 space-y-2">
            <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Categorías
            </h3>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-card text-foreground hover:bg-muted border border-border"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="col-span-4">
            <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedCat?.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Gestiona y configura los registros maestros
                  </p>
                </div>
              </div>
            </div>

            <DataTable
              columns={getCategoryColumns()}
              data={getCategoryData()}
              onRowClick={handleEdit}
              onAdd={handleAdd}
              onExport={() => console.log("Export")}
              searchPlaceholder={`Buscar ${selectedCat?.name.toLowerCase()}...`}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-card rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">
                {editingItem ? "Editar" : "Nuevo"} {selectedCat?.name}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-6">
              {selectedCategory === "vehiculos" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Placa
                      </label>
                      <input
                        type="text"
                        defaultValue={editingItem?.placa}
                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                        placeholder="ABC-123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Modelo
                      </label>
                      <input
                        type="text"
                        defaultValue={editingItem?.modelo}
                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                        placeholder="Mercedes-Benz Sprinter"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Capacidad
                      </label>
                      <input
                        type="number"
                        defaultValue={editingItem?.capacidad}
                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                        placeholder="20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Estado
                      </label>
                      <select
                        defaultValue={editingItem?.estado}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Activo">Activo</option>
                        <option value="Mantenimiento">Mantenimiento</option>
                        <option value="Inactivo">Inactivo</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {selectedCategory === "operarios" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        defaultValue={editingItem?.nombre}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Carlos Mendoza"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        DNI
                      </label>
                      <input
                        type="text"
                        defaultValue={editingItem?.dni}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="12345678"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Cargo
                      </label>
                      <select
                        defaultValue={editingItem?.cargo}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Conductor">Conductor</option>
                        <option value="Copiloto">Copiloto</option>
                        <option value="Supervisor">Supervisor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Licencia
                      </label>
                      <input
                        type="text"
                        defaultValue={editingItem?.licencia}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="A-IIIc"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

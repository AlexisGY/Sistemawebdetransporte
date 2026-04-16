import { useState } from "react";
import { ChevronDown, ChevronUp, Download, Filter, Plus, Search } from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn } from "../ui/utils";

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  onAdd?: () => void;
  onExport?: () => void;
  searchPlaceholder?: string;
  title?: string;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  onRowClick,
  onAdd,
  onExport,
  searchPlaceholder = "Buscar...",
  title,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    activos: true,
    pendientes: false,
    cerrados: false,
    soloConIncidencia: false,
  });
  const itemsPerPage = 10;

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortColumn(columnKey);
    setSortDirection("asc");
  };

  const filteredData = data.filter((item) => {
    const searchValue = searchTerm.toLowerCase();
    return Object.values(item as Record<string, unknown>).some((value) =>
      String(value).toLowerCase().includes(searchValue),
    );
  });

  const sortedData = [...filteredData].sort((left, right) => {
    if (!sortColumn) return 0;

    const leftValue = String((left as Record<string, unknown>)[sortColumn] ?? "");
    const rightValue = String((right as Record<string, unknown>)[sortColumn] ?? "");
    const comparison = leftValue.localeCompare(rightValue, undefined, {
      numeric: true,
      sensitivity: "base",
    });

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Card className="border-border/70 bg-card/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <CardHeader className="border-b border-border/60">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {title && <CardTitle className="text-lg font-semibold">{title}</CardTitle>}

          <div className="flex flex-wrap items-center gap-2">
            {onExport && (
              <Button variant="outline" onClick={onExport} className="rounded-xl">
                <Download className="size-4" />
                Exportar
              </Button>
            )}
            {onAdd && (
              <Button onClick={onAdd} className="rounded-xl">
                <Plus className="size-4" />
                Agregar nuevo
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="h-10 rounded-xl border-border/80 bg-background pl-10"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() => setShowFilters((current) => !current)}
          >
            <Filter className="size-4" />
            Filtros
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 rounded-2xl border border-border/70 bg-muted/20 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">Opciones de filtrado</p>
                <p className="text-xs text-muted-foreground">
                  Vista previa de filtros. Se muestran opciones, sin aplicar lógica todavía.
                </p>
              </div>

              <Button type="button" variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                Cerrar
              </Button>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Estado</p>
                <div className="grid grid-cols-2 gap-3">
                  <Label htmlFor="filtro-activos" className="cursor-pointer text-sm">
                    <Checkbox
                      id="filtro-activos"
                      checked={filterOptions.activos}
                      onCheckedChange={(checked) =>
                        setFilterOptions((current) => ({ ...current, activos: Boolean(checked) }))
                      }
                    />
                    Activos
                  </Label>

                  <Label htmlFor="filtro-pendientes" className="cursor-pointer text-sm">
                    <Checkbox
                      id="filtro-pendientes"
                      checked={filterOptions.pendientes}
                      onCheckedChange={(checked) =>
                        setFilterOptions((current) => ({ ...current, pendientes: Boolean(checked) }))
                      }
                    />
                    Pendientes
                  </Label>

                  <Label htmlFor="filtro-cerrados" className="cursor-pointer text-sm">
                    <Checkbox
                      id="filtro-cerrados"
                      checked={filterOptions.cerrados}
                      onCheckedChange={(checked) =>
                        setFilterOptions((current) => ({ ...current, cerrados: Boolean(checked) }))
                      }
                    />
                    Cerrados
                  </Label>

                  <Label htmlFor="filtro-incidencia" className="cursor-pointer text-sm">
                    <Checkbox
                      id="filtro-incidencia"
                      checked={filterOptions.soloConIncidencia}
                      onCheckedChange={(checked) =>
                        setFilterOptions((current) => ({
                          ...current,
                          soloConIncidencia: Boolean(checked),
                        }))
                      }
                    />
                    Con incidencia
                  </Label>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Rango de fechas
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="date" aria-label="Fecha desde" />
                  <Input type="date" aria-label="Fecha hasta" />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Tipo de búsqueda
                </p>
                <div className="grid gap-3">
                  <Label htmlFor="filtro-general" className="cursor-pointer text-sm">
                    <Checkbox id="filtro-general" />
                    General
                  </Label>
                  <Label htmlFor="filtro-detallada" className="cursor-pointer text-sm">
                    <Checkbox id="filtro-detallada" />
                    Detallada
                  </Label>
                  <Label htmlFor="filtro-critica" className="cursor-pointer text-sm">
                    <Checkbox id="filtro-critica" />
                    Crítica
                  </Label>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 border-t border-border/60 pt-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setFilterOptions({
                    activos: false,
                    pendientes: false,
                    cerrados: false,
                    soloConIncidencia: false,
                  })
                }
              >
                Limpiar
              </Button>
              <Button type="button" size="sm">
                Aplicar
              </Button>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="px-0">
        <Table>
          <TableHeader className="bg-muted/35">
            <TableRow className="hover:bg-muted/35">
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(String(column.key))}
                      className="flex items-center gap-2 transition-colors hover:text-foreground"
                    >
                      {column.label}
                      {sortColumn === column.key &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        ))}
                    </button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow
                key={item.id || index}
                onClick={() => onRowClick?.(item)}
                className={cn(onRowClick && "cursor-pointer")}
              >
                {columns.map((column) => (
                  <TableCell
                    key={String(column.key)}
                    className="px-6 py-4 text-sm text-foreground"
                  >
                    {column.render
                      ? column.render(item)
                      : String((item as Record<string, unknown>)[String(column.key)] ?? "-")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {totalPages > 1 && (
        <div className="flex flex-col gap-3 border-t border-border/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, sortedData.length)} de{" "}
            {sortedData.length} resultados
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded-xl"
            >
              Anterior
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNumber)}
                  className="min-w-9 rounded-xl"
                >
                  {pageNumber}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="rounded-xl"
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

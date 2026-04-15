import { useState } from "react";
import { ChevronDown, ChevronUp, Download, Filter, Plus, Search } from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
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

          <Button variant="outline" className="rounded-xl">
            <Filter className="size-4" />
            Filtros
          </Button>
        </div>
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
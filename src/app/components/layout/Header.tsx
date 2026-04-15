import { Bell, Search, Settings, User } from "lucide-react";
import { useLocation } from "react-router";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

function getSectionLabel(pathname: string) {
  if (pathname.startsWith("/gerencial")) return "Gerencial";
  if (pathname.startsWith("/operativo")) return "Operativo";
  return "Acceso";
}

export function Header() {
  const location = useLocation();
  const sectionLabel = getSectionLabel(location.pathname);
  const visibleUrl = `https://sistema.transportes.com${location.pathname}`;

  return (
    <header className="border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex flex-1 items-center gap-4">
          <div className="hidden lg:flex items-center gap-3">
            <div className="rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs font-semibold text-foreground">
              Sistema de Transporte y Logística
            </div>
            <div className="text-xs font-mono text-muted-foreground">{visibleUrl}</div>
          </div>

          <Badge
            variant="outline"
            className="hidden rounded-full border-border/80 bg-card/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground lg:inline-flex"
          >
            {sectionLabel}
          </Badge>

          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar rutas, operarios o tickets"
              className="h-10 rounded-full border-border/80 bg-card/80 pl-10 pr-4 shadow-none"
            />
          </div>
        </div>

        <div className="ml-6 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full border border-transparent hover:border-border/80 hover:bg-card"
          >
            <Bell className="size-4 text-muted-foreground" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-foreground/80" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border border-transparent hover:border-border/80 hover:bg-card"
          >
            <Settings className="size-4 text-muted-foreground" />
          </Button>

          <div className="ml-2 hidden items-center gap-3 border-l border-border/60 pl-4 sm:flex">
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">Usuario Admin</p>
              <p className="text-xs text-muted-foreground">Prototipo corporativo</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <User className="size-5" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

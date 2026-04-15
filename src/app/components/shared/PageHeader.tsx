import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, showBack = false, actions }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="border-b border-border/60 bg-background/70 px-6 py-5 backdrop-blur-sm lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          {showBack && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
              className="mt-1 h-10 w-10 rounded-xl border-border/80 bg-card"
            >
              <ArrowLeft className="size-4" />
            </Button>
          )}

          <div>
            <Badge
              variant="outline"
              className="mb-3 rounded-full border-border/80 bg-card/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
            >
              Vista
            </Badge>
            <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
            {subtitle && <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{subtitle}</p>}
          </div>
        </div>

        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
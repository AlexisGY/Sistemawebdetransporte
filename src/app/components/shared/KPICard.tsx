import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { cn } from "../ui/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  variant?: "primary" | "secondary" | "accent" | "destructive";
  subtitle?: string;
}

const variantClasses = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
  destructive: "bg-destructive text-destructive-foreground",
};

export function KPICard({ title, value, change, icon: Icon, variant = "primary", subtitle }: KPICardProps) {
  const tone = variantClasses[variant];

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-border/70 bg-card/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Badge
                variant="outline"
                className="rounded-full border-border/70 bg-muted/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
              >
                KPI
              </Badge>
              <p className="mt-4 text-sm font-medium text-muted-foreground">{title}</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
              {subtitle && <p className="mt-2 text-xs text-muted-foreground">{subtitle}</p>}

              {change !== undefined && (
                <div className="mt-4 flex items-center gap-2">
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      change >= 0 ? "text-foreground" : "text-destructive",
                    )}
                  >
                    {change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`}
                  </span>
                  <span className="text-xs text-muted-foreground">vs mes anterior</span>
                </div>
              )}
            </div>

            <div className={cn("flex size-12 items-center justify-center rounded-2xl shadow-sm", tone)}>
              <Icon className="size-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  color?: "indigo" | "emerald" | "amber" | "rose" | "purple" | "blue";
  subtitle?: string;
}

const colorClasses = {
  indigo: {
    bg: "bg-indigo-50",
    icon: "bg-indigo-600",
    text: "text-indigo-600",
    trend: "text-indigo-600",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "bg-emerald-600",
    text: "text-emerald-600",
    trend: "text-emerald-600",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "bg-amber-600",
    text: "text-amber-600",
    trend: "text-amber-600",
  },
  rose: {
    bg: "bg-rose-50",
    icon: "bg-rose-600",
    text: "text-rose-600",
    trend: "text-rose-600",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "bg-purple-600",
    text: "text-purple-600",
    trend: "text-purple-600",
  },
  blue: {
    bg: "bg-blue-50",
    icon: "bg-blue-600",
    text: "text-blue-600",
    trend: "text-blue-600",
  },
};

export function KPICard({ title, value, change, icon: Icon, color = "indigo", subtitle }: KPICardProps) {
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {change >= 0 ? (
                <>
                  <svg className={`w-4 h-4 ${colors.trend}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span className={`text-sm font-medium ${colors.trend}`}>
                    +{change.toFixed(1)}%
                  </span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <span className="text-sm font-medium text-rose-600">
                    {change.toFixed(1)}%
                  </span>
                </>
              )}
              <span className="text-xs text-slate-500 ml-1">vs mes anterior</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${colors.icon} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

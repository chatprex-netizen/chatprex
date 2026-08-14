import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'emerald' | 'blue' | 'purple' | 'amber' | 'primary' | 'rose';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'primary',
}) => {
  const colorMap = {
    primary: 'bg-blue-50 text-[#004aad] border-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900',
    blue: 'bg-blue-50 text-[#004aad] border-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
    purple: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900',
    amber: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
    rose: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900',
  };

  return (
    <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card flex items-center gap-2 sm:gap-2.5 transition-all">
      <div className={`p-1.5 sm:p-2 rounded-lg border shrink-0 ${colorMap[color] || colorMap.primary}`}>
        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-semibold truncate">
          {title}
        </div>
        <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight truncate">
          {value}
        </div>
        {subtitle && (
          <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium truncate">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

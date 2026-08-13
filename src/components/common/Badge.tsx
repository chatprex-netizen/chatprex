import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose' | 'gray' | 'primary' | string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gray',
  size = 'sm',
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'emerald':
      case 'ganado':
      case 'disponible':
      case 'confirmada':
      case 'firmado':
      case 'al_dia':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
      case 'blue':
      case 'primary':
      case 'en_negociacion':
      case 'enviado':
      case 'programada':
      case 'comprador':
        return 'bg-blue-50 text-[#004aad] border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800';
      case 'purple':
      case 'inversionista':
      case 'preventa':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800';
      case 'amber':
      case 'media':
      case 'reservada':
      case 'pendiente':
      case 'proximo':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
      case 'rose':
      case 'alta':
      case 'urgente':
      case 'perdido':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border ${sizeStyles} ${getStyles()} tracking-normal capitalize`}
    >
      {children}
    </span>
  );
};

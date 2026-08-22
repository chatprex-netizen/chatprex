import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCRM();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderClass = 'border-l-4 border-l-[#004aad] dark:border-l-[#38BDF8]';
        let iconColor = 'text-[#004aad] dark:text-[#38BDF8]';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderClass = 'border-l-4 border-l-emerald-500';
          iconColor = 'text-emerald-500';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-l-4 border-l-amber-500';
          iconColor = 'text-amber-500';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-l-4 border-l-rose-500';
          iconColor = 'text-rose-500';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-800 ${borderClass} animate-fade-in transition-all duration-200 backdrop-blur-md`}
          >
            <Icon className={`w-5 h-5 ${iconColor} shrink-0 mt-0.5`} />
            
            <div className="flex-1 min-w-0 pr-1">
              <h5 className="font-bold text-xs text-slate-900 dark:text-white leading-tight truncate">
                {toast.title}
              </h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug break-words">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
              title="Cerrar notificación"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

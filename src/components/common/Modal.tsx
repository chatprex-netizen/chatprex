import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    '4xl': 'sm:max-w-4xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Modal Box */}
      <div
        className={`relative w-full ${maxWidthClasses} bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-modal border-t sm:border border-slate-200 dark:border-slate-800 z-10 max-h-[90vh] flex flex-col animate-slide-up sm:animate-fade-in`}
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1">
          <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[11px] text-slate-400 font-normal mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-5 py-4 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

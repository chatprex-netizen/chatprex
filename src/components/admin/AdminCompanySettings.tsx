import React, { useState } from 'react';
import { Building2, Moon, Sun, RotateCcw, Check } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useTheme } from '../../context/ThemeContext';

export const AdminCompanySettings: React.FC = () => {
  const { resetToDemoData } = useCRM();
  const { theme, toggleTheme } = useTheme();

  const [agencyName, setAgencyName] = useState('Inmobiliaria CRM');
  const [agencyPhone, setAgencyPhone] = useState('+51 987 654 321');
  const [agencyEmail, setAgencyEmail] = useState('contacto@inmobiliaria.com');
  const [currency, setCurrency] = useState('PEN');
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="max-w-3xl animate-fade-in">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">Configuración Central</h2>
        <p className="text-[11px] text-slate-500 mt-0.5">Personaliza los datos de tu empresa, moneda y apariencia.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Agency Information */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <h3 className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#004aad]" />
            Datos de la empresa inmobiliaria
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-[11px] font-semibold mb-1">
                Nombre comercial
              </label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad] focus:ring-1 focus:ring-[#004aad]"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-[11px] font-semibold mb-1">
                Moneda principal
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad] focus:ring-1 focus:ring-[#004aad]"
              >
                <option value="PEN">S/ (Soles peruanos)</option>
                <option value="USD">$ (Dólares americanos)</option>
                <option value="EUR">€ (Euros)</option>
                <option value="MXN">$ (Pesos mexicanos)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-[11px] font-semibold mb-1">
                Teléfono de atención
              </label>
              <input
                type="text"
                value={agencyPhone}
                onChange={(e) => setAgencyPhone(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad] focus:ring-1 focus:ring-[#004aad]"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-[11px] font-semibold mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={agencyEmail}
                onChange={(e) => setAgencyEmail(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad] focus:ring-1 focus:ring-[#004aad]"
              />
            </div>
          </div>
        </div>

        {/* Theme Preference */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-amber-100'}`}>
              {theme === 'dark' ? <Moon className="w-4 h-4 text-slate-300" /> : <Sun className="w-4 h-4 text-amber-600" />}
            </div>
            <div>
              <div className="font-semibold text-xs text-slate-900 dark:text-white">
                Modo {theme === 'dark' ? 'oscuro' : 'claro'}
              </div>
              <div className="text-[10px] text-slate-500">Ajusta la apariencia visual de la plataforma</div>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Alternar
          </button>
        </div>

        {/* Demo Data Reset */}
        <div className="p-4 bg-rose-50/50 dark:bg-rose-900/10 rounded-xl border border-rose-200 dark:border-rose-800/30 flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-xs text-rose-900 dark:text-rose-400">
              Restablecer datos
            </h4>
            <p className="text-[10px] text-rose-700/80 dark:text-rose-300/60 mt-0.5 max-w-[200px]">
              Vuelve a los datos demo iniciales (irrevocable).
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('¿Seguro que deseas restablecer todos los datos? Esto no se puede deshacer.')) {
                resetToDemoData();
                alert('Datos restablecidos exitosamente.');
                window.location.reload();
              }
            }}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-400 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restablecer
          </button>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          {savedToast && (
            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 animate-fade-in">
              <Check className="w-3.5 h-3.5" /> Guardado
            </span>
          )}
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-[#004aad] hover:bg-[#003b8a] text-white font-bold text-xs transition-colors shadow-sm"
          >
            Guardar configuración
          </button>
        </div>
      </form>
    </div>
  );
};

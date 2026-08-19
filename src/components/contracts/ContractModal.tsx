import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Contract, ContractType, ContractStatus } from '../../types';
import { useCRM } from '../../context/CRMContext';

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractToEdit?: Contract | null;
}

export const ContractModal: React.FC<ContractModalProps> = ({
  isOpen,
  onClose,
  contractToEdit,
}) => {
  const { addContract, updateContract, contacts, properties, projects } = useCRM();

  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const [formData, setFormData] = useState({
    code: `SEP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    type: 'Separación' as ContractType,
    amount: 5000,
    currency: 'USD',
    unit: '',
    propertyId: '',
    client: '',
    clientDniRuc: '',
    clientPhone: '',
    clientAddress: '',
    clientMaritalStatus: 'Soltero/a',
    spouseName: '',
    spouseDni: '',
    status: 'Borrador' as ContractStatus,
    notes: '',
  });

  useEffect(() => {
    if (contractToEdit) {
      setFormData({
        code: contractToEdit.code,
        type: contractToEdit.type,
        amount: contractToEdit.amount,
        currency: contractToEdit.currency,
        unit: contractToEdit.unit,
        propertyId: contractToEdit.propertyId || '',
        client: contractToEdit.client,
        clientDniRuc: contractToEdit.clientDniRuc || '',
        clientPhone: contractToEdit.clientPhone || '',
        clientAddress: contractToEdit.clientAddress || '',
        clientMaritalStatus: contractToEdit.clientMaritalStatus || 'Soltero/a',
        spouseName: contractToEdit.spouseName || '',
        spouseDni: contractToEdit.spouseDni || '',
        status: contractToEdit.status,
        notes: contractToEdit.notes || '',
      });
    } else {
      const randomNum = Math.floor(100 + Math.random() * 900);
      setFormData({
        code: `SEP-${new Date().getFullYear()}-${randomNum}`,
        type: 'Separación',
        amount: 5000,
        currency: 'S/',
        unit: properties[0] ? `${properties[0].code} · ${properties[0].title}` : 'T1-A-302 · Departamento 302 interior',
        propertyId: properties[0]?.id || '',
        client: contacts[0]?.name || 'Lucía Ferrer',
        clientDniRuc: '',
        clientPhone: contacts[0]?.phone || '',
        clientAddress: '',
        clientMaritalStatus: 'Soltero/a',
        spouseName: '',
        spouseDni: '',
        status: 'Borrador',
        notes: '',
      });
    }
  }, [contractToEdit, isOpen, properties, contacts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.client || !formData.unit) {
      alert('Por favor completa todos los campos requeridos (*)');
      return;
    }

    if (contractToEdit) {
      updateContract(contractToEdit.id, formData);
    } else {
      addContract(formData);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={contractToEdit ? 'Editar Contrato' : 'Generar Nuevo Contrato'}
      subtitle="Genera un documento legal de separación, arras o compraventa"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Código Correlativo *
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Tipo de Contrato *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ContractType })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="Separación">Separación</option>
              <option value="Compraventa">Compraventa</option>
              <option value="Arras">Arras</option>
              <option value="Alquiler">Alquiler</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Proyecto Asociado
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setFormData(prev => ({ ...prev, propertyId: '', unit: '' }));
              }}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="">-- Todos o Independiente --</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Propiedad Asociada
            </label>
            <select
              value={formData.propertyId}
              onChange={(e) => {
                const prop = properties.find(p => p.id === e.target.value);
                setFormData({ 
                  ...formData, 
                  propertyId: e.target.value,
                  unit: prop ? `${prop.code} - ${prop.title}` : formData.unit
                });
              }}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="">-- Sin propiedad (Solo texto) --</option>
              {properties
                .filter(p => {
                  if (selectedProjectId) {
                    const proj = projects.find(proj => proj.id === selectedProjectId);
                    if (proj && p.projectName !== proj.name) return false;
                  }
                  return p.status === 'disponible' || p.status === 'en_negociacion' || p.id === formData.propertyId;
                })
                .map(p => (
                  <option key={p.id} value={p.id}>{p.code} - {p.title}</option>
                ))
              }
            </select>
          </div>
        </div>

        {!formData.propertyId && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Unidad / Inmueble (Detalle) *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: T1-A-302 · Departamento 302 interior"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Comprador / Cliente *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Lucía Ferrer"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              DNI / RUC *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: 12345678"
              value={formData.clientDniRuc}
              onChange={(e) => setFormData({ ...formData, clientDniRuc: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Teléfono *
            </label>
            <input
              type="tel"
              required
              placeholder="Ej: 987654321"
              value={formData.clientPhone}
              onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Estado Civil
            </label>
            <select
              value={formData.clientMaritalStatus}
              onChange={(e) => setFormData({ ...formData, clientMaritalStatus: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="Soltero/a">Soltero/a</option>
              <option value="Casado/a">Casado/a</option>
              <option value="Divorciado/a">Divorciado/a</option>
              <option value="Viudo/a">Viudo/a</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Dirección del Cliente
            </label>
            <input
              type="text"
              placeholder="Ej: Av. Principal 123"
              value={formData.clientAddress}
              onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {formData.clientMaritalStatus === 'Casado/a' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                Nombre del Cónyuge *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Juan Pérez"
                value={formData.spouseName}
                onChange={(e) => setFormData({ ...formData, spouseName: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                DNI del Cónyuge *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: 87654321"
                value={formData.spouseDni}
                onChange={(e) => setFormData({ ...formData, spouseDni: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Monto del Contrato
            </label>
            <div className="flex gap-1">
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-18 px-2 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 font-medium"
              >
                <option value="S/">S/</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              <input
                type="number"
                min={0}
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="flex-1 px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad] font-semibold text-emerald-600 dark:text-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Estado Inicial
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ContractStatus })}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="Borrador">Borrador</option>
              <option value="Enviado">Enviado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Firmado">Firmado</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
            Cláusulas o Notas Adicionales
          </label>
          <textarea
            rows={2}
            placeholder="Condiciones de pago, notaría o arras..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-[#004aad] outline-none text-slate-900 dark:text-slate-100 resize-none leading-relaxed"
          />
        </div>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 text-xs font-bold rounded-xl bg-[#004aad] hover:bg-[#003b8a] text-white shadow-xs transition-all active:scale-95"
          >
            {contractToEdit ? 'Guardar Cambios' : 'Generar Contrato'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

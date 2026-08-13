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
  const { addContract, updateContract, contacts, properties } = useCRM();

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
        propertyId: '',
        client: contacts[0]?.name || 'Lucía Ferrer',
        clientDniRuc: '',
        clientPhone: '',
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
    if (!formData.unit.trim() || !formData.client.trim()) return;

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
      title={contractToEdit ? 'Editar contrato' : 'Nuevo contrato'}
      subtitle="Genera un documento de separación, compraventa o alquiler"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Código correlativo *
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Tipo de contrato *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ContractType })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="Separación">Separación</option>
              <option value="Compraventa">Compraventa</option>
              <option value="Arras">Arras</option>
              <option value="Alquiler">Alquiler</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Propiedad asociada
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
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="">-- Sin propiedad (Solo texto) --</option>
              {properties.filter(p => p.status === 'disponible' || p.status === 'en_negociacion' || p.id === formData.propertyId).map(p => (
                <option key={p.id} value={p.id}>{p.code} - {p.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Unidad / Inmueble (Detalle) *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: T1-A-302 · Departamento 302 interior"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
            Comprador / Cliente *
          </label>
          <input
            type="text"
            required
            placeholder="Ej: Lucía Ferrer"
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            className="w-full px-3 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              DNI / RUC *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: 12345678"
              value={formData.clientDniRuc}
              onChange={(e) => setFormData({ ...formData, clientDniRuc: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
            />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Estado Civil
            </label>
            <select
              value={formData.clientMaritalStatus}
              onChange={(e) => setFormData({ ...formData, clientMaritalStatus: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="Soltero/a">Soltero/a</option>
              <option value="Casado/a">Casado/a</option>
              <option value="Divorciado/a">Divorciado/a</option>
              <option value="Viudo/a">Viudo/a</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Teléfono *
            </label>
            <input
              type="tel"
              required
              placeholder="Ej: 987654321"
              value={formData.clientPhone}
              onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
            />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Dirección del Cliente *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Av. Principal 123"
              value={formData.clientAddress}
              onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
            />
          </div>
        </div>

        {formData.clientMaritalStatus === 'Casado/a' && (
          <div className="grid grid-cols-2 gap-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Nombre del Cónyuge *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Juan Pérez"
                value={formData.spouseName}
                onChange={(e) => setFormData({ ...formData, spouseName: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                DNI del Cónyuge *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: 87654321"
                value={formData.spouseDni}
                onChange={(e) => setFormData({ ...formData, spouseDni: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Monto del contrato
            </label>
            <div className="flex gap-1.5">
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-18 px-2 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 font-medium"
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
                className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Estado inicial
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ContractStatus })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="Borrador">Borrador</option>
              <option value="Enviado">Enviado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Firmado">Firmado</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
            Cláusulas o notas adicionales
          </label>
          <textarea
            rows={2}
            placeholder="Condiciones de pago, notaría o arras..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-1.5 rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 resize-none"
          />
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-[#004aad] hover:bg-[#003b8a] text-white font-medium shadow-xs transition-all"
          >
            {contractToEdit ? 'Guardar cambios' : 'Generar contrato'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

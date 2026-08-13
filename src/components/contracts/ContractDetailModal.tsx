import React from 'react';
import { Modal } from '../common/Modal';
import { Contract } from '../../types';
import { Badge } from '../common/Badge';
import { useCRM } from '../../context/CRMContext';
import { Printer } from 'lucide-react';

interface ContractDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract | null;
  onEdit: (contract: Contract) => void;
}

export const ContractDetailModal: React.FC<ContractDetailModalProps> = ({
  isOpen,
  onClose,
  contract,
  onEdit,
}) => {
  const { updateContractStatus, currentAgent } = useCRM();

  if (!contract) return null;

  const handleStatusChange = (newStatus: any) => {
    updateContractStatus(contract.id, newStatus);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Documento: ${contract.code}`}
      subtitle={`${contract.type} · ${contract.unit}`}
      maxWidth="xl"
    >
      <div className="space-y-4 text-xs">
        {/* Document Status & Actions Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-normal">Estado:</span>
            <Badge variant={contract.status.toLowerCase()} size="sm">
              {contract.status}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleStatusChange('Firmado')}
              className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium text-[11px] transition-colors"
            >
              Marcar firmado
            </button>

            <button
              onClick={() => handleStatusChange('Enviado')}
              className="px-2.5 py-1 rounded-md bg-blue-50 text-[#004aad] hover:bg-blue-100 font-medium text-[11px] transition-colors"
            >
              Marcar enviado
            </button>

            <button
              onClick={handlePrint}
              className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              title="Imprimir"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Paper Contract Document Preview */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 font-sans text-slate-800 dark:text-slate-200 leading-relaxed">
          {/* Header of Contract */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-start justify-between">
            <div>
              <div className="font-bold text-sm text-[#004aad]">Inmobiliaria CRM</div>
              <div className="text-[10px] text-slate-400">RUC: 20601234567 · Lima, Perú</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">{contract.code}</div>
              <div className="text-[10px] text-slate-400">Fecha: {contract.createdDate} 2026</div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center py-1">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
              Contrato de {contract.type}
            </h3>
            <p className="text-[11px] text-slate-400">Documento privado de validez comercial</p>
          </div>

          {/* Parties & Details Grid */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-[11px]">
            <div>
              <span className="text-slate-400 block font-normal">Comprador / Adquirente:</span>
              <strong className="text-slate-900 dark:text-white font-semibold">{contract.client}</strong>
              {contract.clientDniRuc && <div className="text-slate-500 mt-0.5">DNI/RUC: {contract.clientDniRuc}</div>}
              {contract.clientPhone && <div className="text-slate-500">Tel: {contract.clientPhone}</div>}
              {contract.clientAddress && <div className="text-slate-500">Dir: {contract.clientAddress}</div>}
              {contract.clientMaritalStatus && <div className="text-slate-500">E. Civil: {contract.clientMaritalStatus}</div>}
            </div>
            <div>
              <span className="text-slate-400 block font-normal">Inmueble / Unidad:</span>
              <strong className="text-slate-900 dark:text-white font-semibold">{contract.unit}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-normal">Monto de la operación:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                {contract.currency} {contract.amount.toLocaleString()}
              </strong>
            </div>
            {contract.clientMaritalStatus === 'Casado/a' && contract.spouseName ? (
              <div>
                <span className="text-slate-400 block font-normal">Cónyuge:</span>
                <strong className="text-slate-900 dark:text-white font-semibold">{contract.spouseName}</strong>
                {contract.spouseDni && <div className="text-slate-500 mt-0.5">DNI: {contract.spouseDni}</div>}
              </div>
            ) : (
              <div>
                <span className="text-slate-400 block font-normal">Asesor comercial:</span>
                <strong className="text-slate-900 dark:text-white font-semibold">{currentAgent.name}</strong>
              </div>
            )}
          </div>

          {/* Contract Terms */}
          <div className="space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
            <p>
              <strong>Primera: Objeto.</strong> Por medio del presente documento, las partes acuerdan la {contract.type.toLowerCase()} del inmueble individualizado como {contract.unit}, sujeto a las condiciones de pago estipuladas.
            </p>
            <p>
              <strong>Segunda: Monto y Pagos.</strong> El comprador entrega en calidad de {contract.type.toLowerCase()} la suma de {contract.currency} {contract.amount.toLocaleString()}, sirviendo el presente como comprobante de pago válido.
            </p>
            {contract.notes && (
              <p className="italic text-slate-500 bg-slate-50 dark:bg-slate-800/40 p-2 rounded border border-slate-100 dark:border-slate-800">
                Observaciones: {contract.notes}
              </p>
            )}
          </div>

          {/* Signatures Simulation */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-center text-[10px] text-slate-400">
            <div className="border-t border-slate-300 dark:border-slate-700 pt-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">{contract.client}</span>
              <span>Firma del Comprador</span>
            </div>
            {contract.clientMaritalStatus === 'Casado/a' && contract.spouseName ? (
              <div className="border-t border-slate-300 dark:border-slate-700 pt-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">{contract.spouseName}</span>
                <span>Firma del Cónyuge</span>
              </div>
            ) : (
              <div className="border-t border-slate-300 dark:border-slate-700 pt-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">{currentAgent.name}</span>
                <span>Firma de la Inmobiliaria</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onEdit(contract)}
            className="text-xs font-medium text-[#004aad] hover:underline"
          >
            Editar datos
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};

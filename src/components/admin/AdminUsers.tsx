import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Agent } from '../../types';

export const AdminUsers: React.FC = () => {
  const { agents, addAgent, updateAgent, deleteAgent } = useCRM();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'propietario' | 'supervisor' | 'agente' | 'asistente'>('agente');
  const [avatar, setAvatar] = useState('');
  const [active, setActive] = useState(true);

  const handleOpenNew = () => {
    setEditingAgent(null);
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setRole('agente');
    setAvatar('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80');
    setActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setName(agent.name);
    setEmail(agent.email);
    setPassword(agent.password || '');
    setPhone(agent.phone);
    setRole(agent.role);
    setAvatar(agent.avatar);
    setActive(agent.active !== undefined ? agent.active : true);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario/agente?')) {
      deleteAgent(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (editingAgent) {
      updateAgent(editingAgent.id, { 
        name, 
        email,
        password,
        phone,
        role,
        avatar,
        active
      });
    } else {
      addAgent({ 
        name, 
        email,
        password,
        phone,
        role,
        avatar,
        active,
        activeDealsCount: 0,
        salesVolume: 0
      });
    }
    
    setIsModalOpen(false);
  };

  const formatRole = (role: string) => {
    switch (role) {
      case 'propietario': return 'Propietario';
      case 'supervisor': return 'Supervisor';
      case 'agente': return 'Agente';
      case 'asistente': return 'Asistente';
      default: return role;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Usuarios y Agentes
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Administra los accesos y roles del equipo.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Añadir nuevo
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Usuario</th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Contacto</th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Rol</th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Estado</th>
              <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {agents.map(agent => (
              <tr key={agent.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={agent.avatar} 
                      alt={agent.name} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white text-sm">
                        {agent.name}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wide">
                        ID: {agent.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-900 dark:text-white">
                    {agent.email}
                  </div>
                  <div className="text-xs text-slate-500">{agent.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                    ${agent.role === 'propietario' 
                      ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' 
                      : agent.role === 'supervisor'
                      ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : agent.role === 'agente'
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }
                  `}>
                    {formatRole(agent.role)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {agent.active !== false ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      ACTIVO
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
                      INACTIVO
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(agent)}
                      className="p-1.5 text-[#2563eb] hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(agent.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {agents.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-900 dark:text-white">
                {editingAgent ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#004aad]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Correo
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@empresa.com"
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#004aad]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. +51 987..."
                    className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#004aad]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Dejar en blanco para no cambiar"
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#004aad]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Rol de Usuario
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#004aad]"
                >
                  <option value="propietario">Propietario</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="agente">Agente</option>
                  <option value="asistente">Asistente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  URL de Avatar (Opcional)
                </label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://ejemplo.com/avatar.jpg"
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#004aad]"
                />
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="activeState"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded border-slate-300 text-[#004aad] focus:ring-[#004aad]"
                />
                <label htmlFor="activeState" className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                  Usuario Activo (Puede ingresar al sistema)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#004aad] hover:bg-[#003c8b] rounded-lg transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {editingAgent ? 'Guardar Cambios' : 'Añadir Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

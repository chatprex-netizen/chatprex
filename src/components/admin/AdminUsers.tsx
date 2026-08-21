import React, { useState, useRef } from 'react';
import { 
  Plus, Edit2, Trash2, Check, Upload, Image as ImageIcon, Camera, RefreshCw, X, Shield, Phone, Mail, User
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Agent } from '../../types';
import { Modal } from '../common/Modal';

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
  const [showUrlInput, setShowUrlInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenNew = () => {
    setEditingAgent(null);
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setRole('agente');
    setAvatar('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80');
    setActive(true);
    setShowUrlInput(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setName(agent.name);
    setEmail(agent.email);
    setPassword('');
    setPhone(agent.phone || '');
    setRole(agent.role);
    setAvatar(agent.avatar || '');
    setActive(agent.active !== undefined ? agent.active : true);
    setShowUrlInput(false);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario/agente?')) {
      deleteAgent(id);
    }
  };

  // Procesamiento y optimización de imagen desde la PC
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación de formatos recomendados
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      alert('Formato no válido. Por favor sube una imagen en formato JPG, PNG o WEBP.');
      return;
    }

    // Validación de tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen seleccionada supera el límite máximo de 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Redimensionar y recortar a cuadrado 1:1 de 400x400 máx
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400;
        const width = img.width;
        const height = img.height;
        
        const minDim = Math.min(width, height);
        const startX = (width - minDim) / 2;
        const startY = (height - minDim) / 2;

        canvas.width = Math.min(minDim, MAX_SIZE);
        canvas.height = Math.min(minDim, MAX_SIZE);

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setAvatar(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Resetear valor para permitir volver a seleccionar el mismo archivo si se desea
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAvatar = () => {
    setAvatar('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Por favor completa el nombre y correo del usuario.');
      return;
    }

    try {
      if (editingAgent) {
        await updateAgent(editingAgent.id, { 
          name, 
          email,
          password: password.trim() || undefined,
          phone,
          role,
          avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          active
        });
      } else {
        await addAgent({ 
          name, 
          email,
          password: password.trim() || undefined,
          phone,
          role,
          avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          active,
          activeDealsCount: 0,
          salesVolume: 0
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert('Error al guardar usuario: ' + (err.message || 'Error del servidor'));
    }
  };

  const formatRole = (r: string) => {
    switch (r) {
      case 'propietario': return 'Propietario';
      case 'supervisor': return 'Supervisor';
      case 'agente': return 'Agente';
      case 'asistente': return 'Asistente';
      default: return r;
    }
  };

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Usuarios y Agentes
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Administra los miembros del equipo, credenciales de acceso y fotos de perfil.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="px-3 py-1.5 bg-[#004aad] hover:bg-[#003b8a] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Añadir Usuario
        </button>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
              <th className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800">Usuario</th>
              <th className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800">Contacto</th>
              <th className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800">Rol</th>
              <th className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800">Estado</th>
              <th className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    {agent.avatar ? (
                      <img 
                        src={agent.avatar} 
                        alt={agent.name} 
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0">
                        {agent.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white text-xs">
                        {agent.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ID: {agent.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <div className="text-slate-900 dark:text-slate-200 font-medium">
                    {agent.email}
                  </div>
                  {agent.phone && (
                    <div className="text-[10px] text-slate-400 mt-0.5">{agent.phone}</div>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 capitalize">
                    {formatRole(agent.role)}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-semibold ${
                    agent.active !== false
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${agent.active !== false ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {agent.active !== false ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleOpenEdit(agent)}
                      className="p-1.5 text-slate-500 hover:text-[#004aad] hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Editar Usuario"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(agent.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar Usuario"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {agents.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400 text-xs">
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Gestión de Usuario */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAgent ? 'Editar Usuario / Agente' : 'Nuevo Usuario / Agente'}
        subtitle="Configura datos personales, credenciales y avatar del miembro del equipo"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* SECCIÓN DE SUBIDA DE AVATAR DESDE LA PC */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#004aad]" />
                <span>Foto de Perfil / Avatar</span>
              </label>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-[10.5px] font-medium text-[#004aad] hover:underline cursor-pointer"
              >
                {showUrlInput ? 'Ocultar URL' : 'O usar URL web'}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
              {/* Vista previa circular con hover para cambiar */}
              <div 
                onClick={handleTriggerUpload}
                className="relative group w-18 h-18 rounded-full overflow-hidden border-2 border-[#004aad] bg-white dark:bg-slate-900 shadow-sm cursor-pointer shrink-0"
                title="Haz clic para seleccionar imagen desde tu PC"
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
                    <User className="w-7 h-7" />
                  </div>
                )}
                
                {/* Overlay de cámara al pasar el mouse */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[9px] font-bold transition-opacity backdrop-blur-xs">
                  <Camera className="w-4 h-4 mb-0.5" />
                  <span>Cambiar</span>
                </div>
              </div>

              {/* Controles de Subida y Recomendaciones */}
              <div className="flex-1 space-y-2 text-center sm:text-left">
                {/* Input de archivo invisible */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/webp, image/jpg"
                  className="hidden"
                />

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={handleTriggerUpload}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl bg-[#004aad] hover:bg-[#003b8a] text-white shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir desde la PC</span>
                  </button>

                  {avatar && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      Quitar foto
                    </button>
                  )}
                </div>

                {/* Recomendaciones de Formatos y Tamaños */}
                <div className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight space-y-0.5">
                  <p className="flex items-center justify-center sm:justify-start gap-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Formatos:</span> JPG, PNG, WEBP
                  </p>
                  <p className="flex items-center justify-center sm:justify-start gap-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Tamaño recomendado:</span> 400×400 px (relación 1:1, máx. 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Input opcional de URL */}
            {showUrlInput && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 animate-fade-in">
                <label className="block text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  O pega un enlace de imagen externo (URL):
                </label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
                />
              </div>
            )}
          </div>

          {/* Nombre Completo */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Nombre Completo *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Juan Pérez"
              required
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
            />
          </div>

          {/* Correo y Teléfono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                Correo Electrónico *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@empresa.com"
                required
                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                Teléfono / WhatsApp
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej. +51 987 654 321"
                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
              />
            </div>
          </div>

          {/* Contraseña & Rol */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                Contraseña {editingAgent && <span className="text-[10px] text-slate-400 font-normal">(opcional)</span>}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={editingAgent ? 'Dejar en blanco para conservar' : 'Mínimo 6 caracteres'}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                Rol de Usuario
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
              >
                <option value="propietario">Propietario (Acceso total)</option>
                <option value="supervisor">Supervisor (Gestión y reportes)</option>
                <option value="agente">Agente (Pipeline y contactos)</option>
                <option value="asistente">Asistente (Operativo)</option>
              </select>
            </div>
          </div>

          {/* Estado Activo */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="activeUserState"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-[#004aad] cursor-pointer"
            />
            <label htmlFor="activeUserState" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              Usuario Activo (Habilitado para ingresar y recibir leads)
            </label>
          </div>

          {/* Footer del Formulario */}
          <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold rounded-xl bg-[#004aad] hover:bg-[#003b8a] text-white shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{editingAgent ? 'Guardar Cambios' : 'Registrar Usuario'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

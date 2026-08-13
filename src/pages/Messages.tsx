import React, { useState, useEffect, useCallback } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  Search, 
  Send, 
  Building2, 
  Lock, 
  CheckCheck, 
  ArrowLeft, 
  MessageSquare,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Property } from '../types';
import { sendMessageViaBackend } from '../lib/whatsapp/meta-api';

interface ServerConversation {
  id: string;
  contact_id: string;
  name: string;
  phone: string;
  email?: string;
  last_message_text: string;
  last_message_at: string;
  updated_at: string;
}

interface ServerMessage {
  id: string;
  conversation_id: string;
  sender_type: 'agent' | 'contact' | 'system';
  content_type: 'text' | 'image' | 'video' | 'document' | 'audio' | 'interactive' | 'template';
  content_text?: string;
  media_url?: string;
  message_id?: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  created_at: string;
}

export const MessagesPage: React.FC = () => {
  const { 
    conversations: contextConversations, 
    messages: contextMessages, 
    contacts, 
    properties, 
    activeConversationId, 
    setActiveConversationId, 
    sendMessage: sendContextMessage
  } = useCRM();

  // Real backend server state
  const [serverConversations, setServerConversations] = useState<ServerConversation[]>([]);
  const [serverMessages, setServerMessages] = useState<ServerMessage[]>([]);
  const [useBackend, setUseBackend] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);

  // Form & UI state
  const [inputMessage, setInputMessage] = useState('');
  const [isPrivateNote, setIsPrivateNote] = useState(false);
  const [showPropertyPicker, setShowPropertyPicker] = useState(false);
  const [showContactSidebar, setShowContactSidebar] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'whatsapp' | 'instagram' | 'webchat'>('all');
  const [searchContact, setSearchContact] = useState('');

  // 1. Fetch conversations from local Express / SQLite server
  const fetchBackendConversations = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/whatsapp/conversations');
      if (res.ok) {
        const data = await res.json();
        setServerConversations(data);
        setIsBackendConnected(true);
        setUseBackend(true);
      } else {
        setIsBackendConnected(false);
      }
    } catch {
      setIsBackendConnected(false);
    }
  }, []);

  // 2. Fetch messages for active conversation from local server
  const fetchBackendMessages = useCallback(async (convId: string) => {
    if (!convId) return;
    setLoadingMessages(true);
    try {
      const res = await fetch(`http://localhost:5000/api/whatsapp/conversations/${convId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setServerMessages(data);
      }
    } catch (err) {
      console.warn('Error al cargar mensajes del servidor:', err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Polling conversations & active messages every 3 seconds for real-time Meta webhooks
  useEffect(() => {
    fetchBackendConversations();
    const interval = setInterval(() => {
      fetchBackendConversations();
      if (activeConversationId && useBackend) {
        fetchBackendMessages(activeConversationId);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchBackendConversations, fetchBackendMessages, activeConversationId, useBackend]);

  // When activeConversationId changes, fetch messages immediately
  useEffect(() => {
    if (activeConversationId && isBackendConnected) {
      fetchBackendMessages(activeConversationId);
    }
  }, [activeConversationId, isBackendConnected, fetchBackendMessages]);

  // Selected Active Data (Unified between Backend SQLite & Context fallback)
  const activeServerConv = serverConversations.find(c => c.id === activeConversationId);
  const activeContextConv = contextConversations.find(c => c.id === activeConversationId);
  const activeConvId = activeServerConv?.id || activeContextConv?.id;

  const activeContact = useBackend && activeServerConv
    ? {
        id: activeServerConv.contact_id,
        name: activeServerConv.name,
        phone: activeServerConv.phone,
        email: activeServerConv.email || 'cliente@whatsapp.com',
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
        type: 'comprador' as const,
        preferredZones: ['Polanco', 'Miraflores'],
        budgetMin: 150000,
        budgetMax: 350000
      }
    : activeContextConv
    ? contacts.find(c => c.id === activeContextConv.contactId)
    : null;

  // Render list of conversations
  const displayConversations = isBackendConnected && serverConversations.length > 0
    ? serverConversations.map(c => ({
        id: c.id,
        contactId: c.contact_id,
        name: c.name,
        phone: c.phone,
        lastMessage: c.last_message_text || 'Sin mensajes',
        lastMessageTime: new Date(c.last_message_at || c.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: 'whatsapp',
        unreadCount: 0,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`
      }))
    : contextConversations.map(c => {
        const ct = contacts.find(cnt => cnt.id === c.contactId);
        return {
          id: c.id,
          contactId: c.contactId,
          name: ct?.name || 'Cliente',
          phone: ct?.phone || '',
          lastMessage: c.lastMessage,
          lastMessageTime: c.lastMessageTime,
          channel: c.channel,
          unreadCount: c.unreadCount,
          avatar: ct?.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`
        };
      });

  const filteredConversations = displayConversations.filter((c) => {
    const matchesTab = filterTab === 'all' || c.channel === filterTab;
    const matchesSearch = c.name.toLowerCase().includes(searchContact.toLowerCase()) ||
                          c.lastMessage.toLowerCase().includes(searchContact.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Handle Outbound Message Sending
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConvId) return;

    const messageText = inputMessage.trim();
    setInputMessage('');

    if (isBackendConnected && useBackend) {
      setSendingMessage(true);
      try {
        await sendMessageViaBackend({
          conversation_id: activeConvId,
          message_type: 'text',
          content_text: messageText
        });
        // Immediately refresh messages
        await fetchBackendMessages(activeConvId);
        await fetchBackendConversations();
      } catch (err: any) {
        alert(`Error al enviar mensaje vía Meta WhatsApp: ${err.message}`);
      } finally {
        setSendingMessage(false);
        setIsPrivateNote(false);
      }
    } else {
      // Fallback context send
      sendContextMessage(activeConvId, messageText, undefined, isPrivateNote);
      setIsPrivateNote(false);
    }
  };

  const handleSendPropertyAttachment = async (property: Property) => {
    if (!activeConvId) return;
    const text = `Hola ${activeContact?.name.split(' ')[0] || ''}, te comparto los detalles de esta opción: ${property.title} - $${property.price.toLocaleString()} ${property.currency}`;

    if (isBackendConnected && useBackend) {
      setSendingMessage(true);
      try {
        await sendMessageViaBackend({
          conversation_id: activeConvId,
          message_type: 'text',
          content_text: text,
          media_url: property.images[0]
        });
        await fetchBackendMessages(activeConvId);
      } catch (err: any) {
        alert(`Error al enviar ficha: ${err.message}`);
      } finally {
        setSendingMessage(false);
        setShowPropertyPicker(false);
      }
    } else {
      sendContextMessage(activeConvId, text, property, false);
      setShowPropertyPicker(false);
    }
  };

  const quickTemplates = [
    "Hola, con gusto te comparto la ficha técnica.",
    "¿Qué día te vendría mejor para coordinar una visita?",
    "Confirmada la cita para mañana. ¡Saludos!",
  ];

  return (
    <div className="h-[calc(100vh-130px)] min-h-[500px] bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-card overflow-hidden flex flex-col md:flex-row animate-fade-in text-xs">
      {/* Left Column: Conversations list */}
      <div className={`w-full md:w-80 lg:w-88 border-r border-slate-200/80 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50 ${
        activeConvId ? 'hidden md:flex' : 'flex'
      }`}>
        {/* Search & Server Status Header */}
        <div className="p-3 border-b border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-xs text-slate-800 dark:text-white flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#004aad]" />
              Bandeja de mensajes
            </h2>
            <div className="flex items-center gap-1.5">
              <span
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                  isBackendConnected
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800'
                    : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800'
                }`}
                title={isBackendConnected ? 'Backend SQLite activo en puerto 5000' : 'Servidor local no detectado, usando datos simulados'}
              >
                {isBackendConnected ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
                {isBackendConnected ? 'META REAL' : 'DEMO'}
              </span>
            </div>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar conversación..."
              value={searchContact}
              onChange={(e) => setSearchContact(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-[#004aad]"
            />
          </div>

          {/* Channel Filters */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {(['all', 'whatsapp', 'instagram', 'webchat'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                  filterTab === tab
                    ? 'bg-[#004aad] text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {tab === 'all' ? 'Todos' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredConversations.map((conv) => {
            const isSelected = conv.id === activeConvId;

            return (
              <div
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`p-3 transition-colors cursor-pointer flex items-start gap-2.5 ${
                  isSelected 
                    ? 'bg-blue-50/70 dark:bg-blue-950/40 border-l-2 border-[#004aad]' 
                    : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                }`}
              >
                <img
                  src={conv.avatar}
                  alt={conv.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                />

                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                      {conv.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">{conv.lastMessageTime}</span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {conv.lastMessage}
                  </p>

                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] text-slate-400 capitalize">
                      {conv.channel}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#004aad] text-white text-[9px] font-bold flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Center Column: Chat Messages & Input */}
      {activeContact && activeConvId ? (
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
          {/* Chat Header */}
          <div className="p-3 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setActiveConversationId(null)}
                className="md:hidden p-1 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <img
                src={activeContact.avatar}
                alt={activeContact.name}
                className="w-8 h-8 rounded-full object-cover"
              />

              <div>
                <h3 className="font-semibold text-xs text-slate-900 dark:text-white">
                  {activeContact.name}
                </h3>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Conectado vía WhatsApp Meta Cloud API
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowContactSidebar(!showContactSidebar)}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200"
            >
              Ficha del cliente
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc] dark:bg-slate-950/40">
            {loadingMessages ? (
              <div className="py-10 text-center text-slate-400">
                <RefreshCw className="w-5 h-5 mx-auto animate-spin mb-1 text-[#004aad]" />
                <span>Cargando historial de mensajes...</span>
              </div>
            ) : isBackendConnected && serverMessages.length > 0 ? (
              serverMessages.map((msg) => {
                const isMe = msg.sender_type === 'agent';

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[78%] p-3 rounded-xl space-y-1.5 shadow-subtle ${
                        isMe 
                          ? 'bg-[#004aad] text-white rounded-br-none' 
                          : 'bg-white dark:bg-slate-800 border border-slate-200/80 text-slate-800 dark:text-slate-100 rounded-bl-none'
                      }`}
                    >
                      <p className="leading-relaxed text-[11px]">{msg.content_text}</p>

                      {msg.media_url && (
                        <div className="p-2 rounded-lg bg-black/10 dark:bg-black/30 border border-white/20 text-white">
                          <img
                            src={msg.media_url}
                            alt="Media"
                            className="w-full h-32 rounded object-cover"
                          />
                        </div>
                      )}

                      <div className={`flex items-center justify-end gap-1 text-[9px] ${
                        isMe ? 'text-blue-100' : 'text-slate-400'
                      }`}>
                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isMe && (
                          <CheckCheck className={`w-3 h-3 ${msg.status === 'read' ? 'text-emerald-300' : ''}`} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              (contextMessages[activeConvId] || []).map((msg) => {
                const isMe = msg.sender === 'agent';

                if (msg.isPrivateNote) {
                  return (
                    <div key={msg.id} className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-900 dark:text-amber-200 max-w-md mx-auto text-[11px]">
                      <div className="flex items-center gap-1 font-semibold text-amber-700">
                        <Lock className="w-3 h-3" /> Nota interna privada
                      </div>
                      <p className="mt-0.5">{msg.content}</p>
                      <span className="text-[9px] text-amber-500 block text-right mt-0.5">{msg.timestamp}</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[78%] p-3 rounded-xl space-y-1.5 shadow-subtle ${
                        isMe 
                          ? 'bg-[#004aad] text-white rounded-br-none' 
                          : 'bg-white dark:bg-slate-800 border border-slate-200/80 text-slate-800 dark:text-slate-100 rounded-bl-none'
                      }`}
                    >
                      <p className="leading-relaxed text-[11px]">{msg.content}</p>

                      {msg.propertyAttachment && (
                        <div className="p-2 rounded-lg bg-black/10 dark:bg-black/30 border border-white/20 text-white space-y-1">
                          <img
                            src={msg.propertyAttachment.images[0]}
                            alt={msg.propertyAttachment.title}
                            className="w-full h-24 rounded object-cover"
                          />
                          <div className="font-semibold truncate text-[11px]">{msg.propertyAttachment.title}</div>
                          <div className="text-[10px] font-bold text-emerald-300">
                            ${msg.propertyAttachment.price.toLocaleString()} {msg.propertyAttachment.currency}
                          </div>
                        </div>
                      )}

                      <div className={`flex items-center justify-end gap-1 text-[9px] ${
                        isMe ? 'text-blue-100' : 'text-slate-400'
                      }`}>
                        <span>{msg.timestamp}</span>
                        {isMe && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Reply Templates */}
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickTemplates.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputMessage(t)}
                className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-600 dark:text-slate-300 whitespace-nowrap hover:bg-slate-100"
              >
                {t}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsPrivateNote(!isPrivateNote)}
                className={`p-1.5 rounded-md text-[11px] font-medium flex items-center gap-1 border transition-colors ${
                  isPrivateNote 
                    ? 'bg-amber-100 text-amber-800 border-amber-300' 
                    : 'bg-[#f1f1f1] dark:bg-slate-800 text-slate-500 border-slate-200'
                }`}
                title="Nota interna"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Nota</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPropertyPicker(!showPropertyPicker)}
                className="p-1.5 rounded-md bg-[#f1f1f1] dark:bg-slate-800 text-slate-500 hover:text-[#004aad] border border-slate-200 flex items-center gap-1 text-[11px]"
                title="Enviar ficha de inmueble"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ficha</span>
              </button>

              <input
                type="text"
                placeholder={isPrivateNote ? "Escribir nota interna privada..." : "Escribe un mensaje de WhatsApp..."}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-[#f1f1f1] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:border-[#004aad]"
              />

              <button
                type="submit"
                disabled={sendingMessage}
                className="p-2 rounded-lg bg-[#004aad] hover:bg-[#003b8a] text-white shadow-xs transition-all active:scale-95 shrink-0 flex items-center justify-center disabled:opacity-50"
              >
                {sendingMessage ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Property Picker Tray */}
            {showPropertyPicker && (
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-3 gap-2 animate-fade-in">
                {properties.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSendPropertyAttachment(p)}
                    className="p-1.5 bg-white dark:bg-slate-900 rounded border border-slate-200 cursor-pointer hover:border-[#004aad] text-[10px]"
                  >
                    <div className="font-semibold truncate">{p.title}</div>
                    <div className="text-emerald-600 font-bold">${p.price.toLocaleString()} {p.currency}</div>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
          <div>
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-medium text-xs text-slate-600">Selecciona una conversación para chatear</p>
          </div>
        </div>
      )}

      {/* Right Column: Contact Sidebar */}
      {showContactSidebar && activeContact && (
        <div className="w-64 border-l border-slate-200/80 dark:border-slate-800 p-4 space-y-3 bg-white dark:bg-slate-900 text-xs animate-fade-in">
          <div className="text-center space-y-1">
            <img
              src={activeContact.avatar}
              alt={activeContact.name}
              className="w-12 h-12 rounded-full object-cover mx-auto"
            />
            <h4 className="font-semibold text-slate-900 dark:text-white">{activeContact.name}</h4>
            <Badge variant="blue" size="sm">{activeContact.type}</Badge>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
            <div><strong>Tel:</strong> {activeContact.phone}</div>
            <div><strong>Email:</strong> {activeContact.email}</div>
            <div><strong>Presupuesto:</strong> ${activeContact.budgetMin?.toLocaleString()} - ${activeContact.budgetMax?.toLocaleString()} USD</div>
            <div><strong>Zonas:</strong> {activeContact.preferredZones.join(', ')}</div>
          </div>
        </div>
      )}
    </div>
  );
};

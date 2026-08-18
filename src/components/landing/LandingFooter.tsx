import React from 'react';
import { Building2, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const LandingFooter: React.FC = () => {
  const { appBranding } = useCRM();

  const socialLinks = [
    {
      name: 'WhatsApp',
      url: 'https://wa.me/51957100984?text=Hola%2C%20deseo%20informaci%C3%B3n%20sobre%20proyectos%20y%20propiedades',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.718.074-2.316-.583-1.921-.79-3.153-2.73-3.249-2.857-.094-.127-.775-1.03-.775-1.964 0-.933.491-1.39.667-1.58.176-.19.385-.238.513-.238.128 0 .256.002.368.007.118.006.277-.045.433.33.16.386.549 1.34.597 1.437.048.096.08.209.016.335-.064.127-.096.206-.192.318-.096.111-.202.249-.289.334-.096.095-.197.198-.085.39.112.192.499.824 1.072 1.335.738.658 1.36.862 1.552.958.192.096.304.08.416-.048.112-.128.481-.56.609-.752.128-.192.256-.16.432-.096.176.064 1.121.528 1.313.624.192.096.32.144.368.224.048.08.048.464-.096.869z"/>
        </svg>
      ),
      color: 'hover:text-[#25D366] hover:border-[#25D366]/40',
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: 'hover:text-[#1877F2] hover:border-[#1877F2]/40',
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      color: 'hover:text-[#E1306C] hover:border-[#E1306C]/40',
    },
    {
      name: 'TikTok',
      url: 'https://tiktok.com',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      ),
      color: 'hover:text-white hover:border-white/40',
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      color: 'hover:text-[#FF0000] hover:border-[#FF0000]/40',
    },
  ];

  return (
    <footer className="w-full bg-[#202020] text-slate-400 text-xs border-t border-slate-800 pt-12 pb-24 md:pb-12 font-sans">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Marca & Misión */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-manrope font-extrabold text-base">
              <div className="w-7 h-7 rounded-lg bg-[#1154FF] text-white flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <span>{appBranding?.appName || 'Inmobiliaria Premium'}</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-normal">
              Especialistas en la comercialización de proyectos en preventa, casas, departamentos y lotes exclusivos en el Perú.
            </p>

            {/* Redes Sociales Interactivas */}
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">Síguenos en Redes Sociales</div>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={`w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 transition-all ${social.color}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Col 2: Contacto */}
          <div className="space-y-2.5">
            <h4 className="text-white font-manrope font-bold text-xs uppercase tracking-wider">Contacto Directo</h4>
            <ul className="space-y-2 text-xs font-normal">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#1154FF] shrink-0" />
                <span>+51 957 100 984 (Elvis Meza)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#1154FF] shrink-0" />
                <span>ventas@inmobiliaria.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Arequipa, Perú</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & CRM */}
          <div className="space-y-2.5">
            <h4 className="text-white font-manrope font-bold text-xs uppercase tracking-wider">Legal</h4>
            <ul className="space-y-1.5 text-xs font-normal">
              <li>
                <a href="#/privacy" className="hover:text-white transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#/terms" className="hover:text-white transition-colors">
                  Términos de Servicio
                </a>
              </li>
              <li>
                <a href="#/data-deletion" className="hover:text-white transition-colors">
                  Exclusión de Datos
                </a>
              </li>
              <li className="pt-1">
                <a href="#/dashboard" className="text-[#1154FF] hover:underline font-semibold">
                  Acceso CRM →
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {appBranding?.appName || 'Inmobiliaria Premium'}. Todos los derechos reservados.
          </div>
          <div>
            <span>Plataforma Inmobiliaria Inteligente</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

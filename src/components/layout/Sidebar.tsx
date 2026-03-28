'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  FileText,
  Building2,
  Activity,
  HeartPulse,
} from 'lucide-react';

const navItems = [
  { href: '/',              icon: LayoutDashboard, label: 'Dashboard'    },
  { href: '/patients',      icon: Users,            label: 'Patients'     },
  { href: '/doctors',       icon: Stethoscope,      label: 'Doctors'      },
  { href: '/appointments',  icon: Calendar,         label: 'Appointments' },
];

export function Sidebar() {
  const path = usePathname();

  return (
    <aside
      className="w-60 flex-shrink-0 flex flex-col h-full overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0f2035 0%, #1a3a5c 100%)' }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center shadow-lg">
            <HeartPulse size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-base leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              MediCore
            </p>
            <p className="text-slate-400 text-xs">HMS Platform</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest px-3 mb-3">
          Navigation
        </p>
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = href === '/' ? path === '/' : path.startsWith(href);
          return (
            <Link key={href} href={href} className={`nav-item ${active ? 'active' : ''}`}>
              <Icon size={17} className={active ? 'text-teal-400' : ''} />
              {label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
            <span className="text-teal-400 text-xs font-bold">AD</span>
          </div>
          <div>
            <p className="text-white text-xs font-semibold">Admin User</p>
            <p className="text-slate-500 text-xs">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

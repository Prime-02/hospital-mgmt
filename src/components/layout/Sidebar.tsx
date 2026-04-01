'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  HeartPulse,
  Menu,
  X,
} from 'lucide-react';

const AUTH_KEY = 'hospital-mgmt-authenticated';
const AUTH_USER_KEY = 'hospital-mgmt-user';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/patients', icon: Users, label: 'Patients' },
  { href: '/doctors', icon: Stethoscope, label: 'Doctors' },
  { href: '/appointments', icon: Calendar, label: 'Appointments' },
];

interface UserData {
  username?: string;
  email?: string;
}

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const path = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(AUTH_USER_KEY);
    if (!stored) return;

    try {
      setUser(JSON.parse(stored));
    } catch {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem(AUTH_KEY);
    window.localStorage.removeItem(AUTH_USER_KEY);
    window.location.reload();
  };

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation menu"
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950/90 text-white shadow-lg shadow-slate-950/25 ring-1 ring-white/10 transition hover:bg-slate-900 md:hidden"
      >
        <Menu size={20} />
      </button>

      <div
        className={`fixed inset-0 z-40 bg-slate-950/60 transition-opacity duration-300 md:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-full transform bg-gradient-to-b from-[#0f2035] to-[#1a3a5c] text-white shadow-2xl transition-transform duration-300 md:relative md:translate-x-0 md:w-60 md:max-w-none ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ minHeight: '100vh' }}
      >
        <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-white/10 md:px-5">
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
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-slate-100 transition hover:bg-white/20 md:hidden"
          >
            <X size={18} />
          </button>
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
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                <span className="text-teal-400 text-xs font-bold">{user?.username ? user.username[0].toUpperCase() : 'A'}</span>
              </div>
              <div>
                <p className="text-white text-xs font-semibold">
                  {user?.username ? user.username : 'Admin User'}
                </p>
                <p className="text-slate-500 text-xs">
                  {user?.email ? user.email : 'Super Admin'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

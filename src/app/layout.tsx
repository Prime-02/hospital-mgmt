import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { AuthGate } from '@/components/AuthGate';

export const metadata: Metadata = {
  title: 'MediCore HMS – Hospital Management System',
  description: 'Comprehensive hospital management platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <AuthGate>
          <div className="min-h-screen flex flex-col md:flex-row">
            <Sidebar />
            <main className="flex-1 min-h-screen overflow-y-auto">
              {children}
            </main>
          </div>
        </AuthGate>
      </body>
    </html>
  );
}

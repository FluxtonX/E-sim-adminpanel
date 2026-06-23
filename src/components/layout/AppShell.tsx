'use client';

import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileDrawer from './MobileDrawer';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      
      {/* Desktop Sidebar (hidden below lg breakpoint) */}
      <div className="hidden lg:flex h-full shrink-0">
        <Sidebar />
      </div>

      {/* Right Content Section */}
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        
        {/* Top Navbar */}
        <Navbar />

        {/* Scrollable Dashboard Canvas */}
        <main className="flex-1 overflow-y-auto px-6 py-8 relative">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Drawer (visible below lg breakpoint) */}
      <MobileDrawer />
    </div>
  );
}

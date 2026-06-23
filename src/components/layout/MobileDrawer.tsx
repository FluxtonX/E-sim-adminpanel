'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';

export default function MobileDrawer() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  // Prevent background scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Drawer Sidebar Container */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative z-10 flex h-full w-64 max-w-xs flex-col shadow-2xl"
          >
            <Sidebar />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

import { useToastStore, ToastMessage } from '@/store/useToastStore';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  const [animationClass, setAnimationClass] = useState('translate-y-2 opacity-0');

  useEffect(() => {
    // Micro-animation for toast entry
    const raf = requestAnimationFrame(() => {
      setAnimationClass('translate-y-0 opacity-100');
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-emerald-50/95 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-800',
          text: 'text-emerald-850 dark:text-emerald-250',
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
        };
      case 'error':
        return {
          bg: 'bg-red-50/95 dark:bg-red-950/90 border-red-200 dark:border-red-800',
          text: 'text-red-850 dark:text-red-250',
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-50/95 dark:bg-amber-950/90 border-amber-200 dark:border-amber-800',
          text: 'text-amber-850 dark:text-amber-250',
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
        };
      default:
        return {
          bg: 'bg-blue-50/95 dark:bg-blue-950/90 border-blue-200 dark:border-blue-800',
          text: 'text-blue-850 dark:text-blue-250',
          icon: <Info className="h-5 w-5 text-blue-500" />,
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-md transition-all duration-300 ${styles.bg} ${animationClass}`}
    >
      <div className="shrink-0">{styles.icon}</div>
      <div className="flex-1 text-xs font-semibold leading-relaxed tracking-wide text-slate-800 dark:text-slate-200">
        {toast.message}
      </div>
      <button
        onClick={onClose}
        className="shrink-0 text-slate-400 hover:text-slate-650 transition-colors rounded p-0.5"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

import { useSimulationStore } from '@/store/useSimulationStore';
import { Loader2, CheckCircle2, X } from 'lucide-react';

export default function SimulatedProgressModal() {
  const { activeSimulation, closeSimulation } = useSimulationStore();

  if (!activeSimulation) return null;

  const { title, steps, currentStepIndex, progress, status } = activeSimulation;

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-100/90 bg-white/95 p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900/95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            {status === 'completed' ? 'Action Completed' : 'Processing Request'}
          </h3>
          <button
            onClick={closeSimulation}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-6 flex flex-col items-center text-center">
          {status === 'completed' ? (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 animate-scaleUp">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>
          ) : (
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-600">
              <Loader2 className="h-10 w-10 animate-spin" />
            </div>
          )}

          <h4 className="mt-4 text-base font-bold text-slate-800 dark:text-white">
            {title}
          </h4>

          {/* Progress Bar Container */}
          <div className="mt-6 w-full space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-500">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Steps List */}
          <div className="mt-6 w-full space-y-3 text-left">
            {steps.map((step, idx) => {
              const isCompleted = idx < currentStepIndex || status === 'completed';
              const isActive = idx === currentStepIndex && status === 'running';

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : isCompleted ? 'opacity-85' : 'opacity-40'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  ) : isActive ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-blue-600" />
                  ) : (
                    <div className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-300 dark:border-slate-700" />
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      isActive
                        ? 'text-slate-900 dark:text-white font-bold'
                        : isCompleted
                        ? 'text-slate-650 dark:text-slate-300'
                        : 'text-slate-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            onClick={closeSimulation}
            className={`rounded-xl px-5 py-2 text-xs font-bold transition-all ${
              status === 'completed'
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {status === 'completed' ? 'Done' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}

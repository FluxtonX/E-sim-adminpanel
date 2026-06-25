import { create } from 'zustand';

interface ActiveSimulation {
  title: string;
  steps: string[];
  currentStepIndex: number;
  progress: number;
  status: 'running' | 'completed' | 'failed';
  onComplete?: () => void;
}

interface SimulationStore {
  activeSimulation: ActiveSimulation | null;
  startSimulation: (title: string, steps: string[], onComplete: () => void) => void;
  updateProgress: (progress: number, stepIndex: number) => void;
  completeSimulation: () => void;
  closeSimulation: () => void;
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  activeSimulation: null,
  startSimulation: (title, steps, onComplete) => {
    set({
      activeSimulation: {
        title,
        steps,
        currentStepIndex: 0,
        progress: 0,
        status: 'running',
        onComplete,
      },
    });

    const run = () => {
      const state = get().activeSimulation;
      if (!state || state.status !== 'running') return;

      const duration = 2500; // 2.5 seconds total
      const intervalTime = 50;
      const totalSteps = steps.length;
      let curProgress = 0;

      const timer = setInterval(() => {
        curProgress += (100 / (duration / intervalTime));
        if (curProgress >= 100) {
          curProgress = 100;
          clearInterval(timer);
          set((s) => {
            if (!s.activeSimulation) return {};
            return {
              activeSimulation: {
                ...s.activeSimulation,
                progress: 100,
                currentStepIndex: totalSteps - 1,
                status: 'completed',
              },
            };
          });
          // Execute onComplete callback
          if (onComplete) {
            onComplete();
          }
        } else {
          // Calculate step index
          const stepIndex = Math.min(
            Math.floor((curProgress / 100) * totalSteps),
            totalSteps - 1
          );
          set((s) => {
            if (!s.activeSimulation) return {};
            return {
              activeSimulation: {
                ...s.activeSimulation,
                progress: Math.round(curProgress),
                currentStepIndex: stepIndex,
              },
            };
          });
        }
      }, intervalTime);
    };

    run();
  },
  updateProgress: (progress, stepIndex) => {
    set((state) => {
      if (!state.activeSimulation) return {};
      return {
        activeSimulation: {
          ...state.activeSimulation,
          progress,
          currentStepIndex: stepIndex,
        },
      };
    });
  },
  completeSimulation: () => {
    set((state) => {
      if (!state.activeSimulation) return {};
      return {
        activeSimulation: {
          ...state.activeSimulation,
          progress: 100,
          status: 'completed',
        },
      };
    });
  },
  closeSimulation: () => {
    set({ activeSimulation: null });
  },
}));

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import gamePathData from '@/data/gamePath.json'

export type CharacterId = string | null

interface GameState {
  // Core state
  selectedCharacterId: CharacterId
  currentStep: number
  maxSteps: number
  isAdminMode: boolean
  victoryCount: number

  // MCQ quiz persisted progress by quiz id
  mcqProgress: Record<string, {
    idx: number
    selected: string | null
    correctCount: number
    finished: boolean
    showFeedback: boolean
    lastChosenText: string | null
    lastChosenCorrect: boolean
    appliedBonus: number | null
    done: boolean
  }>

  // Actions
  setSelectedCharacter: (id: CharacterId) => void
  setCurrentStep: (step: number) => void
  incrementStep: (delta: number) => void
  setMaxSteps: (max: number) => void
  setIsAdminMode: (enabled: boolean) => void
  resetGame: () => void
  restartGame: () => void
  incrementVictory: () => void
  resetAll: () => void

  // MCQ actions
  setMcqProgress: (id: string, patch: Partial<GameState['mcqProgress'][string]>) => void
  resetMcq: (id: string) => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      selectedCharacterId: null,
      currentStep: 0,
      maxSteps: gamePathData.maxSteps ?? 40,
    isAdminMode: false,
    victoryCount: 0,
    mcqProgress: {},

      setSelectedCharacter: (id) => set({ selectedCharacterId: id }),

      setCurrentStep: (step) => {
        const clamped = Math.max(0, Math.min(step, get().maxSteps - 1))
        set({ currentStep: clamped })
      },

      incrementStep: (delta) => {
        const { currentStep, maxSteps } = get()
        const target = Math.min(currentStep + delta, maxSteps - 1)
        set({ currentStep: target })
      },

      setMaxSteps: (max) => {
        const safeMax = Math.max(1, Math.floor(max))
        const clampedCurrent = Math.min(get().currentStep, safeMax - 1)
        set({ maxSteps: safeMax, currentStep: clampedCurrent })
      },

      setIsAdminMode: (enabled) => set({ isAdminMode: enabled }),

      resetGame: () => set({ currentStep: 0, maxSteps: gamePathData.maxSteps ?? 40 }),
      restartGame: () => set({ currentStep: 0 }),
      incrementVictory: () => set((state) => ({ victoryCount: state.victoryCount + 1 })),
      resetAll: () => set({
        selectedCharacterId: null,
        currentStep: 0,
        maxSteps: gamePathData.maxSteps ?? 40,
        isAdminMode: false,
        victoryCount: 0,
        mcqProgress: {},
      }),

      setMcqProgress: (id, patch) => set((state) => {
        const current = state.mcqProgress[id] ?? {
          idx: 0,
          selected: null,
          correctCount: 0,
          finished: false,
          showFeedback: false,
          lastChosenText: null,
          lastChosenCorrect: false,
          appliedBonus: null,
          done: false,
        }
        return {
          mcqProgress: {
            ...state.mcqProgress,
            [id]: { ...current, ...patch },
          }
        }
      }),

      resetMcq: (id) => set((state) => {
        const next = { ...state.mcqProgress }
        next[id] = {
          idx: 0,
          selected: null,
          correctCount: 0,
          finished: false,
          showFeedback: false,
          lastChosenText: null,
          lastChosenCorrect: false,
          appliedBonus: null,
          done: false,
        }
        return { mcqProgress: next }
      }),
    }),
    {
      name: 'gameStore',
      partialize: (state) => ({
        selectedCharacterId: state.selectedCharacterId,
        currentStep: state.currentStep,
        maxSteps: state.maxSteps,
        isAdminMode: state.isAdminMode,
        victoryCount: state.victoryCount,
        mcqProgress: state.mcqProgress,
      }),
    }
  )
)

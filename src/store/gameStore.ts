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

  // Actions
  setSelectedCharacter: (id: CharacterId) => void
  setCurrentStep: (step: number) => void
  incrementStep: (delta: number) => void
  setMaxSteps: (max: number) => void
  setIsAdminMode: (enabled: boolean) => void
  resetGame: () => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      selectedCharacterId: null,
      currentStep: 0,
      maxSteps: gamePathData.maxSteps ?? 40,
      isAdminMode: false,

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

      resetGame: () => set({ currentStep: 0, maxSteps: gamePathData.maxSteps ?? 40 })
    }),
    {
      name: 'gameStore',
      partialize: (state) => ({
        selectedCharacterId: state.selectedCharacterId,
        currentStep: state.currentStep,
        maxSteps: state.maxSteps,
        isAdminMode: state.isAdminMode,
      }),
    }
  )
)

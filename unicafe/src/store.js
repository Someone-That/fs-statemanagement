import { create } from 'zustand'

const useCounterStore = create(set => ({
  good: 0,
  neutral: 0,
  bad: 0,
  actions: {
    incrementGood: () => set(state => ({ good: state.good + 1 })),
    incrementNeutral: () => set(state => ({ neutral: state.neutral + 1 })),
    incrementBad: () => set(state => ({ bad: state.bad + 1 })),
  }  
}))

// the hook functions that are used elsewhere in app
export const useCounters = () => useCounterStore(state => ({
    good: state.good,
    neutral: state.neutral,
    bad: state.bad
}))
export const useCounterControls = () => useCounterStore(state => state.actions)
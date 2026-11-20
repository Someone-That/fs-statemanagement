import { create } from 'zustand'

const useNotificationStore = create((set, get) => ({
  message: null,
  timeoutId: null,
  actions: {
    setNotification: (message) => {
      const existingTimeoutId = get().timeoutId
      if (existingTimeoutId) {
        clearTimeout(existingTimeoutId)
      }

      const timeoutId = setTimeout(() => {
        set({ message: null, timeoutId: null })
      }, 5000)

      set({ message, timeoutId })
    }
  },
}))

export const useNotification = () => useNotificationStore((state) => state.message)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)

export default useNotificationStore

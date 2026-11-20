
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const byVotesDesc = (a, b) => b.votes - a.votes

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    vote: async (id) => {
      const anecdote = get().anecdotes.find(a => a.id === id)
      const updated = await anecdoteService.update(
        id, { ...anecdote, votes: anecdote.votes + 1 }
      )
      set(state => ({
        anecdotes: state.anecdotes.map(anecdote =>
          anecdote.id === id ? updated : anecdote
        ).toSorted(byVotesDesc)}))
    },
    add: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set(state => ({ anecdotes: state.anecdotes.concat(newAnecdote).toSorted(byVotesDesc) }))
    },
    remove: async (id) => {
      await anecdoteService.remove(id)
      set(state => ({ anecdotes: state.anecdotes.filter((anecdote) => anecdote.id !== id) }))
    },
    setFilter: value => set(() => ({ filter: value })),
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
      set(state => ({ anecdotes: state.anecdotes.toSorted(byVotesDesc) }))
    }
  },
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)

  if (filter === '') return anecdotes

  return anecdotes.filter((anecdote) => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
}
export const useAnecdoteActions = () => useAnecdoteStore(state => state.actions)
export const useFilter = () => useAnecdoteStore((state) => state.filter)

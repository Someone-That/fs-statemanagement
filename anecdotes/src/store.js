
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const byVotesDesc = (a, b) => b.votes - a.votes

const useAnecdoteStore = create((set) => ({
  // anecdotes: anecdotesAtStart.map(asObject),
  anecdotes: [],
  filter: '',
  actions: {
    vote: async (id) => {
      const anecdote = useAnecdoteStore.getState().anecdotes.find(a => a.id === id)
      const updated = await anecdoteService.update(
        id, { ...anecdote, votes: anecdote.votes + 1 }
      )
      set(state => ({
        anecdotes: state.anecdotes.map(anecdote =>
          anecdote.id === id ? updated : anecdote
        ).toSorted(byVotesDesc)
      })
    )},
    add: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set(state => ({ anecdotes: state.anecdotes.concat(newAnecdote).toSorted(byVotesDesc) }))
    },
    setFilter: value => set(() => ({ filter: value })),
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
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

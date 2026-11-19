
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => ({
  content: anecdote,
  id: getId(),
  votes: 0
})

const byVotesDesc = (a, b) => b.votes - a.votes

const useAnecdoteStore = create((set) => ({
  // anecdotes: anecdotesAtStart.map(asObject),
  anecdotes: [],
  filter: '',
  actions: {
    vote: id => set(
      state => ({
        anecdotes: state.anecdotes.map(anecdote =>
          anecdote.id === id ? {...anecdote, votes: anecdote.votes+1 } : anecdote
        ).toSorted(byVotesDesc)
      })
    ),
    add: content => set(
      state => ({ anecdotes: state.anecdotes.concat(
        asObject(content)
      ).toSorted(byVotesDesc)})
    ),
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

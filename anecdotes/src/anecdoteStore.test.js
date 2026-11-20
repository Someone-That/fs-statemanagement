import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
  }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useFilter, useAnecdoteActions } from './store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {
  it('initialize loads anecdotes from service', async () => {
    const mockAnecdotes = [{ id: 1, content: 'Test', votes: 0 }]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(mockAnecdotes)
  })

  it('verifies the component displaying anecdotes receives the anecdotes from the store sorted by votes', async () => {
    const low = { id: 1, content: 'Low', votes: 1 }
    const high = { id: 2, content: 'High', votes: 10 }
    const mid = { id: 3, content: 'Mid', votes: 5 }

    anecdoteService.getAll.mockResolvedValue([low, mid, high])

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual([high, mid, low])
  })

  it('verifies the component receives a properly filtered list of anecdotes', () => {
    const anecdotes = [
      { id: 1, content: 'Premature optimization is the root of all evil', votes: 3 },
      { id: 2, content: 'Debugging is twice as hard as writing the code', votes: 7 },
    ]
  
    useAnecdoteStore.setState({ anecdotes, filter: 'debugging' })
  
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toEqual([anecdotes[1]])
  })

  it('verifies that voting increases the number of votes for an anecdote', async () => {
    const anecdote = { id: 1, content: 'Test anecdote', votes: 0 }
    useAnecdoteStore.setState({ anecdotes: [anecdote], filter: '' })
  
    anecdoteService.update.mockResolvedValue({ ...anecdote, votes: 1 })
  
    const { result } = renderHook(() => useAnecdoteActions())
  
    await act(async () => {
      await result.current.vote(1)
    })
  
    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current[0].votes).toBe(1)
  })
})

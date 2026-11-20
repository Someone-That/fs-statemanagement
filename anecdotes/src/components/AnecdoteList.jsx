import { useAnecdoteActions, useAnecdotes } from "../store"
import { useNotificationActions } from "../notificationStore"

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()

  const { vote, remove } = useAnecdoteActions()
  const { setNotification } = useNotificationActions()

  const handleVote = async (anecdote) => {
    vote(anecdote.id)
    setNotification("you voted '" + anecdote.content + "'")
  }

  const handleDelete = async (anecdote) => {
    remove(anecdote.id)
    setNotification("You deleted '" + anecdote.content + "'")
  }

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
            {anecdote.votes === 0 && (
              <button onClick={() => handleDelete(anecdote)}>delete</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList

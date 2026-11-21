import { createContext, useState } from 'react'

const NotificationContext = createContext()

export default NotificationContext

export const NotificationContextProvider = (props) => {
  const [message, setMessage] = useState('')

  const setNotification = (text) => {
    setMessage(text)

    setTimeout(() => {
      setMessage((currentMessage) => (currentMessage === text ? '' : currentMessage))
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={{ message, setNotification }}>
      {props.children}
    </NotificationContext.Provider>
  )
}

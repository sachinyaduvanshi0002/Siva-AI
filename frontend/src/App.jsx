import { useRef, useState, useEffect } from 'react'
import './App.css'

function App() {

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [typingDots, setTypingDots] = useState(1)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const textareaRef = useRef(null)
  const chatBoxRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!isTyping) {
      setTypingDots(1)
      return
    }

    intervalRef.current = setInterval(() => {
      setTypingDots(prev => prev === 3 ? 1 : prev + 1)
    }, 500)

    return () => clearInterval(intervalRef.current)
  }, [isTyping])

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [messages])

  function newChat() {
    setMessages([])
    setMessage('')

    textareaRef.current?.focus()
  }

  function sendMessage() {
    if (isTyping) {
      return
    }

    if (message.trim() === '') {
      return
    }

    function getAIResponse(userMessage) {
      const text = userMessage.toLowerCase()

      if (text.includes('hello') || text.includes('hi')) {
        return 'Hello! 👋 How can I help you?'
      }

      if (text.includes('how are you')) {
        return "I'm just a bunch of code, but I'm functioning as expected! 🤖"
      }

      if (text.includes('ok')) {
        return "okay!😎"
      }

      if (text.includes('python')) {
        return 'Python is a popular programming language used for web development, AI, automation and more. 🐍'
      }

      if (text.includes('react')) {
        return 'React is a JavaScript library used to build user interfaces. ⚛️'
      }

      return "I'm still learning Dost! 🤖 Try asking me about Python or React."
    }

    const userMessage = message

    setMessages([
      ...messages,
      { text: userMessage, sender: 'user' }
    ])

    setMessage('')
    setIsTyping(true)

    setTimeout(() => {
      const aiResponse = getAIResponse(userMessage)


      setMessages(prevMessages => [
        ...prevMessages,
        { text: '', sender: 'ai' }
      ])

      setIsStreaming(true)

      let currentText = ''
      let index = 0

      intervalRef.current = setInterval(() => {

        if (index >= aiResponse.length) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
          setIsTyping(false)
          setIsStreaming(false)
          return
        }

        currentText += aiResponse[index]

        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages]

          updatedMessages[updatedMessages.length - 1] = {
            text: currentText,
            sender: 'ai'
          }

          return updatedMessages
        })

        index++

      }, 25)
    }, 1000)

    setMessage('')

    if (textareaRef.current) {
      textareaRef.current.style.height = '55px'
    }
  }

  function stopGeneration() {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setIsTyping(false)
    setIsStreaming(false)
  }

  function handleChange(e) {

    setMessage(e.target.value)

    e.target.style.height = '55px'

    const maxHeight = 150

    e.target.style.height =
      Math.min(e.target.scrollHeight, maxHeight) + 'px'
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()

      if (isTyping) {
        return
      }

      sendMessage()
    }
  }

  return (
    <div className="app">

      {/* Header */}

      <header className="header">

        <div className="left-section">

          <button
            className="menu-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>

          <div className="logo">
            <span className="logo-icon">✦</span>

            <div>
              <h1>Siva AI</h1>
              <p>AI Assistant</p>
            </div>
          </div>

        </div>

        <div className="nav-actions">
          <button className="new-chat" onClick={newChat}>
            + New Chat
          </button>

          <button className="settings">
            ⚙
          </button>
          <button className="user-icon">👤</button>
        </div>

      </header>

      {isSidebarOpen && (
        <aside className="sidebar">

          <button className="sidebar-new-chat" onClick={newChat}>
            + New Chat
          </button>

          <div className="sidebar-section">
            <p className="section-title">Recent Chats</p>

            <button className="chat-history">
              👋 Hello
            </button>

            <button className="chat-history">
              🐍 Python discussion
            </button>

            <button className="chat-history">
              ⚛️ React basics
            </button>
          </div>
        </aside>
      )}

      {/* Chat */}

      <main
        className={`chat-box ${isSidebarOpen ? 'sidebar-open' : ''}`}
        ref={chatBoxRef}
      >
        {messages.length === 0 ? (

          <div className="welcome">
            <h2>Welcome to Siva AI 👋</h2>
            <p>How can I help you today?</p>
          </div>

        ) : (

          messages.map((msg, index) => (

            <div className={`message-row ${msg.sender}`} key={index}>

              <div className={`message ${msg.sender}`}>

                <div className="sender-name">
                  {msg.sender === 'ai' ? 'Siva' : 'Me'}
                </div>

                <div className="message-text">
                  {msg.text}

                  {isStreaming &&
                    msg.sender === 'ai' &&
                    index === messages.length - 1 && (
                      <span className="cursor">▋</span>
                    )}
                </div>

              </div>

            </div>

          ))

        )}

        {isTyping && !isStreaming && (
          <div className="message-row ai">
            <div className="message ai">
              <div className="sender-name">Siva</div>
              <div className="typing">
                {'● '.repeat(typingDots)}
              </div>
            </div>
          </div>
        )}

      </main>


      {/* Input */}

      <div className={`input-area ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <textarea
          ref={textareaRef}
          placeholder="Ask Siva anything..."
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows="1"
        />

        {isTyping ? (
          <button className="stop" onClick={stopGeneration}>
            Stop
          </button>
        ) : (
          <button onClick={sendMessage}>
            Send
          </button>
        )}

      </div>

    </div>
  )
}

export default App
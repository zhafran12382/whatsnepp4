import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Send,
  Settings,
  LogOut,
  MessageCircle,
  Users,
  Menu,
  X,
  Plus
} from 'lucide-react'
import { Avatar, Button, Input, LoadingSpinner } from '../components/ui'
import { useAuth } from '../contexts/AuthContext'
import { useChat } from '../contexts/ChatContext'

const Chat = () => {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    messages,
    loading,
    typingUsers,
    sendMessage,
    startConversation,
    searchUsers,
    setTyping
  } = useChat()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const messagesEndRef = useRef(null)

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle user search
  useEffect(() => {
    const search = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      const results = await searchUsers(searchQuery)
      setSearchResults(results)
      setIsSearching(false)
    }

    const debounce = setTimeout(search, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery, searchUsers])

  // Handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageInput.trim() || !activeConversation) return

    const content = messageInput.trim()
    setMessageInput('')
    await sendMessage(activeConversation.id, content)
  }

  // Handle typing
  const handleTyping = (e) => {
    setMessageInput(e.target.value)
    if (activeConversation) {
      setTyping(activeConversation.id, true)
    }
  }

  // Start new conversation
  const handleStartConversation = async (otherUser) => {
    const { conversation } = await startConversation(otherUser.id)
    if (conversation) {
      setActiveConversation({
        ...conversation,
        otherUser
      })
      setShowSearch(false)
      setSearchQuery('')
      setSearchResults([])
    }
  }

  // Handle logout
  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Get typing indicator text
  const getTypingText = () => {
    const typingUsernames = Object.values(typingUsers).filter(Boolean)
    if (typingUsernames.length === 0) return null
    if (typingUsernames.length === 1) return `${typingUsernames[0]} is typing...`
    return `${typingUsernames.length} people are typing...`
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl glass"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed lg:relative z-40 w-80 h-screen glass flex flex-col"
          >
            {/* User Profile Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={user.username} online={true} />
                  <div>
                    <h3 className="font-semibold text-white">{user.display_name || user.username}</h3>
                    <p className="text-xs text-green-400">Online</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/settings')}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Settings className="w-5 h-5 text-white/60" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <LogOut className="w-5 h-5 text-white/60" />
                  </button>
                </div>
              </div>
            </div>

            {/* Search / New Chat */}
            <div className="p-4 border-b border-white/10">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setShowSearch(true)
                    }}
                    onFocus={() => setShowSearch(true)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-sm input-focus"
                  />
                </div>
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Search Results */}
              <AnimatePresence>
                {showSearch && searchQuery.length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 py-2 rounded-xl bg-white/5 border border-white/10 max-h-60 overflow-y-auto"
                  >
                    {isSearching ? (
                      <div className="py-4">
                        <LoadingSpinner size="sm" />
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => handleStartConversation(result)}
                          className="w-full px-4 py-2 flex items-center gap-3 hover:bg-white/5 transition-colors"
                        >
                          <Avatar name={result.username} size="sm" online={result.is_online} />
                          <div className="text-left">
                            <p className="text-sm font-medium text-white">{result.username}</p>
                            <p className="text-xs text-white/50">
                              {result.is_online ? 'Online' : 'Offline'}
                            </p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="text-center py-4 text-sm text-white/50">No users found</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="py-8">
                  <LoadingSpinner size="md" />
                </div>
              ) : conversations.length > 0 ? (
                conversations.map((conv) => (
                  <motion.button
                    key={conv.id}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                    onClick={() => {
                      setActiveConversation(conv)
                      setSidebarOpen(window.innerWidth >= 1024)
                    }}
                    className={`w-full p-4 flex items-center gap-3 border-b border-white/5 transition-colors ${
                      activeConversation?.id === conv.id ? 'bg-white/10' : ''
                    }`}
                  >
                    <Avatar
                      name={conv.otherUser?.username}
                      online={conv.otherUser?.is_online}
                    />
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-white truncate">
                          {conv.otherUser?.username || 'Unknown User'}
                        </p>
                        {conv.lastMessage && (
                          <span className="text-xs text-white/40">
                            {formatTime(conv.lastMessage.created_at)}
                          </span>
                        )}
                      </div>
                      {conv.lastMessage && (
                        <p className="text-sm text-white/50 truncate">
                          {conv.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </motion.button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Users className="w-12 h-12 text-white/20 mb-4" />
                  <p className="text-white/50">No conversations yet</p>
                  <p className="text-sm text-white/30 mt-1">Search for users to start chatting</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 glass border-b border-white/10">
              <div className="flex items-center gap-3">
                <Avatar
                  name={activeConversation.otherUser?.username}
                  online={activeConversation.otherUser?.is_online}
                />
                <div>
                  <h2 className="font-semibold text-white">
                    {activeConversation.otherUser?.username || 'Unknown User'}
                  </h2>
                  <p className="text-xs text-white/50">
                    {activeConversation.otherUser?.is_online ? (
                      <span className="text-green-400">Online</span>
                    ) : (
                      'Offline'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => {
                const isOwn = message.sender_id === user.id
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        isOwn
                          ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                          : 'glass text-white'
                      }`}
                    >
                      <p className="break-words">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwn ? 'text-white/70' : 'text-white/40'
                        }`}
                      >
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </motion.div>
                )
              })}

              {/* Typing Indicator */}
              {getTypingText() && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-white/50 text-sm"
                >
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  {getTypingText()}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 glass border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={handleTyping}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 input-focus"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!messageInput.trim()}
                  className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </form>
          </>
        ) : (
          /* No Conversation Selected */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <MessageCircle className="w-20 h-20 text-white/10 mb-6" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white/50 mb-2">Welcome to WhatsNep</h2>
            <p className="text-white/30 max-w-md">
              Select a conversation from the sidebar or search for users to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat

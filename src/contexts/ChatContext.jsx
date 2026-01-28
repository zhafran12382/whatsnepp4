import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const ChatContext = createContext({})

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}

export const ChatProvider = ({ children }) => {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [typingUsers, setTypingUsers] = useState({})
  const subscriptionRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Fetch user's conversations
  const fetchConversations = useCallback(async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant1:users!conversations_participant1_id_fkey(*),
          participant2:users!conversations_participant2_id_fkey(*),
          messages:messages(*)
        `)
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('updated_at', { ascending: false })

      if (error) throw error

      // Format conversations
      const formatted = data?.map(conv => {
        const otherUser = conv.participant1_id === user.id ? conv.participant2 : conv.participant1
        const lastMessage = conv.messages?.[conv.messages.length - 1]
        return {
          ...conv,
          otherUser,
          lastMessage
        }
      }) || []

      setConversations(formatted)
    } catch (err) {
      console.error('Error fetching conversations:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId) => {
    if (!conversationId) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(*)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error

      setMessages(data || [])
    } catch (err) {
      console.error('Error fetching messages:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Send a message
  const sendMessage = useCallback(async (conversationId, content) => {
    if (!user?.id || !content.trim()) return

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim(),
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Update conversation's updated_at
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId)

      return { message: data, error: null }
    } catch (err) {
      console.error('Error sending message:', err)
      return { message: null, error: err.message }
    }
  }, [user])

  // Start or get conversation with a user
  const startConversation = useCallback(async (otherUserId) => {
    if (!user?.id || !otherUserId) return

    try {
      // Check if conversation already exists
      const { data: existing } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${otherUserId}),and(participant1_id.eq.${otherUserId},participant2_id.eq.${user.id})`)
        .single()

      if (existing) {
        return { conversation: existing, error: null }
      }

      // Create new conversation
      const { data: newConv, error } = await supabase
        .from('conversations')
        .insert({
          participant1_id: user.id,
          participant2_id: otherUserId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      await fetchConversations()
      return { conversation: newConv, error: null }
    } catch (err) {
      console.error('Error starting conversation:', err)
      return { conversation: null, error: err.message }
    }
  }, [user, fetchConversations])

  // Search users
  const searchUsers = useCallback(async (query) => {
    if (!query || query.length < 2) return []

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .neq('id', user?.id)
        .ilike('username', `%${query}%`)
        .limit(10)

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error searching users:', err)
      return []
    }
  }, [user])

  // Update typing status
  const setTyping = useCallback(async (conversationId, isTyping) => {
    if (!user?.id || !conversationId) return

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Broadcast typing status via Supabase Realtime
    const channel = supabase.channel(`typing:${conversationId}`)
    await channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        userId: user.id,
        username: user.username,
        isTyping
      }
    })

    // Auto-stop typing after 3 seconds
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(conversationId, false)
      }, 3000)
    }
  }, [user])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user?.id) return

    // Subscribe to new messages
    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        async (payload) => {
          const newMessage = payload.new
          
          // Add sender info
          const { data: sender } = await supabase
            .from('users')
            .select('*')
            .eq('id', newMessage.sender_id)
            .single()

          const messageWithSender = { ...newMessage, sender }

          // Update messages if in current conversation
          if (activeConversation?.id === newMessage.conversation_id) {
            setMessages(prev => [...prev, messageWithSender])
          }

          // Update conversations list
          fetchConversations()

          // Show browser notification
          if (newMessage.sender_id !== user.id && document.hidden) {
            if (Notification.permission === 'granted') {
              new Notification(`New message from ${sender?.username || 'Unknown'}`, {
                body: newMessage.content.substring(0, 100),
                icon: '/favicon.ico'
              })
            }
          }
        }
      )
      .subscribe()

    subscriptionRef.current = channel

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current)
      }
    }
  }, [user, activeConversation, fetchConversations])

  // Subscribe to typing indicators for active conversation
  useEffect(() => {
    if (!activeConversation?.id) return

    const channel = supabase
      .channel(`typing:${activeConversation.id}`)
      .on('broadcast', { event: 'typing' }, (payload) => {
        const { userId, username, isTyping } = payload.payload
        setTypingUsers(prev => ({
          ...prev,
          [userId]: isTyping ? username : null
        }))
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeConversation])

  // Request notification permission
  useEffect(() => {
    if (user && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [user])

  // Fetch conversations on mount
  useEffect(() => {
    if (user) {
      fetchConversations()
    }
  }, [user, fetchConversations])

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversation?.id) {
      fetchMessages(activeConversation.id)
    }
  }, [activeConversation, fetchMessages])

  const value = {
    conversations,
    activeConversation,
    setActiveConversation,
    messages,
    loading,
    typingUsers,
    fetchConversations,
    fetchMessages,
    sendMessage,
    startConversation,
    searchUsers,
    setTyping
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

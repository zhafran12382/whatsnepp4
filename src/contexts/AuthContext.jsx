import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check for existing session on mount
  useEffect(() => {
    const getSession = async () => {
      try {
        // Check if remember me was set
        const rememberMe = localStorage.getItem('rememberMe') === 'true'
        
        if (!rememberMe) {
          // Check session storage for session-based login
          const sessionData = sessionStorage.getItem('whatsNepSession')
          if (sessionData) {
            const session = JSON.parse(sessionData)
            setUser(session.user)
          }
        } else {
          // Check Supabase session for persistent login
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            // Get user profile from our users table
            const { data: profile } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single()
            
            setUser(profile || session.user)
          }
        }
      } catch (err) {
        console.error('Error getting session:', err)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        setUser(profile || session.user)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Auto-logout on tab/browser close (if not remember me)
  useEffect(() => {
    const handleBeforeUnload = () => {
      const rememberMe = localStorage.getItem('rememberMe') === 'true'
      if (!rememberMe && user) {
        // Clear session storage
        sessionStorage.removeItem('whatsNepSession')
        // Note: We can't reliably call async logout in beforeunload
        // The session will be invalidated on the server side
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [user])

  const signUp = useCallback(async (username, password) => {
    setError(null)
    setLoading(true)
    
    try {
      // Validate username format
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
      if (!usernameRegex.test(username)) {
        throw new Error('Username must be 3-20 characters and contain only letters, numbers, and underscores')
      }

      // Validate password strength
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long')
      }

      // Check if username is already taken
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('username')
        .eq('username', username.toLowerCase())
        .single()

      if (existingUser) {
        throw new Error('Username is already taken')
      }

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }

      // Create auth user with email placeholder using username
      const email = `${username.toLowerCase()}@whatsnep.local`
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.toLowerCase()
          }
        }
      })

      if (authError) {
        throw authError
      }

      if (!authData.user) {
        throw new Error('Failed to create user account')
      }

      // Create user profile in our users table
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          username: username.toLowerCase(),
          display_name: username,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_online: true
        })
        .select()
        .single()

      if (profileError) {
        // Rollback auth user if profile creation fails
        await supabase.auth.signOut()
        throw profileError
      }

      // Store session
      sessionStorage.setItem('whatsNepSession', JSON.stringify({
        user: profile,
        timestamp: Date.now()
      }))

      setUser(profile)
      return { user: profile, error: null }
    } catch (err) {
      setError(err.message)
      return { user: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const signIn = useCallback(async (username, password, rememberMe = false) => {
    setError(null)
    setLoading(true)
    
    try {
      const email = `${username.toLowerCase()}@whatsnep.local`
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Invalid username or password')
        }
        throw authError
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (profileError) {
        throw profileError
      }

      // Update online status
      await supabase
        .from('users')
        .update({ is_online: true, last_seen: new Date().toISOString() })
        .eq('id', profile.id)

      // Handle remember me
      localStorage.setItem('rememberMe', rememberMe.toString())
      
      if (!rememberMe) {
        sessionStorage.setItem('whatsNepSession', JSON.stringify({
          user: profile,
          timestamp: Date.now()
        }))
      }

      setUser(profile)
      return { user: profile, error: null }
    } catch (err) {
      setError(err.message)
      return { user: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    setLoading(true)
    try {
      // Update online status
      if (user?.id) {
        await supabase
          .from('users')
          .update({ is_online: false, last_seen: new Date().toISOString() })
          .eq('id', user.id)
      }

      await supabase.auth.signOut()
      
      localStorage.removeItem('rememberMe')
      sessionStorage.removeItem('whatsNepSession')
      
      setUser(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  const checkUsernameAvailability = useCallback(async (username) => {
    if (!username || username.length < 3) {
      return { available: false, error: 'Username must be at least 3 characters' }
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('username', username.toLowerCase())
        .single()

      if (error && error.code === 'PGRST116') {
        return { available: true, error: null }
      }

      if (data) {
        return { available: false, error: 'Username is already taken' }
      }

      return { available: true, error: null }
    } catch (err) {
      return { available: false, error: err.message }
    }
  }, [])

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setLoading(true)
    try {
      // First verify current password by trying to sign in
      const email = `${user.username.toLowerCase()}@whatsnep.local`
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword
      })

      if (verifyError) {
        throw new Error('Current password is incorrect')
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) {
        throw updateError
      }

      return { success: true, error: null }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [user])

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    checkUsernameAvailability,
    changePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

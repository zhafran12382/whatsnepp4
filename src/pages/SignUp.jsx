import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { User, Lock, Eye, EyeOff, Check, X, ArrowLeft, Loader2 } from 'lucide-react'
import { Button, Input, Card, PasswordStrengthIndicator } from '../components/ui'
import { useAuth } from '../contexts/AuthContext'

const SignUp = () => {
  const navigate = useNavigate()
  const { signUp, checkUsernameAvailability, loading: authLoading, user } = useAuth()
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState({ checking: false, available: null, error: null })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/chat')
    }
  }, [user, navigate])

  // Debounced username availability check
  useEffect(() => {
    const checkUsername = async () => {
      if (username.length < 3) {
        setUsernameStatus({ checking: false, available: null, error: null })
        return
      }

      // Validate username format first
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
      if (!usernameRegex.test(username)) {
        setUsernameStatus({
          checking: false,
          available: false,
          error: 'Username can only contain letters, numbers, and underscores (3-20 characters)'
        })
        return
      }

      setUsernameStatus({ checking: true, available: null, error: null })
      
      const timer = setTimeout(async () => {
        const result = await checkUsernameAvailability(username)
        setUsernameStatus({
          checking: false,
          available: result.available,
          error: result.error
        })
      }, 500)

      return () => clearTimeout(timer)
    }

    checkUsername()
  }, [username, checkUsernameAvailability])

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {}

    // Username validation
    if (!username.trim()) {
      newErrors.username = 'Username is required'
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores'
    } else if (!usernameStatus.available && usernameStatus.available !== null) {
      newErrors.username = usernameStatus.error || 'Username is not available'
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [username, password, confirmPassword, usernameStatus])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    if (usernameStatus.checking) {
      return // Wait for username check to complete
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const { user: newUser, error } = await signUp(username.trim(), password)
      
      if (error) {
        // Handle specific errors
        if (error.includes('already taken') || error.includes('already exists')) {
          setErrors({ username: 'This username is already taken' })
        } else if (error.includes('password')) {
          setErrors({ password: error })
        } else {
          setErrors({ submit: error })
        }
        return
      }

      if (newUser) {
        // Success! Navigate to chat
        navigate('/chat')
      }
    } catch (err) {
      console.error('Sign up error:', err)
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getUsernameIcon = () => {
    if (usernameStatus.checking) {
      return <Loader2 className="w-5 h-5 animate-spin text-white/40" />
    }
    if (usernameStatus.available === true) {
      return <Check className="w-5 h-5 text-green-400" />
    }
    if (usernameStatus.available === false) {
      return <X className="w-5 h-5 text-red-400" />
    }
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-600/20 rounded-full blur-3xl"
        />
      </div>

      <div className="w-full max-w-md z-10">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to home
        </motion.button>

        <Card>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold gradient-text mb-2">Create Account</h1>
            <p className="text-white/60">Join WhatsNep in seconds</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Input
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="Choose a unique username"
                icon={User}
                error={errors.username}
                success={usernameStatus.available === true ? 'Username is available!' : null}
                maxLength={20}
                autoComplete="username"
                autoFocus
              />
              {username.length >= 3 && (
                <div className="flex items-center gap-2 mt-2 text-sm">
                  {getUsernameIcon()}
                  {usernameStatus.checking && (
                    <span className="text-white/50">Checking availability...</span>
                  )}
                </div>
              )}
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                icon={Lock}
                rightIcon={showPassword ? EyeOff : Eye}
                onRightIconClick={() => setShowPassword(!showPassword)}
                error={errors.password}
                autoComplete="new-password"
              />
              <PasswordStrengthIndicator password={password} />
            </motion.div>

            {/* Confirm Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                icon={Lock}
                rightIcon={showConfirmPassword ? EyeOff : Eye}
                onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                error={errors.confirmPassword}
                success={confirmPassword && password === confirmPassword ? 'Passwords match!' : null}
                autoComplete="new-password"
              />
            </motion.div>

            {/* Submit Error */}
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"
              >
                <p className="text-sm text-red-400">{errors.submit}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                type="submit"
                loading={isSubmitting || authLoading}
                disabled={isSubmitting || usernameStatus.checking || !usernameStatus.available}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            </motion.div>
          </form>

          {/* Sign In Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6 text-white/60"
          >
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Sign in
            </Link>
          </motion.p>
        </Card>

        {/* Security Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6 text-sm text-white/40"
        >
          🔒 Your session will auto-logout when you close the browser
        </motion.p>
      </div>
    </div>
  )
}

export default SignUp

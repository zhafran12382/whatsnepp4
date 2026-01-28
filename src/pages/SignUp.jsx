import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { User, Lock, Eye, EyeOff, Check, X, ArrowLeft, Loader2, Sparkles } from 'lucide-react'
import { Button, Input, Card, PasswordStrengthIndicator } from '../components/ui'
import { FloatingParticles } from '../components/Particles'
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
      return <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden animated-bg">
      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 mesh-gradient opacity-50" />
      
      {/* Floating particles */}
      <FloatingParticles count={30} />
      
      {/* Background Effects */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/30 rounded-full blur-[120px]"
      />

      <div className="w-full max-w-md z-10">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
          <span>Back to home</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-strong p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center glow-mixed"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-4xl font-black gradient-text mb-2">Create Account</h1>
              <p className="text-white/50">Join WhatsNep in seconds — it's free!</p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mt-2 text-sm"
                  >
                    {getUsernameIcon()}
                    {usernameStatus.checking && (
                      <span className="text-purple-400">Checking availability...</span>
                    )}
                  </motion.div>
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
                  className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 backdrop-blur-sm"
                >
                  <p className="text-sm text-red-400 font-medium">{errors.submit}</p>
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
                  className="w-full text-lg py-4"
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
              className="text-center mt-8 text-white/50"
            >
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors hover:underline">
                Sign in
              </Link>
            </motion.p>
          </Card>
        </motion.div>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8 flex items-center justify-center gap-2 text-white/40"
        >
          <Lock className="w-4 h-4 text-green-400" />
          <span className="text-sm">Your session will auto-logout when you close the browser</span>
        </motion.div>
      </div>
    </div>
  )
}

export default SignUp

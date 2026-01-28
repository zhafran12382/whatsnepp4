import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { User, Lock, Eye, EyeOff, ArrowLeft, LogIn, Shield, Check } from 'lucide-react'
import { Button, Input, Card } from '../components/ui'
import { FloatingParticles } from '../components/Particles'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { signIn, loading: authLoading, user } = useAuth()
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/chat')
    }
  }, [user, navigate])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = {}

    if (!username.trim()) {
      newErrors.username = 'Username is required'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const { user: loggedInUser, error } = await signIn(username.trim(), password, rememberMe)
      
      if (error) {
        if (error.includes('Invalid') || error.includes('incorrect')) {
          setErrors({ submit: 'Invalid username or password' })
        } else {
          setErrors({ submit: error })
        }
        return
      }

      if (loggedInUser) {
        navigate('/chat')
      }
    } catch (err) {
      console.error('Login error:', err)
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden animated-bg">
      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 mesh-gradient opacity-50" />
      
      {/* Floating particles */}
      <FloatingParticles count={25} variant="cyan" />
      
      {/* Background Effects */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/30 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px]"
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
          <ArrowLeft className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
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
                className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center glow-cyan"
              >
                <LogIn className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-4xl font-black gradient-text mb-2">Welcome Back</h1>
              <p className="text-white/50">Sign in to continue chatting</p>
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
                  placeholder="Enter your username"
                  icon={User}
                  error={errors.username}
                  autoComplete="username"
                  autoFocus
                />
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
                  placeholder="Enter your password"
                  icon={Lock}
                  rightIcon={showPassword ? EyeOff : Eye}
                  onRightIconClick={() => setShowPassword(!showPassword)}
                  error={errors.password}
                  autoComplete="current-password"
                />
              </motion.div>

              {/* Remember Me */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3"
              >
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    rememberMe
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 glow-mixed'
                      : 'bg-white/5 border border-white/20 hover:border-purple-500/50'
                  }`}
                >
                  {rememberMe && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </button>
                <span className="text-sm text-white/70">
                  Remember me
                  <span className="text-white/40 ml-2">(Stay logged in)</span>
                </span>
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
                  disabled={isSubmitting}
                  className="w-full text-lg py-4"
                  size="lg"
                >
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </Button>
              </motion.div>
            </form>

            {/* Sign Up Link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-8 text-white/50"
            >
              Don't have an account?{' '}
              <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors hover:underline">
                Sign up
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
          <Shield className={`w-4 h-4 ${rememberMe ? 'text-purple-400' : 'text-green-400'}`} />
          <span className="text-sm">
            {rememberMe 
              ? 'You will stay logged in on this device'
              : 'Session will end when you close the browser'
            }
          </span>
        </motion.div>
      </div>
    </div>
  )
}

export default Login

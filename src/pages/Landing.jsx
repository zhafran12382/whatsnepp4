import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Shield, Sparkles, ArrowRight, Zap, Lock, Users } from 'lucide-react'
import { Button } from '../components/ui'
import { FloatingParticles } from '../components/Particles'

// Animated rings component (decorative)
const AnimatedRings = () => (
  <div 
    className="absolute inset-0 flex items-center justify-center pointer-events-none"
    aria-hidden="true"
  >
    {[1, 2, 3].map((ring) => (
      <motion.div
        key={ring}
        className="absolute rounded-full border border-purple-500/10"
        style={{
          width: 200 + ring * 150,
          height: 200 + ring * 150,
        }}
        animate={{
          rotate: ring % 2 === 0 ? 360 : -360,
          scale: [1, 1.05, 1],
        }}
        transition={{
          rotate: { duration: 30 + ring * 10, repeat: Infinity, ease: 'linear' },
          scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        }}
      />
    ))}
  </div>
)

const Landing = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Sign up in seconds with just username & password. No email needed!',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Lock,
      title: 'Ultra Secure',
      description: 'Auto-logout on browser close. Your privacy is our priority.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Real-time Chat',
      description: 'Instant messaging with typing indicators and online status.',
      gradient: 'from-cyan-500 to-blue-500'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden animated-bg">
      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 mesh-gradient opacity-60" />
      
      {/* Floating particles */}
      <FloatingParticles count={50} />
      
      {/* Animated rings */}
      <AnimatedRings />

      {/* Large gradient orbs */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-purple-600/30 to-cyan-600/30 rounded-full blur-[100px]"
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="text-center z-10 max-w-4xl mx-auto"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 150, delay: 0.2, damping: 15 }}
          className="mb-10"
        >
          <div className="relative w-32 h-32 mx-auto mb-6">
            {/* Outer glow ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 p-[2px]"
            >
              <div className="w-full h-full rounded-[2rem] bg-[#0a0a0a]" />
            </motion.div>
            
            {/* Inner icon */}
            <div className="absolute inset-2 rounded-[1.5rem] bg-gradient-to-br from-purple-600 via-purple-500 to-cyan-500 flex items-center justify-center glow-mixed">
              <MessageCircle className="w-14 h-14 text-white drop-shadow-lg" />
            </div>
            
            {/* Sparkle effects */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-cyan-400 blur-sm"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-purple-400 blur-sm"
            />
          </div>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-black gradient-text mb-4 text-glow tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            WhatsNep
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-white/60 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Private messaging, <span className="text-purple-400 font-medium">beautifully</span> simplified
          </motion.p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.15 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-strong rounded-3xl p-8 card-hover cursor-default"
            >
              <motion.div 
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mx-auto mb-5 shadow-lg`}
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="font-bold text-xl text-white mb-3">{feature.title}</h3>
              <p className="text-white/50 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-5 justify-center"
        >
          <Button
            onClick={() => navigate('/signup')}
            size="lg"
            className="min-w-[220px] text-lg py-5"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
          <Button
            onClick={() => navigate('/login')}
            variant="secondary"
            size="lg"
            className="min-w-[220px] text-lg py-5 glass-strong border-white/20 hover:border-purple-500/50"
          >
            Sign In
          </Button>
        </motion.div>
        
        {/* Stats or trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-14 flex items-center justify-center gap-8 text-white/40"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-sm">End-to-end security</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-sm">No email required</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 flex flex-col items-center gap-2"
      >
        <p className="text-sm text-white/30">
          Built with ❤️ using React & Supabase
        </p>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400"
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Landing

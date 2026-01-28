import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Shield, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui'

const Landing = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: MessageCircle,
      title: 'Simple Chat',
      description: 'Just username and password - start chatting in seconds'
    },
    {
      icon: Shield,
      title: 'Secure',
      description: 'Auto-logout on tab close, encrypted messages'
    },
    {
      icon: Sparkles,
      title: 'Beautiful',
      description: 'Modern design with smooth animations'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-cyan-600/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-2xl mx-auto"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-purple-500/30">
            <MessageCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-2">
            WhatsNep
          </h1>
          <p className="text-lg text-white/60">
            Private messaging, simplified
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="glass rounded-2xl p-6"
            >
              <feature.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-white/50">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => navigate('/signup')}
            size="lg"
            className="min-w-[200px]"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => navigate('/login')}
            variant="secondary"
            size="lg"
            className="min-w-[200px]"
          >
            Sign In
          </Button>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 text-sm text-white/30"
      >
        Built with ❤️ using React & Supabase
      </motion.p>
    </div>
  )
}

export default Landing

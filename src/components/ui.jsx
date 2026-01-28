import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'relative font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden'
  
  const variants = {
    primary: 'btn-gradient text-white shadow-lg hover:shadow-purple-500/30',
    secondary: 'bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-purple-500/30',
    ghost: 'text-white/70 hover:text-white hover:bg-white/5',
    danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20'
  }

  const sizes = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-6 py-3.5 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </motion.button>
  )
}

export const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  success,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-white/80 mb-2.5">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full px-4 py-4 rounded-2xl
            bg-white/5 border border-white/10
            text-white placeholder:text-white/30
            input-focus text-base
            ${Icon ? 'pl-12' : ''}
            ${RightIcon ? 'pr-12' : ''}
            ${error ? 'border-red-500/50 focus:border-red-500/50 focus:shadow-red-500/20' : ''}
            ${success ? 'border-green-500/50 focus:border-green-500/50 focus:shadow-green-500/20' : ''}
            ${className}
          `}
          {...props}
        />
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-purple-400 transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <RightIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2.5 text-sm text-red-400 font-medium"
        >
          {error}
        </motion.p>
      )}
      {success && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2.5 text-sm text-green-400 font-medium"
        >
          {success}
        </motion.p>
      )}
    </div>
  )
}

export const Card = ({ children, className = '', ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-strong rounded-3xl p-8 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const Avatar = ({ src, name, size = 'md', online, className = '' }) => {
  const sizes = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl'
  }

  const getInitials = (name) => {
    return name?.slice(0, 2).toUpperCase() || '??'
  }

  return (
    <div className={`relative ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizes[size]} rounded-full object-cover ring-2 ring-white/10`}
        />
      ) : (
        <div
          className={`${sizes[size]} rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-cyan-500 flex items-center justify-center font-bold text-white ring-2 ring-white/10 shadow-lg`}
        >
          {getInitials(name)}
        </div>
      )}
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#0a0a0a] ${
            online ? 'bg-green-500 pulse-green' : 'bg-gray-500'
          }`}
        />
      )}
    </div>
  )
}

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        <Loader2 className={`${sizes[size]} animate-spin text-purple-400`} />
        <div className={`absolute inset-0 ${sizes[size]} rounded-full bg-purple-400/20 blur-md animate-pulse`} />
      </div>
    </div>
  )
}

export const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = (pwd) => {
    let score = 0
    if (!pwd) return { score: 0, label: '', color: '', bgColor: '', glowColor: '' }
    
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^a-zA-Z0-9]/.test(pwd)) score++

    if (score <= 2) return { score: 1, label: 'Weak', color: 'text-red-400', bgColor: 'bg-red-500', glowColor: 'rgba(239, 68, 68, 0.5)' }
    if (score <= 4) return { score: 2, label: 'Medium', color: 'text-yellow-400', bgColor: 'bg-yellow-500', glowColor: 'rgba(234, 179, 8, 0.5)' }
    if (score <= 5) return { score: 3, label: 'Strong', color: 'text-green-400', bgColor: 'bg-green-500', glowColor: 'rgba(34, 197, 94, 0.5)' }
    return { score: 4, label: 'Very Strong', color: 'text-emerald-400', bgColor: 'bg-emerald-400', glowColor: 'rgba(52, 211, 153, 0.5)' }
  }

  const strength = getStrength(password)

  if (!password) return null

  return (
    <div className="mt-3">
      <div className="flex gap-1.5 mb-2">
        {[1, 2, 3, 4].map((level) => (
          <motion.div
            key={level}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              strength.score >= level ? strength.bgColor : 'bg-white/10'
            }`}
            style={{
              boxShadow: strength.score >= level ? `0 0 10px ${strength.glowColor}` : 'none'
            }}
          />
        ))}
      </div>
      <p className={`text-xs font-semibold ${strength.color}`}>
        {strength.label}
      </p>
    </div>
  )
}

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
  const baseClasses = 'relative font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'btn-gradient text-white shadow-lg hover:shadow-purple-500/25',
    secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/10',
    ghost: 'text-white/70 hover:text-white hover:bg-white/5',
    danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
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
        <label className="block text-sm font-medium text-white/70 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 rounded-xl
            bg-white/5 border border-white/10
            text-white placeholder:text-white/30
            input-focus
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
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
          >
            <RightIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
      {success && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-green-400"
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
      className={`glass rounded-2xl p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const Avatar = ({ src, name, size = 'md', online, className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl'
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
          className={`${sizes[size]} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${sizes[size]} rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-semibold text-white`}
        >
          {getInitials(name)}
        </div>
      )}
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1a1a2e] ${
            online ? 'bg-green-500' : 'bg-gray-500'
          }`}
        />
      )}
    </div>
  )
}

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizes[size]} animate-spin text-purple-400`} />
    </div>
  )
}

export const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = (pwd) => {
    let score = 0
    if (!pwd) return { score: 0, label: '', color: '' }
    
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^a-zA-Z0-9]/.test(pwd)) score++

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500' }
    if (score <= 4) return { score: 2, label: 'Medium', color: 'bg-yellow-500' }
    if (score <= 5) return { score: 3, label: 'Strong', color: 'bg-green-500' }
    return { score: 4, label: 'Very Strong', color: 'bg-emerald-400' }
  }

  const strength = getStrength(password)

  if (!password) return null

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((level) => (
          <motion.div
            key={level}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: strength.score >= level ? 1 : 0.3 }}
            className={`h-1 flex-1 rounded-full transition-colors ${
              strength.score >= level ? strength.color : 'bg-white/10'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${
        strength.score === 1 ? 'text-red-400' :
        strength.score === 2 ? 'text-yellow-400' :
        strength.score === 3 ? 'text-green-400' :
        'text-emerald-400'
      }`}>
        {strength.label}
      </p>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, Eye, EyeOff, User, Check } from 'lucide-react'
import { Button, Input, Card, PasswordStrengthIndicator, Avatar } from '../components/ui'
import { useAuth } from '../contexts/AuthContext'

const Settings = () => {
  const navigate = useNavigate()
  const { user, changePassword, loading } = useAuth()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleChangePassword = async (e) => {
    e.preventDefault()

    const newErrors = {}

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password'
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})
    setSuccessMessage('')

    try {
      const { success, error } = await changePassword(currentPassword, newPassword)

      if (error) {
        if (error.includes('incorrect') || error.includes('Current password')) {
          setErrors({ currentPassword: 'Current password is incorrect' })
        } else {
          setErrors({ submit: error })
        }
        return
      }

      if (success) {
        setSuccessMessage('Password changed successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (err) {
      console.error('Change password error:', err)
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto z-10 relative">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/chat')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to chat
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">Settings</h1>
          <p className="text-white/60">Manage your account preferences</p>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-400" />
              Profile
            </h2>
            <div className="flex items-center gap-4">
              <Avatar name={user.username} size="xl" />
              <div>
                <p className="text-lg font-medium text-white">
                  {user.display_name || user.username}
                </p>
                <p className="text-sm text-white/50">@{user.username}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Change Password Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-400" />
              Change Password
            </h2>

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2"
              >
                <Check className="w-5 h-5 text-green-400" />
                <p className="text-sm text-green-400">{successMessage}</p>
              </motion.div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-5">
              <Input
                label="Current Password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                icon={Lock}
                rightIcon={showCurrentPassword ? EyeOff : Eye}
                onRightIconClick={() => setShowCurrentPassword(!showCurrentPassword)}
                error={errors.currentPassword}
                autoComplete="current-password"
              />

              <Input
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter a new password"
                icon={Lock}
                rightIcon={showNewPassword ? EyeOff : Eye}
                onRightIconClick={() => setShowNewPassword(!showNewPassword)}
                error={errors.newPassword}
                autoComplete="new-password"
              />
              <PasswordStrengthIndicator password={newPassword} />

              <Input
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                icon={Lock}
                rightIcon={showConfirmPassword ? EyeOff : Eye}
                onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                error={errors.confirmPassword}
                success={confirmPassword && newPassword === confirmPassword ? 'Passwords match!' : null}
                autoComplete="new-password"
              />

              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                >
                  <p className="text-sm text-red-400">{errors.submit}</p>
                </motion.div>
              )}

              <Button
                type="submit"
                loading={isSubmitting || loading}
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? 'Changing Password...' : 'Change Password'}
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Security Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-sm text-white/40"
        >
          <p>🔒 Your password is securely hashed and stored</p>
          <p className="mt-1">Session auto-logout is enabled for extra security</p>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings

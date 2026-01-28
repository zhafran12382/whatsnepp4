import { useState } from 'react'

// Generate particles only once on the client side
const generateParticles = (count, variant = 'default') => {
  const particles = []
  // Check if we're on mobile for reduced count
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const adjustedCount = isMobile ? Math.floor(count / 2) : count
  
  for (let i = 0; i < adjustedCount; i++) {
    const random1 = Math.random()
    const random2 = Math.random()
    const random3 = Math.random()
    const random4 = Math.random()
    const random5 = Math.random()
    
    let color1, color2
    if (variant === 'cyan') {
      color1 = 'rgba(6, 182, 212, 0.4)'
      color2 = 'rgba(139, 92, 246, 0.4)'
    } else {
      color1 = 'rgba(139, 92, 246, 0.5)'
      color2 = 'rgba(6, 182, 212, 0.5)'
    }
    
    particles.push({
      id: i,
      size: random1 * 4 + 1,
      left: random2 * 100,
      delay: random3 * 20,
      duration: random4 * 20 + 20,
      color: random5 > 0.5 ? color1 : color2
    })
  }
  return particles
}

export const FloatingParticles = ({ count = 50, variant = 'default' }) => {
  // Generate particles once during initial render
  const [particles] = useState(() => generateParticles(count, variant))

  if (particles.length === 0) return null

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            background: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
          }}
        />
      ))}
    </div>
  )
}

export default FloatingParticles

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeProvider'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Visualizations', href: '#visualizations' },
  { label: 'World Building', href: '#auth' },
  { label: 'Pricing', href: '#cta' },
  { label: 'About', href: '#footer' },
]

function StoryForgeLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="24" rx="3" stroke="currentColor" strokeWidth="2" className="text-violet-600" />
      <rect x="10" y="8" width="20" height="24" rx="3" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" className="text-violet-500" />
      <circle cx="15" cy="16" r="2" fill="currentColor" className="text-violet-600" />
      <circle cx="22" cy="14" r="1.5" fill="currentColor" className="text-fuchsia-500" />
      <circle cx="19" cy="22" r="1.5" fill="currentColor" className="text-fuchsia-500" />
      <line x1="15" y1="16" x2="22" y2="14" stroke="currentColor" strokeWidth="1.2" className="text-violet-400" />
      <line x1="15" y1="16" x2="19" y2="22" stroke="currentColor" strokeWidth="1.2" className="text-violet-400" />
      <line x1="22" y1="14" x2="19" y2="22" stroke="currentColor" strokeWidth="1.2" className="text-fuchsia-400" />
    </svg>
  )
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border-b border-black/[0.04] dark:border-white/[0.06] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <StoryForgeLogo />
          <span className="font-display font-semibold tracking-tight text-xl text-zinc-900 dark:text-white">StoryForge</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-zinc-600 dark:text-zinc-400 transition-all duration-300 hover:text-violet-600 dark:hover:text-violet-400"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button className="text-sm text-zinc-700 dark:text-zinc-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors px-4 py-2">
            Login
          </button>
          <button className="text-sm bg-black dark:bg-white text-white dark:text-black rounded-full px-5 py-2.5 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
            Get Started
          </button>
        </div>

        <button
          className="md:hidden text-zinc-700 dark:text-zinc-300"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="md:hidden bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-b border-black/[0.04] dark:border-white/[0.06] overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-base text-zinc-700 dark:text-zinc-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  onClick={toggleTheme}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>
                <button className="text-sm text-zinc-700 dark:text-zinc-300 px-4 py-2">Login</button>
                <button className="text-sm bg-black dark:bg-white text-white dark:text-black rounded-full px-5 py-2.5 font-medium">
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  LayoutDashboard, BookOpen, Search, LogOut, Menu, Sun, Moon, ChevronLeft
} from 'lucide-react'
import { useTheme } from '../components/ThemeProvider'
import { useAuthStore } from '../lib/authStore'

const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/app/stories', icon: BookOpen, label: 'Stories' },
]

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? 'w-full' : sidebarOpen ? 'w-64' : 'w-20'} h-full bg-white dark:bg-zinc-900 border-r border-zinc-100 dark:border-zinc-800 flex flex-col transition-all duration-300`}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-100 dark:border-zinc-800">
        {(sidebarOpen || mobile) && (
          <a href="/app" className="flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="4" width="20" height="24" rx="3" stroke="#7c3aed" strokeWidth="2" />
              <rect x="10" y="8" width="20" height="24" rx="3" fill="#7c3aed" fillOpacity="0.15" stroke="#8b5cf6" strokeWidth="2" />
              <circle cx="15" cy="16" r="2" fill="#7c3aed" />
              <circle cx="22" cy="14" r="1.5" fill="#d946ef" />
              <circle cx="19" cy="22" r="1.5" fill="#d946ef" />
            </svg>
            <span className="font-display font-semibold text-zinc-900 dark:text-white">StoryForge</span>
          </a>
        )}
        {!mobile && (
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hidden lg:flex">
            <ChevronLeft size={18} className={`transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => mobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 font-medium'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`
            }
          >
            <item.icon size={18} />
            {(sidebarOpen || mobile) && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-zinc-100 dark:border-zinc-800">
        {user && (sidebarOpen || mobile) && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 text-sm font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <LogOut size={18} />
          {(sidebarOpen || mobile) && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )

  return (
    <div className="h-screen flex bg-bg-base dark:bg-zinc-950 transition-colors">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative h-full"
            >
              <Sidebar mobile />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between px-4 lg:px-6">
          <button className="lg:hidden text-zinc-600 dark:text-zinc-400" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search your universe..."
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-9 pr-4 py-2 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
              />
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

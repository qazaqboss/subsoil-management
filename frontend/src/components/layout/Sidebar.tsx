import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface NavItem {
  icon: string
  label: string
  path: string
  badge?: number
}

const navItems: NavItem[] = [
  { icon: '📊', label: 'Обзор', path: '/dashboard' },
  { icon: '📜', label: 'Лицензии', path: '/licenses', badge: 1 },
  { icon: '📅', label: 'Календарь', path: '/calendar' },
  { icon: '🏗️', label: 'Скважины', path: '/wells' },
  { icon: '👷', label: 'Подрядчики', path: '/contractors' },
  { icon: '🧪', label: 'Испытания', path: '/tests' },
  { icon: '📄', label: 'Отчеты', path: '/reports' },
  { icon: '🤖', label: 'AI-помощник', path: '/ai-assistant' },
  { icon: '⚙️', label: 'Настройки', path: '/settings' },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        className="fixed md:relative md:translate-x-0 top-0 left-0 h-full w-60 bg-white border-r border-gray-200 z-30 flex flex-col"
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center">
              <span className="text-white text-lg">⛏️</span>
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm leading-tight">Субсойл</div>
              <div className="text-xs text-gray-500">Недропользование</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md mb-1 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-error-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">А</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">Асет Жансеитов</div>
              <div className="text-xs text-gray-500 truncate">Главный геолог</div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

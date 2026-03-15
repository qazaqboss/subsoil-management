import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Notification {
  id: string
  type: 'error' | 'warning' | 'info' | 'success'
  title: string
  body: string
  time: string
  read: boolean
  action?: string
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'error',   title: 'Просроченный отчёт',      body: 'Форма 1-ТП (недра) просрочена на 11 дней. Лицензия МГ-00123. Штраф: 150 000 ₸',        time: '2 ч. назад',  read: false, action: 'Подготовить' },
  { id: 'n2', type: 'error',   title: 'Просроченный документ',   body: 'ГИС скв. №47 не получен. Просрочено 4 дня. Подрядчик: ТОО KazDrilling',                time: '3 ч. назад',  read: false, action: 'Запросить' },
  { id: 'n3', type: 'error',   title: 'Скважина остановлена',    body: 'Скв. №49 (Каражанбас) — работы приостановлены. 2 документа просрочено',                time: '5 ч. назад',  read: false, action: 'Детали' },
  { id: 'n4', type: 'warning', title: 'Срочный дедлайн сегодня', body: 'Форма 2-ТП (воздух) должна быть подана до 16:00. Лицензия МГ-00456',                  time: '1 ч. назад',  read: false, action: 'Подать' },
  { id: 'n5', type: 'warning', title: 'Геологический разрез',    body: 'Скв. №47: сводный геологический разрез — дедлайн через 4 дня (20.03)',                time: '6 ч. назад',  read: false },
  { id: 'n6', type: 'warning', title: 'Страховой полис истекает',body: 'ТОО KazDrilling: страховой полис ГПО истекает через 16 дней (01.04.2026)',             time: '12 ч. назад', read: false, action: 'Напомнить' },
  { id: 'n7', type: 'info',    title: 'Запланировано совещание',  body: 'Техсовет по скв. №48 — 18 марта в 14:00. Участники: KazDrilling, геология',           time: '1 д. назад',  read: true },
  { id: 'n8', type: 'info',    title: 'Дедлайн через 7 дней',    body: 'Форма 5-ГР (февраль) — до 22 марта. Лицензия РГ-00456',                               time: '1 д. назад',  read: true },
  { id: 'n9', type: 'success', title: 'Форма 5-ГР принята',      body: 'МЭ РК подтвердил получение Формы 5-ГР (январь) по лицензии РГ-00456',                 time: '2 д. назад',  read: true },
  { id: 'n10',type: 'success', title: 'Документ получен',        body: 'Инклинограмма скв. №47 получена от ТОО KazDrilling и загружена в систему',             time: '3 д. назад',  read: true },
]

const TYPE_CONFIG = {
  error:   { icon: '🔴', ring: 'ring-error-500/20',   dot: 'bg-error-500',   bg: 'bg-red-50' },
  warning: { icon: '🟠', ring: 'ring-warning-500/20', dot: 'bg-warning-500', bg: 'bg-amber-50' },
  info:    { icon: '🔵', ring: 'ring-info-500/20',    dot: 'bg-info-500',    bg: 'bg-blue-50' },
  success: { icon: '🟢', ring: 'ring-success-500/20', dot: 'bg-success-500', bg: 'bg-green-50' },
}

interface TopNavProps {
  onMenuToggle: () => void
}

export default function TopNav({ onMenuToggle }: TopNavProps) {
  const [searchFocused, setSearchFocused] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS)
  const panelRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    if (notifOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [notifOpen])

  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })))
  const markRead = (id: string) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))
  const dismiss = (id: string) => setNotifications(ns => ns.filter(n => n.id !== id))

  const today = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-4 sticky top-0 z-10">
      {/* Hamburger */}
      <button onClick={onMenuToggle} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors" aria-label="Открыть меню">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Search */}
      <div className={`flex-1 max-w-lg relative ${searchFocused ? 'ring-2 ring-primary-500/20 rounded-md' : ''}`}>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input type="text" placeholder="Поиск... (Cmd+K)"
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-primary-500 bg-gray-50"
          onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono hidden sm:block">⌘K</kbd>
      </div>

      <div className="hidden md:block text-sm text-gray-500 capitalize">{today}</div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto md:ml-0" ref={panelRef}>
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(o => !o)}
            className={`relative p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors ${notifOpen ? 'bg-gray-100' : ''}`}
            aria-label="Уведомления"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <motion.span
                key={unreadCount}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-error-500 text-white text-xs rounded-full flex items-center justify-center font-bold px-1"
              >
                {unreadCount}
              </motion.span>
            )}
          </button>

          {/* Notification dropdown */}
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-[380px] max-h-[520px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col"
              >
                {/* Panel header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">Уведомления</h3>
                    {unreadCount > 0 && (
                      <span className="bg-error-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">{unreadCount}</span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-primary-500 hover:text-primary-700 font-medium transition-colors">
                      Прочитать все
                    </button>
                  )}
                </div>

                {/* Notification list */}
                <div className="overflow-y-auto flex-1">
                  {/* Unread section */}
                  {notifications.filter(n => !n.read).length > 0 && (
                    <>
                      <div className="px-4 pt-3 pb-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Новые</p>
                      </div>
                      {notifications.filter(n => !n.read).map(notif => {
                        const cfg = TYPE_CONFIG[notif.type]
                        return (
                          <motion.div
                            key={notif.id}
                            layout
                            exit={{ opacity: 0, height: 0 }}
                            className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${cfg.bg}`}
                            onClick={() => markRead(notif.id)}
                          >
                            <span className="text-base flex-shrink-0 mt-0.5">{cfg.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notif.body}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-400">{notif.time}</span>
                                {notif.action && (
                                  <button
                                    onClick={e => { e.stopPropagation(); markRead(notif.id) }}
                                    className={`text-xs font-medium px-2 py-0.5 rounded-md transition-colors ${
                                      notif.type === 'error' ? 'bg-error-500 text-white hover:bg-red-600' :
                                      notif.type === 'warning' ? 'bg-warning-500 text-white hover:bg-amber-600' :
                                      'bg-primary-500 text-white hover:bg-primary-700'
                                    }`}
                                  >
                                    {notif.action}
                                  </button>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={e => { e.stopPropagation(); dismiss(notif.id) }}
                              className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0 mt-0.5"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </motion.div>
                        )
                      })}
                    </>
                  )}

                  {/* Read section */}
                  {notifications.filter(n => n.read).length > 0 && (
                    <>
                      <div className="px-4 pt-3 pb-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Прочитанные</p>
                      </div>
                      {notifications.filter(n => n.read).map(notif => {
                        const cfg = TYPE_CONFIG[notif.type]
                        return (
                          <div key={notif.id} className="flex items-start gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors opacity-60">
                            <span className="text-base flex-shrink-0 mt-0.5">{cfg.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-700">{notif.title}</p>
                              <p className="text-xs text-gray-400 mt-0.5 truncate">{notif.body}</p>
                              <p className="text-xs text-gray-300 mt-1">{notif.time}</p>
                            </div>
                            <button onClick={() => dismiss(notif.id)} className="text-gray-200 hover:text-gray-400 transition-colors flex-shrink-0">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )
                      })}
                    </>
                  )}

                  {notifications.length === 0 && (
                    <div className="py-12 text-center text-gray-400">
                      <p className="text-3xl mb-2">🔔</p>
                      <p className="text-sm font-medium">Нет уведомлений</p>
                    </div>
                  )}
                </div>

                {/* Panel footer */}
                <div className="border-t border-gray-100 px-4 py-2.5 bg-gray-50">
                  <button className="text-xs text-primary-500 hover:text-primary-700 font-medium transition-colors">
                    Настройки уведомлений →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User avatar */}
        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors" title="Асет Жансеитов">
          <span className="text-white text-sm font-bold">А</span>
        </div>
      </div>
    </header>
  )
}

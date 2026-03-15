import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Alert {
  id: string
  severity: 'critical' | 'warning'
  title: string
  subtitle: string
  actions: string[]
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    severity: 'critical',
    title: 'Отчет 1-ТП просрочен на 3 дня',
    subtitle: 'Лицензия: МГ-00123 | Штраф: 150,000 ₸',
    actions: ['Подготовить отчет', 'Подробнее'],
  },
  {
    id: '2',
    severity: 'warning',
    title: 'Скважина №47: паспорт не получен (15 дней)',
    subtitle: 'Подрядчик: ТОО KazDrilling',
    actions: ['Запросить статус', 'Детали'],
  },
]

export default function AlertBanner() {
  const [dismissed, setDismissed] = useState<string[]>([])

  const activeAlerts = mockAlerts.filter((a) => !dismissed.includes(a.id))

  if (activeAlerts.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-error-500 font-semibold text-sm">⚠️ КРИТИЧЕСКИЕ УВЕДОМЛЕНИЯ</span>
        <span className="bg-error-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {activeAlerts.length}
        </span>
      </div>

      <AnimatePresence>
        {activeAlerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`rounded-lg border-l-4 p-4 flex items-start gap-4 ${
              alert.severity === 'critical'
                ? 'bg-red-50 border-error-500'
                : 'bg-amber-50 border-warning-500'
            }`}
          >
            <span className="text-lg flex-shrink-0">
              {alert.severity === 'critical' ? '🔴' : '🟠'}
            </span>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm ${alert.severity === 'critical' ? 'text-red-800' : 'text-amber-800'}`}>
                {alert.title}
              </p>
              <p className={`text-xs mt-0.5 ${alert.severity === 'critical' ? 'text-red-600' : 'text-amber-600'}`}>
                {alert.subtitle}
              </p>
              <div className="flex gap-2 mt-2">
                <button className={`text-xs font-medium px-3 py-1 rounded-md transition-colors ${
                  alert.severity === 'critical'
                    ? 'bg-error-500 text-white hover:bg-red-600'
                    : 'bg-warning-500 text-white hover:bg-amber-600'
                }`}>
                  {alert.actions[0]}
                </button>
                <button className="text-xs font-medium px-3 py-1 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                  {alert.actions[1]}
                </button>
              </div>
            </div>
            <button
              onClick={() => setDismissed((d) => [...d, alert.id])}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              aria-label="Закрыть"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

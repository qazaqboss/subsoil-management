import { motion } from 'framer-motion'

interface Metric {
  label: string
  value: string | number
  sublabel: string
  icon: string
  trend?: { value: number; positive: boolean }
  variant: 'default' | 'warning' | 'error' | 'success'
}

const metrics: Metric[] = [
  {
    label: 'Активных лицензий',
    value: 12,
    sublabel: 'из 15 всего',
    icon: '📜',
    trend: { value: 2, positive: true },
    variant: 'default',
  },
  {
    label: 'Отчетов сегодня',
    value: 3,
    sublabel: 'до 16:00',
    icon: '📄',
    trend: { value: 1, positive: false },
    variant: 'warning',
  },
  {
    label: 'Активных скважин',
    value: 8,
    sublabel: 'в работе',
    icon: '🏗️',
    variant: 'success',
  },
  {
    label: 'Дедлайнов на неделе',
    value: 7,
    sublabel: '2 просрочено',
    icon: '📅',
    trend: { value: 2, positive: false },
    variant: 'error',
  },
]

const variantStyles = {
  default: 'border-gray-200 bg-white',
  warning: 'border-warning-500/30 bg-amber-50',
  error: 'border-error-500/30 bg-red-50',
  success: 'border-success-500/30 bg-green-50',
}

const valueStyles = {
  default: 'text-gray-900',
  warning: 'text-warning-500',
  error: 'text-error-500',
  success: 'text-success-500',
}

export default function MetricCards() {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        📊 Ключевые метрики
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ translateY: -2 }}
            className={`border rounded-lg p-4 transition-shadow hover:shadow-md ${variantStyles[metric.variant]}`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl">{metric.icon}</span>
              {metric.trend && (
                <span className={`text-xs font-medium ${metric.trend.positive ? 'text-success-500' : 'text-error-500'}`}>
                  {metric.trend.positive ? '↑' : '↓'} {metric.trend.value}
                </span>
              )}
            </div>
            <div className={`text-3xl font-bold ${valueStyles[metric.variant]}`}>
              {metric.value}
            </div>
            <div className="text-sm font-medium text-gray-700 mt-1">{metric.label}</div>
            <div className="text-xs text-gray-500 mt-0.5">{metric.sublabel}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'
import AlertBanner from '../components/features/dashboard/AlertBanner'
import MetricCards from '../components/features/dashboard/MetricCards'
import DeadlineTimeline from '../components/features/dashboard/DeadlineTimeline'
import TestProgress from '../components/features/dashboard/TestProgress'

export default function Dashboard() {
  const today = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Добро пожаловать, Асет 👋
        </h1>
        <p className="text-gray-500 mt-1 capitalize">{today}</p>
      </div>

      {/* Critical alerts */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AlertBanner />
      </motion.div>

      {/* Key metrics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <MetricCards />
      </motion.div>

      {/* Deadlines and progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DeadlineTimeline />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <TestProgress />
        </motion.div>
      </div>
    </div>
  )
}

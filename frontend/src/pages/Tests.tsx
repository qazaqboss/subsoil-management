import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import ProgressBar from '../components/ui/ProgressBar'

interface TestItem {
  id: string
  wellNumber: string
  field: string
  license: string
  licenseId: string
  startDate: string
  endDate: string
  currentDay: number
  totalDays: number
  phase: string
  nextMilestone: string
  nextMilestoneDate: string
  status: 'active' | 'completed' | 'overdue'
  reportDeadline: string
  reportDaysLeft: number
}

const INITIAL_TESTS: TestItem[] = [
  {
    id: '1',
    wellNumber: '47',
    field: 'Каражанбас',
    license: 'МГ-00123',
    licenseId: '1',
    startDate: '01.03.2026',
    endDate: '30.05.2026',
    currentDay: 15,
    totalDays: 90,
    phase: 'Полевые работы',
    nextMilestone: 'Завершение полевых работ',
    nextMilestoneDate: '01.04.2026',
    status: 'active',
    reportDeadline: '30.05.2026',
    reportDaysLeft: 75,
  },
  {
    id: '2',
    wellNumber: '12',
    field: 'Жанажол',
    license: 'МГ-00789',
    licenseId: '3',
    startDate: '15.01.2026',
    endDate: '14.04.2026',
    currentDay: 60,
    totalDays: 90,
    phase: 'Подготовка отчёта',
    nextMilestone: 'Подача отчёта в МЭ РК',
    nextMilestoneDate: '12.04.2026',
    status: 'active',
    reportDeadline: '14.04.2026',
    reportDaysLeft: 29,
  },
  {
    id: '3',
    wellNumber: '31',
    field: 'Жанажол',
    license: 'МГ-00789',
    licenseId: '3',
    startDate: '01.10.2025',
    endDate: '28.12.2025',
    currentDay: 90,
    totalDays: 90,
    phase: 'Завершено',
    nextMilestone: 'Отчёт сдан',
    nextMilestoneDate: '25.12.2025',
    status: 'completed',
    reportDeadline: '28.12.2025',
    reportDaysLeft: 0,
  },
]

const statusConfig = {
  active: { label: 'Активное', variant: 'info' as const, icon: '🔄' },
  completed: { label: 'Завершено', variant: 'success' as const, icon: '✅' },
  overdue: { label: 'Просрочено', variant: 'error' as const, icon: '🔴' },
}

const FIELD_LICENSE_MAP: Record<string, { license: string; licenseId: string }> = {
  'Каражанбас': { license: 'МГ-00123', licenseId: '1' },
  'Жанажол':   { license: 'МГ-00789', licenseId: '3' },
  'Сарыланское': { license: 'РГ-00456', licenseId: '2' },
  'Узень':     { license: 'МГ-00789', licenseId: '3' },
  'Тенгиз':    { license: 'МГ-00123', licenseId: '1' },
}

function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}.${mm}.${yyyy}`
}

function addDays(d: Date, days: number): Date {
  const result = new Date(d)
  result.setDate(result.getDate() + days)
  return result
}

interface NewTestModalProps {
  onClose: () => void
  onSave: (t: TestItem) => void
}

function NewTestModal({ onClose, onSave }: NewTestModalProps) {
  const [wellNumber, setWellNumber] = useState('')
  const [field, setField] = useState('Каражанбас')
  const [startDateRaw, setStartDateRaw] = useState('')
  const [durationDays, setDurationDays] = useState(90)
  const [phase, setPhase] = useState('')

  const licenseInfo = FIELD_LICENSE_MAP[field]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!wellNumber.trim() || !startDateRaw) return

    const startDateObj = new Date(startDateRaw)
    const endDateObj = addDays(startDateObj, durationDays)
    const milestoneDateObj = addDays(startDateObj, 30)

    const newTest: TestItem = {
      id: Date.now().toString(),
      wellNumber: wellNumber.trim(),
      field,
      license: licenseInfo.license,
      licenseId: licenseInfo.licenseId,
      startDate: formatDate(startDateObj),
      endDate: formatDate(endDateObj),
      currentDay: 1,
      totalDays: durationDays,
      phase: phase.trim() || 'Полевые работы',
      nextMilestone: 'Завершение полевых работ',
      nextMilestoneDate: formatDate(milestoneDateObj),
      status: 'active',
      reportDeadline: formatDate(endDateObj),
      reportDaysLeft: durationDays - 1,
    }

    onSave(newTest)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Новое испытание скважины</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            {/* Номер скважины */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Номер скважины <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                placeholder="например, 50"
                value={wellNumber}
                onChange={(e) => setWellNumber(e.target.value)}
                required
              />
            </div>

            {/* Месторождение */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Месторождение
              </label>
              <select
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary-500 bg-white"
                value={field}
                onChange={(e) => setField(e.target.value)}
              >
                {Object.keys(FIELD_LICENSE_MAP).map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Лицензия (авто) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Лицензия
              </label>
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 text-gray-500 focus:outline-none"
                value={licenseInfo.license}
                readOnly
              />
            </div>

            {/* Дата начала */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата начала испытания <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                value={startDateRaw}
                onChange={(e) => setStartDateRaw(e.target.value)}
                required
              />
            </div>

            {/* Длительность */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Длительность испытания
              </label>
              <select
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary-500 bg-white"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
              >
                <option value={30}>30 дней</option>
                <option value={60}>60 дней</option>
                <option value={90}>90 дней</option>
              </select>
            </div>

            {/* Текущая фаза */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Текущая фаза
              </label>
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                placeholder="Полевые работы"
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" variant="primary">
              Начать испытание
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

interface UpdateTestModalProps {
  test: TestItem
  onClose: () => void
  onSave: (id: string, newDay: number) => void
}

function UpdateTestModal({ test, onClose, onSave }: UpdateTestModalProps) {
  const [day, setDay] = useState(test.currentDay)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">📊 Обновить данные</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-600">
            Скважина №{test.wellNumber} — {test.field}
          </p>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Текущий день: <span className="text-primary-600 font-bold">{day}</span> из {test.totalDays}
            </label>
            <input
              type="range"
              min={1}
              max={test.totalDays}
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="w-full accent-primary-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>День 1</span>
              <span>День {test.totalDays}</span>
            </div>
          </div>
          <div className="bg-primary-50 rounded-lg p-3 text-sm">
            <p className="text-primary-700">
              Прогресс: <strong>{Math.round((day / test.totalDays) * 100)}%</strong>
            </p>
            <p className="text-primary-600 text-xs mt-0.5">
              Осталось: {test.totalDays - day} дн. до окончания испытания
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <Button variant="ghost" onClick={onClose}>Отмена</Button>
          <Button variant="primary" onClick={() => onSave(test.id, day)}>Сохранить</Button>
        </div>
      </motion.div>
    </div>
  )
}

export default function Tests() {
  const [tests, setTests] = useState<TestItem[]>(INITIAL_TESTS)
  const [showModal, setShowModal] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [updateTarget, setUpdateTarget] = useState<TestItem | null>(null)

  const activeCount = tests.filter((t) => t.status === 'active').length

  function handleSave(newTest: TestItem) {
    setTests((prev) => [newTest, ...prev])
    setShowModal(false)
    setSuccessMsg(`Испытание скважины №${newTest.wellNumber} запущено`)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  function handleUpdateDay(id: string, newDay: number) {
    setTests((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, currentDay: newDay, reportDaysLeft: Math.max(0, t.totalDays - newDay) }
          : t
      )
    )
    setUpdateTarget(null)
    const t = tests.find((x) => x.id === id)
    setSuccessMsg(`Данные скважины №${t?.wellNumber} обновлены: день ${newDay}`)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🧪 Испытания скважин</h1>
          <p className="text-sm text-gray-500 mt-1">{activeCount} активных · {tests.length} всего</p>
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {successMsg && (
              <motion.span
                key="success"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-sm font-medium text-green-600"
              >
                ✓ {successMsg}
              </motion.span>
            )}
          </AnimatePresence>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Начать испытание
          </Button>
        </div>
      </div>

      {/* Active tests */}
      <div className="space-y-4">
        {tests.map((test, index) => {
          const cfg = statusConfig[test.status]
          const percentage = Math.round((test.currentDay / test.totalDays) * 100)
          const isUrgent = test.reportDaysLeft > 0 && test.reportDaysLeft <= 14

          return (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row gap-5">
                {/* Left: info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{cfg.icon}</span>
                        <h3 className="font-bold text-gray-900 text-lg">
                          Скважина №{test.wellNumber} — {test.field}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        <Link to={`/licenses/${test.licenseId}`} className="text-primary-500 hover:underline">
                          {test.license}
                        </Link>
                        {' · '}Испытание: {test.startDate} — {test.endDate}
                      </p>
                    </div>
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm text-gray-600">
                        День <strong>{test.currentDay}</strong> из <strong>{test.totalDays}</strong>
                      </span>
                      <span className="text-sm font-bold text-primary-500">{percentage}%</span>
                    </div>
                    <ProgressBar
                      value={test.currentDay}
                      max={test.totalDays}
                      size="md"
                      color={test.status === 'completed' ? 'success' : percentage > 80 ? 'warning' : 'primary'}
                      showLabel={false}
                    />
                  </div>

                  {/* Phase + milestone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-primary-50 rounded-lg p-3">
                      <p className="text-xs text-primary-600 font-medium uppercase tracking-wide">Текущая фаза</p>
                      <p className="text-sm font-semibold text-primary-900 mt-1">{test.phase}</p>
                    </div>
                    <div className={`rounded-lg p-3 ${isUrgent ? 'bg-amber-50' : 'bg-gray-50'}`}>
                      <p className={`text-xs font-medium uppercase tracking-wide ${isUrgent ? 'text-warning-500' : 'text-gray-500'}`}>
                        Следующая веха
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">{test.nextMilestone}</p>
                      <p className={`text-xs mt-0.5 ${isUrgent ? 'text-warning-500' : 'text-gray-500'}`}>
                        {test.nextMilestoneDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: deadline + actions */}
                <div className="lg:w-48 flex flex-col gap-3">
                  <div className={`rounded-lg p-4 text-center ${
                    test.status === 'completed' ? 'bg-green-50' :
                    isUrgent ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'
                  }`}>
                    <p className="text-xs text-gray-500 font-medium">Дедлайн отчёта</p>
                    <p className="font-bold text-gray-900 mt-1">{test.reportDeadline}</p>
                    {test.status !== 'completed' && (
                      <p className={`text-lg font-bold mt-1 ${isUrgent ? 'text-warning-500' : 'text-primary-500'}`}>
                        {test.reportDaysLeft} дн.
                      </p>
                    )}
                    {test.status === 'completed' && (
                      <p className="text-success-500 font-medium text-sm mt-1">Сдан ✅</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link to={`/wells/${test.wellNumber}`}>
                      <Button variant="primary" size="sm" fullWidth>Открыть скважину</Button>
                    </Link>
                    {test.status === 'active' && (
                      <Button variant="secondary" size="sm" fullWidth onClick={() => setUpdateTarget(test)}>Обновить данные</Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <NewTestModal
            onClose={() => setShowModal(false)}
            onSave={handleSave}
          />
        )}
        {updateTarget && (
          <UpdateTestModal
            test={updateTarget}
            onClose={() => setUpdateTarget(null)}
            onSave={handleUpdateDay}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

type ReportStatus = 'overdue' | 'due_today' | 'upcoming' | 'submitted' | 'draft'

interface Report {
  id: string
  form: string
  description: string
  license: string
  period: string
  deadline: string
  daysLeft: number
  status: ReportStatus
  orgBody: string
  fine?: string
  progress?: number
}

const INITIAL_REPORTS: Report[] = [
  {
    id: '1',
    form: '1-ТП (недра)',
    description: 'Отчёт об использовании недр',
    license: 'МГ-00123',
    period: 'Февраль 2026',
    deadline: '05.03.2026',
    daysLeft: -11,
    status: 'overdue',
    orgBody: 'МЭ РК',
    fine: '150 000 ₸',
  },
  {
    id: '2',
    form: '2-ТП (воздух)',
    description: 'Отчёт о выбросах в атмосферу',
    license: 'МГ-00456',
    period: 'Март 2026',
    deadline: '16.03.2026',
    daysLeft: 0,
    status: 'due_today',
    orgBody: 'МЭГПР РК',
    progress: 85,
  },
  {
    id: '3',
    form: '5-ГР',
    description: 'Геологоразведочные работы',
    license: 'РГ-00456',
    period: 'Февраль 2026',
    deadline: '05.03.2026',
    daysLeft: -11,
    status: 'submitted',
    orgBody: 'МЭ РК',
  },
  {
    id: '4',
    form: 'ПЛА (скв. №15)',
    description: 'План ликвидации аварий — учения',
    license: 'МГ-00789',
    period: 'Март 2026',
    deadline: '17.03.2026',
    daysLeft: 1,
    status: 'draft',
    orgBody: 'МЧС РК',
    progress: 100,
  },
  {
    id: '5',
    form: '6-ГР',
    description: 'Отчёт о добыче углеводородов',
    license: 'МГ-00123',
    period: 'I квартал 2026',
    deadline: '15.04.2026',
    daysLeft: 30,
    status: 'upcoming',
    orgBody: 'МЭ РК',
  },
  {
    id: '6',
    form: 'Годовой отчёт',
    description: 'Отчёт о выполнении рабочей программы',
    license: 'МГ-00123',
    period: '2025 год',
    deadline: '01.04.2026',
    daysLeft: 16,
    status: 'draft',
    orgBody: 'МЭ РК',
    progress: 50,
  },
  {
    id: '7',
    form: '2-ТП (водхоз)',
    description: 'Отчёт об использовании воды',
    license: 'МГ-00789',
    period: '2025 год',
    deadline: '25.03.2026',
    daysLeft: 9,
    status: 'upcoming',
    orgBody: 'МЭГПР РК',
  },
]

const statusConfig: Record<ReportStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default'; icon: string; bg: string }> = {
  overdue: { label: 'Просрочено', variant: 'error', icon: '🔴', bg: 'bg-red-50 border-red-200' },
  due_today: { label: 'Сегодня', variant: 'warning', icon: '🟠', bg: 'bg-amber-50 border-amber-200' },
  upcoming: { label: 'Предстоит', variant: 'info', icon: '🔵', bg: 'bg-blue-50 border-blue-100' },
  submitted: { label: 'Сдан', variant: 'success', icon: '✅', bg: 'bg-white border-gray-200' },
  draft: { label: 'Черновик', variant: 'default', icon: '📝', bg: 'bg-white border-gray-200' },
}

type FilterTab = 'all' | 'active' | 'submitted'

// ─── NewReportModal ───────────────────────────────────────────────────────────

interface NewReportModalProps {
  onClose: () => void
  onSave: (r: Report) => void
}

function NewReportModal({ onClose, onSave }: NewReportModalProps) {
  const [form, setForm] = useState('')
  const [description, setDescription] = useState('')
  const [license, setLicense] = useState('МГ-00123')
  const [period, setPeriod] = useState('')
  const [deadline, setDeadline] = useState('')
  const [orgBody, setOrgBody] = useState('МЭ РК')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const inputClass =
    'w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary-500'
  const selectClass =
    'w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary-500'

  function validate() {
    const e: Record<string, string> = {}
    if (!form.trim()) e.form = 'Укажите форму отчёта'
    if (!period.trim()) e.period = 'Укажите период'
    if (!deadline) e.deadline = 'Укажите дедлайн'
    return e
  }

  function handleSave() {
    const e = validate()
    if (Object.keys(e).length > 0) {
      setErrors(e)
      return
    }

    // Calculate daysLeft relative to today (2026-03-16)
    const today = new Date('2026-03-16')
    const dl = new Date(deadline)
    const diffMs = dl.getTime() - today.getTime()
    const daysLeft = Math.round(diffMs / (1000 * 60 * 60 * 24))

    // Format deadline as DD.MM.YYYY
    const [y, m, d] = deadline.split('-')
    const formattedDeadline = `${d}.${m}.${y}`

    const newReport: Report = {
      id: Date.now().toString(),
      form: form.trim(),
      description: description.trim(),
      license,
      period: period.trim(),
      deadline: formattedDeadline,
      daysLeft,
      status: 'upcoming',
      orgBody,
    }

    onSave(newReport)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.18 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Новый отчёт</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Форма отчёта */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Форма отчёта <span className="text-error-500">*</span>
            </label>
            <input
              className={inputClass}
              placeholder="например, 1-ТП (недра)"
              value={form}
              onChange={(e) => {
                setForm(e.target.value)
                if (errors.form) setErrors((prev) => ({ ...prev, form: '' }))
              }}
            />
            {errors.form && (
              <p className="mt-1 text-xs text-error-500">{errors.form}</p>
            )}
          </div>

          {/* Описание */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Описание
            </label>
            <input
              className={inputClass}
              placeholder="Краткое описание отчёта"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Лицензия */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Лицензия
            </label>
            <select
              className={selectClass}
              value={license}
              onChange={(e) => setLicense(e.target.value)}
            >
              <option value="МГ-00123">МГ-00123</option>
              <option value="РГ-00456">РГ-00456</option>
              <option value="МГ-00789">МГ-00789</option>
            </select>
          </div>

          {/* Период */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Период <span className="text-error-500">*</span>
            </label>
            <input
              className={inputClass}
              placeholder="например, Март 2026"
              value={period}
              onChange={(e) => {
                setPeriod(e.target.value)
                if (errors.period) setErrors((prev) => ({ ...prev, period: '' }))
              }}
            />
            {errors.period && (
              <p className="mt-1 text-xs text-error-500">{errors.period}</p>
            )}
          </div>

          {/* Дедлайн */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Дедлайн <span className="text-error-500">*</span>
            </label>
            <input
              type="date"
              className={inputClass}
              value={deadline}
              onChange={(e) => {
                setDeadline(e.target.value)
                if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: '' }))
              }}
            />
            {errors.deadline && (
              <p className="mt-1 text-xs text-error-500">{errors.deadline}</p>
            )}
          </div>

          {/* Орган подачи */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Орган подачи
            </label>
            <select
              className={selectClass}
              value={orgBody}
              onChange={(e) => setOrgBody(e.target.value)}
            >
              <option value="МЭ РК">МЭ РК</option>
              <option value="МЭГПР РК">МЭГПР РК</option>
              <option value="МЧС РК">МЧС РК</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <Button variant="ghost" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Создать отчёт
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── SubmitModal ──────────────────────────────────────────────────────────────

interface SubmitModalProps {
  report: Report
  onClose: () => void
  onConfirm: () => void
}

function SubmitModal({ report, onClose, onConfirm }: SubmitModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.18 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Подача отчёта</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-700">
            Вы собираетесь подать отчёт. Убедитесь, что все данные верны.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Форма:</span>
              <span className="font-medium text-gray-900">{report.form}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Лицензия:</span>
              <span className="font-medium text-gray-900">{report.license}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Период:</span>
              <span className="font-medium text-gray-900">{report.period}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Дедлайн:</span>
              <span className="font-medium text-gray-900">{report.deadline}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Орган подачи:</span>
              <span className="font-medium text-gray-900">{report.orgBody}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            После подачи статус отчёта изменится на «Сдан» и редактирование будет недоступно.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <Button variant="ghost" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Подать
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── ProgressModal ────────────────────────────────────────────────────────────

interface ProgressModalProps {
  report: Report
  onClose: () => void
  onSave: (progress: number) => void
}

function ProgressModal({ report, onClose, onSave }: ProgressModalProps) {
  const [progress, setProgress] = useState<number>(report.progress ?? 0)

  function clamp(val: number) {
    return Math.min(100, Math.max(0, val))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.18 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Обновить прогресс</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Форма {report.form}</p>
            <p className="text-xs text-gray-500">{report.description}</p>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Прогресс</span>
              <span className="font-bold text-primary-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full accent-primary-500"
            />
          </div>

          {/* Quick buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setProgress((p) => clamp(p + 10))}
              className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              +10%
            </button>
            <button
              onClick={() => setProgress((p) => clamp(p + 25))}
              className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              +25%
            </button>
            <button
              onClick={() => setProgress(100)}
              className="px-3 py-1.5 text-xs font-medium bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
            >
              Готово (100%)
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <Button variant="ghost" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="primary" onClick={() => onSave(progress)}>
            Сохранить
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── ViewModal ────────────────────────────────────────────────────────────────

interface ViewModalProps {
  report: Report
  onClose: () => void
}

function ViewModal({ report, onClose }: ViewModalProps) {
  const fields: { label: string; value: string }[] = [
    { label: 'Форма отчёта', value: report.form },
    { label: 'Описание', value: report.description },
    { label: 'Лицензия', value: report.license },
    { label: 'Период', value: report.period },
    { label: 'Орган подачи', value: report.orgBody },
    { label: 'Дедлайн', value: report.deadline },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.18 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <h2 className="text-base font-semibold text-gray-900">Просмотр отчёта</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm text-green-700 font-medium">
            Отчёт сдан
          </div>
          <div className="divide-y divide-gray-100">
            {fields.map((f) => (
              <div key={f.label} className="flex justify-between py-2.5 text-sm">
                <span className="text-gray-500">{f.label}</span>
                <span className="font-medium text-gray-900 text-right max-w-[55%]">{f.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-100 bg-gray-50">
          <Button variant="ghost" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Reports page ─────────────────────────────────────────────────────────────

export default function Reports() {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<FilterTab>('all')
  const [showModal, setShowModal] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [modalType, setModalType] = useState<'submit' | 'progress' | 'view' | null>(null)

  function showToast(msg: string) {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  function updateReport(id: string, changes: Partial<Report>) {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, ...changes } : r)))
  }

  function closeActionModal() {
    setSelectedReport(null)
    setModalType(null)
  }

  const filtered = reports.filter((r) => {
    const matchSearch =
      r.form.toLowerCase().includes(search.toLowerCase()) ||
      r.license.toLowerCase().includes(search.toLowerCase()) ||
      r.orgBody.toLowerCase().includes(search.toLowerCase())
    const matchTab =
      tab === 'all' ||
      (tab === 'active' && ['overdue', 'due_today', 'upcoming', 'draft'].includes(r.status)) ||
      (tab === 'submitted' && r.status === 'submitted')
    return matchSearch && matchTab
  })

  const counts = {
    overdue: reports.filter((r) => r.status === 'overdue').length,
    due_today: reports.filter((r) => r.status === 'due_today').length,
    upcoming: reports.filter((r) => r.status === 'upcoming').length,
  }

  function handleSave(r: Report) {
    setReports((prev) => [r, ...prev])
    setShowModal(false)
    showToast('Отчёт добавлен!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📄 Отчёты</h1>
          <p className="text-sm text-gray-500 mt-1">
            {counts.overdue > 0 && <span className="text-error-500 font-medium">{counts.overdue} просрочено · </span>}
            {counts.due_today > 0 && <span className="text-warning-500 font-medium">{counts.due_today} сегодня · </span>}
            {counts.upcoming} предстоит
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {successMsg && (
              <motion.span
                key="success-toast"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-sm text-success-600 font-medium bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg"
              >
                ✓ {successMsg}
              </motion.span>
            )}
          </AnimatePresence>
          <Button variant="primary" onClick={() => setShowModal(true)}>+ Новый отчёт</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {([
          { id: 'all' as FilterTab, label: `Все (${reports.length})` },
          { id: 'active' as FilterTab, label: `Активные (${reports.filter(r => r.status !== 'submitted').length})` },
          { id: 'submitted' as FilterTab, label: `Сданы (${reports.filter(r => r.status === 'submitted').length})` },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <Input
        placeholder="🔍 Поиск по форме, лицензии, органу..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Reports list */}
      <div className="space-y-3">
        {filtered.map((report, index) => {
          const cfg = statusConfig[report.status]
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={`border rounded-lg p-4 transition-shadow hover:shadow-sm ${cfg.bg}`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-xl mt-0.5">{cfg.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900">Форма {report.form}</h3>
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                      {report.status === 'overdue' && report.fine && (
                        <span className="text-xs text-error-500 font-medium bg-red-100 px-2 py-0.5 rounded-full">
                          Штраф: {report.fine}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{report.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-500">
                      <span>📜 {report.license}</span>
                      <span>📅 {report.period}</span>
                      <span>🏛️ {report.orgBody}</span>
                      <span className={
                        report.status === 'overdue' ? 'text-error-500 font-medium' :
                        report.status === 'due_today' ? 'text-warning-500 font-medium' : ''
                      }>
                        {report.status === 'overdue'
                          ? `Дедлайн: ${report.deadline} (просрочено ${Math.abs(report.daysLeft)} дн.)`
                          : report.status === 'submitted'
                          ? `Сдан: ${report.deadline}`
                          : `Дедлайн: ${report.deadline} (${report.daysLeft === 0 ? 'сегодня!' : `${report.daysLeft} дн.`})`}
                      </span>
                    </div>
                    {report.progress !== undefined && report.status !== 'submitted' && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-xs">
                          <div
                            className="h-full bg-primary-500 rounded-full transition-all"
                            style={{ width: `${report.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{report.progress}% готово</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {report.status === 'overdue' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        updateReport(report.id, { status: 'draft', progress: 0 })
                        showToast(`Начата подготовка отчёта «${report.form}»`)
                      }}
                    >
                      Подготовить
                    </Button>
                  )}
                  {report.status === 'due_today' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setSelectedReport(report)
                        setModalType('submit')
                      }}
                    >
                      Подать сейчас
                    </Button>
                  )}
                  {report.status === 'draft' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setSelectedReport(report)
                        setModalType('progress')
                      }}
                    >
                      Продолжить
                    </Button>
                  )}
                  {report.status === 'upcoming' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        updateReport(report.id, { status: 'draft', progress: 0 })
                        showToast('Отчёт добавлен в работу')
                      }}
                    >
                      Начать
                    </Button>
                  )}
                  {report.status === 'submitted' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedReport(report)
                        setModalType('view')
                      }}
                    >
                      Просмотр
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">📄</p>
          <p className="font-medium">Отчёты не найдены</p>
        </div>
      )}

      {/* New Report Modal */}
      <AnimatePresence>
        {showModal && (
          <NewReportModal
            onClose={() => setShowModal(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      {/* Submit Modal */}
      <AnimatePresence>
        {modalType === 'submit' && selectedReport && (
          <SubmitModal
            report={selectedReport}
            onClose={closeActionModal}
            onConfirm={() => {
              updateReport(selectedReport.id, { status: 'submitted' })
              closeActionModal()
              showToast('Отчёт успешно подан!')
            }}
          />
        )}
      </AnimatePresence>

      {/* Progress Modal */}
      <AnimatePresence>
        {modalType === 'progress' && selectedReport && (
          <ProgressModal
            report={selectedReport}
            onClose={closeActionModal}
            onSave={(progress) => {
              updateReport(selectedReport.id, { progress })
              closeActionModal()
              showToast('Прогресс обновлён')
            }}
          />
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {modalType === 'view' && selectedReport && (
          <ViewModal
            report={selectedReport}
            onClose={closeActionModal}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

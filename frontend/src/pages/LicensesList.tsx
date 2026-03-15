import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

interface License {
  id: string
  number: string
  status: 'active' | 'expiring' | 'expired' | 'suspended'
  type: string
  resource: string
  company: string
  issuedDate: string
  expiresDate: string
  daysLeft?: number
  area: number
  wells: number
  obligations: number
  overdue: number
}

const INITIAL_LICENSES: License[] = [
  {
    id: '1',
    number: 'МГ-00123',
    status: 'active',
    type: 'Совмещенная',
    resource: 'Нефть',
    company: 'ТОО "ЭкоМикс"',
    issuedDate: '15.01.2020',
    expiresDate: '15.01.2028',
    area: 120.5,
    wells: 8,
    obligations: 12,
    overdue: 1,
  },
  {
    id: '2',
    number: 'РГ-00456',
    status: 'expiring',
    type: 'Разведка',
    resource: 'Газ',
    company: 'АО "GasExplore"',
    issuedDate: '10.06.2022',
    expiresDate: '10.06.2026',
    daysLeft: 82,
    area: 45.2,
    wells: 3,
    obligations: 8,
    overdue: 0,
  },
  {
    id: '3',
    number: 'МГ-00789',
    status: 'active',
    type: 'Добыча',
    resource: 'Нефть и газ',
    company: 'ТОО "КазМунайГаз"',
    issuedDate: '01.03.2019',
    expiresDate: '01.03.2029',
    area: 210.0,
    wells: 15,
    obligations: 18,
    overdue: 0,
  },
]

const statusMap = {
  active: { label: 'Действующая', variant: 'success' as const },
  expiring: { label: 'Истекает скоро', variant: 'warning' as const },
  expired: { label: 'Истекла', variant: 'error' as const },
  suspended: { label: 'Приостановлена', variant: 'default' as const },
}

// ─── NewLicenseModal ────────────────────────────────────────────────────────

interface NewLicenseModalProps {
  onClose: () => void
  onSave: (l: License) => void
}

function NewLicenseModal({ onClose, onSave }: NewLicenseModalProps) {
  const [number, setNumber] = useState('')
  const [type, setType] = useState('Совмещенная')
  const [resource, setResource] = useState('Нефть')
  const [company, setCompany] = useState('')
  const [issuedDate, setIssuedDate] = useState('')
  const [expiresDate, setExpiresDate] = useState('')
  const [area, setArea] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!number.trim()) e.number = 'Введите номер лицензии'
    if (!company.trim()) e.company = 'Введите недропользователя'
    if (!issuedDate) e.issuedDate = 'Выберите дату выдачи'
    if (!expiresDate) e.expiresDate = 'Выберите дату истечения'
    if (!area || isNaN(Number(area)) || Number(area) <= 0) e.area = 'Введите корректную площадь'
    return e
  }

  function handleSave() {
    const e = validate()
    if (Object.keys(e).length > 0) {
      setErrors(e)
      return
    }

    // Format dates from yyyy-mm-dd to dd.mm.yyyy
    function fmtDate(d: string) {
      const [y, m, day] = d.split('-')
      return `${day}.${m}.${y}`
    }

    const newLicense: License = {
      id: String(Date.now()),
      number: number.trim(),
      status: 'active',
      type,
      resource,
      company: company.trim(),
      issuedDate: fmtDate(issuedDate),
      expiresDate: fmtDate(expiresDate),
      area: Number(area),
      wells: 0,
      obligations: 0,
      overdue: 0,
    }

    onSave(newLicense)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Новая лицензия</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">
          {/* Номер лицензии */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Номер лицензии <span className="text-error-500">*</span>
            </label>
            <Input
              placeholder="например, МГ-00999"
              value={number}
              onChange={(e) => { setNumber(e.target.value); setErrors((prev) => ({ ...prev, number: '' })) }}
            />
            {errors.number && <p className="mt-1 text-xs text-error-500">{errors.number}</p>}
          </div>

          {/* Вид лицензии */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Вид лицензии</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
            >
              <option>Совмещенная</option>
              <option>Разведка</option>
              <option>Добыча</option>
            </select>
          </div>

          {/* Ресурс */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ресурс</label>
            <select
              value={resource}
              onChange={(e) => setResource(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
            >
              <option>Нефть</option>
              <option>Газ</option>
              <option>Нефть и газ</option>
              <option>Уголь</option>
            </select>
          </div>

          {/* Недропользователь */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Недропользователь <span className="text-error-500">*</span>
            </label>
            <Input
              placeholder='ТОО "НазваниеКомпании"'
              value={company}
              onChange={(e) => { setCompany(e.target.value); setErrors((prev) => ({ ...prev, company: '' })) }}
            />
            {errors.company && <p className="mt-1 text-xs text-error-500">{errors.company}</p>}
          </div>

          {/* Дата выдачи */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дата выдачи <span className="text-error-500">*</span>
            </label>
            <input
              type="date"
              value={issuedDate}
              onChange={(e) => { setIssuedDate(e.target.value); setErrors((prev) => ({ ...prev, issuedDate: '' })) }}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
            />
            {errors.issuedDate && <p className="mt-1 text-xs text-error-500">{errors.issuedDate}</p>}
          </div>

          {/* Дата истечения */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дата истечения <span className="text-error-500">*</span>
            </label>
            <input
              type="date"
              value={expiresDate}
              onChange={(e) => { setExpiresDate(e.target.value); setErrors((prev) => ({ ...prev, expiresDate: '' })) }}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
            />
            {errors.expiresDate && <p className="mt-1 text-xs text-error-500">{errors.expiresDate}</p>}
          </div>

          {/* Площадь */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Площадь (км²) <span className="text-error-500">*</span>
            </label>
            <input
              type="number"
              placeholder="например, 120.5"
              value={area}
              onChange={(e) => { setArea(e.target.value); setErrors((prev) => ({ ...prev, area: '' })) }}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
            />
            {errors.area && <p className="mt-1 text-xs text-error-500">{errors.area}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <Button variant="ghost" onClick={onClose}>Отмена</Button>
          <Button variant="primary" onClick={handleSave}>Создать лицензию</Button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── LicensesList ────────────────────────────────────────────────────────────

export default function LicensesList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [licenses, setLicenses] = useState<License[]>(INITIAL_LICENSES)
  const [showModal, setShowModal] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  function showToast(msg: string) {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const filtered = licenses.filter(
    (l) =>
      (l.number.toLowerCase().includes(search.toLowerCase()) ||
       l.company.toLowerCase().includes(search.toLowerCase())) &&
      (filterStatus === 'all' || l.status === filterStatus)
  )

  function handleSave(l: License) {
    setLicenses((prev) => [l, ...prev])
    setShowModal(false)
    setSuccessMsg(`Лицензия ${l.number} успешно создана`)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">📜 Лицензии</h1>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {successMsg && (
              <motion.span
                key="success"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-sm text-success-600 font-medium"
              >
                ✅ {successMsg}
              </motion.span>
            )}
          </AnimatePresence>
          <Button variant="primary" onClick={() => setShowModal(true)}>+ Новая лицензия</Button>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            placeholder="🔍 Поиск лицензий..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="secondary" onClick={() => setShowFilters(!showFilters)}>
          Фильтры {showFilters ? '▲' : '▼'}
        </Button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4"
          >
            <p className="text-xs font-medium text-gray-700 mb-2">Статус лицензии</p>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'Все' },
                { value: 'active', label: '✅ Действующие' },
                { value: 'expiring', label: '⚠️ Истекают' },
                { value: 'expired', label: '❌ Истекшие' },
                { value: 'suspended', label: '⏸️ Приостановленные' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilterStatus(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filterStatus === opt.value
                      ? 'bg-primary-500 text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {filtered.map((license, index) => {
          const status = statusMap[license.status]
          return (
            <motion.div
              key={license.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-gray-900">{license.number}</h3>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {license.resource} | {license.type}
                  </p>
                  <p className="text-sm font-medium text-gray-700">{license.company}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Выдана:</span>
                  <span className="ml-1 text-gray-900 font-medium">{license.issuedDate}</span>
                </div>
                <div>
                  <span className="text-gray-500">Истекает:</span>
                  <span className={`ml-1 font-medium ${license.status === 'expiring' ? 'text-warning-500' : 'text-gray-900'}`}>
                    {license.expiresDate}
                    {license.daysLeft && <span className="text-xs ml-1">({license.daysLeft} дн.)</span>}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Площадь:</span>
                  <span className="ml-1 text-gray-900 font-medium">{license.area} км²</span>
                </div>
                <div>
                  <span className="text-gray-500">Скважин:</span>
                  <span className="ml-1 text-gray-900 font-medium">{license.wells}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-500">Обязательств: </span>
                  <span className="font-medium">{license.obligations}</span>
                  {license.overdue > 0 && (
                    <span className="ml-2 text-error-500 font-medium">
                      Просрочено: {license.overdue} 🔴
                    </span>
                  )}
                  {license.overdue === 0 && (
                    <span className="ml-2 text-success-500 font-medium">Все выполнены ✅</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link to={`/licenses/${license.id}`}>
                    <Button variant="ghost" size="sm">Детали</Button>
                  </Link>
                  <Button variant="secondary" size="sm" onClick={() => navigate('/reports')}>Отчеты</Button>
                  {license.status === 'expiring' && (
                    <Button variant="primary" size="sm" onClick={() => showToast(`Заявка на продление ${license.number} отправлена в МЭ РК`)}>Продлить</Button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="text-center">
        <Button variant="ghost" onClick={() => showToast('Все лицензии отображены')}>Показать еще 10 лицензий...</Button>
      </div>

      <AnimatePresence>
        {showModal && (
          <NewLicenseModal
            onClose={() => setShowModal(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

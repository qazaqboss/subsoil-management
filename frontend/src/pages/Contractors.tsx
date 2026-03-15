import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

type ContractorStatus = 'active' | 'warning' | 'blacklisted'

interface Document {
  name: string
  expiry: string
  daysLeft: number
  status: 'ok' | 'expiring' | 'expired'
}

interface Contractor {
  id: string
  name: string
  bin: string
  status: ContractorStatus
  specialty: string[]
  activeWells: number
  completedWells: number
  contact: string
  phone: string
  email: string
  rating: number
  overdueDocuments: number
  documents: Document[]
  lastActivity: string
}

const INITIAL_CONTRACTORS: Contractor[] = [
  {
    id: '1',
    name: 'ТОО "KazDrilling"',
    bin: '180340012345',
    status: 'warning',
    specialty: ['Бурение', 'Испытание'],
    activeWells: 2,
    completedWells: 15,
    contact: 'Сейткали Нурлан',
    phone: '+7 701 234 56 78',
    email: 'nurlan@kazdrilling.kz',
    rating: 3.8,
    overdueDocuments: 2,
    lastActivity: '14.03.2026',
    documents: [
      { name: 'Лицензия на буровые работы', expiry: '30.06.2026', daysLeft: 106, status: 'ok' },
      { name: 'Страховой полис ГПО', expiry: '01.04.2026', daysLeft: 16, status: 'expiring' },
      { name: 'Сертификат ISO 9001', expiry: '01.03.2026', daysLeft: -15, status: 'expired' },
      { name: 'Допуск к работам МЧС', expiry: '15.09.2026', daysLeft: 183, status: 'ok' },
    ],
  },
  {
    id: '2',
    name: 'ТОО "MunaiService"',
    bin: '140230045678',
    status: 'active',
    specialty: ['Добыча', 'Обслуживание', 'КРС'],
    activeWells: 2,
    completedWells: 42,
    contact: 'Жансеит Болат',
    phone: '+7 702 345 67 89',
    email: 'bolat@munaiservice.kz',
    rating: 4.7,
    overdueDocuments: 0,
    lastActivity: '16.03.2026',
    documents: [
      { name: 'Лицензия на нефтедобычу', expiry: '31.12.2027', daysLeft: 655, status: 'ok' },
      { name: 'Страховой полис ГПО', expiry: '01.07.2026', daysLeft: 107, status: 'ok' },
      { name: 'Сертификат ISO 9001', expiry: '20.08.2026', daysLeft: 157, status: 'ok' },
    ],
  },
  {
    id: '3',
    name: 'АО "CaspianDrill"',
    bin: '100150067890',
    status: 'active',
    specialty: ['Бурение', 'Паспортизация', 'ГИС'],
    activeWells: 1,
    completedWells: 87,
    contact: 'Альжанов Серик',
    phone: '+7 705 456 78 90',
    email: 's.alzhanov@caspiandrill.kz',
    rating: 4.9,
    overdueDocuments: 0,
    lastActivity: '15.03.2026',
    documents: [
      { name: 'Лицензия на буровые работы', expiry: '01.01.2028', daysLeft: 656, status: 'ok' },
      { name: 'Страховой полис ГПО', expiry: '30.11.2026', daysLeft: 259, status: 'ok' },
      { name: 'Сертификат API Q1', expiry: '15.05.2026', daysLeft: 60, status: 'ok' },
    ],
  },
  {
    id: '4',
    name: 'ТОО "GeoService"',
    bin: '200560078901',
    status: 'active',
    specialty: ['Геологоразведка', 'Бурение'],
    activeWells: 1,
    completedWells: 8,
    contact: 'Берикова Гульнара',
    phone: '+7 707 567 89 01',
    email: 'g.berikova@geoservice.kz',
    rating: 4.2,
    overdueDocuments: 0,
    lastActivity: '13.03.2026',
    documents: [
      { name: 'Лицензия на геологоразведку', expiry: '30.09.2026', daysLeft: 198, status: 'ok' },
      { name: 'Страховой полис ГПО', expiry: '01.06.2026', daysLeft: 77, status: 'ok' },
    ],
  },
]

const statusConfig: Record<ContractorStatus, { label: string; variant: 'success' | 'warning' | 'error'; icon: string }> = {
  active: { label: 'Надёжный', variant: 'success', icon: '✅' },
  warning: { label: 'Нарушения', variant: 'warning', icon: '⚠️' },
  blacklisted: { label: 'Чёрный список', variant: 'error', icon: '🚫' },
}

const docStatusStyle: Record<Document['status'], string> = {
  ok: 'text-success-500',
  expiring: 'text-warning-500',
  expired: 'text-error-500',
}

const docStatusIcon: Record<Document['status'], string> = {
  ok: '✅',
  expiring: '⚠️',
  expired: '❌',
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`text-sm ${s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

function NewContractorModal({ onClose, onSave }: { onClose: () => void; onSave: (c: Contractor) => void }) {
  const [name, setName] = useState('')
  const [bin, setBin] = useState('')
  const [contact, setContact] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [status, setStatus] = useState<ContractorStatus>('active')

  const inputCls = 'input w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary-500'

  function handleSave() {
    if (!name.trim() || !bin.trim() || !contact.trim() || !phone.trim() || !email.trim()) return

    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    const lastActivity = `${dd}.${mm}.${yyyy}`

    const specialtyArr = specialty
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const newContractor: Contractor = {
      id: Date.now().toString(),
      name: name.trim(),
      bin: bin.trim(),
      status,
      specialty: specialtyArr,
      activeWells: 0,
      completedWells: 0,
      contact: contact.trim(),
      phone: phone.trim(),
      email: email.trim(),
      rating: 5.0,
      overdueDocuments: 0,
      documents: [],
      lastActivity,
    }

    onSave(newContractor)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">👷 Новый подрядчик</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Название */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Название компании <span className="text-error-500">*</span>
            </label>
            <input
              className={inputCls}
              placeholder='ТОО "НазваниеКомпании"'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* БИН + Статус */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                БИН <span className="text-error-500">*</span>
              </label>
              <input
                className={inputCls}
                placeholder="123456789012"
                maxLength={12}
                value={bin}
                onChange={(e) => setBin(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Статус</label>
              <select
                className={inputCls}
                value={status}
                onChange={(e) => setStatus(e.target.value as ContractorStatus)}
              >
                <option value="active">Надёжный</option>
                <option value="warning">Нарушения</option>
                <option value="blacklisted">Чёрный список</option>
              </select>
            </div>
          </div>

          {/* Контактное лицо */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Контактное лицо <span className="text-error-500">*</span>
            </label>
            <input
              className={inputCls}
              placeholder="Фамилия Имя Отчество"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>

          {/* Телефон + Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Телефон <span className="text-error-500">*</span>
              </label>
              <input
                className={inputCls}
                placeholder="+7 7XX XXX XX XX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email <span className="text-error-500">*</span>
              </label>
              <input
                className={inputCls}
                placeholder="email@company.kz"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Специализация */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Специализация <span className="text-gray-400 font-normal">(через запятую)</span>
            </label>
            <input
              className={inputCls}
              placeholder="Бурение, Испытание"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button variant="ghost" onClick={onClose}>Отмена</Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!name.trim() || !bin.trim() || !contact.trim() || !phone.trim() || !email.trim()}
          >
            Добавить подрядчика
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

interface ContactModalProps {
  contractor: Contractor
  onClose: () => void
}

function ContactModal({ contractor, onClose }: ContactModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">✉️ Связаться</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Компания</p>
            <p className="font-semibold text-gray-900">{contractor.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Контактное лицо</p>
            <p className="text-gray-900">{contractor.contact}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Телефон</p>
            <a href={`tel:${contractor.phone}`} className="text-primary-500 hover:underline font-medium">{contractor.phone}</a>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Email</p>
            <a href={`mailto:${contractor.email}`} className="text-primary-500 hover:underline">{contractor.email}</a>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <Button variant="ghost" onClick={onClose}>Закрыть</Button>
          <Button variant="primary" onClick={() => { window.open(`mailto:${contractor.email}`) }}>Открыть email</Button>
        </div>
      </motion.div>
    </div>
  )
}

export default function Contractors() {
  const [contractors, setContractors] = useState<Contractor[]>(INITIAL_CONTRACTORS)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [contactTarget, setContactTarget] = useState<Contractor | null>(null)

  function showToast(msg: string) {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const filtered = contractors.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.bin.includes(search) ||
      c.specialty.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  )

  function handleSave(c: Contractor) {
    setContractors((prev) => [c, ...prev])
    setShowModal(false)
    setSuccessMsg(`Подрядчик "${c.name}" добавлен`)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">👷 Подрядчики</h1>
          <p className="text-sm text-gray-500 mt-1">
            {contractors.length} подрядчика ·{' '}
            <span className="text-error-500 font-medium">
              {contractors.filter((c) => c.overdueDocuments > 0).length} с просроченными документами
            </span>
          </p>
        </div>
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
          <Button variant="primary" onClick={() => setShowModal(true)}>+ Добавить подрядчика</Button>
        </div>
      </div>

      {/* Search */}
      <Input
        placeholder="🔍 Поиск по названию, БИН, специализации..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Contractors list */}
      <div className="space-y-4">
        {filtered.map((c, index) => {
          const cfg = statusConfig[c.status]
          const isExpanded = expanded === c.id

          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Main row */}
              <div className="p-5">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Avatar + name */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      🏢
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900">{c.name}</h3>
                        <Badge variant={cfg.variant}>{cfg.icon} {cfg.label}</Badge>
                        {c.overdueDocuments > 0 && (
                          <span className="text-xs text-error-500 bg-red-50 px-2 py-0.5 rounded-full font-medium">
                            {c.overdueDocuments} просроч. доков
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">БИН: {c.bin}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {c.specialty.map((s) => (
                          <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6 text-center flex-shrink-0">
                    <div>
                      <div className="text-xl font-bold text-info-500">{c.activeWells}</div>
                      <div className="text-xs text-gray-500">Активных<br />скважин</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-success-500">{c.completedWells}</div>
                      <div className="text-xs text-gray-500">Завершённых<br />скважин</div>
                    </div>
                    <div>
                      <StarRating rating={c.rating} />
                      <div className="text-xs text-gray-500 mt-1">Рейтинг</div>
                    </div>
                  </div>
                </div>

                {/* Contact row */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex gap-4 text-sm flex-1">
                    <div>
                      <span className="text-gray-500">Контакт: </span>
                      <span className="font-medium text-gray-900">{c.contact}</span>
                    </div>
                    <a href={`tel:${c.phone}`} className="text-primary-500 hover:underline">{c.phone}</a>
                    <a href={`mailto:${c.email}`} className="text-primary-500 hover:underline hidden md:block">{c.email}</a>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpanded(isExpanded ? null : c.id)}
                    >
                      {isExpanded ? 'Скрыть' : 'Документы'} ({c.documents.length})
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setContactTarget(c)}>Написать</Button>
                    <Button variant={c.status === 'warning' ? 'danger' : 'primary'} size="sm"
                      onClick={() => showToast(c.status === 'warning'
                        ? `Запрос документов отправлен: ${c.name}`
                        : `Задача поставлена: ${c.name}`)}>
                      {c.status === 'warning' ? 'Запросить документы' : 'Задать задачу'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Documents accordion */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-200 bg-gray-50"
                >
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">📋 Разрешительные документы</h4>
                    <div className="space-y-2">
                      {c.documents.map((doc, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-gray-100"
                        >
                          <span className="text-base">{docStatusIcon[doc.status]}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                            <p className={`text-xs mt-0.5 ${docStatusStyle[doc.status]}`}>
                              {doc.status === 'expired'
                                ? `Просрочено ${Math.abs(doc.daysLeft)} дн. назад`
                                : doc.status === 'expiring'
                                ? `Истекает через ${doc.daysLeft} дн. (${doc.expiry})`
                                : `Действует до ${doc.expiry}`}
                            </p>
                          </div>
                          {(doc.status === 'expired' || doc.status === 'expiring') && (
                            <Button
                              variant={doc.status === 'expired' ? 'danger' : 'secondary'}
                              size="sm"
                              onClick={() => showToast(doc.status === 'expired'
                                ? `Запрос отправлен: "${doc.name}" — ${c.name}`
                                : `Напоминание отправлено: "${doc.name}" — ${c.name}`)}
                            >
                              {doc.status === 'expired' ? 'Запросить' : 'Напомнить'}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">Подрядчики не найдены</p>
          <p className="text-sm mt-1">Попробуйте изменить поиск</p>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <NewContractorModal
            onClose={() => setShowModal(false)}
            onSave={handleSave}
          />
        )}
        {contactTarget && (
          <ContactModal
            contractor={contactTarget}
            onClose={() => setContactTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

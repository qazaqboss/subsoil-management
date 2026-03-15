import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import ProgressBar from '../components/ui/ProgressBar'

type TabId = 'overview' | 'reports' | 'wells' | 'documents'

const tabs: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Обзор' },
  { id: 'reports', label: 'Отчетность' },
  { id: 'wells', label: 'Скважины' },
  { id: 'documents', label: 'Документы' },
]

const obligations = [
  { name: 'Форма 1-ТП (недра)', status: 'overdue', period: 'Ежемесячная', org: 'МЭ РК', deadline: '05.03.2026', overdueDays: 3, fine: '50 МРП' },
  { name: 'Форма 6-ГР', status: 'ok', period: 'Квартальная', org: 'МЭ РК', deadline: '15.04.2026', daysLeft: 30 },
  { name: 'Годовой отчет о выполнении раб. программы', status: 'inprogress', period: 'Годовая', org: 'МЭ РК', deadline: '01.04.2026', daysLeft: 16, progress: 50 },
]

const wells = [
  { number: '45', status: 'Добыча', depth: '3500м' },
  { number: '46', status: 'Добыча', depth: '3200м' },
  { number: '47', status: 'Испытание', depth: '3800м' },
  { number: '48', status: 'Бурение', depth: '2450м' },
]

export default function LicenseDetail() {
  useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [toast, setToast] = useState<string>('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editCompany, setEditCompany] = useState('ТОО «ЭкоМикс»')
  const [editArea, setEditArea] = useState('120.5')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function handleSaveEdit() {
    setShowEditModal(false)
    showToast('Изменения сохранены')
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              key="modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Редактировать лицензию</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Компания</label>
                  <input
                    type="text"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Площадь участка (км²)</label>
                  <input
                    type="text"
                    value={editArea}
                    onChange={(e) => setEditArea(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="ghost" size="sm" onClick={() => setShowEditModal(false)}>Отмена</Button>
                <Button variant="primary" size="sm" onClick={handleSaveEdit}>Сохранить</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back */}
      <Link to="/licenses" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors">
        ← Назад к лицензиям
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">📜 Лицензия МГ-00123</h1>
            <Badge variant="success">Действующая</Badge>
          </div>
          <p className="text-gray-600 mt-1">ТОО "ЭкоМикс"</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => showToast('📥 Загружается лицензия МГ-00123.pdf...')}>Скачать PDF</Button>
          <Button variant="primary" size="sm" onClick={() => setShowEditModal(true)}>Редактировать</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div role="tablist" className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Basic info */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Основная информация</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Тип лицензии', value: 'Совмещенная (разведка + добыча)' },
                { label: 'Полезное ископаемое', value: 'Нефть' },
                { label: 'Номер', value: 'МГ-00123' },
                { label: 'Дата выдачи', value: '15 января 2020' },
                { label: 'Срок действия', value: '15 января 2028 (1 год 9 мес.)' },
                { label: 'Площадь участка', value: '120.5 км²' },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-2">
                  <span className="text-gray-500 flex-shrink-0">{label}:</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Obligations */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Обязательства по отчетности ({obligations.length})</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {obligations.map((ob, i) => (
                <div key={i} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{ob.name}</span>
                        {ob.status === 'overdue' && <span className="text-xs text-error-500 bg-red-50 px-2 py-0.5 rounded-full font-medium">🔴 Просрочено {ob.overdueDays} дн.</span>}
                        {ob.status === 'ok' && <span className="text-xs text-success-500 bg-green-50 px-2 py-0.5 rounded-full font-medium">🟢 Подан вовремя</span>}
                        {ob.status === 'inprogress' && <span className="text-xs text-warning-500 bg-amber-50 px-2 py-0.5 rounded-full font-medium">🟡 В работе</span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {ob.period} | {ob.org}
                        {ob.fine && <span className="ml-2 text-error-500">| Штраф: {ob.fine}</span>}
                      </p>
                      <p className="text-xs text-gray-500">
                        Дедлайн: {ob.deadline}
                        {ob.daysLeft && <span className="ml-1 text-gray-400">({ob.daysLeft} дн.)</span>}
                      </p>
                      {ob.progress && (
                        <div className="mt-2 max-w-xs">
                          <ProgressBar value={ob.progress} size="sm" showLabel={false} color="warning" />
                        </div>
                      )}
                    </div>
                    <Button
                      variant={ob.status === 'overdue' ? 'danger' : ob.status === 'inprogress' ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => {
                        if (ob.status === 'overdue') showToast(`Начата подготовка: ${ob.name}`)
                        else if (ob.status === 'inprogress') showToast(`Продолжаете работу над: ${ob.name}`)
                        else showToast(`Просмотр: ${ob.name}`)
                      }}
                    >
                      {ob.status === 'overdue' ? 'Подготовить' : ob.status === 'inprogress' ? 'Продолжить' : 'Детали'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wells */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Скважины ({wells.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {wells.map((well) => (
                <Link
                  key={well.number}
                  to={`/wells/${well.number}`}
                  className="border border-gray-200 rounded-lg p-3 text-center hover:border-primary-300 hover:bg-primary-100/30 transition-all"
                >
                  <div className="font-bold text-gray-900">№{well.number}</div>
                  <div className="text-xs text-gray-500 mt-1">{well.status}</div>
                  <div className="text-xs text-gray-400">{well.depth}</div>
                </Link>
              ))}
            </div>
            <Button variant="ghost" className="mt-3" onClick={() => navigate('/wells')}>Посмотреть все скважины</Button>
          </div>
        </div>
      )}

      {activeTab !== 'overview' && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
          <p className="text-4xl mb-3">🚧</p>
          <p className="font-medium">Раздел в разработке</p>
          <p className="text-sm mt-1">Скоро появится контент для вкладки "{tabs.find(t => t.id === activeTab)?.label}"</p>
        </div>
      )}
    </div>
  )
}

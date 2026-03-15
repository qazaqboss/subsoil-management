import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import ProgressBar from '../components/ui/ProgressBar'
import Button from '../components/ui/Button'

const documents = [
  { name: 'Конструкция скважины', status: 'done', date: '12.03.2026' },
  { name: 'Акты спуска обсадных колонн (все 4 шт.)', status: 'done', date: '10.03.2026' },
  { name: 'Инклинограмма', status: 'done', date: '10.03.2026' },
  { name: 'Сводный геологический разрез', status: 'pending', deadline: '20.03.2026', daysLeft: 4, responsible: 'ТОО "KazDrilling"' },
  { name: 'Сводка результатов ГИС', status: 'overdue', overdueDays: 3, responsible: 'ТОО "KazDrilling"' },
]

const lifecycle = ['Подготовка', 'Бурение', 'Испытание', 'Паспортизация', 'Сдача']
const currentStep = 2 // 0-indexed

const historyEntries = [
  { date: '15.03.2026', author: 'Иванов И.И.', action: 'Обновлены данные по глубине: 3785 м' },
  { date: '10.03.2026', author: 'ТОО "KazDrilling"', action: 'Добавлены акты спуска обсадных колонн' },
  { date: '05.03.2026', author: 'Система', action: 'Переход на этап "Испытание"' },
  { date: '01.03.2026', author: 'Иванов И.И.', action: 'Начало бурения' },
]

export default function WellDetail() {
  const { id } = useParams()
  const [toast, setToast] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  function showToast(message: string) {
    setToast(message)
    setTimeout(() => setToast(''), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed top-4 right-4 z-50 bg-green-600 text-white text-sm font-medium px-4 py-3 rounded-lg shadow-lg max-w-xs"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <Link to="/licenses/1" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
        ← Назад к скважинам
      </Link>

      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">🏗️ Скважина №{id || '47'}</h1>
          <span className="bg-amber-100 text-warning-500 text-sm px-3 py-1 rounded-full font-medium">🟡 Испытание</span>
        </div>
        <p className="text-gray-600 mt-1">Месторождение "Каражанбас" | Лицензия МГ-00123</p>
      </div>

      {/* Lifecycle */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Жизненный цикл скважины</h2>
        <div className="flex items-center gap-0 overflow-x-auto">
          {lifecycle.map((step, index) => (
            <div key={step} className="flex items-center flex-shrink-0">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                index < currentStep ? 'bg-success-500/10 text-success-500' :
                index === currentStep ? 'bg-primary-100 text-primary-700' :
                'bg-gray-100 text-gray-400'
              }`}>
                <span>{index < currentStep ? '✅' : index === currentStep ? '🔄' : '⏸️'}</span>
                <span>{step}</span>
              </div>
              {index < lifecycle.length - 1 && (
                <div className={`w-6 h-0.5 ${index < currentStep ? 'bg-success-500' : 'bg-gray-200'}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Текущий этап: Испытания (90-дневный цикл)</h2>
        <div className="mb-4">
          <ProgressBar value={45} max={90} label="День 45 из 90" color="primary" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500">Дата начала</p>
            <p className="font-semibold text-gray-900 mt-1">01.03.2026</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500">Дедлайн отчета</p>
            <p className="font-semibold text-gray-900 mt-1">30.05.2026 <span className="text-warning-500 text-xs">(45 дн.)</span></p>
          </div>
          <div className="bg-primary-100 rounded-lg p-3">
            <p className="text-primary-600">Текущая фаза</p>
            <p className="font-semibold text-primary-900 mt-1">Полевые работы</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Следующие вехи:</p>
          <div className="space-y-2">
            {[
              { date: '01.04', label: 'Завершение полевых работ' },
              { date: '16.04', label: 'Старт подготовки отчета' },
              { date: '29.05', label: 'Подача отчета в МЭ РК' },
            ].map((m) => (
              <div key={m.date} className="flex items-center gap-3 text-sm">
                <span>📍</span>
                <span className="font-mono text-primary-500 font-medium">{m.date}</span>
                <span className="text-gray-700">— {m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Documents checklist */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Критические документы (паспортизация)</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {documents.map((doc, i) => (
            <div key={i} className="p-4 flex items-start gap-3">
              <span className="text-lg flex-shrink-0">
                {doc.status === 'done' ? '✅' : doc.status === 'pending' ? '⚠️' : '❌'}
              </span>
              <div className="flex-1">
                <p className={`text-sm font-medium ${doc.status === 'overdue' ? 'text-error-500' : 'text-gray-900'}`}>
                  {doc.name}
                  {doc.status === 'overdue' && <span className="ml-2 text-xs">(просрочено на {doc.overdueDays} дня!) 🔴</span>}
                </p>
                {doc.status === 'done' && <p className="text-xs text-gray-500 mt-0.5">Получено {doc.date}</p>}
                {(doc.status === 'pending' || doc.status === 'overdue') && (
                  <div className="mt-1">
                    {doc.responsible && <p className="text-xs text-gray-500">Ответственный: {doc.responsible}</p>}
                    {doc.deadline && <p className="text-xs text-warning-500">Дедлайн: {doc.deadline} ({doc.daysLeft} дн.) 🟠</p>}
                  </div>
                )}
              </div>
              {(doc.status === 'pending' || doc.status === 'overdue') && (
                <Button
                  variant={doc.status === 'overdue' ? 'danger' : 'secondary'}
                  size="sm"
                  onClick={() => showToast(`Запрос отправлен: ${doc.name} → ${doc.responsible}`)}
                >
                  Запросить
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Technical data */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Технические данные</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {[
            { label: 'Проектная глубина', value: '3800 м' },
            { label: 'Текущая глубина', value: '3785 м' },
            { label: 'Дата забуривания', value: '01.03.2026' },
            { label: 'Буровой подрядчик', value: 'ТОО "KazDrilling"' },
            { label: 'Супервайзер', value: 'Иванов И.И.' },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-2 p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-500">{label}:</span>
              <span className="font-medium text-gray-900">{value}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            variant="secondary"
            onClick={() => showToast(`📥 Загружается паспорт скважины №${id || '47'}...`)}
          >
            Скачать полный паспорт
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowHistory((prev) => !prev)}
          >
            История изменений
          </Button>
        </div>

        {/* History panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              key="history"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">История изменений</h3>
                <div className="space-y-2">
                  {historyEntries.map((entry, i) => (
                    <div key={i} className="flex gap-3 text-sm p-3 bg-gray-50 rounded-lg">
                      <span className="font-mono text-gray-400 flex-shrink-0">{entry.date}</span>
                      <span className="text-primary-600 font-medium flex-shrink-0">{entry.author}</span>
                      <span className="text-gray-700">— {entry.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

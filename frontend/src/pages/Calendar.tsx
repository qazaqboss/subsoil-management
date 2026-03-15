import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button'

type EventStatus = 'overdue' | 'urgent' | 'upcoming' | 'scheduled' | 'done'

interface CalEvent {
  id: string
  day: number
  title: string
  license: string
  orgBody: string
  status: EventStatus
  type: string
  time?: string
}

const EVENTS: CalEvent[] = [
  { id: 'e1',  day: 1,  title: 'Форма 5-ГР (январь)', license: 'РГ-00456', orgBody: 'МЭ РК',    status: 'done',     type: 'Отчёт',    time: '10:00' },
  { id: 'e2',  day: 3,  title: 'Совещание с подрядчиком KazDrilling', license: 'МГ-00123', orgBody: 'Внутр.', status: 'done', type: 'Встреча' },
  { id: 'e3',  day: 5,  title: 'Форма 1-ТП (февраль)', license: 'МГ-00123', orgBody: 'МЭ РК',    status: 'overdue',  type: 'Отчёт',    time: '16:00' },
  { id: 'e4',  day: 5,  title: 'Форма 6-ГР (февраль)', license: 'МГ-00789', orgBody: 'МЭ РК',    status: 'done',     type: 'Отчёт',    time: '16:00' },
  { id: 'e5',  day: 10, title: 'Проверка МЭ РК — плановая', license: 'МГ-00123', orgBody: 'МЭ РК', status: 'done',   type: 'Проверка' },
  { id: 'e6',  day: 12, title: 'ГИС скв. №47 — результаты', license: 'МГ-00123', orgBody: 'KazDrilling', status: 'overdue', type: 'Документ' },
  { id: 'e7',  day: 15, title: 'Форма 2-ТП (воздух)', license: 'МГ-00456', orgBody: 'МЭГПР РК', status: 'done',     type: 'Отчёт',    time: '10:00' },
  { id: 'e8',  day: 16, title: 'Форма 2-ТП (март)', license: 'МГ-00456', orgBody: 'МЭГПР РК',   status: 'urgent',   type: 'Отчёт',    time: '16:00' },
  { id: 'e9',  day: 17, title: 'ПЛА скв. №15 — учения', license: 'МГ-00789', orgBody: 'МЧС РК', status: 'upcoming', type: 'Мероприятие', time: '09:00' },
  { id: 'e10', day: 18, title: 'Техсовет по скв. №48', license: 'МГ-00123', orgBody: 'Внутр.',   status: 'scheduled',type: 'Встреча',  time: '14:00' },
  { id: 'e11', day: 20, title: 'Геологический разрез скв. №47', license: 'МГ-00123', orgBody: 'KazDrilling', status: 'urgent', type: 'Документ' },
  { id: 'e12', day: 20, title: 'Акт на буровые работы скв. №48', license: 'МГ-00123', orgBody: 'МЭ РК', status: 'upcoming', type: 'Документ' },
  { id: 'e13', day: 22, title: 'Форма 5-ГР (февраль)', license: 'РГ-00456', orgBody: 'МЭ РК',    status: 'scheduled',type: 'Отчёт',    time: '12:00' },
  { id: 'e14', day: 25, title: 'Форма 2-ТП (водхоз)', license: 'МГ-00789', orgBody: 'МЭГПР РК', status: 'scheduled',type: 'Отчёт',    time: '16:00' },
  { id: 'e15', day: 25, title: 'Совещание с МЭ РК', license: 'МГ-00123', orgBody: 'МЭ РК',       status: 'scheduled',type: 'Встреча',  time: '11:00' },
  { id: 'e16', day: 28, title: 'Годовой отчёт — черновик', license: 'МГ-00123', orgBody: 'МЭ РК', status: 'upcoming', type: 'Отчёт' },
  { id: 'e17', day: 31, title: 'Форма 6-ГР (март)', license: 'МГ-00789', orgBody: 'МЭ РК',       status: 'scheduled',type: 'Отчёт',    time: '16:00' },
  { id: 'e18', day: 31, title: 'Паспорт скв. №12 — финал', license: 'МГ-00789', orgBody: 'МЭ РК', status: 'upcoming', type: 'Документ' },
]

const STATUS_CFG: Record<EventStatus, { dot: string; badge: string; label: string; bg: string; border: string }> = {
  overdue:   { dot: 'bg-error-500',   badge: 'bg-red-100 text-error-500',   label: 'Просрочено',  bg: 'bg-red-50',    border: 'border-error-500' },
  urgent:    { dot: 'bg-warning-500', badge: 'bg-amber-100 text-warning-500', label: 'Срочно',    bg: 'bg-amber-50',  border: 'border-warning-500' },
  upcoming:  { dot: 'bg-primary-500', badge: 'bg-blue-100 text-primary-500', label: 'Скоро',      bg: 'bg-blue-50',   border: 'border-primary-500' },
  scheduled: { dot: 'bg-success-500', badge: 'bg-green-100 text-success-500', label: 'Запланировано', bg: 'bg-green-50', border: 'border-success-500' },
  done:      { dot: 'bg-gray-400',    badge: 'bg-gray-100 text-gray-500',   label: 'Выполнено',   bg: 'bg-gray-50',   border: 'border-gray-300' },
}

const TYPE_ICONS: Record<string, string> = {
  'Отчёт': '📄', 'Проверка': '🔍', 'Документ': '📋', 'Встреча': '👥', 'Мероприятие': '🚒',
}

const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
// March 2026: starts on Sunday → offset 6 (Mon-first grid)
const MONTH_OFFSET = 6  // 1 Mar 2026 = Sunday → last cell of first row
const DAYS_IN_MONTH = 31
const TODAY = 16

type ViewMode = 'month' | 'list'
type FilterType = 'all' | 'Отчёт' | 'Проверка' | 'Документ' | 'Встреча' | 'Мероприятие'

export default function Calendar() {
  const [view, setView] = useState<ViewMode>('month')
  const [selectedDay, setSelectedDay] = useState<number | null>(TODAY)
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterStatus, setFilterStatus] = useState<EventStatus | 'all'>('all')

  const eventsForDay = (day: number) => EVENTS.filter(e => e.day === day)

  const filteredEvents = EVENTS.filter(e =>
    (filterType === 'all' || e.type === filterType) &&
    (filterStatus === 'all' || e.status === filterStatus)
  ).sort((a, b) => a.day - b.day)

  const selectedEvents = selectedDay
    ? EVENTS.filter(e => e.day === selectedDay && (filterType === 'all' || e.type === filterType))
    : []

  // Build calendar grid (6 rows × 7 cols)
  const cells: (number | null)[] = [
    ...Array(MONTH_OFFSET).fill(null),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const topPriorityStatus = (day: number): EventStatus | null => {
    const evs = eventsForDay(day)
    if (!evs.length) return null
    const order: EventStatus[] = ['overdue', 'urgent', 'upcoming', 'scheduled', 'done']
    for (const s of order) if (evs.some(e => e.status === s)) return s
    return null
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📅 Календарь обязательств</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {EVENTS.filter(e => e.status === 'overdue').length} просрочено ·{' '}
            {EVENTS.filter(e => e.status === 'urgent').length} срочно ·{' '}
            {EVENTS.filter(e => e.status === 'scheduled' || e.status === 'upcoming').length} запланировано
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setView('month')} className={`px-4 py-2 text-sm font-medium transition-colors ${view === 'month' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              🗓️ Месяц
            </button>
            <button onClick={() => setView('list')} className={`px-4 py-2 text-sm font-medium transition-colors ${view === 'list' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              📋 Список
            </button>
          </div>
        </div>
      </div>

      {/* Month nav */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">← Февраль</button>
          <div className="text-center">
            <h2 className="font-bold text-gray-900 text-lg">Март 2026</h2>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">Апрель →</button>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
          {(['all', 'Отчёт', 'Документ', 'Проверка', 'Встреча', 'Мероприятие'] as FilterType[]).map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors font-medium ${filterType === t ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
              {t === 'all' ? 'Все типы' : `${TYPE_ICONS[t]} ${t}`}
            </button>
          ))}
        </div>

        {/* ─── MONTH VIEW ─── */}
        {view === 'month' && (
          <div>
            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {DAYS_OF_WEEK.map(d => (
                <div key={d} className={`text-center text-xs font-semibold py-2 ${d === 'Сб' || d === 'Вс' ? 'text-error-500/70' : 'text-gray-500'}`}>{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {cells.map((day, idx) => {
                const evs = day ? eventsForDay(day).filter(e => filterType === 'all' || e.type === filterType) : []
                const priority = day ? topPriorityStatus(day) : null
                const isToday = day === TODAY
                const isSelected = day === selectedDay
                const isWeekend = idx % 7 >= 5

                return (
                  <div
                    key={idx}
                    onClick={() => day && setSelectedDay(day === selectedDay ? null : day)}
                    className={`min-h-[80px] sm:min-h-[96px] border-b border-r border-gray-100 p-1.5 transition-colors relative
                      ${!day ? 'bg-gray-50/50' : 'cursor-pointer'}
                      ${isWeekend && day ? 'bg-red-50/20' : ''}
                      ${isSelected ? 'bg-primary-50 ring-2 ring-inset ring-primary-400' : day ? 'hover:bg-gray-50' : ''}
                    `}
                  >
                    {day && (
                      <>
                        {/* Day number */}
                        <div className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold mb-1 mx-auto
                          ${isToday ? 'bg-primary-500 text-white' : isWeekend ? 'text-error-400' : 'text-gray-700'}`}>
                          {day}
                        </div>

                        {/* Event dots */}
                        <div className="space-y-0.5">
                          {evs.slice(0, 2).map(e => (
                            <div key={e.id} className={`text-xs rounded px-1 py-0.5 truncate leading-tight ${STATUS_CFG[e.status].badge}`}>
                              <span className="hidden sm:inline">{TYPE_ICONS[e.type]} </span>{e.title}
                            </div>
                          ))}
                          {evs.length > 2 && (
                            <div className="text-xs text-gray-400 text-center font-medium">+{evs.length - 2} ещё</div>
                          )}
                          {evs.length === 0 && priority && (
                            <div className={`w-2 h-2 rounded-full mx-auto ${STATUS_CFG[priority].dot}`} />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ─── LIST VIEW ─── */}
        {view === 'list' && (
          <div>
            {/* Status filter for list */}
            <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-gray-100">
              {(['all', 'overdue', 'urgent', 'upcoming', 'scheduled', 'done'] as const).map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors font-medium ${filterStatus === s ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-200'}`}>
                  {s === 'all' ? 'Все статусы' : <>
                    <span className={`inline-block w-2 h-2 rounded-full mr-1 ${STATUS_CFG[s].dot}`} />
                    {STATUS_CFG[s].label}
                  </>}
                </button>
              ))}
            </div>

            <div className="divide-y divide-gray-100">
              {filteredEvents.map((event) => {
                const cfg = STATUS_CFG[event.status]
                return (
                  <motion.div key={event.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className={`flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors border-l-4 ${cfg.border} ml-0`}>
                    <div className="flex-shrink-0 mt-0.5 text-center min-w-[36px]">
                      <div className={`text-lg font-bold ${event.day === TODAY ? 'text-primary-500' : 'text-gray-700'}`}>{event.day}</div>
                      <div className="text-xs text-gray-400">мар</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base">{TYPE_ICONS[event.type]}</span>
                        <p className="font-semibold text-gray-900 text-sm">{event.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>{cfg.label}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        📜 {event.license} · 🏛️ {event.orgBody}
                        {event.time && ` · ⏰ до ${event.time}`}
                      </p>
                    </div>
                    {(event.status === 'overdue' || event.status === 'urgent') && (
                      <Button variant={event.status === 'overdue' ? 'danger' : 'primary'} size="sm" className="flex-shrink-0">
                        {event.status === 'overdue' ? 'Подготовить' : 'Открыть'}
                      </Button>
                    )}
                  </motion.div>
                )
              })}
              {filteredEvents.length === 0 && (
                <div className="py-12 text-center text-gray-400">
                  <p className="text-3xl mb-2">📅</p><p className="font-medium">Событий не найдено</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ─── SIDE PANEL: selected day events ─── */}
      <AnimatePresence>
        {view === 'month' && selectedDay && (
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-500 text-white rounded-lg flex items-center justify-center font-bold">{selectedDay}</div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedDay === TODAY ? '📍 Сегодня, ' : ''}{selectedDay} марта 2026
                  </p>
                  <p className="text-xs text-gray-500">{selectedEvents.length} событий</p>
                </div>
              </div>
              <button onClick={() => setSelectedDay(null)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {selectedEvents.length === 0 ? (
              <div className="py-8 text-center text-gray-400">
                <p className="text-2xl mb-2">✨</p>
                <p className="text-sm font-medium">Событий нет</p>
                <p className="text-xs mt-1">В этот день дедлайнов не запланировано</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {selectedEvents.map(event => {
                  const cfg = STATUS_CFG[event.status]
                  return (
                    <div key={event.id} className={`flex items-start gap-4 px-5 py-4 ${cfg.bg} border-l-4 ${cfg.border}`}>
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${cfg.dot}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span>{TYPE_ICONS[event.type]}</span>
                          <p className="font-semibold text-sm text-gray-900">{event.title}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>{cfg.label}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          📜 {event.license} · 🏛️ {event.orgBody}
                          {event.time && <span className="ml-1">· ⏰ до {event.time}</span>}
                        </p>
                      </div>
                      {(event.status === 'overdue' || event.status === 'urgent') && (
                        <Button variant={event.status === 'overdue' ? 'danger' : 'primary'} size="sm">
                          {event.status === 'overdue' ? 'Подготовить' : 'Открыть'}
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Легенда</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {(Object.entries(STATUS_CFG) as [EventStatus, typeof STATUS_CFG[EventStatus]][]).map(([status, cfg]) => (
            <div key={status} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${cfg.dot}`} />
              <span className="text-xs text-gray-600 font-medium">{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

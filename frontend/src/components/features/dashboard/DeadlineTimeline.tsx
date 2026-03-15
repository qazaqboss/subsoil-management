interface DeadlineItem {
  id: string
  date: string
  dateLabel: string
  title: string
  license: string
  hoursLeft?: string
  daysLeft?: number
  status: 'critical' | 'warning' | 'scheduled' | 'info'
  statusLabel: string
}

const deadlines: DeadlineItem[] = [
  {
    id: '1',
    date: '2026-03-16',
    dateLabel: 'Сегодня, 16 марта',
    title: 'Форма 2-ТП (воздух)',
    license: 'Лицензия МГ-00456',
    hoursLeft: '8 часов',
    status: 'info',
    statusLabel: 'Черновик готов',
  },
  {
    id: '2',
    date: '2026-03-17',
    dateLabel: 'Завтра, 17 марта',
    title: 'ПЛА скважина №15 — Учения',
    license: 'Лицензия МГ-00123',
    daysLeft: 1,
    status: 'scheduled',
    statusLabel: 'Запланировано',
  },
  {
    id: '3',
    date: '2026-03-20',
    dateLabel: '20 марта (через 4 дня)',
    title: 'Геологический разрез скв. №47',
    license: 'Лицензия МГ-00123',
    daysLeft: 4,
    status: 'warning',
    statusLabel: 'Ожидается от подрядчика',
  },
  {
    id: '4',
    date: '2026-03-25',
    dateLabel: '25 марта (через 9 дней)',
    title: 'Форма 6-ГР (добыча)',
    license: 'Лицензия МГ-00789',
    daysLeft: 9,
    status: 'scheduled',
    statusLabel: 'Запланировано',
  },
]

const statusColors = {
  critical: 'bg-error-500',
  warning: 'bg-warning-500',
  scheduled: 'bg-success-500',
  info: 'bg-info-500',
}

const statusBadgeColors = {
  critical: 'bg-red-100 text-error-500',
  warning: 'bg-amber-100 text-warning-500',
  scheduled: 'bg-green-100 text-success-500',
  info: 'bg-blue-100 text-info-500',
}

// Group by date label
const groupedDeadlines = deadlines.reduce((acc, item) => {
  if (!acc[item.dateLabel]) acc[item.dateLabel] = []
  acc[item.dateLabel].push(item)
  return acc
}, {} as Record<string, DeadlineItem[]>)

export default function DeadlineTimeline() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">📅 Ближайшие дедлайны</h2>
        <span className="text-sm text-gray-500">7 дней</span>
      </div>
      <div className="p-4 space-y-6">
        {Object.entries(groupedDeadlines).map(([dateLabel, items]) => (
          <div key={dateLabel}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-gray-700">{dateLabel}</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${statusColors[item.status]}`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-900">{item.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadgeColors[item.status]}`}>
                        {item.statusLabel}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.license} | Осталось: {item.hoursLeft || `${item.daysLeft} ${item.daysLeft === 1 ? 'день' : 'дня'}`}
                    </p>
                  </div>
                  <button className="text-xs text-primary-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Детали →
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

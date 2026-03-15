import ProgressBar from '../../ui/ProgressBar'

interface TestMilestone {
  date: string
  label: string
  status: 'completed' | 'upcoming' | 'current'
}

const milestones: TestMilestone[] = [
  { date: '01.04', label: 'Завершение полевых работ', status: 'upcoming' },
  { date: '16.04', label: 'Старт подготовки отчета', status: 'upcoming' },
  { date: '29.05', label: 'Подача отчета в МЭ РК', status: 'upcoming' },
]

export default function TestProgress() {
  const currentDay = 45
  const totalDays = 90
  const percentage = Math.round((currentDay / totalDays) * 100)

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="px-4 py-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">📈 Прогресс испытаний</h2>
      </div>
      <div className="p-4 space-y-4">
        {/* Main progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-sm font-semibold text-gray-900">Месторождение "Каражанбас"</p>
              <p className="text-xs text-gray-500 mt-0.5">День {currentDay} из {totalDays}</p>
            </div>
            <span className="text-2xl font-bold text-primary-500">{percentage}%</span>
          </div>
          <ProgressBar value={currentDay} max={totalDays} showLabel={false} size="md" />
        </div>

        {/* Current phase */}
        <div className="bg-primary-100 rounded-lg p-3">
          <p className="text-xs font-medium text-primary-700 uppercase tracking-wide">Текущая фаза</p>
          <p className="text-sm font-semibold text-primary-900 mt-1">Полевые работы</p>
        </div>

        {/* Milestones */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Следующие вехи</p>
          <div className="space-y-2">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 text-xs font-mono font-medium text-primary-500 bg-primary-100 rounded px-1.5 py-1 text-center">
                  {milestone.date}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-700">{milestone.label}</p>
                </div>
                <span className="text-xs">📍</span>
              </div>
            ))}
          </div>
        </div>

        {/* Additional progress bars */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div>
            <ProgressBar value={75} label="Скважина №45 — Документация" size="sm" color="success" showLabel={false} />
          </div>
          <div>
            <ProgressBar value={30} label="Скважина №48 — Бурение" size="sm" color="warning" showLabel={false} />
          </div>
        </div>
      </div>
    </div>
  )
}

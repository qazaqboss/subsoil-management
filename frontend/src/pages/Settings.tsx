import { useState } from 'react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

type SettingsTab = 'profile' | 'notifications' | 'system'

export default function Settings() {
  const [tab, setTab] = useState<SettingsTab>('profile')
  const [emailNotif, setEmailNotif] = useState(true)
  const [smsNotif, setSmsNotif] = useState(false)
  const [telegramNotif, setTelegramNotif] = useState(true)
  const [savedMsg, setSavedMsg] = useState(false)

  const handleSave = () => {
    setSavedMsg(true)
    setTimeout(() => setSavedMsg(false), 2000)
  }

  const tabs: { id: SettingsTab; label: string; icon: string }[] = [
    { id: 'profile', label: 'Профиль', icon: '👤' },
    { id: 'notifications', label: 'Уведомления', icon: '🔔' },
    { id: 'system', label: 'Система', icon: '⚙️' },
  ]

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">⚙️ Настройки</h1>
        <p className="text-sm text-gray-500 mt-1">Управление профилем и системными параметрами</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile */}
      {tab === 'profile' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">А</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Асет Жансеитов</p>
              <p className="text-sm text-gray-500">Главный геолог</p>
              <Button variant="ghost" size="sm" className="mt-1 px-0">Изменить фото</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Имя" defaultValue="Асет" />
            <Input label="Фамилия" defaultValue="Жансеитов" />
            <Input label="Email" type="email" defaultValue="a.zhanseitov@company.kz" />
            <Input label="Телефон" type="tel" defaultValue="+7 701 000 00 00" />
            <Input label="Должность" defaultValue="Главный геолог" />
            <Input label="Компания" defaultValue='ТОО "ЭкоМикс"' />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Button variant="primary" onClick={handleSave}>Сохранить</Button>
            {savedMsg && <span className="text-success-500 text-sm font-medium">✅ Сохранено!</span>}
          </div>
        </div>
      )}

      {/* Notifications */}
      {tab === 'notifications' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Каналы уведомлений</h3>
            <p className="text-sm text-gray-500">Выберите, как получать оповещения о дедлайнах</p>
          </div>

          {[
            { label: 'Email-уведомления', sub: 'a.zhanseitov@company.kz', state: emailNotif, set: setEmailNotif },
            { label: 'SMS-уведомления', sub: '+7 701 000 00 00', state: smsNotif, set: setSmsNotif },
            { label: 'Telegram-бот', sub: '@subsoil_bot', state: telegramNotif, set: setTelegramNotif },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.sub}</p>
              </div>
              <button
                onClick={() => item.set(!item.state)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  item.state ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                    item.state ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Когда уведомлять</h3>
            {[
              { label: 'За 30 дней до дедлайна', defaultChecked: true },
              { label: 'За 14 дней до дедлайна', defaultChecked: true },
              { label: 'За 7 дней до дедлайна', defaultChecked: true },
              { label: 'За 3 дня до дедлайна', defaultChecked: true },
              { label: 'В день дедлайна', defaultChecked: true },
              { label: 'При просрочке', defaultChecked: true },
            ].map((item) => (
              <label key={item.label} className="flex items-center gap-3 py-2 cursor-pointer">
                <input type="checkbox" defaultChecked={item.defaultChecked} className="w-4 h-4 accent-primary-500" />
                <span className="text-sm text-gray-700">{item.label}</span>
              </label>
            ))}
          </div>

          <Button variant="primary" onClick={handleSave}>Сохранить настройки</Button>
        </div>
      )}

      {/* System */}
      {tab === 'system' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Информация о системе</h3>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Версия', value: '1.0.0 (March 2026)' },
                { label: 'База данных', value: 'PostgreSQL 15' },
                { label: 'Backend', value: 'FastAPI 0.109' },
                { label: 'AI-модель', value: 'Claude claude-sonnet-4-6' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-900 font-mono text-xs">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Данные</h3>
            <div className="flex flex-col gap-3">
              <Button variant="secondary" fullWidth>📤 Экспортировать данные (CSV)</Button>
              <Button variant="secondary" fullWidth>📥 Импортировать лицензии</Button>
              <Button variant="ghost" fullWidth className="text-error-500 hover:bg-red-50">
                🗑️ Очистить кеш
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

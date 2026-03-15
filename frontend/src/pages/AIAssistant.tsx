import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: string
}

const mockMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'Какую форму отчета нужно подавать для разведочной лицензии на нефть ежемесячно?',
    time: '10:23',
  },
  {
    id: '2',
    role: 'assistant',
    content: `Для разведочной лицензии на нефть обязательна ежемесячная подача:

**Форма 5-ГР** (геологоразведка)
- Срок подачи: до 5-го числа следующего месяца
- Адресат: МЭ РК
- Штраф за просрочку: 50 МРП

📎 **Источники:**
• Приказ МЭ РК №234 от 15.06.2022, п.3
• Кодекс РК "О недрах", ст. 115

Форму 6-ГР (которая для добычи) подавать НЕ нужно при наличии только разведочной лицензии.`,
    time: '10:23',
  },
]

const quickQuestions = [
  'Как продлить лицензию?',
  'Какие штрафы за просрочку отчета 1-ТП?',
  'Нужно ли разрешение МЧС для бурения?',
  'Что входит в паспорт скважины?',
]

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)

    // Mock response
    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Это демонстрационный ответ AI-помощника. В продакшн-версии здесь будет реальный ответ от Claude API на основе законодательства Казахстана о недропользовании.',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((m) => [...m, assistantMsg])
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">🤖 AI-Помощник</h1>
        <p className="text-gray-500 text-sm mt-1">Эксперт по законодательству РК в сфере недропользования</p>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-2xl ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className="flex items-center gap-2 mb-1">
                    {msg.role === 'assistant' && <span className="text-sm">🤖</span>}
                    <span className="text-xs text-gray-400">
                      {msg.role === 'user' ? 'Вы' : 'AI-Помощник'} • {msg.time}
                    </span>
                  </div>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-primary-500 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick questions */}
        <div className="px-4 py-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">💡 Популярные вопросы:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              placeholder="Ваш вопрос по недропользованию..."
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="bg-primary-500 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Отправить
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

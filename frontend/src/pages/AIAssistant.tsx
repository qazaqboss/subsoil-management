import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LIFECYCLE_STAGES } from '../data/lifecycleData'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: string
  sources?: string[]
  error?: boolean
}

const QUICK_QUESTIONS = [
  'Как продлить лицензию на добычу нефти?',
  'Какие штрафы за просрочку отчёта 1-ТП?',
  'Нужно ли разрешение МЧС для бурения?',
  'Что входит в паспорт скважины?',
  'Когда нужен пересчёт запасов через ГКЗ?',
]

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      content: `Привет! Я AI-помощник по недропользованию Казахстана на базе Claude.\n\nЯ знаю:\n• Все 7 этапов жизненного цикла (STG-01 → STG-07)\n• КОНН РК №125-VI (изм. 10.06.2025), ЭК РК №400-VI (изм. 29.07.2025), ЕПРКИН №239\n• Нормативные сроки, органы согласования, формы отчётности\n\nСпросите меня о любом этапе или обязательстве!`,
      time: now(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLifecycleQ, setShowLifecycleQ] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      time: now(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const history = messages
      .filter((m) => !m.error)
      .map((m) => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: `Ошибка ${res.status}` }))
        throw new Error(err.detail ?? `HTTP ${res.status}`)
      }

      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          time: now(),
          sources: data.sources ?? [],
        },
      ])
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Неизвестная ошибка'
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Ошибка подключения к AI-серверу:\n${msg}\n\nПроверьте что бэкенд запущен и переменная ANTHROPIC_API_KEY настроена.`,
          time: now(),
          error: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-0">
      {/* Header */}
      <div className="mb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI-Помощник по недропользованию</h1>
            <p className="text-gray-500 text-xs mt-0.5">
              Работает на Claude · КОНН РК, ЭК РК, ЕПРКИН · 7 этапов ЖЦ ·{' '}
              <span className="text-green-600 font-medium">● Claude API</span>
            </p>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden min-h-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-2xl flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    {msg.role === 'assistant' && <span className="text-sm">🤖</span>}
                    <span className="text-[11px] text-gray-400">
                      {msg.role === 'user' ? 'Вы' : 'AI-Помощник'} · {msg.time}
                    </span>
                  </div>

                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-primary-500 text-white rounded-br-sm'
                        : msg.error
                        ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-sm'
                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                    }`}
                  >
                    <MessageContent content={msg.content} />
                  </div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {msg.sources.map((src, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full"
                        >
                          📎 {src}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1.5 items-center">
                  <span className="text-xs text-gray-400 mr-1">Claude анализирует НПА...</span>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
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
        <div className="px-4 py-2 border-t border-gray-100 space-y-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Быстрые вопросы</p>
            <button
              onClick={() => setShowLifecycleQ((v) => !v)}
              className="text-[11px] text-primary-600 hover:text-primary-700 font-medium"
            >
              {showLifecycleQ ? '▲ Скрыть этапы' : '▼ По этапам ЖЦ'}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                disabled={loading}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {showLifecycleQ && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {LIFECYCLE_STAGES.map((s) => (
                    <button
                      key={s.code}
                      onClick={() => sendMessage(`Что нужно делать на этапе "${s.name}" (${s.code})?`)}
                      disabled={loading}
                      className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors disabled:opacity-50"
                    >
                      {s.icon} {s.shortName}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              placeholder="Спросите о лицензиях, этапах, штрафах, документах..."
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 disabled:bg-gray-50"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="bg-primary-500 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {loading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <span>↑</span>
              )}
              <span>{loading ? 'Думает...' : 'Отправить'}</span>
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5 text-center">
            Ответы основаны на КОНН РК, ЭК РК, ЕПРКИН и методических рекомендациях КазНИГРИ 2026
          </p>
        </div>
      </div>
    </div>
  )
}

function now() {
  return new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

function MessageContent({ content }: { content: string }) {
  const parts = content.split(/(\*\*[^*]+\*\*|`[^`]+`)/)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="text-[11px] bg-black/10 rounded px-1 py-0.5 font-mono">
              {part.slice(1, -1)}
            </code>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LIFECYCLE_STAGES,
  STAGE_COLORS,
  DOC_TYPE_LABELS,
  DOC_TYPE_COLORS,
  type LifecycleStage,
  type ProjectDoc,
} from '../data/lifecycleData'

const MOCK_LICENSE = {
  number: 'МГ-00123',
  company: 'ТОО "ЭкоМикс"',
  currentStageIndex: 3,
  stageYears: ['2021', '2023', '2024', '2025', '—', '—', '—'],
}

type TabKey = 'documents' | 'phases' | 'checklist' | 'alerts'

export default function LifecycleTimeline() {
  const [selectedStageIdx, setSelectedStageIdx] = useState(MOCK_LICENSE.currentStageIndex)
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>('documents')

  const selectedStage = LIFECYCLE_STAGES[selectedStageIdx]
  const selectedDoc = selectedStage.documents.find((d) => d.id === selectedDocId) ?? null

  const handleStageClick = (idx: number) => {
    setSelectedStageIdx(idx)
    setSelectedDocId(null)
    setActiveTab('documents')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Жизненный цикл лицензии</h1>
          <p className="text-gray-500 text-sm mt-1">
            Лицензия {MOCK_LICENSE.number} · {MOCK_LICENSE.company}
          </p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-medium">
            Текущий: Этап {MOCK_LICENSE.currentStageIndex + 1}
          </span>
        </div>
      </div>

      {/* Stage Stepper */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 overflow-x-auto">
        <div className="flex items-start min-w-max gap-0">
          {LIFECYCLE_STAGES.map((stage, idx) => {
            const isCompleted = idx < MOCK_LICENSE.currentStageIndex
            const isActive = idx === MOCK_LICENSE.currentStageIndex
            const isSelected = idx === selectedStageIdx
            const colors = STAGE_COLORS[stage.color]

            return (
              <div key={stage.code} className="flex items-start">
                {/* Stage node */}
                <button
                  onClick={() => handleStageClick(idx)}
                  className="flex flex-col items-center gap-2 group"
                  style={{ minWidth: 100 }}
                >
                  {/* Circle */}
                  <div className="relative">
                    <motion.div
                      animate={{ scale: isSelected ? 1.15 : 1 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 shadow-sm ${
                        isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : isActive
                          ? `${colors.dot} border-transparent text-white`
                          : isSelected
                          ? `${colors.bg} ${colors.border} ${colors.text}`
                          : 'bg-gray-100 border-gray-200 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-base">{stage.icon}</span>
                      )}
                    </motion.div>
                    {isActive && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white animate-pulse" />
                    )}
                  </div>

                  {/* Label */}
                  <div className="text-center">
                    <div className={`text-xs font-semibold leading-tight max-w-[90px] ${
                      isSelected ? colors.text : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {stage.shortName}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {MOCK_LICENSE.stageYears[idx]}
                    </div>
                    {isActive && (
                      <span className="text-[10px] text-amber-600 font-medium">в работе</span>
                    )}
                    {isCompleted && (
                      <span className="text-[10px] text-green-600">✓ завершён</span>
                    )}
                  </div>
                </button>

                {/* Connector */}
                {idx < LIFECYCLE_STAGES.length - 1 && (
                  <div className="flex items-center mt-5 mx-1">
                    <div className={`h-0.5 w-8 transition-colors duration-300 ${
                      idx < MOCK_LICENSE.currentStageIndex ? 'bg-green-400' : 'bg-gray-200'
                    }`} />
                    <svg className={`w-3 h-3 -ml-1 ${idx < MOCK_LICENSE.currentStageIndex ? 'text-green-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Stage Detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedStageIdx}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {/* Left: Stage info + documents */}
          <div className="lg:col-span-2 space-y-4">
            {/* Stage header */}
            <StageHeader stage={selectedStage} isActive={selectedStageIdx === MOCK_LICENSE.currentStageIndex} />

            {/* Tabs */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex border-b border-gray-100">
                {([
                  { key: 'documents', label: 'Документы', count: selectedStage.documents.length },
                  { key: 'phases',    label: 'Фазы' },
                  { key: 'checklist', label: 'Чек-лист' },
                  { key: 'alerts',    label: 'Алёрты', count: selectedStage.alerts?.length },
                ] as { key: TabKey; label: string; count?: number }[]).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? 'border-primary-500 text-primary-700 bg-primary-50/50'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                    {tab.count != null && tab.count > 0 && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                        activeTab === tab.key ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="p-4">
                <AnimatePresence mode="wait">
                  {activeTab === 'documents' && (
                    <motion.div key="docs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                      {selectedStage.documents.map((doc) => (
                        <DocCard
                          key={doc.id}
                          doc={doc}
                          isSelected={selectedDocId === doc.id}
                          onClick={() => setSelectedDocId(selectedDocId === doc.id ? null : doc.id)}
                        />
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'phases' && (
                    <motion.div key="phases" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {selectedDoc ? (
                        <PhaseList doc={selectedDoc} />
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <div className="text-2xl mb-2">👆</div>
                          <p className="text-sm">Выберите документ во вкладке «Документы»</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'checklist' && (
                    <motion.div key="checklist" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {selectedDoc?.checklist ? (
                        <ChecklistView items={selectedDoc.checklist} />
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <div className="text-2xl mb-2">📋</div>
                          <p className="text-sm">
                            {selectedDoc ? 'Чек-лист для этого документа не требуется' : 'Выберите документ во вкладке «Документы»'}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'alerts' && (
                    <motion.div key="alerts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                      {selectedStage.alerts && selectedStage.alerts.length > 0 ? (
                        selectedStage.alerts.map((alert, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <span className="text-amber-500 mt-0.5">⚠️</span>
                            <span className="text-sm text-amber-800">{alert}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <div className="text-2xl mb-2">✅</div>
                          <p className="text-sm">Алёртов нет</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right: regulatory refs + quick info */}
          <div className="space-y-4">
            <RegulatoryPanel stage={selectedStage} />
            <MacroPhaseCard stage={selectedStage} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StageHeader({ stage, isActive }: { stage: LifecycleStage; isActive: boolean }) {
  const colors = STAGE_COLORS[stage.color]
  return (
    <div className={`rounded-xl border p-5 ${colors.bg} ${colors.border}`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${colors.bg} border ${colors.border} shadow-sm`}>
          {stage.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className={`text-lg font-bold ${colors.text}`}>{stage.name}</h2>
            {isActive && (
              <span className="text-xs bg-amber-400 text-white px-2 py-0.5 rounded-full font-semibold">Текущий</span>
            )}
            {stage.maxDurationYears && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
                ≤ {stage.maxDurationYears} лет
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{stage.description}</p>
          <div className="mt-2 text-xs text-gray-400 font-mono">{stage.code}</div>
        </div>
      </div>
    </div>
  )
}

function DocCard({ doc, isSelected, onClick }: { doc: ProjectDoc; isSelected: boolean; onClick: () => void }) {
  const phaseProgress = doc.totalPhases > 0 ? (doc.currentPhase / doc.totalPhases) * 100 : 0

  return (
    <motion.button
      layout
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
        isSelected ? 'border-primary-300 bg-primary-50 shadow-sm' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">📄</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm font-medium leading-snug ${isSelected ? 'text-primary-900' : 'text-gray-800'}`}>
              {doc.title}
            </p>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${DOC_TYPE_COLORS[doc.type]}`}>
              {DOC_TYPE_LABELS[doc.type]}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
            {doc.konnArticle && <span>КОНН ст. {doc.konnArticle}</span>}
            {doc.ekArticle && <span>ЭК ст. {doc.ekArticle}</span>}
            {doc.deadlineNote && <span className="text-amber-600">⏱ {doc.deadlineNote}</span>}
            {doc.trigger && <span className="text-blue-600 italic">Триггер: {doc.trigger}</span>}
          </div>

          {/* Phase progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-400">
                Фаза {doc.currentPhase} из {doc.totalPhases}
              </span>
              <span className="text-[10px] text-gray-400">{Math.round(phaseProgress)}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${phaseProgress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-primary-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSelected && doc.note && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-primary-200"
          >
            <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">{doc.note}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

function PhaseList({ doc }: { doc: ProjectDoc }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700 mb-3">{doc.title}</p>
      {doc.phases.map((phase) => {
        const isDone = phase.number < doc.currentPhase
        const isActive = phase.number === doc.currentPhase
        return (
          <div
            key={phase.number}
            className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
              isDone
                ? 'bg-green-50 border-green-100'
                : isActive
                ? 'bg-primary-50 border-primary-200'
                : 'bg-gray-50 border-gray-100'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
              isDone ? 'bg-green-500 text-white' : isActive ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {isDone ? '✓' : phase.number}
            </div>
            <div>
              <p className={`text-sm font-medium ${isDone ? 'text-green-700' : isActive ? 'text-primary-700' : 'text-gray-600'}`}>
                {phase.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{phase.authority}</p>
              {phase.sla && <p className="text-xs text-amber-600 mt-0.5">⏱ SLA: {phase.sla}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ChecklistView({ items }: { items: { id: string; text: string }[] }) {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-700">Чек-лист содержания документа</p>
        <span className="text-xs text-gray-500">
          {checked.size} / {items.length}
        </span>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <label
            key={item.id}
            className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
              checked.has(item.id) ? 'bg-green-50' : 'hover:bg-gray-50'
            }`}
          >
            <input
              type="checkbox"
              checked={checked.has(item.id)}
              onChange={() => toggle(item.id)}
              className="mt-0.5 w-4 h-4 accent-green-500 cursor-pointer"
            />
            <span className={`text-sm leading-snug ${checked.has(item.id) ? 'line-through text-gray-400' : 'text-gray-700'}`}>
              {item.text}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

function RegulatoryPanel({ stage }: { stage: LifecycleStage }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <span>⚖️</span> Нормативная база
      </h3>
      {stage.regulatoryRefs && stage.regulatoryRefs.length > 0 ? (
        <ul className="space-y-2">
          {stage.regulatoryRefs.map((ref, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <span className="text-primary-400 mt-0.5 flex-shrink-0">•</span>
              {ref}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-gray-400">—</p>
      )}
    </div>
  )
}

function MacroPhaseCard({ stage }: { stage: LifecycleStage }) {
  const MACRO_MAP = {
    exploration: { label: 'Разведочный этап', icon: '🔍', color: 'text-blue-700 bg-blue-50 border-blue-200' },
    industrial:  { label: 'Промышленный этап', icon: '⚙️', color: 'text-green-700 bg-green-50 border-green-200' },
    return:      { label: 'Возврат участка', icon: '↩️', color: 'text-orange-700 bg-orange-50 border-orange-200' },
  }
  const macro = MACRO_MAP[stage.macroPhase]

  return (
    <div className={`rounded-xl border p-4 ${macro.color}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{macro.icon}</span>
        <span className="text-sm font-semibold">{macro.label}</span>
      </div>
      <p className="text-xs opacity-75 leading-relaxed">
        Этап {stage.sortOrder} из 7 подэтапов жизненного цикла недропользования
      </p>
      {stage.maxDurationYears && (
        <div className="mt-3 pt-3 border-t border-current/20">
          <p className="text-xs font-medium">Максимальный срок: {stage.maxDurationYears} лет</p>
        </div>
      )}
    </div>
  )
}

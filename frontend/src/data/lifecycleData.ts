export type MacroPhase = 'exploration' | 'industrial' | 'return'
export type DocumentType =
  | 'base_project'
  | 'technical_project'
  | 'geological_report'
  | 'liquidation'
  | 'author_supervision'
  | 'reserve_operation'

export type StageStatus = 'completed' | 'active' | 'pending'

export interface Phase {
  number: number
  name: string
  authority: string
  sla?: string
}

export interface ChecklistItem {
  id: string
  text: string
}

export interface ProjectDoc {
  id: string
  title: string
  type: DocumentType
  konnArticle?: string
  ekArticle?: string
  eprkinClause?: string
  trigger?: string
  deadlineNote?: string
  currentPhase: number
  totalPhases: number
  phases: Phase[]
  checklist?: ChecklistItem[]
  note?: string
}

export interface LifecycleStage {
  code: string
  name: string
  shortName: string
  icon: string
  color: string
  macroPhase: MacroPhase
  maxDurationYears?: number
  sortOrder: number
  description: string
  documents: ProjectDoc[]
  alerts?: string[]
  regulatoryRefs?: string[]
}

export const LIFECYCLE_STAGES: LifecycleStage[] = [
  {
    code: 'STG-01-EXPLORATION',
    name: 'Разведка',
    shortName: 'Разведка',
    icon: '🔍',
    color: 'blue',
    macroPhase: 'exploration',
    sortOrder: 1,
    description: 'Поисковый этап — поиск залежей углеводородов. Срок составления базового проекта: 1 год со дня регистрации контракта.',
    regulatoryRefs: [
      'КОНН РК №125-VI, ст. 134, 135',
      'ЭК РК №400-VI, ст. 67',
      'ЕПРКИН №239',
    ],
    documents: [
      {
        id: 'doc-01-01',
        title: 'Проект разведочных работ (поисковый этап)',
        type: 'base_project',
        konnArticle: '134, 135',
        ekArticle: '67',
        deadlineNote: '1 год со дня регистрации контракта',
        currentPhase: 3,
        totalPhases: 7,
        phases: [
          { number: 1, name: 'Направление в уведомительном порядке', authority: 'Компетентный орган' },
          { number: 2, name: 'Заявление о намечаемой деятельности (ст. 68 ЭК)', authority: 'МЭиПР РК' },
          { number: 3, name: 'Разработка проекта ОВВ/РООС', authority: '—' },
          { number: 4, name: 'Согласование', authority: 'РГУ «Департамент экологии»' },
          { number: 5, name: 'Независимая экспертиза', authority: 'Компетентный орган' },
          { number: 6, name: 'Защита на ЦКРР, получение протокола', authority: 'ЦКРР' },
          { number: 7, name: 'Передача окончательного варианта', authority: 'Недропользователь' },
        ],
        checklist: [
          { id: 'c1', text: 'Объёмы исторических данных, степень изученности' },
          { id: 'c2', text: 'Задачи разведочных работ по поиску' },
          { id: 'c3', text: 'Объёмы геолого-геофизических исследований; местоположение скважин' },
          { id: 'c4', text: 'Интервалы отбора керна и шлама, лабораторные исследования' },
          { id: 'c5', text: 'Порядок испытания нефтегазоносных горизонтов' },
          { id: 'c6', text: 'Комплекс ГИС; ГДИС; отбор проб флюидов' },
          { id: 'c7', text: 'Мероприятия по охране недр и ООС' },
          { id: 'c8', text: 'Объёмы, сроки работ, инвестиции' },
          { id: 'c9', text: 'Прогнозный дебит нефти и газа по каждой скважине' },
          { id: 'c10', text: 'Размер обеспечения исполнения обязательств по ликвидации' },
        ],
        note: '⚠️ Исключение: морская разведка и увеличение участка по ст. 113 КОНН — требуется госэкспертиза.',
      },
      {
        id: 'doc-01-02',
        title: 'Авторский надзор за реализацией проекта разведки (поиск)',
        type: 'author_supervision',
        konnArticle: '142',
        eprkinClause: 'гл. 5, п. 55',
        trigger: 'Старт фактических работ по проекту разведки',
        deadlineNote: 'Ежегодно',
        currentPhase: 1,
        totalPhases: 3,
        phases: [
          { number: 1, name: 'Подготовка информационного отчёта', authority: '—' },
          { number: 2, name: 'Уведомительная подача в МЭиПР РК (электронный формат)', authority: 'МЭиПР РК' },
          { number: 3, name: 'Передача отчёта недропользователю', authority: 'Недропользователь' },
        ],
      },
    ],
    alerts: [
      'Авторнадзор за 2025 г. — срок подачи через 23 дня',
    ],
  },
  {
    code: 'STG-02-EVALUATION',
    name: 'Оценка',
    shortName: 'Оценка',
    icon: '📊',
    color: 'indigo',
    macroPhase: 'exploration',
    sortOrder: 2,
    description: 'Оценочный этап — оценка обнаруженной залежи, обоснование целесообразности ввода в разработку.',
    regulatoryRefs: [
      'КОНН РК, ст. 134, 135, 136, 138',
      'ЭК РК, ст. 67',
      'Приказ МИИР №71 от 02.02.2023',
    ],
    documents: [
      {
        id: 'doc-02-01',
        title: 'Проект разведочных работ (оценочный этап)',
        type: 'base_project',
        konnArticle: '134, 135',
        ekArticle: '67',
        deadlineNote: 'В период оценки',
        currentPhase: 2,
        totalPhases: 7,
        phases: [
          { number: 1, name: 'Направление в уведомительном порядке', authority: 'Компетентный орган' },
          { number: 2, name: 'Заявление о намечаемой деятельности (ст. 68 ЭК)', authority: 'МЭиПР РК' },
          { number: 3, name: 'Разработка ОВВ/РООС', authority: '—' },
          { number: 4, name: 'Согласование', authority: 'РГУ «Департамент экологии»' },
          { number: 5, name: 'Независимая экспертиза', authority: 'Компетентный орган' },
          { number: 6, name: 'Защита на ЦКРР', authority: 'ЦКРР' },
          { number: 7, name: 'Передача окончательного варианта', authority: 'Недропользователь' },
        ],
      },
      {
        id: 'doc-02-02',
        title: 'Проект ликвидации последствий разведки УВ',
        type: 'liquidation',
        konnArticle: '138',
        ekArticle: '67',
        trigger: 'Завершение разведки + необходимость ликвидации скважин',
        totalPhases: 5,
        currentPhase: 1,
        phases: [
          { number: 1, name: 'Заявление по ст. 68 ЭК', authority: 'МЭиПР РК' },
          { number: 2, name: 'Разработка ОВВ/РООС', authority: '—' },
          { number: 3, name: 'Согласование', authority: 'РГУ «Департамент экологии»' },
          { number: 4, name: 'Экспертиза', authority: 'Компетентный орган' },
          { number: 5, name: 'Передача недропользователю', authority: 'Недропользователь' },
        ],
        checklist: [
          { id: 'lc1', text: 'Технология демонтажа, вывоза и захоронения оборудования' },
          { id: 'lc2', text: 'Категории скважин и их назначение, рекультивация' },
          { id: 'lc3', text: 'Объёмы работ по ликвидации в зависимости от банковского обеспечения' },
        ],
      },
      {
        id: 'doc-02-03',
        title: 'Оперативный подсчёт запасов нефти и растворённого газа',
        type: 'geological_report',
        totalPhases: 5,
        currentPhase: 2,
        phases: [
          { number: 1, name: 'Анализ исследований и подготовка отчёта', authority: '—' },
          { number: 2, name: 'Представление в ГКЗ РК, назначение эксперта', authority: 'ГКЗ РК' },
          { number: 3, name: 'Защита на заседании ГКЗ РК, получение протокола', authority: 'ГКЗ РК' },
          { number: 4, name: 'Сдача в геофонды (МД «Запказнедра», АО «НГС»)', authority: 'МД / НГС' },
          { number: 5, name: 'Передача недропользователю', authority: 'Недропользователь' },
        ],
        checklist: [
          { id: 'gr1', text: 'Литологическое расчленение разреза скважин' },
          { id: 'gr2', text: 'Выделение пластов-коллекторов, оценка насыщенности' },
          { id: 'gr3', text: 'Петрофизические зависимости' },
          { id: 'gr4', text: 'Количественное определение коллекторских свойств' },
          { id: 'gr5', text: 'Флюидальная система в пластовых и поверхностных условиях' },
          { id: 'gr6', text: 'Обоснование ВНК' },
        ],
      },
      {
        id: 'doc-02-04',
        title: 'Проект пробной эксплуатации',
        type: 'base_project',
        konnArticle: '134, 136',
        ekArticle: '67',
        trigger: 'Обнаружение залежи в период разведки',
        deadlineNote: '3 месяца со дня решения о пробной эксплуатации',
        totalPhases: 5,
        currentPhase: 0,
        phases: [
          { number: 1, name: 'Разработка проекта', authority: '—' },
          { number: 2, name: 'Заявление ст. 68 ЭК', authority: 'МЭиПР РК' },
          { number: 3, name: 'ОВВ/РООС, согласование', authority: 'РГУ' },
          { number: 4, name: 'Экспертиза ЦКРР', authority: 'ЦКРР' },
          { number: 5, name: 'Передача недропользователю', authority: 'Недропользователь' },
        ],
      },
    ],
  },
  {
    code: 'STG-03-STATE-BALANCE',
    name: 'Государственный Баланс',
    shortName: 'Гос. Баланс',
    icon: '⚖️',
    color: 'violet',
    macroPhase: 'exploration',
    sortOrder: 3,
    description: 'Постановка запасов на Государственный баланс. Срок: 3 месяца с момента решения недропользователя.',
    regulatoryRefs: [
      'КОНН РК, ст. 6, 142',
      'Приказ МИИР №71 от 02.02.2023',
    ],
    documents: [
      {
        id: 'doc-03-01',
        title: 'Подсчёт запасов нефти и растворённого газа',
        type: 'geological_report',
        deadlineNote: '3 месяца с момента решения недропользователя',
        totalPhases: 5,
        currentPhase: 3,
        phases: [
          { number: 1, name: 'Подготовка отчёта по подсчёту запасов', authority: '—' },
          { number: 2, name: 'Представление в ГКЗ РК, назначение эксперта', authority: 'ГКЗ РК' },
          { number: 3, name: 'Защита на заседании ГКЗ РК', authority: 'ГКЗ РК' },
          { number: 4, name: 'Сдача в геофонды', authority: 'МД «Запказнедра» / «Южказнедра» / НГС' },
          { number: 5, name: 'Передача недропользователю', authority: 'Недропользователь' },
        ],
        note: '⚠️ Для сложных проектов: requires_complex_contract_update — блок перехода к фазе III.',
      },
      {
        id: 'doc-03-02',
        title: 'Анализ разработки месторождения УВ',
        type: 'geological_report',
        konnArticle: '6, 142',
        trigger: 'Не реже 1 раза в 3 года',
        deadlineNote: 'Периодически — не реже раза в 3 года',
        totalPhases: 3,
        currentPhase: 0,
        phases: [
          { number: 1, name: 'Разработка анализа', authority: '—' },
          { number: 2, name: 'Защита на ЦКРР', authority: 'ЦКРР' },
          { number: 3, name: 'Получение протокола', authority: 'ЦКРР' },
        ],
        checklist: [
          { id: 'ar1', text: 'Общие сведения о месторождении' },
          { id: 'ar2', text: 'История разработки и проектная документация' },
          { id: 'ar3', text: 'Анализ выработки запасов' },
          { id: 'ar4', text: 'Эффективность применяемых технологий' },
          { id: 'ar5', text: 'Технико-экономические показатели' },
        ],
        note: '💡 Автогенерация дедлайна: last_analysis_date + 3 года',
      },
    ],
    alerts: [
      'Анализ разработки последний раз — 2023, осталось 11 месяцев',
    ],
  },
  {
    code: 'STG-04-PREPARATORY',
    name: 'Подготовительный период',
    shortName: 'Подготовка',
    icon: '🏗️',
    color: 'amber',
    macroPhase: 'industrial',
    maxDurationYears: 3,
    sortOrder: 4,
    description: 'Подготовительный период добычи — не более 3 лет. После закрепления периода разведки, до закрепления периода добычи.',
    regulatoryRefs: [
      'КОНН РК, ст. 137, 138',
      'ЭК РК, ст. 67',
      'ЕПРКИН №239',
      'Приказ МЭ №200 от 22.05.2018',
    ],
    documents: [
      {
        id: 'doc-04-01',
        title: 'Проект разработки месторождения',
        type: 'base_project',
        konnArticle: '137',
        ekArticle: '67',
        totalPhases: 5,
        currentPhase: 4,
        phases: [
          { number: 1, name: 'Разработка проекта', authority: '—' },
          { number: 2, name: 'Заявление ст. 68 ЭК', authority: 'МЭиПР РК' },
          { number: 3, name: 'ОВВ/РООС, согласование', authority: 'РГУ' },
          { number: 4, name: 'Экспертиза и защита на ЦКРР', authority: 'ЦКРР' },
          { number: 5, name: 'Передача недропользователю', authority: 'Недропользователь' },
        ],
      },
      {
        id: 'doc-04-02',
        title: 'Проект ликвидации последствий недропользования на месторождении УВ',
        type: 'liquidation',
        konnArticle: '138',
        ekArticle: '67',
        totalPhases: 5,
        currentPhase: 2,
        phases: [
          { number: 1, name: 'Разработка проекта ликвидации', authority: '—' },
          { number: 2, name: 'Заявление ст. 68 ЭК', authority: 'МЭиПР РК' },
          { number: 3, name: 'ОВВ/РООС, согласование', authority: 'РГУ' },
          { number: 4, name: 'Экспертиза', authority: 'Компетентный орган' },
          { number: 5, name: 'Передача недропользователю', authority: 'Недропользователь' },
        ],
      },
      {
        id: 'doc-04-03',
        title: 'Технический проект на строительство добывающих и оценочных скважин',
        type: 'technical_project',
        ekArticle: '67',
        totalPhases: 5,
        currentPhase: 1,
        phases: [
          { number: 1, name: 'Техническое задание (утв. недропользователем)', authority: 'Недропользователь' },
          { number: 2, name: 'Разработка технического проекта', authority: '—' },
          { number: 3, name: 'Согласование ОВВ/РООС', authority: 'МЭиПР РК' },
          { number: 4, name: 'Экспертиза', authority: 'Компетентный орган' },
          { number: 5, name: 'Передача недропользователю', authority: 'Недропользователь' },
        ],
      },
      {
        id: 'doc-04-04',
        title: 'Перевод запасов нефти и растворённого газа (при необходимости)',
        type: 'reserve_operation',
        trigger: 'Получены новые данные при разбуривании, влияющие на оценку запасов',
        totalPhases: 5,
        currentPhase: 0,
        phases: [
          { number: 1, name: 'Подготовка отчёта о пересчёте', authority: '—' },
          { number: 2, name: 'Представление в ГКЗ РК', authority: 'ГКЗ РК' },
          { number: 3, name: 'Защита на ГКЗ РК', authority: 'ГКЗ РК' },
          { number: 4, name: 'Сдача в геофонды', authority: 'МД / НГС' },
          { number: 5, name: 'Передача недропользователю', authority: 'Недропользователь' },
        ],
        note: 'Категории перевода: C2 → C1, C1 → A. Требуется полный комплекс исследований по Классификации запасов.',
      },
    ],
    alerts: [
      'Авторнадзор за 2025 г. — срок подачи через 23 дня',
      'Осталось 1 год 4 месяца до окончания подготовительного периода',
    ],
  },
  {
    code: 'STG-05-FULL-DEVELOPMENT',
    name: 'Полномасштабная разработка',
    shortName: 'Разработка',
    icon: '⛽',
    color: 'green',
    macroPhase: 'industrial',
    maxDurationYears: 25,
    sortOrder: 5,
    description: 'Промышленная добыча. Срок: до 25 лет (до 45 лет для крупных/уникальных месторождений >100 млн т нефти или >50 млрд м³ газа).',
    regulatoryRefs: [
      'КОНН РК, ст. 119, 142',
      'ЭК РК, ст. 67',
      'ЕПРКИН №239',
    ],
    documents: [
      {
        id: 'doc-05-01',
        title: 'Технический проект строительства добывающих и оценочных скважин',
        type: 'technical_project',
        ekArticle: '67',
        totalPhases: 5,
        currentPhase: 0,
        phases: [
          { number: 1, name: 'Техническое задание (утв. недропользователем)', authority: 'Недропользователь' },
          { number: 2, name: 'Разработка технического проекта', authority: '—' },
          { number: 3, name: 'Согласование ОВВ/РООС', authority: 'МЭиПР РК' },
          { number: 4, name: 'Экспертиза', authority: 'Компетентный орган' },
          { number: 5, name: 'Передача недропользователю', authority: 'Недропользователь' },
        ],
      },
      {
        id: 'doc-05-02',
        title: 'Пересчёт запасов нефти и растворённого газа',
        type: 'reserve_operation',
        trigger: 'Запасы изменились более чем на 20% относительно ранее утверждённых ГКЗ РК',
        totalPhases: 4,
        currentPhase: 0,
        phases: [
          { number: 1, name: 'Подготовка отчёта', authority: '—' },
          { number: 2, name: 'Сдача в геофонды', authority: 'МД / НГС' },
          { number: 3, name: 'Защита в ГКЗ РК', authority: 'ГКЗ РК' },
          { number: 4, name: 'Передача недропользователю', authority: 'Недропользователь' },
        ],
        note: '💡 Система автоматически вычисляет delta_percent. Если > 20% — блокируется утверждение до прохождения ГКЗ.',
      },
    ],
  },
  {
    code: 'STG-06-LIQUIDATION',
    name: 'Проект ликвидации',
    shortName: 'Ликвидация',
    icon: '🔧',
    color: 'orange',
    macroPhase: 'return',
    sortOrder: 6,
    description: 'Ликвидация последствий недропользования. Применяется при прекращении права, возврате части или всего участка.',
    regulatoryRefs: [
      'КОНН РК, ст. 138',
      'ЭК РК, ст. 9',
      'ЕПРКИН №239 (изм. 24.09.2024)',
      'Приказ МЭ №200 от 22.05.2018 (изм. №66 от 11.10.2024)',
      'Закон РК «О гражданской защите» №188-V (изм. 31.08.2025)',
    ],
    documents: [
      {
        id: 'doc-06-01',
        title: 'Проект ликвидации последствий недропользования',
        type: 'liquidation',
        konnArticle: '138',
        ekArticle: '9',
        totalPhases: 5,
        currentPhase: 0,
        phases: [
          { number: 1, name: 'Разработка проекта ликвидации', authority: '—' },
          { number: 2, name: 'Заявление ст. 68 ЭК', authority: 'МЭиПР РК' },
          { number: 3, name: 'ОВВ/РООС, согласование с цепочкой РГУ', authority: 'РГУ (7 органов)' },
          { number: 4, name: 'Итоговое согласование', authority: 'РГУ «Департамент экологии»' },
          { number: 5, name: 'Передача недропользователю', authority: 'Недропользователь' },
        ],
        note: `Цепочка согласования (7 органов):
• РГУ «Управление земельных отношений»
• РГУ «Департамент Комитета промышленной безопасности МЧС РК»
• РГУ «Департамент санитарно-эпидемиологического контроля МЗ РК»
• МД «Запказнедра» / «Южказнедра»
• РГУ «Департамент экологии» МЭиПР РК
• РГУ «Территориальная инспекция лесного хозяйства» (для морских)
• РГУ «Жайык-Каспийская бассейновая инспекция» (для морских)`,
      },
    ],
  },
  {
    code: 'STG-07-TERRITORY-RETURN',
    name: 'Сдача контрактной территории',
    shortName: 'Сдача',
    icon: '📋',
    color: 'gray',
    macroPhase: 'return',
    sortOrder: 7,
    description: 'Окончательная сдача контрактной территории. Применяется при прекращении права (ст. 107), добровольном уменьшении участка (ст. 114), досрочном прекращении разведки (ст. 116 п. 5).',
    regulatoryRefs: [
      'КОНН РК, ст. 107, 114, 116',
      'Приказ МЭ №200 от 22.05.2018 (изм. №66 от 11.10.2024)',
    ],
    documents: [
      {
        id: 'doc-07-01',
        title: 'Окончательный отчёт о результатах ГРР на возвращаемой контрактной территории',
        type: 'geological_report',
        totalPhases: 5,
        currentPhase: 0,
        phases: [
          { number: 1, name: 'Подготовка отчёта', authority: '—' },
          { number: 2, name: 'Представление в уполномоченный орган', authority: 'МЭ РК' },
          { number: 3, name: 'Сдача в геофонды', authority: 'МД / НГС' },
          { number: 4, name: 'Согласование с органами', authority: 'МЭиПР РК' },
          { number: 5, name: 'Передача недропользователю', authority: 'Недропользователь' },
        ],
        checklist: [
          { id: 'tr1', text: 'Краткое геологическое описание территории' },
          { id: 'tr2', text: 'Данные о ГРР (сейсморазведка, поисково-разведочное бурение)' },
          { id: 'tr3', text: 'Обоснование необходимости возврата' },
          { id: 'tr4', text: 'Перспективы нефтегазоносности возвращаемых частей' },
        ],
      },
      {
        id: 'doc-07-02',
        title: 'Приёмка возвращаемой контрактной территории после ликвидационных работ',
        type: 'liquidation',
        konnArticle: '138',
        totalPhases: 5,
        currentPhase: 0,
        phases: [
          { number: 1, name: 'Уведомление МЭ РК о завершении ликвидационных работ (п. 8–9 ст. 138)', authority: 'МЭ РК' },
          { number: 2, name: 'Создание комиссии по приёмке приказом МЭ РК', authority: 'МЭ РК' },
          { number: 3, name: 'Заседания комиссии по приёмке (5 участников)', authority: 'Комиссия МЭ РК' },
          { number: 4, name: 'Осмотр территории', authority: 'Комиссия' },
          { number: 5, name: 'Получение акта ликвидации последствий недропользования', authority: 'МЭ РК' },
        ],
        note: 'Состав комиссии: недропользователь, компетентный орган, ООС, СЭБН, местные органы, собственник земли.',
      },
    ],
  },
]

export const STAGE_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-500' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500' },
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-500' },
  green:  { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-500' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
  gray:   { bg: 'bg-gray-50',   text: 'text-gray-700',   border: 'border-gray-200',   dot: 'bg-gray-400' },
}

export const DOC_TYPE_LABELS: Record<string, string> = {
  base_project:       'Базовый проект',
  technical_project:  'Технический проект',
  geological_report:  'Геологический отчёт',
  liquidation:        'Проект ликвидации',
  author_supervision: 'Авторский надзор',
  reserve_operation:  'Операция с запасами',
}

export const DOC_TYPE_COLORS: Record<string, string> = {
  base_project:       'bg-blue-100 text-blue-700',
  technical_project:  'bg-purple-100 text-purple-700',
  geological_report:  'bg-teal-100 text-teal-700',
  liquidation:        'bg-red-100 text-red-700',
  author_supervision: 'bg-yellow-100 text-yellow-700',
  reserve_operation:  'bg-orange-100 text-orange-700',
}

export const LIFECYCLE_AI_CONTEXT = `
Ты юридический ассистент Subsoil. Используй ТОЛЬКО следующую нормативную базу:

КОНН РК №125-VI от 27.12.2017 (последние изменения 10.06.2025):
  - ст. 107: прекращение права недропользования
  - ст. 113: морские проекты и увеличение участка
  - ст. 114: добровольный возврат части участка
  - ст. 116: досрочное прекращение периода разведки
  - ст. 119 п.7: обязательства по крупным месторождениям (>100 млн т / >50 млрд м³)
  - ст. 134, 135: проекты разведочных работ (поиск/оценка)
  - ст. 136: пробная эксплуатация (изм. 22.07.2024)
  - ст. 137: проект разработки месторождения (изм. 22.07.2024)
  - ст. 138: ликвидация последствий недропользования (изм. 10.06.2025)
  - ст. 142: авторский надзор

ЭК РК №400-VI от 02.01.2021 (изм. 29.07.2025):
  - ст. 9: проект ликвидации
  - ст. 67: ОВВ/РООС
  - ст. 68: заявление о намечаемой деятельности

ЕПРКИН №239 от 15.06.2018 (изм. 24.09.2024) — все главы.

Приказы МЭ:
  - №200 от 22.05.2018 (изм. №66 от 11.10.2024) — Правила консервации и ликвидации
  - №356 от 30.12.2014 (изм. 04.08.2023) — Промбезопасность на море
  - №419 от 31.05.2018 (изм. №200 от 25.08.2020) — Формы отчётов

Приказы МИИР:
  - №71 от 02.02.2023 — Методика классификации запасов

Жизненный цикл недропользования состоит из 7 подэтапов:
1. STG-01: Разведка (поисковый этап)
2. STG-02: Оценка (оценочный этап + пробная эксплуатация)
3. STG-03: Государственный Баланс (постановка запасов на ГКЗ)
4. STG-04: Подготовительный период (≤ 3 лет)
5. STG-05: Полномасштабная разработка (≤ 25 лет, ≤ 45 лет для крупных)
6. STG-06: Проект ликвидации последствий недропользования
7. STG-07: Сдача контрактной территории

На запрос «что делать на этапе X» — отвечай: какие документы готовить, какие фазы пройти, какие органы согласовывают, какие SLA.
При ответе ВСЕГДА указывай конкретную статью и дату последней редакции.
`

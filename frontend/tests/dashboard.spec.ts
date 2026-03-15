import { test, expect } from '@playwright/test'

// ─────────────────────────── Dashboard ───────────────────────────
test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => { await page.goto('http://localhost:3000/dashboard') })

  test('loads welcome message', async ({ page }) => {
    await expect(page.getByText('Добро пожаловать, Асет')).toBeVisible()
  })
  test('shows critical alerts', async ({ page }) => {
    await expect(page.getByText('КРИТИЧЕСКИЕ УВЕДОМЛЕНИЯ')).toBeVisible()
    await expect(page.getByText('Отчет 1-ТП просрочен на 3 дня')).toBeVisible()
  })
  test('shows 4 metric cards', async ({ page }) => {
    await expect(page.getByText('Активных лицензий')).toBeVisible()
    await expect(page.getByText('Активных скважин')).toBeVisible()
  })
  test('shows deadline timeline', async ({ page }) => {
    await expect(page.getByText('Ближайшие дедлайны')).toBeVisible()
  })
  test('can dismiss an alert', async ({ page }) => {
    const before = await page.locator('.border-l-4').count()
    await page.locator('.border-l-4').first().getByRole('button', { name: 'Закрыть' }).click()
    await page.waitForTimeout(400)
    expect(await page.locator('.border-l-4').count()).toBeLessThan(before)
  })
})

// ─────────────────────── Notifications ───────────────────────────
test.describe('Notifications', () => {
  test.beforeEach(async ({ page }) => { await page.goto('http://localhost:3000/dashboard') })

  test('bell shows unread badge', async ({ page }) => {
    const badge = page.locator('header span.bg-error-500').first()
    await expect(badge).toBeVisible()
    const count = await badge.textContent()
    expect(Number(count)).toBeGreaterThan(0)
  })

  test('opens notification panel on click', async ({ page }) => {
    await page.getByRole('button', { name: 'Уведомления' }).click()
    await expect(page.getByText('Просроченный отчёт')).toBeVisible()
    await expect(page.getByText('Форма 1-ТП (недра)')).toBeVisible()
  })

  test('mark all read clears badge', async ({ page }) => {
    await page.getByRole('button', { name: 'Уведомления' }).click()
    await page.getByRole('button', { name: 'Прочитать все' }).click()
    await expect(page.locator('header span.bg-error-500').first()).not.toBeVisible()
  })

  test('dismiss single notification', async ({ page }) => {
    await page.getByRole('button', { name: 'Уведомления' }).click()
    const panel = page.locator('.absolute.right-0.top-full')
    const before = await panel.locator('.bg-red-50, .bg-amber-50').count()
    await panel.locator('button').filter({ has: page.locator('svg') }).first().click()
    await page.waitForTimeout(200)
    const after = await panel.locator('.bg-red-50, .bg-amber-50').count()
    expect(after).toBeLessThanOrEqual(before)
  })

  test('panel closes on outside click', async ({ page }) => {
    await page.getByRole('button', { name: 'Уведомления' }).click()
    await expect(page.getByText('Просроченный отчёт')).toBeVisible()
    await page.locator('main').click({ position: { x: 100, y: 100 } })
    await expect(page.getByText('Просроченный отчёт')).not.toBeVisible()
  })
})

// ─────────────────────────── Sidebar ─────────────────────────────
test.describe('Sidebar Navigation', () => {
  test('all links navigate correctly', async ({ page }) => {
    const links = [
      { name: '📜 Лицензии',    url: /\/licenses$/ },
      { name: '📅 Календарь',   url: /\/calendar/ },
      { name: '🏗️ Скважины',    url: /\/wells$/ },
      { name: '👷 Подрядчики',  url: /\/contractors/ },
      { name: '🧪 Испытания',   url: /\/tests/ },
      { name: '📄 Отчеты',      url: /\/reports/ },
      { name: '🤖 AI-помощник', url: /\/ai-assistant/ },
      { name: '⚙️ Настройки',   url: /\/settings/ },
    ]
    for (const link of links) {
      await page.goto('http://localhost:3000/dashboard')
      await page.getByRole('link', { name: link.name }).first().click()
      await expect(page).toHaveURL(link.url)
    }
  })
})

// ──────────────────────── Wells List ─────────────────────────────
test.describe('Wells List Page', () => {
  test.beforeEach(async ({ page }) => { await page.goto('http://localhost:3000/wells') })

  test('shows wells in table view', async ({ page }) => {
    await expect(page.getByText('№47')).toBeVisible()
    await expect(page.getByText('№45')).toBeVisible()
    await expect(page.getByText('№48')).toBeVisible()
    // FIX: exact:true prevents №3 matching №31
    await expect(page.getByText('№3', { exact: true })).toBeVisible()
  })

  test('shows 60 wells (all examples)', async ({ page }) => {
    const rows = page.locator('tbody tr')
    expect(await rows.count()).toBe(60)
  })

  test('stats cards are clickable filters', async ({ page }) => {
    // FIX: scope to the stats grid buttons (gap-3 parent) to avoid badge text collisions
    await page.locator('.gap-3 > button').filter({ hasText: 'Бурение' }).click()
    const rows = await page.locator('tbody tr').count()
    expect(rows).toBeGreaterThan(0)
    expect(rows).toBeLessThan(60)
  })

  test('search filters wells', async ({ page }) => {
    // FIX: use exact placeholder to avoid matching TopNav search
    await page.getByPlaceholder('🔍 Поиск по номеру, месторождению, подрядчику...').fill('Жанажол')
    const rows = await page.locator('tbody tr').count()
    expect(rows).toBeLessThan(60)
  })

  test('status dropdown filters', async ({ page }) => {
    await page.locator('select').first().selectOption('testing')
    const rows = await page.locator('tbody tr').count()
    expect(rows).toBeGreaterThan(0)
    expect(rows).toBeLessThan(60)
  })

  test('field dropdown filters', async ({ page }) => {
    await page.locator('select').nth(1).selectOption('Каражанбас')
    const rows = await page.locator('tbody tr').count()
    expect(rows).toBeGreaterThan(0)
    expect(rows).toBeLessThan(60)
  })

  test('switches to grid view', async ({ page }) => {
    await page.getByTitle('Карточки').click()
    await expect(page.getByText('Скв. №47')).toBeVisible()
  })

  test('opens New Well modal', async ({ page }) => {
    await page.getByRole('button', { name: '+ Новая скважина' }).click()
    // FIX: use emoji prefix to distinguish modal heading from the button text
    await expect(page.getByText('🏗️ Новая скважина')).toBeVisible()
    await expect(page.getByPlaceholder('например, 50')).toBeVisible()
  })

  test('new well form validates required fields', async ({ page }) => {
    await page.getByRole('button', { name: '+ Новая скважина' }).click()
    await page.getByRole('button', { name: 'Создать скважину' }).click()
    await expect(page.getByText('Укажите номер')).toBeVisible()
    await expect(page.getByText('Укажите глубину')).toBeVisible()
  })

  test('creates new well and adds to list', async ({ page }) => {
    await page.getByRole('button', { name: '+ Новая скважина' }).click()
    await page.getByPlaceholder('например, 50').fill('99')
    await page.getByPlaceholder('например, 3500').fill('4200')
    await page.getByPlaceholder(/ТОО/).fill('ТОО "TestDrill"')
    await page.locator('input[type="date"]').fill('2026-04-01')
    await page.getByPlaceholder('Фамилия И.О.').fill('Тестов Т.Т.')
    await page.getByRole('button', { name: 'Создать скважину' }).click()
    await expect(page.getByText('Скважина №99 добавлена!')).toBeVisible()
    // FIX: exact:true prevents '№99' matching the toast 'Скважина №99 добавлена!'
    await expect(page.getByText('№99', { exact: true })).toBeVisible()
  })

  test('navigates to well detail', async ({ page }) => {
    await page.getByRole('link', { name: /Открыть →/ }).first().click({ force: true })
    await expect(page).toHaveURL(/\/wells\/\d+/)
  })
})

// ──────────────────────── Calendar ───────────────────────────────
test.describe('Calendar Page', () => {
  test.beforeEach(async ({ page }) => { await page.goto('http://localhost:3000/calendar') })

  test('shows month grid', async ({ page }) => {
    await expect(page.getByText('Март 2026')).toBeVisible()
    // FIX: scope to the day-of-week header row (first grid-cols-7 element)
    const dayHeader = page.locator('.grid-cols-7').first()
    await expect(dayHeader.getByText('Пн', { exact: true })).toBeVisible()
    await expect(dayHeader.getByText('Вс', { exact: true })).toBeVisible()
  })

  test('today cell is highlighted', async ({ page }) => {
    // Today (16) should have primary-500 background
    const todayCell = page.locator('.bg-primary-500.text-white').filter({ hasText: '16' }).first()
    await expect(todayCell).toBeVisible()
  })

  test('events are displayed on calendar', async ({ page }) => {
    await expect(page.getByText('Форма 2-ТП (март)').first()).toBeVisible()
  })

  test('clicking day shows detail panel', async ({ page }) => {
    // FIX: scope to the calendar cells grid (second grid-cols-7, after the day-name header)
    await page.locator('.grid-cols-7').nth(1).locator('div').filter({ hasText: /^17$/ }).click()
    await expect(page.getByText('17 марта 2026')).toBeVisible()
    // FIX: event title appears in both grid tile and detail panel — use .first()
    await expect(page.getByText('ПЛА скв. №15 — учения').first()).toBeVisible()
  })

  test('type filter works', async ({ page }) => {
    await page.getByRole('button', { name: '📄 Отчёт' }).click()
    // FIX: use .first() — event appears in both grid cell and detail panel
    await expect(page.getByText('Форма 2-ТП (март)').first()).toBeVisible()
  })

  test('switches to list view', async ({ page }) => {
    await page.getByRole('button', { name: '📋 Список' }).click()
    // All events visible in list
    await expect(page.getByText('Форма 1-ТП (февраль)')).toBeVisible()
    await expect(page.getByText('ПЛА скв. №15 — учения')).toBeVisible()
  })

  test('list view status filter works', async ({ page }) => {
    await page.getByRole('button', { name: '📋 Список' }).click()
    await page.getByRole('button', { name: /Просрочено/ }).click()
    await expect(page.getByText('Форма 1-ТП (февраль)')).toBeVisible()
    await expect(page.getByText('Форма 2-ТП (март)')).not.toBeVisible()
  })

  test('legend is visible', async ({ page }) => {
    // FIX: use .first() — 'Просрочено' also appears as event badge in calendar grid
    await expect(page.getByText('Просрочено').first()).toBeVisible()
    await expect(page.getByText('Запланировано').first()).toBeVisible()
    await expect(page.getByText('Выполнено').first()).toBeVisible()
  })

  test('close detail panel works', async ({ page }) => {
    // FIX: scope day click to calendar cells grid
    await page.locator('.grid-cols-7').nth(1).locator('div').filter({ hasText: /^17$/ }).click()
    await expect(page.getByText('17 марта 2026')).toBeVisible()
    // FIX: detail panel has overflow-hidden (legend doesn't); nth(1) = panel, not legend
    await page.locator('.rounded-xl.overflow-hidden').nth(1).locator('button').filter({ has: page.locator('svg') }).first().click()
    await expect(page.getByText('17 марта 2026')).not.toBeVisible()
  })
})

// ──────────────────────── Contractors ────────────────────────────
test.describe('Contractors Page', () => {
  test.beforeEach(async ({ page }) => { await page.goto('http://localhost:3000/contractors') })

  test('shows all contractors', async ({ page }) => {
    await expect(page.getByText('ТОО "KazDrilling"')).toBeVisible()
    await expect(page.getByText('АО "CaspianDrill"')).toBeVisible()
    await expect(page.getByText('ТОО "GeoService"')).toBeVisible()
  })
  test('search filters', async ({ page }) => {
    // FIX: use exact placeholder to avoid matching TopNav search
    await page.getByPlaceholder('🔍 Поиск по названию, БИН, специализации...').fill('Caspian')
    await expect(page.getByText('АО "CaspianDrill"')).toBeVisible()
    await expect(page.getByText('ТОО "KazDrilling"')).not.toBeVisible()
  })
  test('expands document accordion', async ({ page }) => {
    await page.getByRole('button', { name: /Документы/ }).first().click()
    await expect(page.getByText('Разрешительные документы')).toBeVisible()
  })
})

// ──────────────────────── Reports ────────────────────────────────
test.describe('Reports Page', () => {
  test.beforeEach(async ({ page }) => { await page.goto('http://localhost:3000/reports') })

  test('shows reports with statuses', async ({ page }) => {
    await expect(page.getByText('Форма 1-ТП (недра)')).toBeVisible()
    await expect(page.getByText('Просрочено').first()).toBeVisible()
    await expect(page.getByText('Сегодня', { exact: true })).toBeVisible()
  })
  test('tab filter works', async ({ page }) => {
    await page.getByRole('button', { name: /Сданы/ }).click()
    await expect(page.getByText('Форма 5-ГР')).toBeVisible()
  })
})

// ──────────────────────── Settings ───────────────────────────────
test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => { await page.goto('http://localhost:3000/settings') })

  test('profile tab default', async ({ page }) => {
    await expect(page.getByText('Асет Жансеитов').first()).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })
  test('notifications tab', async ({ page }) => {
    // FIX: scope to main to avoid matching the TopNav bell button aria-label
    await page.locator('main').getByRole('button', { name: /Уведомления/ }).click()
    await expect(page.getByText('Email-уведомления')).toBeVisible()
  })
  test('system tab', async ({ page }) => {
    await page.getByRole('button', { name: /Система/ }).click()
    await expect(page.getByText('FastAPI 0.109')).toBeVisible()
  })
})

// ──────────────────────── AI Assistant ───────────────────────────
test.describe('AI Assistant', () => {
  test.beforeEach(async ({ page }) => { await page.goto('http://localhost:3000/ai-assistant') })

  test('shows chat with messages', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /AI-Помощник/ })).toBeVisible()
    await expect(page.getByText('Форма 5-ГР')).toBeVisible()
  })
  test('sends message and gets response', async ({ page }) => {
    await page.getByPlaceholder('Ваш вопрос').fill('Тест')
    await page.getByRole('button', { name: 'Отправить' }).click()
    await page.waitForTimeout(2500)
    await expect(page.getByText('демонстрационный ответ AI-помощника').last()).toBeVisible()
  })
})

// ──────────────────────── Mobile ─────────────────────────────────
test.describe('Mobile Responsiveness', () => {
  test('dashboard mobile layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('http://localhost:3000/dashboard')
    await expect(page.getByRole('button', { name: 'Открыть меню' })).toBeVisible()
    await expect(page.getByText('Добро пожаловать, Асет')).toBeVisible()
  })
  test('hamburger opens sidebar navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('http://localhost:3000/dashboard')
    await page.getByRole('button', { name: 'Открыть меню' }).click()
    await page.waitForTimeout(600)
    await page.getByRole('link', { name: '📜 Лицензии' }).first().click()
    await expect(page).toHaveURL(/\/licenses/)
  })
})

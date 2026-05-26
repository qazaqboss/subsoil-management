# Деплой на Railway — пошаговая инструкция

## Структура: два сервиса в одном репозитории

```
subsoil-management/
├── backend/     ← Railway Service 1 (FastAPI)
└── frontend/    ← Railway Service 2 (React SPA)
```

---

## Шаг 1 — Создать проект на Railway

1. Зайдите на [railway.app](https://railway.app)
2. New Project → Deploy from GitHub repo → выберите ваш репозиторий

---

## Шаг 2 — Добавить PostgreSQL

В проекте нажмите **+ New** → **Database** → **Add PostgreSQL**

Railway автоматически добавит переменную `DATABASE_URL` в базу данных.

---

## Шаг 3 — Настроить Backend сервис

1. Нажмите **+ New** → **GitHub Repo** → выберите тот же репозиторий
2. В настройках сервиса:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. Во вкладке **Variables** добавьте:

```
DATABASE_URL     = (скопируйте из PostgreSQL сервиса → Variables → DATABASE_URL)
ANTHROPIC_API_KEY = sk-ant-ваш-ключ
SECRET_KEY       = случайная-строка-32-символа
ALLOWED_ORIGINS  = https://ваш-фронтенд.railway.app
```

4. Нажмите **Deploy** — подождите 2-3 минуты

5. Проверьте: откройте `https://ваш-бэкенд.railway.app/api/health`
   Должно вернуть: `{"status": "ok", "db": "ok"}`

---

## Шаг 4 — Настроить Frontend сервис

1. Нажмите **+ New** → **GitHub Repo** → тот же репозиторий
2. В настройках сервиса:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`

3. Во вкладке **Variables** добавьте:

```
VITE_API_URL = https://ваш-бэкенд.railway.app
```

4. Нажмите **Deploy**

---

## Шаг 5 — Связать сервисы

После деплоя фронтенда:
1. Скопируйте URL фронтенда: `https://subsoil-xyz.railway.app`
2. Перейдите в настройки **Backend** → Variables
3. Обновите: `ALLOWED_ORIGINS = https://subsoil-xyz.railway.app`
4. Редеплой бэкенда

---

## Проверка

| URL | Ожидаемый результат |
|-----|---------------------|
| `https://бэкенд.railway.app/api/health` | `{"status":"ok","db":"ok"}` |
| `https://бэкенд.railway.app/docs` | Swagger UI |
| `https://фронтенд.railway.app` | React приложение |
| `https://бэкенд.railway.app/api/licenses/` | JSON список лицензий |

---

## Troubleshooting

**Build failed: ModuleNotFoundError**
→ Проверьте что `Root Directory` = `backend` (не корень репозитория)

**CORS error в браузере**
→ Убедитесь что `ALLOWED_ORIGINS` в бэкенде содержит точный URL фронтенда (без слэша в конце)

**DB connection error**
→ Убедитесь что `DATABASE_URL` скопирован из Railway PostgreSQL сервиса

**AI assistant не отвечает**
→ Проверьте `ANTHROPIC_API_KEY` начинается с `sk-ant-`

**Страница не найдена при обновлении (404)**
→ Это обрабатывается через `serve.json` — убедитесь файл есть в `frontend/`

# Subsoil Management — Автоматизация недропользования

Веб-приложение для автоматизации контроля лицензионных обязательств недропользователей Казахстана.

## Быстрый старт

### Frontend
```bash
cd frontend
npm install
npm run dev
# Открыть http://localhost:3000
```

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
```

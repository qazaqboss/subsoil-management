# Stage 1: Build React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
ENV VITE_API_URL=""
RUN npm run build && echo "=== Frontend build OK ===" && ls -la dist/

# Stage 2: FastAPI backend + built frontend
FROM python:3.11-slim
WORKDIR /app

# DejaVu fonts for fpdf2 Cyrillic PDF generation
RUN apt-get update && \
    apt-get install -y --no-install-recommends fonts-dejavu-core && \
    rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./
COPY --from=frontend-build /app/dist /app/dist

RUN echo "=== Dist ===" && ls -la /app/dist/ && \
    echo "=== Stage PDFs ===" && ls /app/app/static/reports/ 2>/dev/null || echo "(no PDFs)"

ENV PORT=8000
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT}

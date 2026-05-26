# Stage 1: Build React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app

# Skip Playwright browser download (not needed for build)
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps

COPY frontend/ ./

# Empty VITE_API_URL = relative /api/* URLs (same-origin, single service)
ENV VITE_API_URL=""
RUN npm run build && echo "=== Frontend build OK ===" && ls -la dist/

# Stage 2: FastAPI backend + built frontend
FROM python:3.11-slim
WORKDIR /app

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./
COPY --from=frontend-build /app/dist /app/dist

# Verify dist was copied
RUN echo "=== Dist contents ===" && ls -la /app/dist/

ENV PORT=8000
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT}

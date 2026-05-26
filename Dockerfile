# Stage 1: Build React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
# Empty VITE_API_URL = use relative URLs (same-origin, single service)
ENV VITE_API_URL=""
RUN npm run build

# Stage 2: FastAPI backend + built frontend
FROM python:3.11-slim
WORKDIR /app

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./
COPY --from=frontend-build /app/dist ./dist

ENV PORT=8000
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT}

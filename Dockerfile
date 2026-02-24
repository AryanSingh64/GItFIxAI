# ---- Stage 1: Build Frontend ----
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
# Cache bust to force rebuild when .env changes
ARG CACHEBUST=1
COPY frontend/ ./
RUN npm run build

# ---- Stage 2: Run Backend ----
FROM python:3.11-slim
WORKDIR /app

# Install git (needed for GitPython)
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy built frontend (optional: serve via FastAPI or nginx)
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Expose port
EXPOSE 8000

# Set working directory to backend
WORKDIR /app/backend

# Railway sets PORT dynamically - default to 8000 if not set
ENV PORT=8000
EXPOSE $PORT

# Start the backend using shell form so $PORT is resolved at runtime
CMD uvicorn main:app --host 0.0.0.0 --port $PORT

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Python-FastAPI-blue?style=for-the-badge&logo=python" alt="Python" />
  <img src="https://img.shields.io/badge/PostgreSQL-PostGIS-316192?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker" alt="Docker" />
</p>

# mongi.AI

> **AI-Powered Satellite Intelligence for Olive Grove Monitoring**

An advanced agricultural monitoring platform that leverages **Sentinel-2** satellite imagery, **Google Earth Engine**, and **Machine Learning** to provide real-time vegetation health analysis, water stress detection, and actionable recommendations for olive farmers.

---

## Features

### Satellite Monitoring
- Real-time **NDVI** (Normalized Difference Vegetation Index) analysis using Sentinel-2 imagery
- **Sentinel-1** radar data for soil moisture estimation
- Automatic cloud filtering for accurate measurements
- Historical trend analysis with interactive timeline

### Water Stress Detection
- AI-powered water stress prediction before visible symptoms appear
- Soil moisture correlation with vegetation health
- Smart irrigation recommendations based on current conditions

### Intelligent Alerts
- Real-time alerts for:
  - Critical water stress
  - Root disease/waterlogging warnings
  - Heat stress detection
  - Optimal growth conditions
- Confidence scores for each prediction

### AI Chatbot (Mongi)
- **RAG-powered** agricultural assistant using Pinecone vector database
- Vision capabilities for image-based plant diagnosis
- Context-aware farming recommendations
- Multi-model support (Mistral, GPT-4, Gemini)

### Interactive Dashboard
- Leaflet-based interactive map with field polygons
- 3D character integration (Ready Player Me)
- Field "fingerprint" cards with health metrics
- Time evolution charts for trend visualization

---

## Project Structure

```
actinspace/
├── frontend/           # Next.js 14 web application
│   ├── app/            # App router pages
│   │   ├── dashboard/  # Main monitoring dashboard
│   │   ├── login/      # Authentication pages
│   │   ├── signup/
│   │   └── ...
│   └── components/     # Reusable UI components
│       ├── 3d/         # Three.js 3D components
│       ├── dashboard/  # Dashboard-specific components
│       └── providers/  # React context providers
│
├── backend/            # Node.js/Express REST API
│   ├── routes/
│   │   ├── auth.js     # JWT authentication
│   │   ├── fields.js   # Field CRUD operations
│   │   ├── alerts.js   # Alert management
│   │   ├── ai.js       # AI service proxy
│   │   └── payment.js  # Payment integration
│   └── index.js        # Express server entry
│
├── ai_service/         # Python FastAPI ML service
│   ├── main.py         # FastAPI application
│   ├── satellite.py    # Google Earth Engine integration
│   ├── decision_engine.py  # Expert system rules
│   └── requirements.txt
│
├── chatbot/ActInSpace/ # RAG-powered agricultural chatbot
│   ├── app.py          # FastAPI chatbot server
│   └── src/
│       ├── helper.py   # Embedding utilities
│       ├── prompt.py   # System prompts
│       └── sentinel_utils.py
│
├── db/                 # Database setup
│   └── init.sql        # PostgreSQL + PostGIS schema
│
└── docker-compose.yml  # Full stack orchestration
```

---

## Quick Start

### Prerequisites

- **Node.js** >= 18.x
- **Python** >= 3.9
- **pnpm** (or npm/yarn)
- **Docker & Docker Compose** (for full stack)
- **Google Earth Engine account** (for real satellite data)

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/greensignal.git
cd greensignal

# Start all services
docker-compose up -d

# Services will be available at:
# Frontend:   http://localhost:3000
# Backend:    http://localhost:5000
# AI Service: http://localhost:8000
# Database:   localhost:5432
```

### Option 2: Manual Setup

#### Database (PostgreSQL + PostGIS)

```bash
# Using Docker
docker run -d \
  --name greensignal-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=greensignal \
  -p 5432:5432 \
  postgis/postgis:15-3.4

# Initialize schema
docker exec -i greensignal-db psql -U postgres -d greensignal < db/init.sql
```

#### Backend (Node.js/Express)

```bash
cd backend

# Install dependencies
npm install

# Create environment file
echo "DATABASE_URL=postgres://postgres:postgres@localhost:5432/greensignal" > .env
echo "JWT_SECRET=your-super-secret-key" >> .env

# Start development server
npm run dev   # Runs on http://localhost:5001
```

#### AI Service (Python/FastAPI)

```bash
cd ai_service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Authenticate with Google Earth Engine (one-time)
earthengine authenticate

# Start the service
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend (Next.js)

```bash
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev   # Runs on http://localhost:3000
```

#### Chatbot (Optional)

```bash
cd chatbot/ActInSpace

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export PINECONE_API_KEY=your-pinecone-key
export OPENROUTER_API_KEY=your-openrouter-key

# Start chatbot service
uvicorn app:app --host 0.0.0.0 --port 8001 --reload
```

---

## Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/greensignal
JWT_SECRET=your-jwt-secret-key
PORT=5001
```

#### AI Service
```env
GEE_PROJECT_ID=your-gee-project-id
```

#### Chatbot
```env
PINECONE_API_KEY=your-pinecone-api-key
OPENROUTER_API_KEY=your-openrouter-api-key
```

---

## API Endpoints

### Backend API (Port 5001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | User registration |
| POST | `/api/auth/login` | User authentication |
| GET | `/api/fields` | Get user's fields |
| POST | `/api/fields` | Create new field |
| GET | `/api/alerts` | Get field alerts |
| POST | `/api/ai/analyze` | Trigger AI analysis |

### AI Service API (Port 8000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ping` | Health check |
| POST | `/analyze-field` | Analyze field satellite data |
| GET | `/health` | Service status |

### Chatbot API (Port 8001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Service status |
| POST | `/chat` | Send message to chatbot |

---

## Satellite Data Pipeline

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Sentinel-2    │────▶│  Google Earth    │────▶│  NDVI + MSAVI   │
│   (Optical)     │     │     Engine       │     │   Calculation   │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
┌─────────────────┐     ┌──────────────────┐              ▼
│   Sentinel-1    │────▶│  Moisture Index  │────▶┌─────────────────┐
│   (Radar/SAR)   │     │   Estimation     │     │ Decision Engine │
└─────────────────┘     └──────────────────┘     │  (Expert Rules) │
                                                  └────────┬────────┘
                                                           │
                        ┌──────────────────┐              ▼
                        │   ML Model       │────▶┌─────────────────┐
                        │ (Yield Predict)  │     │   Actionable    │
                        └──────────────────┘     │  Insights       │
                                                  └─────────────────┘
```

---

## Decision Engine Rules

The AI service uses an expert system with the following scenarios:

| Scenario | Condition | Risk Level | Action |
|----------|-----------|------------|--------|
| Critical Water Stress | Moisture < 0.3, NDVI < 0.4, declining | Critical | Immediate irrigation |
| Root Disease | Moisture > 0.6, NDVI < 0.4 | High | Stop irrigation, inspect |
| Developing Stress | Moisture < 0.4, declining trend | Medium | Schedule irrigation |
| Heat Stress | Moisture > 0.5, NDVI declining | Medium | Check for damage |
| Healthy Growth | NDVI > 0.6, Moisture > 0.4 | Low | Maintain schedule |
| Recovery | NDVI trend positive | Low | Continue practices |

---

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TailwindCSS** - Utility-first styling
- **Leaflet** - Interactive maps
- **Three.js / React Three Fiber** - 3D rendering
- **Framer Motion** - Animations
- **Chart.js** - Data visualization

### Backend
- **Express.js** - REST API framework
- **PostgreSQL + PostGIS** - Geospatial database
- **JWT** - Authentication
- **bcrypt** - Password hashing

### AI Service
- **FastAPI** - High-performance Python API
- **Google Earth Engine** - Satellite data processing
- **scikit-learn** - Machine learning
- **NumPy / Pandas** - Data processing

### Chatbot
- **LangChain** - LLM orchestration
- **Pinecone** - Vector database
- **OpenRouter** - Multi-model LLM access

---

## Docker Services

```yaml
services:
  frontend:   # Next.js app     → Port 3000
  backend:    # Express API     → Port 5000
  ai_service: # FastAPI ML      → Port 8000
  db:         # PostGIS         → Port 5432
```

---

## Sample Data

The database is seeded with sample olive groves in Tunisia:

- **Sfax North Grove** - Northern Sfax region
- **Mahdia Coastal** - Coastal Mahdia area
- **Sousse Valley** - Sousse valley region

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **ESA Copernicus Program** - Sentinel satellite data
- **Google Earth Engine** - Satellite data processing platform
- **Act in Space** - Hackathon inspiration

---

<p align="center">
  Made with love for sustainable agriculture
</p>

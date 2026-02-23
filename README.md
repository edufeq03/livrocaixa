# Livro Caixa SaaS

A Multi-tenant SaaS application for accounting offices and their clients.

## Project Structure

- `backend/`: FastAPI REST API (Python)
- `frontend/`: Next.js Web Application (React)
- `docs/`: Technical specifications and ADRs

## Tech Stack

- **Backend:** FastAPI, PostgreSQL (via SQLAlchemy), JWT Auth
- **Frontend:** Next.js, Tailwind CSS, React Hook Form, Zod
- **Infrastructure:** Docker (single container), Easypanel, Nginx

## Setup Instructions

### Backend
1. `cd backend`
2. `python -m venv venv`
3. `venv\Scripts\activate`
4. `pip install -r requirements.txt`
5. `uvicorn main:app --reload`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
# livrocaixa

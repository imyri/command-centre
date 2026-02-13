# Personal Financial Operating System (Command Centre) — Local-First Foundation

## Folder Tree

```text
command-centre/
├── frontend/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── productivity/
│   │   ├── KanbanView.tsx
│   │   ├── ListView.tsx
│   │   └── TimelineView.tsx
│   ├── services/
│   │   └── api/
│   │       └── client.ts
│   ├── widgets/
│   │   ├── AIWidget.tsx
│   │   ├── FinanceWidget.tsx
│   │   ├── ProductivityWidget.tsx
│   │   └── TradingWidget.tsx
│   ├── workspace/
│   │   └── WorkspaceLayout.tsx
│   ├── next.config.ts
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── tailwind.config.ts
│   └── tsconfig.json
└── backend/
    ├── alembic.ini
    ├── migrations/
    │   ├── env.py
    │   ├── README
    │   ├── script.py.mako
    │   └── versions/
    │       └── 0001_init_tasks_projects.py
    ├── core/
    │   ├── config.py
    │   └── logging.py
    ├── api/
    │   ├── deps.py
    │   └── routers/
    │       ├── ai.py
    │       ├── finance.py
    │       ├── health.py
    │       ├── productivity.py
    │       └── trading.py
    ├── db/
    │   ├── base.py
    │   └── session.py
    ├── engines/
    │   ├── ai/
    │   │   └── __init__.py
    │   ├── finance/
    │   │   └── __init__.py
    │   ├── productivity/
    │   │   ├── __init__.py
    │   │   ├── projects/
    │   │   │   ├── __init__.py
    │   │   │   └── service.py
    │   │   └── tasks/
    │   │       ├── __init__.py
    │   │       └── service.py
    │   └── trading/
    │       └── __init__.py
    ├── models/
    │   ├── project.py
    │   └── task.py
    ├── services/
    │   └── __init__.py
    ├── main.py
    ├── pyproject.toml
    └── requirements.txt
```

## Setup Steps

### Backend (FastAPI)

```bash
cd backend
python -m venv .venv
```

**PowerShell**

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
python -m pip install -U pip
pip install -r requirements.txt
```

Run migrations (SQLite):

```bash
alembic upgrade head
```

Run API server on `:8000`:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend (Next.js)

```bash
cd ../frontend
npm install
```

Create a local env file:

```bash
echo NEXT_PUBLIC_API_BASE_URL=http://localhost:8000> .env.local
```

Run dev server on `:3000`:

```bash
npm run dev -- -p 3000
```

## Run Commands (one-liners)

### Backend

```bash
cd backend && .\.venv\Scripts\Activate.ps1 && alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend

```bash
cd frontend && npm install && npm run dev -- -p 3000
```


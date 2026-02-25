# VPS Deployment Guide - Livro Caixa SaaS

Este guia descreve como realizar o deploy da aplicação utilizando o **Easypanel** ou uma VPS Linux tradicional.

## 🚀 Deploy via Easypanel (Recomendado)

O Easypanel facilita a conexão entre contêineres usando a rede interna do projeto.

### 1. Serviço de Banco de Dados (PostgreSQL)
- Crie um serviço **PostgreSQL** no Easypanel.
- Anote o **Service Name** (ex: `db`), o **Usuário**, **Senha** e **Nome do Banco**.
- A string de conexão interna será algo como: `postgresql://user:password@db:5432/database`.

### 2. Serviço de Back-end (FastAPI)
- Crie um serviço do tipo **App**.
- **Source**: Conecte ao seu repositório Git.
- **Root Directory**: Defina como `backend`.
- **Dockerfile**: O Easypanel detectará automaticamente o `backend/Dockerfile`.
- **Variáveis de Ambiente**:
  - `DATABASE_URL`: Use a string de conexão interna (ex: `postgresql://user:password@db:5432/database`).
  - `SECRET_KEY`: Uma string aleatória longa para o JWT.
- **Domínio**: Configure um subdomínio como `api.seudominio.com`.

### 3. Serviço de Front-end (Next.js)
- Crie outro serviço do tipo **App**.
- **Source**: Conecte ao seu repositório Git.
- **Root Directory**: Defina como `frontend`.
- **Dockerfile**: O Easypanel detectará automaticamente o `frontend/Dockerfile`.
- **Build Arguments**:
  - `NEXT_PUBLIC_API_URL`: Use a URL pública do seu back-end (ex: `https://api.seudominio.com`).
- **Domínio**: Configure seu domínio principal (ex: `seudominio.com`).

---

## 🛠️ Deploy Manual em VPS (Ubuntu)

### 1. Configuração do Banco (PostgreSQL)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo -u postgres psql
# CREATE DATABASE livrocaixa;
# CREATE USER livro_user WITH PASSWORD 'sua_senha_forte';
# GRANT ALL PRIVILEGES ON DATABASE livrocaixa TO livro_user;
\q
```

### 2. Back-end (PM2 + Uvicorn)
1. Configure as variáveis no arquivo `.env`.
2. Instale as dependências e rode o script de inicialização:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed.py
pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000" --name "livro-backend"
```

### 3. Front-end (Next.js)
```bash
cd frontend
npm install
npm run build
pm2 start "npm start -- -p 3000" --name "livro-frontend"
```

> [!TIP]
> **Rede Interna**: No Easypanel, use o nome do serviço do banco (ex: `db`) na URL de conexão. O Easypanel resolve isso automaticamente para o IP interno.

## 🌐 Rede e Portas no Easypanel

Uma dúvida comum é sobre o conflito de portas (como a `5432` do Postgres) quando se tem vários projetos.

### 1. Isolamento por Contêiner
Cada serviço no Easypanel roda em seu próprio contêiner com um IP interno próprio. Isso significa que **não há conflito** se você tiver 10 instâncias de Postgres em portas `5432` dentro dos contêineres, pois elas não "ecoam" na porta da VPS principal a menos que você configure isso explicitamente.

### 2. Comunicação Interna (Recomendado)
Para o Backend (FastAPI) conversar com o Banco (Postgres), você **não precisa** abrir a porta `5432` para a internet.
- No campo **Hostname** da conexão, use o **Service Name** do banco no Easypanel (ex: `livrocaixa-db`).
- A URL de conexão será: `postgresql+psycopg2://usuario:senha@livrocaixa-db:5432/nome_do_banco`.

### 3. Acesso Externo (Opcional)
Se você precisar acessar o banco de dados do seu computador (usando DBeaver ou TablePlus, por exemplo):
- Vá nas configurações do serviço de banco no Easypanel.
- Procure a seção de **External Ports**.
- Mapeie uma porta livre na sua VPS (ex: `5433`) para a porta `5432` do contêiner.
- **Segurança**: Lembre-se de fechar essa porta ou usar um Firewall se não for mais necessária.

### 4. Como verificar a conexão?
Eu adicionei diagnósticos nos logs. Se o Backend iniciar e você vir a mensagem:
`--- ENVIRONMENT DIAGNOSTICS ---`
Seguida de informações da versão, significa que o Python carregou. Se houver erro de conexão, ele aparecerá logo abaixo nos logs do servidor.

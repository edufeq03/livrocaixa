# Guia de Execução Local

Este documento contém os comandos necessários para rodar o backend e o frontend do projeto Livro Caixa SaaS em ambiente de desenvolvimento.

## 1. Backend (FastAPI)

Abra um terminal na pasta `livrocaixa/backend` e execute:

```powershell
# Ativar o ambiente virtual (Windows)
.\venv\Scripts\activate

# Instalar dependências (caso não tenha feito)
pip install -r requirements.txt

# Iniciar o servidor com Hot Reload
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

A documentação interativa da API estará disponível em: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 2. Frontend (Next.js)

Abra outro terminal na pasta `livrocaixa/frontend` e execute:

```powershell
# Instalar dependências (caso não tenha feito)
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em: [http://localhost:3000](http://localhost:3000)

---

## 3. Credenciais de Teste

Utilize estas credenciais para acessar o Dashboard após iniciar ambos os servidores:

- **Login:** `admin@livrocaixa.com.br`
- **Senha:** `admin123`

> [!TIP]
> Certifique-se de que o backend está rodando na porta 8000 antes de tentar fazer login no frontend.

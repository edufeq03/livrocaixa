# Boas Práticas e Lições Aprendidas - Livro Caixa SaaS

Este documento consolida os aprendizados obtidos durante a resolução de bugs críticos e a implementação de novas funcionalidades. Utilize-o como referência para evitar falhas semelhantes no futuro.

---

## 🔒 1. Autenticação e Segurança (Backend & Frontend)

### Erro de Validação de Domínio (".local")
- **O Problema**: O uso de e-mails como `admin@livrocaixa.local` causava falhas silenciosas ou erros 500.
- **Por que ocorreu**: A biblioteca `pydantic[email]` (que usa `email-validator`) por padrão rejeita TLDs (Top-Level Domains) que não existem na IANA ou são reservados apenas para uso local, a menos que configurado explicitamente. Isso causava uma `ResponseValidationError` no FastAPI ao tentar serializar o objeto de resposta.
- **Como evitar**:
    - Use sempre domínios válidos ou simulados reais para testes (ex: `.com.br`, `.com`).
    - Verifique se os dados inseridos no banco via scripts de `seed` ou testes manuais obedecem rigorosamente aos esquemas Pydantic.
    - Implemente logs detalhados de exceções no backend para capturar erros de validação de resposta.

### Consistência de Headers de API
- **O Problema**: Erros 401 intermitentes mesmo após o login.
- **Por que ocorreu**: A atribuição do header `Authorization` no Axios às vezes não persistia corretamente ou falhava em requisições disparadas simultaneamente à mudança de estado.
- **Como evitar**:
    - Centralize a lógica de injeção de tokens em interceptores de requisição do Axios.
    - Garanta que o estado global (ex: `AuthContext`) e o armazenamento local (`localStorage`) estejam sincronizados imediatamente após o login.

---

## 🔗 2. Integração Frontend-Backend

### Divergência em Nomes de Campos (Schemas)
- **O Problema**: O frontend enviava `name` enquanto o backend esperava `company_name`.
- **Por que ocorreu**: Falta de uma definição única de contrato (interface) entre as camadas.
- **Como evitar**:
    - Crie interfaces TypeScript que reflitam exatamente os Schemas Pydantic.
    - Se o nome de um campo mudar no banco, utilize o `grep` para encontrar todas as ocorrências no frontend para atualização.

### Mismatch de Tipos de Dados (Datas e UUIDs)
- **O Problema**: Erros no backend ao receber strings de data simples quando o Schema esperava `datetime` completo (ISO string).
- **Por que ocorreu**: Inconsistência entre os componentes de formulário HTML5 (`type="date"`) e a expectativa do banco de dados.
- **Como evitar**:
    - Converta sempre datas obtidas via input para ISO strings (`new Date(val).toISOString()`) antes de enviar.
    - Utilize conversores consistentes no frontend para campos específicos como CNPJ (máscaras).

---

## 💾 3. Banco de Dados e Schemas

### Dependências de Chave Estrangeira (Missing Data)
- **O Problema**: Falha ao criar transações porque `category_id` ou `account_id` não existiam.
- **Por que ocorreu**: O script de `seed` inicial era incompleto, criando o usuário mas não o ambiente básico para operação.
- **Como evitar**:
    - Scripts de `seed` devem criar uma estrutura mínima funcional (Tenant -> Empresa -> Categorias -> Contas -> Usuário).
    - Utilize valores padrão (`Default`) para campos mandatórios em fluxos de criação se o usuário não os fornecer.

### Conflitos de Argumentos Nomeados (Python/SQLAlchemy)
- **O Problema**: `TypeError: models.User() got multiple values for keyword argument 'tenant_id'`.
- **Por que ocorreu**: Ao desempacotar um dicionário `**user.dict()` que já continha `tenant_id` e passar o argumento novamente de forma explícita.
- **Como evitar**:
    - Sempre faça um `.pop("field", None)` no dicionário antes de passá-lo para o construtor do modelo se você for sobrescrever aquele campo manualmente baseado no contexto da requisição (ex: `current_user.tenant_id`).

---

## 🏗️ 4. Deploy e Produção (VPS/Easypanel)

### Ambiente Node.js (Frontend)
- **O Problema**: Falhas no build do Tailwind CSS v4 e Next.js 15.
- **Por que ocorreu**: O Tailwind CSS v4 e o motor `oxide` exigem **Node.js >= 20**. O uso do Node 18 causa erros de "native bindings" impossíveis de debugar via código.
- **Como evitar**:
    - Mantenha o `Dockerfile` e o `package.json` sincronizados com a versão estável mais recente (LTS) do Node (atualmente recomenda-se **Node 20 Alpine** para produção).

### Drivers de Banco de Dados (Psycopg 3)
- **O Problema**: `ModuleNotFoundError` persistente para `psycopg2`.
- **Por que ocorreu**: Incompatibilidades entre as versões binárias (`psycopg2-binary`) e sistemas Linux "slim". Além disso, o SQLAlchemy 2.0 recomenda o uso do **Psycopg 3**.
- **Como evitar**:
    - Use `psycopg[binary]` (v3) no `requirements.txt`.
    - No `database.py`, normalize as URLs do Postgres de `postgres://` para `postgresql+psycopg://`. O prefixo `postgres://` é obsoleto e causa erro no SQLAlchemy 2.0.

### Rede Interna vs Externa
- **O Problema**: Confusão sobre portas e conectividade entre Backend e Banco.
- **Por que ocorreu**: Tentativa de usar `localhost` ou IPs externos quando os serviços rodam em contêineres isolados.
- **Como evitar**:
    - Utilize o **Service Name** do banco como hostname (ex: `db` em vez de `127.0.0.1`).
    - Nunca exponha a porta `5432` da VPS para a internet a menos que precise de acesso externo direto (via DBeaver, etc.). Mantenha a comunicação privada via rede interna do Docker/Easypanel.

### Configuração de CORS em Produção
- **O Problema**: Login funcionando localmente mas falhando na VPS com erro de "Network Error" ou Bloqueio de CORS.
- **Por que ocorreu**: O middleware CORS no backend estava restrito ao `localhost`.
- **Como evitar**:
    - Em produção, configure `allow_origins=["*"]` se o front e o back estiverem em domínios ou subdomínios diferentes, ou especifique a lista exata de domínios permitidos.

---

## 🚀 5. Workflow de Desenvolvimento e Deploy

1. **Logs são seus amigos**: Mantenha o terminal do backend visível. Se o front der "Network Error", o log do backend dirá se foi um 500 ou um erro de CORS.
2. **Push é Mandatório**: Mudanças feitas no seu ambiente local (commits) **devem** ser enviadas ao Git (`git push`) para que o serviço de deploy automático as detecte.
3. **Seed após Deploy**: Sempre que limpar o banco de dados em produção ou trocar de provedor, execute o `seed.py` via console do contêiner para garantir que o usuário Admin exista.

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

## 🚀 4. Workflow de Desenvolvimento

1. **Logs são seus amigos**: Mantenha o terminal do backend visível. 90% dos erros de "CORS" no frontend são, na verdade, crashes (500) no backend.
2. **Teste em Estado Limpo**: Frequentemente limpe o banco de dados (`del livrocaixa.db`) e re-execute o `seed.py` para garantir que novas migrações e restrições funcionam do zero.
3. **Pequenas Iterações**: Teste a funcionalidade no navegador imediatamente após cada pequena mudança no backend.

📚 Biblioteca API

API REST construída em NestJS + Prisma + PostgreSQL para gerenciar uma pequena biblioteca digital.
Permite cadastrar usuários e livros, registrar empréstimos e controlar devoluções.

🚀 Tecnologias

NestJS
– Framework Node.js

Prisma
– ORM

PostgreSQL
– Banco de dados

Swagger
– Documentação interativa (em /docs)

⚙️ Requisitos

Node.js 18+

PostgreSQL 13+ (local ou via Docker)

📦 Instalação

# instalar dependências

npm install

# criar o banco (ajuste sua URL no arquivo .env)

npx prisma migrate dev

Crie um arquivo .env baseado no exemplo:

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/biblioteca?schema=public"

▶️ Executar

# modo desenvolvimento

npm run start:dev

# produção

npm run start:prod

Acesse:

API → http://localhost:3000

Swagger → http://localhost:3000/docs

📖 Endpoints principais
Users

POST /users → cadastrar usuário

Books

POST /books → cadastrar novo livro

GET /books?status=AVAILABLE|BORROWED&q=termo → listar livros com filtro por status e busca por título

PATCH /books/:id/status → atualizar status (AVAILABLE ↔ BORROWED)

Loans

POST /loans → registrar empréstimo (User pega um Book)

PATCH /loans/:id/return → marcar devolução

⚡ Regras de negócio

Não é possível emprestar livro já emprestado.

E-mail de usuário é único.

Ao devolver, o livro volta para status AVAILABLE.

🛠️ Scripts úteis

# abrir Prisma Studio

npx prisma studio

# lint

npm run lint

# formatar código

npm run format

🔑 Arquivo .env.example

Inclua no repositório um arquivo .env.example com:

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/biblioteca?schema=public"

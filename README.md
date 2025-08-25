📚 Biblioteca

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

🔑 Arquivo .env.example

Inclua no repositório um arquivo .env.example com:

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/biblioteca?schema=public"

# 🏅 Diferenciais

- ✅ Testes unitários (Jest) cobrindo regras de negócio nos _services_

## Como Construir

Criar o projeto e instalar dependências

# 1. CLI do Nest

npm i -g @nestjs/cli

# 2. Crie o projeto

nest new biblioteca
cd biblioteca

# 3. Prisma

npm i @prisma/client
npm i -D prisma

# 4. DTOs

npm i class-validator class-transformer

# 5. Inicializar o Prisma

npx prisma init

# 6. Editar .env com string Postgres

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/biblioteca?schema=public"

# 7. Modelar o prisma/schema.prisma

# 8. Rodar e gerar

npx prisma migrate dev --name init
npx prisma generate

# 9. Editar src/main.ts

# 10. Modular o prisma

nest g module prisma
nest g service prisma --no-spec

# 11. Editar src/prisma/prisma.service.ts../module.ts

# 12. Criar módulos, controllers e services

nest g module books,users,loans
nest g controller books,users,loans --no-spec
nest g service books,users,loans --no-spec

# 13. Criar as pastas src/books,users,loans/dtos

# 14. Adicionar regras de negocios

# 15. Subir a API

npm run start:dev

# Tripleten web_project_api_full

---

# **Around The Us** 🎓📚

Este projeto é uma plataforma completa de compartilhamento de cartões e perfis de usuários, onde os usuários podem se registrar, fazer login e interagir com conteúdo, como curtir e criar cartões personalizados. O site é responsivo e seguro, com uma arquitetura bem definida no frontend e backend.
Podendo ser acessado aqui:
https://app.uni-pros.com/

---

## **Sumário**

- [Demonstração](#demonstração)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação e Configuração](#instalação-e-configuração)
- [API e Rotas](#api-e-rotas)
- [Frontend](#frontend)
- [Backend](#backend)
- [Autenticação e Segurança](#autenticação-e-segurança)
- [Estrutura de Diretórios](#estrutura-de-diretórios)
- [Contribuições](#contribuições)

---

## **Funcionalidades**

### Para Usuários:

- **Cadastro e Login**: Os usuários podem se registrar e fazer login utilizando autenticação baseada em tokens JWT.
- **Edição de Perfil**: Atualize o nome, descrição e avatar do perfil do usuário.
- **Adicionar Cartões**: Os usuários podem criar cartões personalizados com nome e link para uma imagem.
- **Curtir Cartões**: Adicionar e remover likes em cartões de outros usuários.
- **Deletar Cartões**: Excluir seus próprios cartões.

### Para Administradores:

- **Gerenciamento de Usuários**: A API permite obter a lista de todos os usuários cadastrados.

---

## **Tecnologias Utilizadas**

### **Frontend**:

- **React** com Hooks
- **React Router Dom** para gerenciamento de rotas
- **CSS** para estilização
- **Fetch API** para comunicação com o backend
- **Local Storage** para armazenamento de tokens JWT

### **Backend**:

- **Node.js** com **Express**
- **MongoDB** com **Mongoose**
- **Joi** para validação de dados
- **JWT (JSON Web Token)** para autenticação
- **bcryptjs** para hashing de senhas
- **Winston** para logging

---

## **Instalação e Configuração**

### Pré-requisitos:

- Node.js v14 ou superior
- MongoDB rodando localmente ou em um serviço remoto

### Clonando o Repositório

```bash
git clone https://github.com/iorecode/web_project_api_full.git
cd web_project_api_full
```

### Backend

1. **Configuração do Backend**:

   - Crie o arquivo `.env` e preencha com suas informações:
     ```
     JWT_SECRET=sua_chave_secreta
     PORT=3000
     ```

2. **Instale as dependências do backend**:

   ```bash
   cd backend
   npm install
   ```

3. **Rodando o servidor backend**:
   ```bash
   npm run dev
   ```

### Frontend

1. **Configuração do Frontend**:

2. **Instale as dependências do frontend**:

   ```bash
   cd frontend
   npm install
   ```

3. **Rodando o servidor frontend**:
   ```bash
   npm start
   ```

---

## **API e Rotas**

### **Rotas de Usuários:**

- `POST /signup`: Cadastrar um novo usuário.
- `POST /signin`: Login de usuário e retorno de token JWT.
- `GET /users/me`: Obter os dados do usuário logado.
- `PATCH /users/me`: Atualizar informações do perfil do usuário logado.
- `PATCH /users/me/avatar`: Atualizar o avatar do usuário logado.

### **Rotas de Cartões:**

- `GET /cards`: Obter todos os cartões.
- `POST /cards`: Criar um novo cartão.
- `DELETE /cards/:cardId`: Deletar um cartão pelo ID.
- `PUT /cards/:cardId/likes`: Adicionar um like em um cartão.
- `DELETE /cards/:cardId/likes`: Remover um like de um cartão.

---

## **Frontend**

O frontend foi construído com React e está organizado da seguinte maneira:

- **Páginas Principais**:
  - `/`: Exibe os cartões e permite a interação (curtir, deletar).
  - `/signin`: Página de login.
  - `/signup`: Página de cadastro.
- **Componentes**:
  - **Header**: Exibe o cabeçalho do site e permite logout.
  - **Footer**: Rodapé do site.
  - **Card**: Componente para exibir os cartões.
  - **Popups**: Componentes modais para editar perfil, avatar e criar novos cartões.

---

## **Backend**

O backend foi construído com Node.js e Express. Ele gerencia autenticação, persistência de dados no MongoDB e manipulação de rotas para o CRUD de usuários e cartões.

### **Middleware de Autenticação:**

A API usa JWT para proteger rotas. O middleware `auth.js` intercepta as requisições, verifica o token e só permite acesso caso seja válido.

### **Validação de Dados:**

O backend usa o `celebrate` (com base em Joi) para garantir que os dados enviados pelo cliente estejam no formato correto.

---

## **Autenticação e Segurança**

- **JWT**: Autenticação baseada em tokens. O token JWT é gerado no login e armazenado no `localStorage`. Ele é enviado em cada requisição subsequente às rotas protegidas do backend.
- **bcryptjs**: Utilizado para hashear as senhas antes de salvar no banco de dados.
- **Proteção de Rotas**: O frontend protege rotas utilizando o componente `ProtectedRoute` que verifica se o usuário está logado antes de permitir acesso às páginas.

---

## **Contribuições**

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request com melhorias, correções de bugs ou novas funcionalidades.

---

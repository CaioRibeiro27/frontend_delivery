# 🍔 Sistema de Delivery (Full-Stack)

Este é um projeto de estudo de um aplicativo de delivery completo, seu desenvolvimento foi feito com: React, Node.js (Express) e MySQL.

O projeto inclui cadastro e login de usuários com criptografia de senha, e está estruturado com um frontend (React) que consome uma API REST (Node.js) conectada a um banco de dados relacional (MySQL).

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React, React Router, React Icons
- **Backend:** Node.js, Express
- **Banco de Dados:** MySQL
- **Autenticação:** Bcryptjs (para hash de senhas)
- **Conexão:** `mysql2`, `cors`, `dotenv`

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

Ferramentas necessárias:

- [Node.js](https://nodejs.org/) (que já vem com o npm)
- [Git](https://git-scm.com/)
- Um servidor MySQL (recomendo [XAMPP](https://www.apachefriends.org/pt_br/index.html), pois facilita a visualização com o phpMyAdmin)

---

### 1. Configuração do Banco de Dados

1.  Inicie os módulos **Apache** e **MySQL** no seu painel de controle do XAMPP.
2.  Abra o **phpMyAdmin** (clicando em "Admin" na linha do MySQL no XAMPP).
3.  Crie um novo banco de dados. Clique em **"Novo"** (ou "New") na barra lateral e dê o nome de `Sistema_delivery`.
4.  Com o banco `Sistema_delivery` selecionado no menu, clique na aba **"Importar"** (ou "Import") no topo.
5.  Clique em "Escolher arquivo" e selecione o arquivo `backend/Sistema delivery.sql` que está neste projeto.
6.  Desça e clique em **"Executar"** (ou "Go"). As tabelas (`usuario`, `pedido`, etc.) serão criadas.

### 2. Configuração do Backend

1.  Clone este repositório para sua máquina:

    ```bash
    git clone https://github.com/CaioRibeiro27/sistema_delivery.git
    cd SEU-REPOSITORIO
    ```

2.  Navegue até a pasta do backend e instale as dependências:

    ```bash
    cd backend
    npm install
    ```

3.  Crie um arquivo chamado `.env` dentro desta pasta (`backend/.env`).
4.  Abra este `.env` e cole o seguinte conteúdo. (Estes são os padrões do XAMPP, então se você não mudou a senha do seu MySQL, funcionará direto).

    ```
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=Sistema_delivery
    ```

### 3. Configuração do Frontend

1.  Abra um **novo terminal**.
2.  Navegue até a pasta raiz do projeto (a que tem o `src/`):
    ```bash
    cd SEU-REPOSITORIO
    ```
3.  Instale as dependências do React:
    ```bash
    npm install
    ```

### 4. Ligando Tudo!

Serão neccessarios **dois terminais** rodando simultaneamente.

- **Terminal 1 (Para rodar o Backend):**

  ```bash
  # (Dentro da pasta /backend)
  npm start
  ```

  _(Você deve ver a mensagem: 🚀 Servidor backend rodando na porta 3001)_

- **Terminal 2 (Para rodar o Frontend):**
  ```bash
  # (Dentro da pasta raiz do projeto)
  npm start
  ```
  _(Seu navegador abrirá automaticamente em `http://localhost:3000`)_

Pronto! Agora você pode acessar `http://localhost:3000/cadastro`, criar uma conta, e verificar os dados aparecendo no phpMyAdmin.

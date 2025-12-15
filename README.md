# 🛵 Delivery App

Um sistema completo de delivery (estilo iFood) que conecta clientes e restaurantes, permitindo realização de pedidos, gestão de cardápio e acompanhamento de status em tempo real.

## 🛠️ Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando as seguintes tecnologias:

### Frontend

- **React.js**: Biblioteca principal para construção da interface.
- **React Router Dom**: Para gerenciamento de rotas e navegação.
- **CSS3**: Estilização responsiva e moderna.
- **Axios**: Para consumo da API e requisições HTTP.
- **React Icons**: Ícones utilizados na interface.

### Backend

- **Node.js & Express**: Servidor e construção da API RESTful.
- **PostgreSQL**: Banco de dados relacional para armazenar usuários, pedidos e produtos.
- **SessionStorage**: Gerenciamento de sessão para isolamento de login entre abas.

---

## 🚀 Guia de Uso (Como testar)

Para ter a melhor experiência de uso e simular um pedido real, recomendo seguir o fluxo abaixo:

### 1. Preparação do Ambiente

- Abra o sistema em **duas abas diferentes**.
- Isso permitirá simular o **Cliente** e o **Restaurante** simultaneamente.

### 2. Cadastro do Cliente

- Na primeira aba, crie uma conta de **Usuário**.
- Vá até as **Configurações** e cadastre:
  - Um Endereço de entrega.
  - Um Cartão de crédito (simulado).

### 3. Configuração do Restaurante

- Na segunda aba, crie uma conta de **Restaurante**.
- Acesse a barra lateral e vá na opção de **Cardápio**.
- Cadastre alguns produtos (ex: Hambúrguer, Refrigerante) para que sua loja fique visível.

### 4. Realizando o Pedido

- Volte para a conta do **Usuário** e atualize a página. O restaurante criado aparecerá na lista.
- Entre no restaurante, escolha os itens e finalize o pedido no carrinho.

### 5. Gestão do Pedido

- Na conta do **Restaurante**, o novo pedido aparecerá na Dashboard.
- O restaurante pode avançar o status: _Aceitar_ -> _Saiu para Entrega_ -> _Entregue_.
- A cada mudança, o cliente pode ver a atualização em tempo real na sua tela.

### 6. Finalização

- **Financeiro:** Ao marcar como "Entregue", o valor entra no "Lucro do Dia" do restaurante.
- **Histórico:** O pedido fica salvo no histórico de ambos os usuários.

Desenvolvido por Caio Ribeiro

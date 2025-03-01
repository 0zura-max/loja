# Sistema de Loja


## Tecnologias Utilizadas

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** C# (.NET)
- **Banco de Dados:** SQL Server
- **Docker (Opcional):** Para facilitar a execução do banco de dados

## Estrutura do Banco de Dados
#### O nome do banco deve ser loja e o servidor esta em LAPTOP-1KB7IMR7\\SQLExpress,para mudar deve ser alterado no AppdbContext e no appsttings.jons
O banco de dados contém as seguintes tabelas principais:
- `Usuarios`: Armazena os usuários do sistema.
- `Produtos`: Armazena os produtos cadastrados por cada usuário.
- `Clientes`: Armazena os clientes cadastrados por cada usuário.

### Modelo das Tabelas
```sql
CREATE TABLE Usuarios (
    nome VARCHAR(100) PRIMARY KEY,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE Produtos (
    codigo INT NOT NULL,
    usuario_nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    codigo_barras VARCHAR(100) NOT NULL,
    valor_venda DECIMAL(10,2) NOT NULL,
    peso_bruto DECIMAL(10,2) NOT NULL,
    peso_liquido DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (usuario_nome, codigo),
    UNIQUE (usuario_nome, codigo_barras),
    FOREIGN KEY (usuario_nome) REFERENCES Usuarios(nome) ON DELETE CASCADE
);

CREATE TABLE Clientes (
    codigo INT NOT NULL,
    usuario_nome VARCHAR(100) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    fantasia VARCHAR(255),
    documento VARCHAR(50) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    PRIMARY KEY (usuario_nome, codigo),
    UNIQUE (usuario_nome, documento),
    FOREIGN KEY (usuario_nome) REFERENCES Usuarios(nome) ON DELETE CASCADE
);
```

## Como Rodar o Frontend

2. No terminal, colocar cd caminho-do-repo/loja e então:
   ```sh
   npm install
   ```
3. Inicie o projeto:
   ```sh
   npm run dev
   ```
4. Acesse no navegador: `http://localhost:3000`


## Backend
O backend esta em /lojaback
Para acessa-lo, usar o link https://localhost:7203/swagger/index.html
---



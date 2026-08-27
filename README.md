# 🌱 Cardápio Seletivo — Área de Membros PWA

Aplicativo web responsivo, mobile-first e instalável como PWA para entrega do **Cardápio Seletivo**, uma área de membros pós-compra voltada a pais e responsáveis por crianças de 3 a 6 anos com seletividade alimentar.

---

## 📌 Visão Geral e Filosofia do Produto

> **Ideia Central:** *“Mais opções práticas para variar as refeições, partindo de alimentos familiares e sem transformar a hora de comer em um confronto.”*

- **Finalidade:** Apoio educacional, organizacional e culinário.
- **Privacidade & Segurança:** **Nenhum** dado sensível da criança (nome, nascimento, diagnóstico ou prontuário) é coletado. A conta pertence 100% ao responsável adulto.
- **Tom de Voz:** Acolhedor, sem cobrança e respeitoso.

---

## 🏗️ Arquitetura e Tecnologias

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + Lucide Icons + React Router DOM v7.
- **Backend:** Node.js + Express + TypeScript + Firebase Admin SDK + Zod + UUID.
- **Banco e Autenticação:** Firebase Authentication (E-mail/Senha) + Cloud Firestore + Firebase Storage.
- **PWA:** Manifesto Web App (`manifest.json`), ícones e metatags prontos para instalação no celular.

---

## 🔐 Níveis de Acesso (RBAC)

| Papel | Descrição | Valor | Recursos Liberados |
|---|---|---|---|
| `none` / Sem compra | Cadastro criado sem pagamento confirmado | — | Tela acolhedora *"Aguardando liberação de acesso"* |
| `basic` | Comprador do E-book Básico | R$ 10 (vitalício) | Biblioteca do E-book, receitas básicas e versão para impressão. Recursos Premium exibidos com cadeado discreto e CTA suave. |
| `premium` | Comprador do Cardápio Seletivo Premium | R$ 19 (vitalício) | **Acesso Total:** +200 receitas, filtros avançados (alimento aceito, textura, cor, formato), favoritos, Planejador Semanal (Seg a Dom), Lista de Compras consolidada, Central de Dúvidas e 4 bônus digitais. |
| `admin` | Administrador | — | Painel exclusivo em `/admin` com CRUD de receitas, gestão de usuários, concessão de acesso manual e resposta a chamados de suporte. |

---

## 📁 Estrutura de Diretórios

```
cardapio-seletivo/
├── client/                     # Frontend React + Vite + Tailwind
│   ├── public/                 # Manifest PWA, Favicon SVG e ícones
│   ├── src/
│   │   ├── api/                # Cliente de integração com o backend Express
│   │   ├── components/         # Layout, Header, Sidebar, BottomNav, RecipeCard, Planner, etc.
│   │   ├── contexts/           # AuthContext (Firebase Auth + sincronização de perfil)
│   │   ├── pages/              # Telas públicas, de autenticação, área de membros e admin
│   │   ├── services/           # Inicialização do Firebase Web Client
│   │   ├── types/              # Definições de tipos TypeScript
│   │   ├── App.tsx             # Rotas e guardas de autorização
│   │   └── main.tsx            # Ponto de entrada
│   ├── .env.example            # Variáveis do cliente
│   └── package.json
│
├── server/                     # Backend Node.js + Express
│   ├── src/
│   │   ├── config/             # Configuração do Firebase Admin SDK
│   │   ├── middleware/         # Autenticação e verificação de token JWT
│   │   ├── routes/             # Rotas REST (/api/recipes, /api/planner, /api/shopping, etc.)
│   │   ├── services/           # Camada de banco (Firestore com fallback em memória) e seeds
│   │   ├── types/              # Tipos TypeScript do backend
│   │   └── index.ts            # Ponto de entrada da API Express
│   ├── .env.example            # Variáveis do servidor
│   └── package.json
│
├── firebase/
│   ├── firestore.rules         # Regras de segurança granulares do Firestore
│   └── storage.rules           # Regras de proteção para download de PDFs e materiais
│
└── package.json                # Scripts raiz unificados
```

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
- Node.js versão 18 ou superior.
- NPM ou Bun instalado.

### 2. Instalação das Dependências

Na raiz do projeto:
```bash
# Instalar dependências do servidor
cd server && npm install

# Instalar dependências do cliente
cd ../client && npm install
```

### 3. Configuração das Variáveis de Ambiente

Crie o arquivo `.env` na pasta `server/`:
```env
PORT=5000
# Firebase Admin (opcional para rodar com fallback em memória local)
FIREBASE_PROJECT_ID=cardapio-seletivo
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=cardapio-seletivo.appspot.com

# Webhook e Gateway
PAYMENT_WEBHOOK_SECRET=sua_chave_secreta_webhook
CHECKOUT_API_KEY=sk_sua_chave_paradise
```

Crie o arquivo `.env` na pasta `client/`:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=cardapio-seletivo.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=cardapio-seletivo
VITE_FIREBASE_STORAGE_BUCKET=cardapio-seletivo.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
VITE_API_URL=http://localhost:5000
```

### 4. Executando em Modo de Desenvolvimento

Para rodar o backend:
```bash
cd server
npm run dev
# Servidor rodando em http://localhost:5000
```

Em outro terminal, para rodar o frontend:
```bash
cd client
npm run dev
# Aplicativo disponível em http://localhost:5173
```

---

## 🧪 Testes Rápidos & Alternador de Papéis (Dev Mode)

O aplicativo conta com um seletor visual no cabeçalho para facilitar a homologação imediata sem necessidade de configurar chaves do Firebase de imediato:
- **1. Sem Compra:** Simula usuário recém-cadastrado na tela de *"Aguardando liberação"*.
- **2. Básico:** Simula comprador do Plano Básico (R$ 10) com visualização das travas elegantes de upgrade.
- **3. Premium:** Simula comprador com todas as ferramentas e bônus desbloqueados.
- **4. Admin:** Abre o acesso ao painel de administração em `/admin`.

---

## 📦 Build para Produção

Para compilar todo o projeto:
```bash
# Compilar servidor
cd server && npm run build

# Compilar cliente
cd ../client && npm run build
```
Os arquivos estáticos otimizados do frontend serão gerados na pasta `client/dist`.
